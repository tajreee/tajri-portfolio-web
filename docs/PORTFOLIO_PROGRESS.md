# Tajri Anhaar Portfolio

Dokumentasi progres dan keputusan desain untuk prototype portfolio web Tajri Mintahtihal Anhaar.

## Status

Versi release: `v1.1.0`.

Pembaruan terakhir: 29 Oktober 2026.

Frontend portfolio sudah memiliki tujuh section utama, koreografi scroll berbasis `motion/react`, dialog aksesibel, dan dukungan reduced motion yang mengikuti perubahan preferensi sistem. Pengembangan setelah release `v1.1.0` memakai tema Studio Cetak yang telah disetujui, navbar sticky, dan footer bergaya colophon.

Section yang sudah tersedia:

1. Hero
2. About Me
3. Education
4. Professional Experience
5. Selected Work / Projects
6. Skills
7. Contact

Foto portrait/project dan automated test suite permanen masih menjadi pekerjaan berikutnya. Form contact tetap menggunakan `mailto:`, bukan pengiriman melalui backend.

## Riwayat Release

### v1.1.0 / 29 Oktober 2026

- Refactor section, data portfolio, dan domain type menjadi modul terpisah; menambahkan About Me dan Professional Experience setelah release awal.
- Hero parallax, heading per baris, paper arrival, cap dokumen, timeline scroll, hanging-project sway, serta transisi filter dan modal.
- Play/Pause untuk marquee dan portrait; autoplay berhenti saat offscreen, tab browser tidak aktif, atau reduced motion diaktifkan.
- Navigasi keyboard pada portrait, native dialog dengan Escape dan pemulihan fokus, serta perbaikan layout mobile.
- Surat contact langsung berhenti bergerak saat difokuskan; data form dan signature tetap tersimpan selama halaman aktif.
- Versi `package.json` dan metadata root `package-lock.json` diselaraskan ke `1.1.0`; tidak ada dependency aplikasi baru.

### v1.0.0 / 27 Oktober 2026

- Release awal portfolio dengan arah visual paper archive, academic record, hanging projects, skills, dan surat contact.

## Cara Menjalankan

```bash
cd D:\Vibecoding\new-personal-web
npm install
npm run dev
```

Build production:

```bash
npm run build
```

Preview hasil build:

```bash
npm run preview
```

## Stack Teknis

- React 19
- TypeScript
- Vite
- CSS native
- `@phosphor-icons/react` untuk ikon sosial
- `motion/react` (Framer Motion) untuk transisi interaktif; `@react-three/fiber` belum digunakan

## Arah Visual

Bahasa visual yang digunakan adalah **Studio Cetak / torn-paper portfolio**, melanjutkan konsep paper archive dari release awal.

Karakter visual:

- Background ivory, sage, hijau tinta, dan rust yang memberi ritme antar-section.
- Motif halftone, tanda registrasi cetak, kertas bergaris, dan lipatan amplop di luar area baca.
- Paper texture dan grain.
- Torn paper clipping melalui `clip-path`.
- Push pin, tape, shadow, dan bulletin-board material.
- Tipografi display `Space Grotesk`.
- Metadata teknis menggunakan `DM Mono`.
- Warna utama berasal dari token `--press-*` di `src/print-studio.css`.
- Aksen rust, olive, dan gold dipakai untuk penekanan serta kontrol interaktif.

Keputusan visual utama:

- Tidak menggunakan dark-tech neon sebagai tema utama.
- Tidak menggunakan gradient ungu atau glassmorphism.
- Tidak membuat semua konten menjadi card generik.
- Konten dibuat seperti artefak fisik: poster, lembar akademik, case file, specimen, dan surat.
- Detail teks tetap dipertahankan, tetapi ditata sebagai dokumen visual agar tidak terasa seperti CV panjang.

## Navbar dan Footer

