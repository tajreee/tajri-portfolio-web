# Tajri Anhaar Portfolio

Dokumentasi progres dan keputusan desain untuk prototype portfolio web Tajri Mintahtihal Anhaar.

## Status

Prototype frontend sudah berjalan dan build production berhasil.

Section yang sudah tersedia:

1. Hero
2. About Me
3. Education
4. Professional Experience
5. Selected Work / Projects
6. Skills
7. Contact

Section lain belum dibuat dan dapat dilanjutkan pada sesi berikutnya.

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
- `motion` dan `@react-three/fiber` masih tersedia dari prototype sebelumnya, tetapi Hero saat ini menggunakan pendekatan CSS/HTML portrait dan marquee

## Arah Visual

Bahasa visual yang digunakan adalah **grayscale paper archive / torn-paper portfolio**.

Karakter visual:

- Background warm gray dan charcoal.
- Paper texture dan grain.
- Torn paper clipping melalui `clip-path`.
- Push pin, tape, shadow, dan bulletin-board material.
- Tipografi display `Space Grotesk`.
- Metadata teknis menggunakan `DM Mono`.
- Aksen utama sage yellow: `#b6b580`.
- Warna pendukung rust dan muted gray-green digunakan secara terbatas.

Keputusan visual utama:

- Tidak menggunakan dark-tech neon sebagai tema utama.
- Tidak menggunakan gradient ungu atau glassmorphism.
- Tidak membuat semua konten menjadi card generik.
- Konten dibuat seperti artefak fisik: poster, lembar akademik, case file, specimen, dan surat.
- Detail teks tetap dipertahankan, tetapi ditata sebagai dokumen visual agar tidak terasa seperti CV panjang.

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

About Me berganti otomatis setiap tiga detik secara looping. Selector manual tetap tersedia sebagai kontrol tambahan.

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

Skills dibuat sebagai **technical specimen wall** dengan background charcoal.

Kategori:

- Languages
- Frameworks
- Data & API
- Practice & Tools

Setiap skill berisi:

- Logo teknologi.
- Nama skill.
- Status `ACTIVE`.
- Konteks project atau penggunaan.
- Hover state dengan perubahan warna dan elevasi.

Logo skill menggunakan Simple Icons CDN:

```text
https://cdn.simpleicons.org/{icon-name}/55564f
```

Jika logo gagal dimuat, fallback otomatis menggunakan dua huruf awal nama skill.

Filter kategori tersedia pada bagian atas section.

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
    ├── logo-universitas-indonesia.png
    ├── tajri-portrait.jpg
    ├── project-ekatalog.jpg
    ├── project-minigame-energi.jpg
    └── project-penilaian-merit.jpg
```

Asset project bersifat opsional karena placeholder sudah tersedia.

## Struktur Komponen

```text
src/
├── App.tsx
├── main.tsx
├── styles.css
├── types/
│   └── portfolio.ts
├── data/
│   ├── portfolio.ts
│   ├── projects.ts
│   └── skills.ts
└── components/
    ├── common/
    │   └── Marquee.tsx
    ├── hero/
    │   └── HeroSection.tsx
    ├── about/
    │   └── AboutSection.tsx
    ├── education/
    │   └── EducationSection.tsx
    ├── projects/
    │   └── SelectedWorkSection.tsx
    ├── skills/
    │   └── SkillsSection.tsx
    └── contact/
        └── ContactSection.tsx

public/assets/
package.json
```

`App.tsx` sekarang berfungsi sebagai composition root dan hanya menyusun section utama. Data portfolio dipisahkan ke `src/data`, sedangkan domain type berada di `src/types`.

Pembagian tanggung jawab:

- `HeroSection`: poster hero, portrait, social links, dan marquee.
- `AboutSection`: tiga gaya portrait yang dapat dipilih, portrait fallback, dan content landscape About Me.
- `EducationSection`: academic record dan wall clipping.
- `SelectedWorkSection`: carousel project, project image fallback, popup detail, dan stack marks.
- `SkillsSection`: filter kategori, skill cards, dan logo fallback.
- `ContactSection`: letter form, validasi lokal, mailto, dan signature canvas modal.
- `Marquee`: helper visual yang digunakan oleh Hero.

## Catatan Teknis dan Pekerjaan Berikutnya

- Tambahkan footer jika struktur halaman sudah final.
- Tambahkan navigation setelah semua section disetujui.
- Pastikan link Instagram dan GitHub diganti dengan URL asli.
- Tambahkan asset project jika tersedia.
- Pertimbangkan self-hosting font untuk production.
- Pertimbangkan lazy-loading logo skill eksternal atau menggantinya dengan asset lokal.
- Audit keyboard navigation pada carousel dan modal.
- Tambahkan focus trap pada popup signature dan project detail.
- Tambahkan Escape key untuk menutup modal.
- Tambahkan test visual desktop dan mobile.
- Jalankan Lighthouse setelah konten dan asset final tersedia.
- Pertimbangkan lazy-loading library yang tidak digunakan untuk mengurangi dependency bundle.

## Verifikasi Terakhir

Perintah yang digunakan:

```bash
npm run build
```

Hasil terakhir:

```text
vite build
✓ built successfully
```
