# Deployment Docker dan Jenkins

## Alur dan batasan

- Build dilakukan di Docker: `npm ci` lalu `npm run build` pada stage Node. Host developer, Jenkins, dan server tidak perlu Node/npm.
- Agar host produksi tidak menanggung checkout, dependency cache, dan beban build, gunakan agent Jenkins yang terpisah dari host produksi. Jika keduanya ditempatkan pada mesin yang sama, beban build tetap ada pada mesin tersebut meskipun image runtime hanya berisi hasil build.
- Image runtime hanya berisi hasil `dist` dan Nginx/config, tanpa source proyek atau Node. Image memakai `USER 101:101` (UID/GID `nginx`), port container `8080`, dengan health check `/healthz` dan `/index.html`.
- Jenkins menguji image, mengarsipkan static `dist`, lalu opsional mem-push ke Docker Registry. Server menerima **image berdasarkan digest**, `compose.yaml`, dan helper deploy saja; tidak ada checkout Git, source, atau build di server.
- `PUBLISH_IMAGE=false` dan `DEPLOY=false` adalah default aman. Build biasa tidak perlu registry/server/credential. `DEPLOY=true` wajib disertai `PUBLISH_IMAGE=true`.
- Konfigurasi registry, Jenkins, SSH, reverse proxy, dan server produksi belum disiapkan atau dijalankan oleh perubahan ini. Contoh user/path di bawah bersifat ilustratif, bukan server yang sudah tersedia.

## Build dan uji lokal

Prasyarat: Docker Engine/Desktop yang aktif dengan Linux containers dan Docker Compose v2 yang mendukung `--wait` (gunakan v2.20+). Jalankan dari root repo:

```sh
docker build -t tajri-portfolio-web:local .
docker compose up -d --wait
curl --fail http://127.0.0.1:8081/healthz
curl --fail http://127.0.0.1:8081/index.html
docker compose logs --tail 100
docker compose down
```

`compose.yaml` adalah image-only, tidak memiliki `build:`. Build eksplisit harus dilakukan sebelum `up`. Default `IMAGE_REF=tajri-portfolio-web:local`, `BIND_ADDRESS=127.0.0.1`, dan `HTTP_PORT=8081`; port host ini menghindari bentrok dengan Jenkins yang lazim memakai 8080. Opsi dapat diberikan lewat environment atau `.env` lokal. Jangan memasukkan credential ke `.env` repo. Nama project lokal boleh mengikuti default Compose; pipeline dan semua operasi server selalu memakai `-p tajri-portfolio`.

Untuk build lintas arsitektur, tentukan `--platform linux/amd64` atau `--platform linux/arm64`. Worker harus memiliki arsitektur yang sama atau QEMU/binfmt yang sudah dikonfigurasi. Server juga harus cocok dengan platform image. Pipeline ini menghasilkan **satu platform**, bukan manifest multi-architecture; digest index yang tersedia tidak menjamin semua hardware dapat menjalankannya.

## Reproducibility dan keamanan

Base image dipin ke digest index berikut di `Dockerfile`:

```text
node:24-alpine@sha256:8a32c8cf649a49915a66e81e7a609223c708d0adabf288ee3f4077d765542f85
nginxinc/nginx-unprivileged:stable-alpine@sha256:f5116ed4606f3eb015dd4a8e28cb9b351476dc0ad4bc6e9f93b19cec130cdf03
```

File shell, Dockerfile, Jenkinsfile, YAML, dan konfigurasi Nginx dikunci ke LF melalui `.gitattributes` agar checkout Windows tidak merusak skrip Linux.

`package-lock.json` dan `npm ci` mengunci dependensi; `ARG GIT_COMMIT=unknown` mengisi label OCI `org.opencontainers.image.revision`. Pin ini membuat input build lebih terkendali, bukan jaminan hasil byte-identical, selalu aman, atau kompatibel dengan semua hardware. Tag bergerak tidak memperbarui digest yang sudah dipin: tinjau advisori, perbarui digest/lockfile secara sengaja, lalu build dan smoke-test kembali.