- Navbar sticky berada di luar `main`, dengan wordmark TA dan enam anchor: About, Education, Experience, Work, Skills, Contact.
- Penanda section aktif memakai `IntersectionObserver` pada garis baca di bawah navbar, bukan React state update per frame scroll.
- Pada lebar sampai 1040 px, navigasi menjadi menu disclosure beranimasi yang bisa ditutup lewat Escape, klik luar, perpindahan fokus, pemilihan anchor, atau resize ke desktop. Menu tidak mengunci scroll atau menjadi modal.
- Skip link menuju `#main-content`; Hero memakai `#home`. Target section dapat menerima fokus setelah navigasi anchor.
- `scroll-padding-top` memberi ruang untuk navbar pada anchor maupun kontrol yang mendapat fokus. Native hash/history tetap dipertahankan; smooth scrolling dinonaktifkan saat reduced motion aktif.
- Footer bergaya colophon berisi identitas, navigasi ulang, email, LinkedIn, copyright tahun otomatis, dan Back to top.
- Link GitHub dan Instagram belum dimasukkan ke footer karena data saat ini masih berupa URL generik; link Hero lama tidak diubah.
- Komponen navbar/footer tidak memakai native dialog, sehingga tidak mengubah focus containment dan scroll lock dialog proyek atau signature.

## Hero Section

Hero menjadi poster portrait utama.

Fitur:

- Foto close-up Tajri di tengah.
- Marquee teks bergerak ke kiri dan kanan di belakang portrait.
- Role di kiri atas.
- Social links di kanan atas:
  - Instagram
  - LinkedIn
  - GitHub
- Nama `TAJRI ANHAAR` di bawah portrait.
- Quote:

```text
Kode yang bisa diuji,
dibaca, dan dilanjutkan.
```

- Paper grain.
- Torn edge atas dan bawah.
- Portrait fallback jika foto belum tersedia.
- Reduced-motion support: marquee berhenti ketika `prefers-reduced-motion: reduce` aktif.

Asset Hero:

```text
public/assets/tajri-portrait.jpg
```

About portrait assets:

```text
public/assets/about-portrait-builder.jpg
public/assets/about-portrait-explainer.jpg
public/assets/about-portrait-observer.jpg
```

About Me berganti otomatis setiap tiga detik saat terlihat dan tab browser aktif. Hover, fokus, atau pemilihan manual menjedakan slideshow sampai tombol Play ditekan. Autoplay dinonaktifkan saat reduced motion aktif.

## Education Section

Education dibuat seperti lembar academic record yang ditempel di wall board.

Konten:

- Logo Universitas Indonesia.
- Periode `2022 — 2026`.
- Lulus `15 Juli 2026`.
- Program Studi Sistem Informasi.
- Fakultas Ilmu Komputer.
- Gelar `S.Kom.`.
- Predikat `Cum Laude`.
- IPK `3.77 / 4.00`.
- `125 SKS` dan `471,2 mutu`.
- Asisten Dosen Matematika Diskrit 2.
- Lima mata kuliah relevan dengan nilai.
- Tugas akhir Design System untuk Direktorat Transformasi Digital UI.
- Informasi terpilih dari 85 pendaftar dan mendampingi 350+ mahasiswa.

Asset Education:

```text
public/assets/logo-universitas-indonesia.png
```

Keputusan layout:

- Logo dibuat berwarna asli.
- Teks `Indonesia` menggunakan aksen sage yellow.
- Logo dibuat besar dan dipusatkan secara vertikal terhadap area judul.
- Degree stamp `S.Kom. / Cum Laude` dipusatkan dalam kolom tersendiri dan digeser sedikit ke kiri untuk keseimbangan visual.
- Pada mobile, layout berubah menjadi satu kolom.

## Professional Experience Section

Professional Experience ditempatkan setelah Education dan sebelum Selected Work.

Komponen:

```text
src/components/experience/ExperienceSection.tsx
```

Konsep visualnya adalah timeline work log dengan kartu landscape bergaya lembar arsip.

Konten saat ini:

- Full Stack Developer Intern.
- PT Indi Teknokreasi Internasional / INDI Technology.
- Jakarta, Indonesia.
- Agu—Des 2025.
- 20 pekan.
- 770 jam kerja.
- Evaluasi internship 96,3 / 100.
- 40+ REST endpoints.
- 3 client projects.
- 2 released services.

