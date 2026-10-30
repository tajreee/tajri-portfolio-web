pipeline {
    agent { label 'docker' }

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 45, unit: 'MINUTES')
        skipDefaultCheckout(true)
    }

    parameters {
        booleanParam(name: 'PUBLISH_IMAGE', defaultValue: false, description: 'Push the tested image to the registry.')
        booleanParam(name: 'DEPLOY', defaultValue: false, description: 'Deploy the published digest over SSH; requires PUBLISH_IMAGE.')
        string(name: 'REGISTRY_HOST', defaultValue: '', description: 'Dotted hostname/IPv4, localhost, or hostname:port; without scheme or path.')
        string(name: 'IMAGE_REPOSITORY', defaultValue: '', description: 'Lowercase namespace/repository, without tag.')
        string(name: 'REGISTRY_CREDENTIALS_ID', defaultValue: '', description: 'Jenkins username/password credential ID with push permission.')
        choice(name: 'TARGET_PLATFORM', choices: ['linux/amd64', 'linux/arm64'], description: 'Must match the Docker worker architecture, or have QEMU/binfmt configured.')
        string(name: 'DEPLOY_HOST', defaultValue: '', description: 'SSH DNS hostname or IPv4 address; port 22.')
        string(name: 'DEPLOY_USER', defaultValue: '', description: 'SSH account with Docker access and preconfigured pull-only registry login.')
        string(name: 'DEPLOY_PATH', defaultValue: '/srv/tajri-portfolio', description: 'Existing, dedicated absolute path; simple characters, no symlinks or ..')
        string(name: 'SSH_CREDENTIALS_ID', defaultValue: '', description: 'Jenkins SSH private-key credential ID.')
        string(name: 'KNOWN_HOSTS_CREDENTIALS_ID', defaultValue: '', description: 'Jenkins secret-file ID containing verified SSH known_hosts.')
        string(name: 'BIND_ADDRESS', defaultValue: '127.0.0.1', description: 'IPv4 bind address. Prefer loopback behind a TLS reverse proxy.')
        string(name: 'HTTP_PORT', defaultValue: '8081', description: 'Host HTTP port, 1-65535; default avoids Jenkins on 8080.')
    }

    stages {
        stage('Validate') {
            steps {
                script {
                    env.DOCKER_AUTH_DIR = ''
                    env.SMOKE_CONTAINER = ''
                    if (params.DEPLOY && !params.PUBLISH_IMAGE) {
                        error('DEPLOY requires PUBLISH_IMAGE.')
                    }
                    if (!(params.TARGET_PLATFORM in ['linux/amd64', 'linux/arm64'])) {
                        error('Unsupported TARGET_PLATFORM.')
                    }

                    def hostPattern = /[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*/
                    def credentialPattern = /[A-Za-z0-9_.-]+/
                    if (params.PUBLISH_IMAGE) {
                        def registry = params.REGISTRY_HOST
                        def host = registry.split(':', -1)[0]
                        def parts = registry.split(':', -1)
                        if (!(host ==~ hostPattern) || parts.size() > 2 ||
                            (!host.contains('.') && parts.size() == 1 && host != 'localhost') ||
                            (parts.size() == 2 && (!(parts[1] ==~ /[1-9][0-9]{0,4}/) || parts[1].toInteger() > 65535))) {
                            error('REGISTRY_HOST must be lowercase, without scheme/path, and contain a dot or explicit port, or equal localhost. Bare hostnames are ambiguous Docker Hub paths.')
                        }
                        if (!(params.IMAGE_REPOSITORY ==~ /[a-z0-9]+(?:[._-][a-z0-9]+)*(?:\/[a-z0-9]+(?:[._-][a-z0-9]+)*)+/)) {
                            error('IMAGE_REPOSITORY must be a lowercase namespace/repository without a tag.')
                        }
                        if (!(params.REGISTRY_CREDENTIALS_ID ==~ credentialPattern)) {
                            error('Set REGISTRY_CREDENTIALS_ID using letters, digits, dots, underscores or hyphens.')
                        }
                        env.REGISTRY_HOST = registry
                        env.IMAGE_REPOSITORY = params.IMAGE_REPOSITORY
                    }

                    if (params.DEPLOY) {
                        if (!(params.DEPLOY_HOST ==~ hostPattern) || !(params.DEPLOY_USER ==~ /[a-z_][a-z0-9_-]{0,31}/)) {
                            error('DEPLOY_HOST must be a lowercase DNS hostname/IPv4; DEPLOY_USER must be a simple Unix account name.')
                        }
                        if (!(params.DEPLOY_PATH ==~ /\/[A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)*/) ||
                            params.DEPLOY_PATH.contains('..') || params.DEPLOY_PATH.tokenize('/').contains('.')) {
                            error('DEPLOY_PATH must be an absolute, non-root dedicated path without trailing slash, dot segments or shell characters.')
                        }
                        if (!(params.SSH_CREDENTIALS_ID ==~ credentialPattern) || !(params.KNOWN_HOSTS_CREDENTIALS_ID ==~ credentialPattern)) {
                            error('Set SSH_CREDENTIALS_ID and KNOWN_HOSTS_CREDENTIALS_ID using simple credential IDs.')
                        }
                        if (!(params.BIND_ADDRESS ==~ /(?:0|[1-9][0-9]{0,2})(?:\.(?:0|[1-9][0-9]{0,2})){3}/)) {
                            error('BIND_ADDRESS must be an IPv4 address without leading zeroes.')
                        }
                        def octets = params.BIND_ADDRESS.tokenize('.')
                        if (octets.any { it.toInteger() > 255 }) {
                            error('BIND_ADDRESS contains an invalid IPv4 octet.')
                        }
                        if (!(params.HTTP_PORT ==~ /[1-9][0-9]{0,4}/) || params.HTTP_PORT.toInteger() > 65535) {
                            error('HTTP_PORT must be between 1 and 65535.')
                        }
                    }
                }
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
                script {
                    env.SOURCE_COMMIT = sh(script: 'git rev-parse HEAD', returnStdout: true).trim()
                    if (!(env.SOURCE_COMMIT ==~ /[0-9a-f]{40,64}/) || !(env.BUILD_NUMBER ==~ /[0-9]+/)) {
                        error('Cannot identify the checked-out commit/build.')
                    }
                    def safeBuildTag = env.BUILD_TAG.toLowerCase().replaceAll(/[^a-z0-9_.-]+/, '-').take(48)
                    def buildIdentity = sh(script: 'printf "%s" "$BUILD_TAG" | sha256sum', returnStdout: true).trim().take(12)
                    if (!(buildIdentity ==~ /[0-9a-f]{12}/)) {
                        error('Cannot create a unique build identity.')
                    }
                    env.IMAGE_TAG = "ci-${safeBuildTag}-${env.SOURCE_COMMIT.take(12)}-${env.BUILD_NUMBER}-${buildIdentity}"
                    if (env.IMAGE_TAG.length() > 128) {
                        error('Generated image tag is too long.')
                    }
                    env.LOCAL_IMAGE = "tajri-portfolio-web:${env.IMAGE_TAG}"
                    env.SMOKE_CONTAINER = "tajri-portfolio-smoke-${env.IMAGE_TAG}"
                    if (params.PUBLISH_IMAGE) {
                        env.REMOTE_TAG = "${env.REGISTRY_HOST}/${env.IMAGE_REPOSITORY}:${env.IMAGE_TAG}"
                    }
                }
            }
        }

        stage('Build image') {
            steps {
                sh '''
                    set -eu
                    docker build --platform "$TARGET_PLATFORM" \
                        --build-arg "GIT_COMMIT=$SOURCE_COMMIT" --tag "$LOCAL_IMAGE" .
                '''
            }
        }

        stage('Smoke test and static artifact') {
            steps {
                sh '''
                    set -eu
                    docker run --detach --name "$SMOKE_CONTAINER" --label "ci.build=$BUILD_TAG" \
                        --platform "$TARGET_PLATFORM" --read-only --tmpfs /tmp \
                        --cap-drop ALL --security-opt no-new-privileges "$LOCAL_IMAGE"
                    ready=false
                    for attempt in $(seq 1 30); do
                        if docker exec "$SMOKE_CONTAINER" sh -ec \
                            'wget -q -O /dev/null http://127.0.0.1:8080/healthz && wget -q -O /dev/null http://127.0.0.1:8080/index.html'; then
                            ready=true
                            break
                        fi
                        sleep 2
                    done
                    if [ "$ready" != true ]; then
                        docker logs "$SMOKE_CONTAINER"
                        echo 'Image failed the runtime smoke test.' >&2
                        exit 1
                    fi
                    # Export only the static files from the exact image that passed the smoke test.
                    rm -rf -- dist
                    mkdir dist
                    docker cp "$SMOKE_CONTAINER:/usr/share/nginx/html/." dist/
                    test -s dist/index.html
                    tar -czf static-dist.tar.gz dist
                '''
                archiveArtifacts artifacts: 'static-dist.tar.gz', fingerprint: true
            }
        }

        stage('Publish tested image') {
            when { expression { params.PUBLISH_IMAGE } }
            steps {
                script {
                    env.DOCKER_AUTH_DIR = sh(script: 'mktemp -d /tmp/tajri-jenkins-auth.XXXXXXXX', returnStdout: true).trim()
                    withEnv(["DOCKER_CONFIG=${env.DOCKER_AUTH_DIR}"]) {
                        withCredentials([usernamePassword(credentialsId: params.REGISTRY_CREDENTIALS_ID,
                            usernameVariable: 'REGISTRY_USERNAME', passwordVariable: 'REGISTRY_PASSWORD')]) {
                            sh '''
                                set +x
                                set -eu
                                printf '%s' "$REGISTRY_PASSWORD" | docker login "$REGISTRY_HOST" \
                                    --username "$REGISTRY_USERNAME" --password-stdin
                                docker tag "$LOCAL_IMAGE" "$REMOTE_TAG"
                                docker push "$REMOTE_TAG"
                                digest=$(docker buildx imagetools inspect "$REMOTE_TAG" --format '{{.Manifest.Digest}}')
                                if [ "${#digest}" -ne 71 ] || ! printf '%s\\n' "$digest" | grep -Eq '^sha256:[0-9a-f]{64}$'; then
                                    echo 'Registry returned an invalid image digest.' >&2
                                    exit 1
                                fi
                                printf '%s/%s@%s\\n' "$REGISTRY_HOST" "$IMAGE_REPOSITORY" "$digest" > image-ref.txt
                            '''
                        }
                    }
                    env.DEPLOY_IMAGE = readFile('image-ref.txt').trim()
                }
                archiveArtifacts artifacts: 'image-ref.txt', fingerprint: true
            }
        }

        stage('Deploy immutable digest') {
            when { expression { params.DEPLOY } }
            steps {
                sshagent(credentials: [params.SSH_CREDENTIALS_ID]) {
                    withCredentials([file(credentialsId: params.KNOWN_HOSTS_CREDENTIALS_ID, variable: 'SSH_KNOWN_HOSTS')]) {
                        sh '''
                            set +x
                            set -eu
                            incoming="$DEPLOY_PATH/.incoming-$IMAGE_TAG"
                            target="$DEPLOY_USER@$DEPLOY_HOST"
                            ssh -o BatchMode=yes -o StrictHostKeyChecking=yes -o "UserKnownHostsFile=\\"$SSH_KNOWN_HOSTS\\"" \
                                "$target" "test -d '$DEPLOY_PATH' && mkdir -m 700 -- '$incoming'"
                            scp -o BatchMode=yes -o StrictHostKeyChecking=yes -o "UserKnownHostsFile=\\"$SSH_KNOWN_HOSTS\\"" \
                                compose.yaml deploy/deploy.sh "$target:$incoming/"
                            ssh -o BatchMode=yes -o StrictHostKeyChecking=yes -o "UserKnownHostsFile=\\"$SSH_KNOWN_HOSTS\\"" \
                                "$target" "bash '$incoming/deploy.sh' '$DEPLOY_PATH' '$DEPLOY_IMAGE' '$BIND_ADDRESS' '$HTTP_PORT'"
                        '''
                    }
                }
            }
        }
    }

    post {
        always {
            sh '''
                set +x
                set -u
                if [ -n "${SMOKE_CONTAINER:-}" ]; then
                    owner=$(docker inspect --format '{{ index .Config.Labels "ci.build" }}' "$SMOKE_CONTAINER" 2>/dev/null || true)
                    if [ "$owner" = "$BUILD_TAG" ]; then
                        docker rm -f "$SMOKE_CONTAINER" >/dev/null || true
                    fi
                fi
                if [ -n "${DOCKER_AUTH_DIR:-}" ]; then
                    rm -rf -- "$DOCKER_AUTH_DIR"
                fi
            '''
        }
    }
}