Compose menggunakan filesystem read-only, tmpfs `/tmp`, `cap_drop: ALL`, `no-new-privileges`, restart policy `unless-stopped`, serta rotasi log terbatas. Image runtime tanpa source bukan berarti kecil sepenuhnya: aset portrait PNG publik tetap masuk `dist`, termasuk file sekitar 8 MB. Optimasi aset perlu perubahan terpisah.

Semua `VITE_*` yang dipakai saat build menjadi data publik dalam bundle. Jangan gunakan untuk password, token privat, atau secret lain. Environment server hanya memilih image/bind/port, bukan mengubah konfigurasi Vite yang sudah dibangun.

## Persiapan Jenkins

Gunakan Pipeline from SCM yang memuat `Jenkinsfile`, hanya untuk branch/kode tepercaya. Batasi izin mengubah pipeline dan mengaktifkan publish/deploy; masking log bukan sandbox untuk kode berbahaya.

Agent Linux berlabel `docker` memerlukan:

- Docker CLI dan akses daemon untuk build/run/cp; plugin Buildx untuk `docker buildx imagetools inspect`, tersedia secara system-wide agar tetap terdeteksi saat `DOCKER_CONFIG` temporer dipakai.
- Arsitektur sesuai `TARGET_PLATFORM`, atau QEMU/binfmt pada worker/daemon. Smoke test mengeksekusi image, jadi kemampuan build saja belum cukup.
- Git untuk `checkout scm`, Bash/POSIX shell, coreutils (termasuk `sha256sum`, `mktemp`, `seq`), `tar`, `grep`, `ssh`, `ssh-agent`, dan `scp`.
- Plugin Jenkins Pipeline/Declarative, Git, Credentials Binding, SSH Agent, dan Timestamper. Compose plugin wajib di **server remote**, bukan untuk langkah build Jenkins.
- Akses jaringan ke SCM, registry base image, registry tujuan, dan server SSH. Akses Docker setara hak istimewa tinggi; gunakan worker tepercaya/terisolasi.

Buat credential melalui Jenkins, bukan di source:

| Parameter | Tipe / kegunaan |
| --- | --- |
| `REGISTRY_CREDENTIALS_ID` | Username with password/token, hanya untuk push dari Jenkins ke registry tujuan. |
| `SSH_CREDENTIALS_ID` | SSH Username with private key; user-nya harus sesuai `DEPLOY_USER`. |
| `KNOWN_HOSTS_CREDENTIALS_ID` | Secret file berformat OpenSSH `known_hosts` yang sudah diverifikasi. |

ID credential dibatasi huruf, angka, `.`, `_`, dan `-`. Nilai credential sebenarnya tidak boleh dicetak, dihardcode, diarsipkan, atau ditransfer ke server. Login registry Jenkins memakai `--password-stdin` dengan tracing dimatikan dan `DOCKER_CONFIG` temporer di luar workspace, lalu dihapus pada `post`.

### Parameter job