Bullet kontribusi:

- 40+ endpoint REST dengan Go dan Django, skema PostgreSQL, dan dua layanan production.
- Backend minigame loyalitas energi dengan 10+ endpoint Go, tiga API partner, dan leaderboard harian serta mingguan.
- 25+ endpoint sistem penilaian kinerja dengan 11 peran, access rules berlapis, dan data locking setelah finalisasi.
- Swagger/OpenAPI, Prometheus, Grafana, UAT, dan end-to-end testing hingga MVP.

Asset:

```text
public/assets/logo-inditech.png
```

Struktur data pengalaman dibuat sebagai array agar pengalaman profesional berikutnya dapat ditambahkan sebagai entry timeline baru tanpa mengubah struktur komponen.

## Selected Work Section

Selected Work menggunakan konsep **hanging project papers**.

Setiap lembar berisi:

- Nomor case file.
- Tipe project.
- Foto atau placeholder project.
- Judul.
- Deskripsi singkat.
- Timeline.
- Role.
- Tombol `OPEN DETAIL`.

Project yang tersedia:

### E-Katalog UMKM

- Timeline: Pekan 02—06.
- Role: Full Stack.
- 8+ endpoint REST.
- Model abstrak dan kompresi gambar.
- Batas maksimal lima file upload.
- Pagination per app.
- Google Analytics dengan dimensi city.
- Dokumentasi API untuk Autentikasi, Document, Event, FAQ, dan Katalog.

### Minigame Energi

- Timeline: 1 bulan.
- Role: Lead Backend.
- 10+ endpoint Go.
- Clean Architecture.
- Database transaction dan unique constraint.
- Seeder untuk parameter campaign.
- Tie-breaker leaderboard berdasarkan waktu pencapaian.
- Sinkronisasi timezone.
- Graceful shutdown.

### Penilaian Merit

- Timeline: 20 pekan.
- Role: Backend Developer.
- 25+ endpoint.
- 11 peran pengguna.
- Status Hold untuk verifikator.
- Finalisasi dan penguncian data.
- Satu fungsi pembulatan untuk dashboard dan PDF.
- Preload skor dan inner join.
- Seeder untuk Aspect, Sub Aspect, Indicator, dan Queue Indicator.
- `chromedp` untuk rendering PDF.

Interaksi carousel:

- Drag desktop.
- Swipe mobile.
- Tombol navigasi kiri/kanan.
- Track memiliki banyak clone agar looping circular.
- Jarak drag diterjemahkan menjadi beberapa langkah project.
- Normalisasi posisi clone dilakukan tanpa transition yang terlihat.
- Text selection dinonaktifkan pada area carousel agar drag tidak memilih teks.
- Tali horizontal membentang melewati frame kiri dan kanan.
- Setiap kertas memiliki tali vertikal dan kail.

Popup project:

- Format landscape di desktop.
- Tidak menampilkan gambar project utama.
- Kolom kiri berisi judul, summary, timeline, dan role.
- Kolom kanan berisi detail teknis.
- Stack ditampilkan dengan supporting logo marks.
- Mobile berubah menjadi satu kolom.

Asset project opsional:

```text
public/assets/project-ekatalog.jpg
public/assets/project-minigame-energi.jpg
public/assets/project-penilaian-merit.jpg
```

Jika asset tidak ditemukan, placeholder otomatis menampilkan nomor dan nama project.

## Skills Section

Skills dibuat sebagai **floating paper field**: logo berada pada potongan kertas sobek kecil yang melayang vertikal di atas kanvas hijau tinta Studio Cetak, menggantikan kartu kotak.

Kategori:

- Languages
- Frameworks
- Data & API
- Practice & Tools

Setiap potongan kertas berisi:

