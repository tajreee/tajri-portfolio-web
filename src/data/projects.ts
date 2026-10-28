import type { Project } from '../types/portfolio'

export const projects: Project[] = [
  {
    id: 'ekatalog', number: '01', title: 'E-Katalog UMKM', type: 'FULL STACK', timeline: 'PEKAN 02—06', role: 'FULL STACK', image: '/assets/project-ekatalog.jpg',
    summary: 'Katalog digital untuk UMKM pesisir dengan image handling dan analitik pengunjung per kota.',
    detail: 'Saya membangun 8+ endpoint REST untuk kategori produk, produk, dan toko UMKM. Model abstrak dengan kompresi gambar dipakai lintas modul agar aturannya konsisten. Saya menambahkan single input dengan batas lima file, pagination per app ketika data bertambah, mengganti dimensi analytics dari country menjadi city, dan menulis dokumentasi API untuk Autentikasi, Document, Event, FAQ, serta Katalog.',
    stack: [{ name: 'Django', icon: 'https://cdn.simpleicons.org/django/55564f' }, { name: 'DRF', icon: 'https://cdn.simpleicons.org/djangorestframework/55564f' }, { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/55564f' }, { name: 'Google Analytics', icon: 'https://cdn.simpleicons.org/googleanalytics/55564f' }],
  },
  {
    id: 'minigame', number: '02', title: 'Minigame Energi', type: 'LEAD BACKEND', timeline: '01 BULAN', role: 'LEAD BACKEND', image: '/assets/project-minigame-energi.jpg',
    summary: 'Backend permainan loyalitas dengan transaksi aman, leaderboard, dan release flow yang terkendali.',
    detail: 'Saya memimpin backend selama satu bulan dengan 10+ endpoint Go dan Clean Architecture. Pembuatan profil user dibungkus database transaction dan unique constraint untuk mencegah duplikasi. Ambang poin dipindah ke kolom database dan seeder agar dapat berubah tanpa deploy ulang. Saya juga menangani tie-breaker berdasarkan waktu pencapaian, response Game Mode, sinkronisasi timezone, serta graceful shutdown saat rilis.',
    stack: [{ name: 'Golang', icon: 'https://cdn.simpleicons.org/go/55564f' }, { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/55564f' }, { name: 'JWT', icon: 'https://cdn.simpleicons.org/jsonwebtokens/55564f' }, { name: 'Clean Architecture', icon: '' }],
  },
  {
    id: 'merit', number: '03', title: 'Penilaian Merit', type: 'BACKEND', timeline: '20 PEKAN', role: 'BACKEND DEVELOPER', image: '/assets/project-penilaian-merit.jpg',
    summary: 'Sistem penilaian kinerja dengan 11 peran, data terkunci, dan output dashboard serta PDF yang konsisten.',
    detail: 'Saya menangani 25+ endpoint untuk 11 peran pengguna, termasuk status Hold khusus verifikator. Saya membuat rute finalisasi dan menonaktifkan menu edit ketika periode dikunci. Satu fungsi pembulatan float64 dipakai dashboard dan PDF agar tidak berselisih. Saya juga menggunakan preload skor dan inner join untuk mengurangi query berulang, serta membuat seeder untuk 5 Aspect, 15+ Sub Aspect, 40+ Indicator, dan 80+ Queue Indicator. Untuk PDF, engine diganti ke chromedp agar gambar dan layout kompleks konsisten.',
    stack: [{ name: 'Golang', icon: 'https://cdn.simpleicons.org/go/55564f' }, { name: 'PostgreSQL', icon: 'https://cdn.simpleicons.org/postgresql/55564f' }, { name: 'JSONB', icon: 'https://cdn.simpleicons.org/postgresql/55564f' }, { name: 'chromedp', icon: '' }],
  },
]