| Parameter | Pengisian |
| --- | --- |
| `PUBLISH_IMAGE` / `DEPLOY` | Default `false`; pilih publish dahulu sebelum deploy. |
| `REGISTRY_HOST` | Host registry huruf kecil, tanpa `https://` atau path; wajib mengandung titik (FQDN/IPv4), memakai `:port` eksplisit, atau persis `localhost`. Nama polos seperti `registry` ditolak karena image `registry/team/repo` ditafsirkan Docker sebagai namespace Docker Hub, bukan host untuk `docker login registry`. Default kosong. |
| `IMAGE_REPOSITORY` | Namespace/repository huruf kecil, tanpa tag/digest; isi sesuai registry milik Anda, default kosong. Komponen memakai alfanumerik dengan separator tunggal `.`, `_`, atau `-`. |
| `TARGET_PLATFORM` | `linux/amd64` (default) atau `linux/arm64`; cocokkan worker dan server. |
| `DEPLOY_HOST` / `DEPLOY_USER` | DNS huruf kecil atau IPv4, SSH port 22; nama user Unix sederhana. Default kosong. IPv6 dan custom SSH port belum didukung. |
| `DEPLOY_PATH` | Default `/srv/tajri-portfolio`; direktori absolut khusus, sudah ada, writable, tanpa symlink, `..`, spasi, trailing slash, atau karakter shell. |
| `BIND_ADDRESS` / `HTTP_PORT` | Default `127.0.0.1` / `8081`. IPv4 saja, port `1-65535`. `0.0.0.0` mengekspos HTTP ke jaringan; gunakan hanya jika memang diperlukan dan dilindungi firewall. |

Registry/server yang kosong diabaikan untuk build-only. Saat publish/deploy diaktifkan, pipeline memvalidasi parameter sebelum checkout/build; credential ID yang tidak ada juga harus diselesaikan di Jenkins. Tag lokal/registry unik berasal dari `BUILD_TAG` yang disanitasi, commit, nomor build, dan hash identitas build untuk membedakan nama job panjang yang terpotong; pipeline tidak memakai `latest` dan tidak mengubah Git tag atau branch.

### Verifikasi SSH

Dapatkan fingerprint host melalui saluran admin tepercaya, misalnya console server dengan `ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub`. Bandingkan dengan public host key yang akan dimasukkan ke `known_hosts`, lalu unggah file tersebut sebagai secret file Jenkins. Jika menggunakan `ssh-keyscan` untuk mengambil key, hasilnya **belum tepercaya** sampai fingerprint dibandingkan melalui saluran terpisah. Jangan menonaktifkan strict checking. Saat rotasi host key, verifikasi ulang sebelum memperbarui credential.

Pipeline menggunakan `StrictHostKeyChecking=yes`, `BatchMode=yes`, dan file tersebut pada `ssh` maupun `scp`. Agen Jenkins harus mendukung algoritme host/key yang dipakai server.

## Persiapan server

Server Linux memerlukan Bash, `flock` (biasanya paket `util-linux`), coreutils, Docker Engine dan Compose plugin v2.20+, SSH/SFTP (`scp` modern), akses registry, serta disk yang cukup untuk image baru dan image rollback. Server tidak membutuhkan Git/Node/npm. User deploy harus bisa menjalankan Docker tanpa prompt sudo; keanggotaan grup Docker pada umumnya setara akses root.

Contoh persiapan oleh administrator, **ganti** user/path dengan milik Anda:

```sh
sudo mkdir -p /srv/tajri-portfolio
sudo chown deploy:deploy /srv/tajri-portfolio
sudo chmod 700 /srv/tajri-portfolio
```

Gunakan direktori khusus dan path fisik, bukan direktori bersama atau symlink. Pasang public SSH key Jenkins pada user deploy sesuai kebijakan server. Project Compose `tajri-portfolio` harus khusus aplikasi ini pada daemon tersebut; jangan menjalankan deployment lain dengan nama project sama walaupun direktori berbeda.

Login registry **di server sebagai user deploy** menggunakan credential terpisah dengan izin **pull-only**, lewat mekanisme provisioning/admin yang aman. Gunakan `docker login REGISTRY_HOST --username PULL_USER --password-stdin` dengan token yang dipasok lewat stdin, bukan argumen command atau source. Jangan memakai atau mengirim credential push Jenkins ke server. Pastikan sesi SSH non-interaktif user tersebut dapat pull image dan mengakses daemon. Credential helper server, jika digunakan, juga harus tersedia tanpa prompt.