- Logo teknologi dan nama skill terlihat tanpa hover; warna kertas, kemiringan, jarak, dan fase gerak dibuat bervariasi secara deterministik.
- Konteks project serta kategori muncul saat hover, fokus, atau kertas ditahan. Pada layar kecil, perangkat tanpa hover, dan reduced motion, konteks selalu terlihat.
- Hover/fokus menjedakan animasi pada posisi saat itu, tanpa mengembalikan transform ke posisi awal.
- Klik, tap, atau Enter menahan/melepas kertas melalui toggle yang mendukung `aria-pressed`.
- Fallback inisial dua huruf jika logo gagal dimuat.

Gerakan memakai CSS transform dan `animation-play-state`, sedangkan Motion menangani fade/layout saat filter berubah. Loop dijeda per kertas ketika di luar/menjauh dari viewport, saat tab browser tidak aktif, atau melalui kontrol Pause/Resume motion. Reduced motion menonaktifkan loop dan perpindahan layout. Hover tidak memperbesar dimensi kertas.

Hamparan memakai layout auto-height dengan 5 kolom desktop, 4/3 kolom tablet, dan 2 kolom di layar sempit. Namespace `press-skill-*` terpisah dari CSS specimen/orbit lama agar tidak menghidupkan kembali aturan legacy.

Logo skill menggunakan Simple Icons CDN:

```text
https://cdn.simpleicons.org/{icon-name}/253b30
```

Jika logo gagal dimuat, fallback otomatis menggunakan dua huruf awal nama skill.

Filter kategori dan pengumuman jumlah hasil tetap tersedia: ALL menampilkan 20 kertas, masing-masing kategori menampilkan lima. Logo dimuat secara lazy dengan ukuran tetap.

## Contact Section

Contact dibuat sebagai surat fisik yang ditempel di bulletin board.

Elemen:

- Kop surat.
- Nama dan role Tajri.
- Lokasi dan email.
- Garis pemisah.
- Tanggal otomatis dari perangkat pengunjung.
- `Dear`.
- `RE`.
- `FROM NAME`.
- `EMAIL`.
- `VIA`.
- `BODY`.
- `Sincerely`.
- Area signature.
- Nama dan email pengirim.
- `SEND LETTER` sebagai dispatch mark, bukan tombol UI solid.

### Signature

Pengunjung dapat klik area `SIGN HERE` untuk membuka popup canvas.

Fitur:

- Menggambar dengan mouse.
- Menggambar dengan trackpad.
- Menggambar dengan jari di touchscreen.
- Tombol `CLEAR`.
- Tombol `USE SIGNATURE`.
- Signature tampil di surat.
- Klik langsung pada signature untuk mengeditnya kembali.
- Tidak ada tombol `EDIT SIGNATURE` terpisah.

Signature hanya disimpan di React state selama halaman aktif.

### Keputusan Keamanan Contact

Form tidak menggunakan endpoint backend publik.

Pengiriman memakai `mailto:` setelah validasi lokal:

```text
Form browser
  -> validasi lokal
  -> encodeURIComponent
  -> aplikasi email milik pengunjung
```

Keuntungan:

- Tidak ada API key di frontend.
- Tidak ada SMTP credential di browser.
- Tidak ada database pesan.
- Tidak ada endpoint publik yang dapat dispam.
- Tidak ada upload file.
- Tidak ada email service credential.
- Tidak ada data signature yang di-upload.

Validasi yang tersedia:

- Nama wajib.
- Subject wajib.
- Email wajib.
- Format email diperiksa.
- Body wajib.
- Input di-encode sebelum dimasukkan ke URL `mailto:`.
- Tidak ada HTML mentah yang dirender dari input user.

Batasan `mailto:`:

- Pengunjung harus memiliki aplikasi email.
- Signature gambar tidak dapat dikirim sebagai attachment melalui `mailto:`.
- Email tujuan terlihat di source frontend.
- Proteksi spam tidak dapat mengontrol inbox tujuan secara penuh.

Untuk form server-side di masa depan, gunakan:

- Cloudflare Turnstile.
- Server-side validation.
- Rate limiting.
- CSRF protection jika memakai cookie/session.
- Email provider free tier.
- Batas payload.
- Sanitasi input.
- Tidak mengizinkan attachment pada tahap awal.

## Struktur Asset

```text
public/
└── assets/
    ├── logo-inditech.png
    └── logo-universitas-indonesia.png
```

