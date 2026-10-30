#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

die() { printf 'Deploy error: %s\n' "$*" >&2; exit 1; }

[[ $# == 4 ]] || die 'Usage: bash deploy.sh DEPLOY_ROOT REPOSITORY@sha256:DIGEST BIND_ADDRESS HTTP_PORT'
deploy_root=$1
image_ref=$2
bind_address=$3
http_port=$4

[[ $deploy_root =~ ^/[A-Za-z0-9_.-]+(/[A-Za-z0-9_.-]+)*$ && $deploy_root != *..* && $deploy_root != */./* && $deploy_root != */. ]] || die 'Invalid dedicated absolute deploy path.'
[[ $image_ref =~ ^[a-z0-9]([a-z0-9.-]*[a-z0-9])?(:[1-9][0-9]{0,4})?/[a-z0-9]+([._-][a-z0-9]+)*(/[a-z0-9]+([._-][a-z0-9]+)*)+@sha256:[0-9a-f]{64}$ ]] || die 'Image must be a registry/namespace/repository pinned to a sha256 digest.'
registry=${image_ref%%/*}
[[ $registry == localhost || $registry == *.* || $registry == *:* ]] || die 'Registry must contain a dot or explicit port, or be localhost; bare hostnames are ambiguous Docker Hub paths.'
if [[ $registry == *:* ]]; then
    (( ${registry##*:} <= 65535 )) || die 'Invalid registry port.'
fi
[[ $bind_address =~ ^(0|[1-9][0-9]{0,2})(\.(0|[1-9][0-9]{0,2})){3}$ ]] || die 'Bind address must be IPv4.'
IFS=. read -r -a octets <<< "$bind_address"
for octet in "${octets[@]}"; do
    (( octet <= 255 )) || die 'Invalid IPv4 octet.'
done
[[ $http_port =~ ^[1-9][0-9]{0,4}$ ]] && (( http_port <= 65535 )) || die 'Port must be between 1 and 65535.'

for command in docker flock mktemp; do
    command -v "$command" >/dev/null || die "Required command not found: $command"
done
[[ -d $deploy_root && ! -L $deploy_root && -w $deploy_root ]] || die 'Deploy root must exist and be writable, not a symlink.'
[[ $(cd -- "$deploy_root" && pwd -P) == "$deploy_root" ]] || die 'Use a physical deploy path without symlink components.'
script_dir=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)
[[ $(dirname -- "$script_dir") == "$deploy_root" && $(basename -- "$script_dir") == .incoming-* ]] || die 'Run the uploaded helper from a unique .incoming-* directory directly inside the deploy root.'
[[ -f $script_dir/compose.yaml && ! -L $script_dir/compose.yaml ]] || die 'Missing uploaded compose.yaml.'

[[ ! -L $deploy_root/.deploy.lock ]] || die 'Lock file must not be a symlink.'
exec 9>"$deploy_root/.deploy.lock"
flock -x 9
for name in compose.yaml current.env previous-compose.yaml previous.env; do
    [[ ! -L $deploy_root/$name ]] || die "Metadata must not be a symlink: $name"
    [[ ! -e $deploy_root/$name || -f $deploy_root/$name ]] || die "Metadata must be a regular file: $name"
done

had_current=false
if [[ -e $deploy_root/compose.yaml || -e $deploy_root/current.env ]]; then
    [[ -f $deploy_root/compose.yaml && -f $deploy_root/current.env ]] || die 'Incomplete current metadata; repair it before deploying.'
    had_current=true
fi
had_previous=false
if [[ -e $deploy_root/previous-compose.yaml || -e $deploy_root/previous.env ]]; then
    [[ -f $deploy_root/previous-compose.yaml && -f $deploy_root/previous.env ]] || die 'Incomplete previous metadata; both files must exist or both be absent.'
    had_previous=true
fi
candidate=$(mktemp -d "$script_dir/.candidate.XXXXXXXX")
started=false
promoting=false
committed=false

compose() {
    local env_file=$1 compose_file=$2
    shift 2
    # Explicit env-file values must win over any variables inherited from the SSH account.
    env -u IMAGE_REF -u BIND_ADDRESS -u HTTP_PORT docker compose --project-name tajri-portfolio --project-directory "$deploy_root" \
        --env-file "$env_file" -f "$compose_file" "$@"
}

finish() {
    local status=$?
    local keep_candidate=false
    trap - EXIT HUP INT TERM
    set +e
    if [[ $promoting == true && $committed == false ]]; then
        status=1
        if [[ $had_previous == true ]]; then
            cp -- "$candidate/original-previous-compose.yaml" "$deploy_root/previous-compose.yaml" || keep_candidate=true
            cp -- "$candidate/original-previous.env" "$deploy_root/previous.env" || keep_candidate=true
        else
            rm -f -- "$deploy_root/previous-compose.yaml" "$deploy_root/previous.env" || keep_candidate=true
        fi
        if [[ $keep_candidate == true ]]; then
            printf 'ERROR: original previous metadata could not be restored (had_previous=%s). Backups retained in %s; repair before retrying.\n' "$had_previous" "$candidate" >&2
        fi
    fi
    if [[ $started == true && $committed == false ]]; then
        status=1
        if [[ $had_current == true ]]; then
            printf 'Candidate failed; rolling back to the last healthy release.\n' >&2
            if compose "$candidate/old.env" "$candidate/old-compose.yaml" up -d --pull missing --no-build --wait --wait-timeout 120; then
                if cp -- "$candidate/old-compose.yaml" "$deploy_root/compose.yaml" && cp -- "$candidate/old.env" "$deploy_root/current.env"; then
                    printf 'Rollback healthy; deployment still returns failure.\n' >&2
                else
                    printf 'ERROR: rollback is healthy, but current metadata could not be restored. Repair it before retrying.\n' >&2
                    exit "$status"
                fi
            else
                printf 'ERROR: rollback also failed. Inspect project tajri-portfolio; saved release metadata is in %s.\n' "$candidate" >&2
                exit "$status"
            fi
        else
            printf 'First deployment failed: no prior healthy release exists for rollback. Removing the failed candidate only.\n' >&2
            compose "$candidate/current.env" "$candidate/compose.yaml" down --timeout 10 || printf 'ERROR: failed candidate cleanup also failed.\n' >&2
            rm -f -- "$deploy_root/compose.yaml" "$deploy_root/current.env"
        fi
    fi
    [[ $keep_candidate == false ]] || exit "$status"
    # Remove only this invocation's known staging files; retain the uploaded incoming directory.
    rm -f -- "$candidate/compose.yaml" "$candidate/current.env" "$candidate/old-compose.yaml" \
        "$candidate/old.env" "$candidate/previous-compose.yaml" "$candidate/previous.env" \
        "$candidate/original-previous-compose.yaml" "$candidate/original-previous.env" "$candidate/original-previous-absent"
    rmdir -- "$candidate" || true
    exit "$status"
}
trap finish EXIT
trap 'exit 129' HUP
trap 'exit 130' INT
trap 'exit 143' TERM

cp -- "$script_dir/compose.yaml" "$candidate/compose.yaml"
printf 'IMAGE_REF=%s\nBIND_ADDRESS=%s\nHTTP_PORT=%s\n' "$image_ref" "$bind_address" "$http_port" > "$candidate/current.env"
if [[ $had_current == true ]]; then
    cp -- "$deploy_root/compose.yaml" "$candidate/old-compose.yaml"
    cp -- "$deploy_root/current.env" "$candidate/old.env"
fi
if [[ $had_previous == true ]]; then
    cp -- "$deploy_root/previous-compose.yaml" "$candidate/original-previous-compose.yaml"
    cp -- "$deploy_root/previous.env" "$candidate/original-previous.env"
else
    : > "$candidate/original-previous-absent"
fi

compose "$candidate/current.env" "$candidate/compose.yaml" config --quiet
if ! compose "$candidate/current.env" "$candidate/compose.yaml" pull --policy always; then
    die 'Pull failed before replacement; current containers and metadata are unchanged.'
fi

started=true
compose "$candidate/current.env" "$candidate/compose.yaml" up -d --pull never --no-build --wait --wait-timeout 120

# Only a healthy candidate can rotate the previous release and become current.
promoting=true
if [[ $had_current == true ]]; then
    cp -- "$candidate/old-compose.yaml" "$candidate/previous-compose.yaml"
    cp -- "$candidate/old.env" "$candidate/previous.env"
    mv -f -- "$candidate/previous-compose.yaml" "$deploy_root/previous-compose.yaml"
    mv -f -- "$candidate/previous.env" "$deploy_root/previous.env"
fi
cp -- "$candidate/compose.yaml" "$deploy_root/compose.yaml"
cp -- "$candidate/current.env" "$deploy_root/current.env"
committed=true
printf 'Healthy release deployed: %s\n' "$image_ref"