Bind default hanya loopback. Letakkan reverse proxy dengan TLS di depan `127.0.0.1:8081` dan atur DNS/firewall/sertifikat secara terpisah. Jika proxy juga berupa container, `127.0.0.1` di dalam proxy bukan host; atur konektivitas host/proxy secara eksplisit. Konfigurasi Vite saat ini memakai base `/`: sajikan di root domain, bukan subpath, kecuali base/routing dibangun ulang secara sengaja.

Aset Vite yang content-hashed aman untuk cache immutable panjang. File dari `public`, termasuk portrait PNG dengan nama tetap, **tidak content-hashed**; penggantian isi dengan nama sama dapat terlihat lama jika browser/proxy memberi cache panjang. Gunakan nama baru/versioning atau purge cache dan tinjau kebijakan cache Nginx/proxy saat menggantinya.

## Deploy dan rollback

Jenkins menjalankan langkah berikut:

1. Checkout commit; build image ber-tag unik dengan `--platform` dan `GIT_COMMIT`.
2. Jalankan container smoke tanpa host port, dengan pembatasan runtime yang sama; `docker exec wget` memeriksa `/healthz` dan `/index.html`.
3. `docker cp` static dari `/usr/share/nginx/html` pada image teruji ke `dist`, lalu arsipkan **hanya** `static-dist.tar.gz` berisi `dist/`, dengan fingerprint. Source/workspace/credential tidak ikut arsip.
4. Jika publish aktif: login temporer, tag dan push image teruji, lalu resolusi digest dengan perintah berikut. Digest wajib `sha256:` dan 64 karakter hex; arsip `image-ref.txt` berisi `registry/namespace/repository@sha256:...`.

```sh
docker buildx imagetools inspect "$REMOTE_TAG" --format '{{.Manifest.Digest}}'
```

5. Jika deploy aktif: buat direktori unik `DEPLOY_PATH/.incoming-<image-tag>` dan upload **hanya** `compose.yaml` dan `deploy/deploy.sh`. Jalankan kontrak helper ini melalui SSH:

```sh
bash DEPLOY_PATH/.incoming-UNIQUE/deploy.sh DEPLOY_PATH REPOSITORY@sha256:DIGEST BIND_ADDRESS HTTP_PORT
```

Helper mengambil `flock` pada `.deploy.lock` di root deploy, sehingga job/proses lain yang memakai helper pada direktori sama terserialisasi. Kandidat memakai direktori `.candidate.*` baru di samping script, hanya untuk metadata kecil. Helper memvalidasi manifest, lalu `compose pull --policy always` sebelum mengganti container. Pull gagal tidak mengubah container atau metadata aktif.

Startup memakai project `tajri-portfolio` dan `up -d --pull never --no-build --wait --wait-timeout 120`. Dockerfile harus memiliki health check; `--wait` menunggu sehat, bukan sekadar proses hidup. Jika startup/health gagal, helper mengembalikan rilis sebelumnya menggunakan compose/env aktif yang disalin ke staging, `--pull missing`, `--no-build`, dan `--wait`; job tetap gagal walaupun rollback berhasil. Pada deploy pertama belum ada rollback: helper melaporkan hal itu dan mencoba menghapus hanya kandidat/project yang gagal. Jika rollback juga gagal, metadata staging dipertahankan untuk diagnosis.

`compose.yaml` + `current.env` di root hanya dipromosikan setelah kandidat sehat. Rilis aktif lama baru disimpan sebagai `previous-compose.yaml` + `previous.env` setelah itu. Pasangan `previous-*` wajib lengkap atau keduanya tidak ada. Helper menyimpan pasangan awal di staging (atau marker `original-previous-absent`); jika promosi gagal atau menerima sinyal yang ditangani, kedua file awal atau kondisi tidak adanya dipulihkan sebelum rollback runtime. Jika pemulihan metadata gagal, error dicetak dan staging/backup dipertahankan untuk perbaikan manual, termasuk ketika rollback runtime berhasil. Tidak ada Git/npm/source di server, `docker system prune`, atau cleanup project lain. Replacement satu container **bukan zero-downtime**: ada kemungkinan jeda dan koneksi terputus saat recreate atau rollback. Health check internal juga tidak membuktikan DNS/TLS/reverse proxy eksternal sehat.

