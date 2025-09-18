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