Struktur di atas menunjukkan asset yang tersedia saat release `v1.1.0`. Foto Hero, tiga portrait About, dan gambar project belum tersedia; masing-masing memakai fallback. Path asset yang diharapkan tercantum pada section terkait.

## Struktur Komponen

```text
src/
├── App.tsx
├── main.tsx
├── styles.css
├── print-studio.css
├── site-chrome.css
├── types/
│   └── portfolio.ts
├── data/
│   ├── portfolio.ts
│   ├── projects.ts
│   └── skills.ts
└── components/
    ├── common/
    │   ├── AnimatedDialog.tsx
    │   ├── InkHeading.tsx
    │   ├── Marquee.tsx
    │   ├── usePageVisible.ts
    │   └── useReducedMotion.ts
    ├── layout/
    │   ├── SiteHeader.tsx
    │   └── SiteFooter.tsx
    ├── hero/
    │   └── HeroSection.tsx
    ├── about/
    │   └── AboutSection.tsx
    ├── education/
    │   └── EducationSection.tsx
    ├── experience/
    │   └── ExperienceSection.tsx
    ├── projects/
    │   └── SelectedWorkSection.tsx
    ├── skills/
    │   ├── SkillsSection.tsx
    │   └── skills-paper.css
    └── contact/
        └── ContactSection.tsx

public/assets/
package.json
```

`App.tsx` berfungsi sebagai composition root, menyediakan `MotionConfig`, dan menampilkan progres membaca. Navbar dan footer menjadi sibling dari `main` agar landmark banner/contentinfo tetap semantik. Data portfolio dan `sectionLinks` bersama dipisahkan ke `src/data`, sedangkan domain type berada di `src/types`.

Pembagian tanggung jawab:

- `SiteHeader`: navigasi sticky, scrollspy, skip link, dan disclosure mobile.
- `SiteFooter`: colophon, navigasi sekunder, kontak, dan anchor kembali ke atas.
- `HeroSection`: poster hero, portrait, social links, dan marquee.
- `AboutSection`: tiga gaya portrait yang dapat dipilih, portrait fallback, dan content landscape About Me.
- `EducationSection`: academic record dan wall clipping.
- `ExperienceSection`: work-log timeline, record internship, dan evaluasi.
- `SelectedWorkSection`: carousel project, project image fallback, popup detail, dan stack marks.
- `SkillsSection`: filter kategori, kertas skill melayang, kontrol pause/hold, dan logo fallback.
- `ContactSection`: letter form, validasi lokal, mailto, dan signature canvas modal.
- `Marquee`: helper visual yang digunakan oleh Hero.
- `AnimatedDialog`: portal/native dialog, transisi, scroll lock, dan pemulihan fokus.
- `InkHeading`: reveal judul per baris, sekali saat masuk viewport.
- `usePageVisible` dan `useReducedMotion`: preferensi aksesibilitas serta kontrol autoplay.

## Catatan Teknis dan Pekerjaan Berikutnya

- Pastikan link Instagram dan GitHub diganti dengan URL asli.
- Tambahkan foto Hero, tiga portrait About, dan asset project jika tersedia.
- Pertimbangkan self-hosting font untuk production.
- Pertimbangkan mengganti logo skill eksternal dengan asset lokal untuk mengurangi ketergantungan CDN.
- Tambahkan automated test suite permanen untuk interaksi dan regresi visual.
- Jalankan Lighthouse setelah konten dan asset final tersedia.
- Pertimbangkan lazy-loading library yang tidak digunakan untuk mengurangi dependency bundle.

## Verifikasi Terakhir

### Kertas Skill Melayang

Pemeriksaan Edge headless pada 1440, 820, 744, 390, dan 320 px mencakup gerak vertikal nyata, freeze/resume clock tanpa reset saat hover/fokus, hold melalui keyboard/touch, pause global yang bertahan saat filter berubah, penghentian saat tab tersembunyi/offscreen, live reduced motion, fallback logo, 20/lima hasil filter, keunikan ID, serta kertas yang tidak saling bertumpuk atau memicu horizontal overflow. Navbar/footer dan navigasi anchor tetap diperiksa terpisah.