Jenkins `post` hanya menghapus container smoke milik build tersebut dan direktori auth temporer. Image lokal ber-tag unik tetap ada; administrator perlu kebijakan retensi Docker/Jenkins dan registry yang tidak menghapus digest rollback yang masih diperlukan. `disableConcurrentBuilds` melindungi satu job, bukan job Jenkins lain; lock remote melindungi satu root deploy. Direktori `.incoming-*` berisi dua file upload tetap disimpan; hapus hanya direktori milik deployment yang sudah selesai, tanpa wildcard cleanup saat deploy berjalan. Jangan membersihkan image/project global.

### Rollback manual

Hentikan/cegah deployment lain, periksa bahwa kedua file `previous-*` ada dan digest/platform benar. Jalankan sebagai user deploy di direktori deploy, dengan lock yang sama:

```sh
cd /srv/tajri-portfolio || exit 1
(
    flock -x 9 || exit 1
    unset IMAGE_REF BIND_ADDRESS HTTP_PORT
    docker compose --env-file previous.env -f previous-compose.yaml -p tajri-portfolio \
        up -d --pull missing --no-build --wait --wait-timeout 120 &&
    cp previous-compose.yaml compose.yaml &&
    cp previous.env current.env
) 9>.deploy.lock
```

Salinan metadata hanya dijalankan jika rollback sehat. `previous-*` tetap menunjuk rilis rollback; perintah ini tidak menukar slot untuk roll-forward. Bila ingin mempertahankan rilis yang digantikan, simpan compose/env-nya dengan nama lain terlebih dahulu di bawah lock, lalu kelola slot tersebut secara sengaja. Metadata compose/env adalah satu pasangan; jangan hanya mengganti `IMAGE_REF` tanpa manifest yang sesuai.

Jika job gagal: lihat log Jenkins, `docker compose --env-file current.env -f compose.yaml -p tajri-portfolio ps`, dan log project pada server. Setelah kegagalan deploy pertama, `current.env` mungkin belum ada; gunakan manifest/env kandidat yang tersisa untuk diagnosis jika tersedia, atau `docker ps -a --filter label=com.docker.compose.project=tajri-portfolio`. Tidak ada aksi server nyata yang dijalankan saat menulis dokumentasi ini.

## Verifikasi lokal release 1.2.0

- Build multi-stage dijalankan dengan Docker Linux containers, termasuk `npm ci` dan build Vite di stage Node yang dipin.
- Runtime berhasil healthy melalui Compose dengan filesystem read-only, tmpfs, cap-drop, dan user `101:101`. `nginx -t` berhasil.
- Direktori HTML berisi sembilan file statis, sekitar 9 MiB. Tidak ada Node/npm, `/app`, source `src`, `.git`, `package.json`, atau `node_modules` aplikasi di runtime. Image lengkap, termasuk base Nginx/Alpine, sekitar 103.5 MiB pada linux/amd64; ukuran transfer terkompresi dan cache layer berbeda.
- HTTP memeriksa `/healthz`, index, SPA fallback, gzip JS/CSS, header keamanan, cache immutable hanya untuk JS/CSS hashed, cache pendek portrait bernama tetap, serta 404 untuk aset yang hilang dan dotfiles.
- Helper deploy diuji dengan mock Docker/flock untuk kondisi sukses, pull/start/health failure, rollback, pemulihan pasangan metadata, sinyal, dan validasi input. Shell pipeline juga diperiksa.
- Jenkins Declarative/Groovy belum dieksekusi pada job Jenkins nyata; publish registry, akses SSH, dan deploy produksi belum dijalankan karena konfigurasi/kredensial tujuan belum diberikan.
