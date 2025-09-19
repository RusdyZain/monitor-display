# 🏥 Monitor Display BIDDOKKES POLDA NTB

Monitor digital ini menampilkan laporan realisasi, video profil, informasi moto, dan ticker berita agar mudah dibaca pada layar TV kantor.

## ✨ Fitur Utama

- **Layout full-screen** tanpa scrollbar halaman agar tampilan selalu rapih di monitor.
- **Panel laporan PDF** dengan auto-scroll dan opsi ringkasan halaman pertama.
- **Video profil** looping otomatis 24/7.
- **Moto card** berisi pesan organisasi dengan aksen warna instansi.
- **Running ticker** animasi untuk menonjolkan pesan penting.

## 🧱 Struktur Proyek

```
monitor-display/
├── public/
│   ├── bg.png                # background utama
│   ├── dokkes.png            # logo BIDDOKKES
│   ├── pdfs/Laporan.pdf      # dokumen yang ditampilkan
│   └── videos/Video.mp4      # video profil
├── src/
│   ├── components/
│   │   ├── HeaderTitle.jsx   # header tanggal, logo, jam
│   │   ├── LaporanPanel.jsx  # panel PDF dengan auto-scroll
│   │   ├── VideoPlayer.jsx   # komponen pemutar video
│   │   ├── MotoTagline.jsx   # kartu moto organisasi
│   │   └── RunningText.jsx   # teks berjalan bagian bawah
│   ├── App.jsx               # komposisi layout utama
│   ├── index.css             # reset dan utilitas global
│   └── main.jsx              # entry React
├── index.html
└── package.json
```

## 🚀 Menjalankan Aplikasi Lokal

Pastikan Node.js 18+ tersedia, lalu:

```bash
npm install
npm run dev
```

Buka URL yang tertera (biasanya `http://localhost:5173`).

## 🛠️ Build Produksi

```bash
npm run build
```

Folder `dist/` siap dipublikasikan ke server statis.

## 📄 Konfigurasi & Catatan

- Styling utama menggunakan Tailwind CSS.
- Tailwind mengandalkan konfigurasi di `tailwind.config.js`.
- Komponen PDF memanfaatkan library `react-pdf`. Saat build, akan muncul peringatan `eval` dari `pdfjs-dist`; ini datang dari dependensi upstream dan aman diabaikan untuk keperluan display internal.

---

Dikembangkan untuk kebutuhan tampilan monitor internal BIDDOKKES POLDA NTB.
## Paket Desktop Sederhana

1. Jalankan `npm install` (sekali saja) untuk memastikan dependensi server ringan terpasang.
2. Buat build statis dengan `npm run build` sehingga folder `dist/` terisi.
3. Bungkus server menjadi executable Windows dengan `npm run package:win`.

Perintah di atas menghasilkan `build/monitor-display.exe`. Letakkan file `.exe` tersebut berdampingan dengan folder `dist/` (yang berisi PDF, video, dan asset lainnya), lalu jalankan. Aplikasi akan menyalakan server lokal otomatis dan membuka browser ke `http://localhost:4173`. Jika tidak ingin browser terbuka otomatis, jalankan dengan `AUTO_OPEN=false monitor-display.exe`.

Untuk mengetes tanpa membuat `.exe`, gunakan `npm run serve:dist` setelah `npm run build`; perintah ini menyalakan server yang sama langsung dari Node.js.