### Navbar dan Footer

Pemeriksaan browser mencakup desktop 1440 px, mobile 390 px, narrow/reduced-motion 320 px, tablet 820 px, dan landscape 844 x 430 px. Skenario: seluruh anchor, indikator aktif, deep link langsung, browser Back, skip link, fokus target, Escape/klik luar/Tab pada disclosure, resize menu ke desktop, back-to-top, overflow, dan kontras teks. Regresi dialog proyek, signature canvas, form persistence, serta carousel tetap diperiksa.

### Koreografi Scroll

- Hero memakai scroll progress yang dihaluskan spring untuk memisahkan gerak portrait dan dua lapisan marquee. Tombol Explore menuju About, dan garis tipis di atas halaman menunjukkan progres membaca.
- `InkHeading` membuka judul per baris seperti teks yang muncul dari tepi kertas. Urutan hanya berjalan sekali, bukan menyembunyikan judul setiap kali pengguna kembali ke section.
- Academic record bergeser ke papan; cap gelar dan evaluasi menekan saat cap itu sendiri terlihat. Observer menargetkan header/cap pendek agar tetap bekerja pada dokumen mobile yang tinggi.
- Timeline pengalaman terisi berdasarkan posisi scroll tanpa mengubah ukuran dot atau label NOW.
- Tali proyek terbentang, lalu lembar case file menetap. Ayunan spring merespons scroll, drag, dan tombol carousel. State kedatangan disinkronkan antar-copy agar loop tidak memutar ulang entrance; hanya lembar di sekitar viewport yang mengikuti sway.
- Kertas skill melayang vertikal dengan fase berbeda dan diam saat hover/fokus. Filter dan modal mempertahankan transisi keluar-masuk.
- Surat kontak diletakkan sekali dan garis pembatas tergambar. Fokus pertama langsung menyelesaikan gerakan surat; isi form dan canvas tidak dianimasikan saat digunakan.
- Reduced motion punya fallback CSS selain pengaturan Motion, sehingga transform berbasis MotionValue juga langsung dinetralkan saat preferensi sistem berubah.

Motion memakai transform/opacity dan MotionValues, tanpa React state update per frame scroll, animasi tekstur, WebGL tambahan, atau scroll hijacking.

Integrasi motion mempertahankan visual paper archive dan menggunakan dependency `motion` yang sudah tersedia, tanpa menambah dependency aplikasi.

- Hero: portrait masuk seperti lembar yang ditempel, disusul tape dan nama; marquee memiliki kontrol jeda dan berhenti saat di luar viewport.
- About: crossfade portrait, selector keyboard dengan Arrow/Home/End, serta kontrol Play/Pause.
- Skills: indikator filter bergerak, transisi posisi kertas, pause/resume tanpa reset, serta konteks pemakaian untuk hover, keyboard, dan touch.
- Modal project dan signature: `AnimatedDialog` memakai portal dan native `<dialog>`, transisi masuk/keluar, Escape, focus containment, focus restoration, dan scroll lock.
- `MotionConfig` dan autoplay mengikuti perubahan preferensi reduced motion tanpa reload.
- Override responsif ditempatkan setelah aturan desktop agar layout mobile tidak tertimpa.

Verifikasi release menggunakan Edge headless pada 320, 390, 820, 1440, dan 2560 px: filter, kontrol keyboard, carousel looping, modal, signature canvas, form persistence, reduced motion, dan horizontal overflow. Koreografi scroll juga diperiksa pada desktop/mobile, termasuk touch scrolling, timeline progress, cap dokumen, konsistensi copy carousel, dan penghentian gerak surat saat fokus.

Pemeriksaan browser saat ini memakai skrip verifikasi lokal di direktori sementara, belum berupa automated test suite permanen dalam repository. Tidak ada error JavaScript yang ditemukan pada skenario tersebut.

Perintah yang digunakan:

```bash
npm run build
git diff --check
```

Hasil terakhir:

```text
vite build
✓ built successfully
```
