# Monitor Display BIDDOKKES POLDA NTB

Aplikasi layar penuh untuk menampilkan laporan PDF, video profil, moto organisasi, dan teks berjalan pada monitor kantor.

## Fitur Utama

- Panel PDF dengan auto-scroll serta dukungan multi halaman.
- Pemutar video looping dengan kontrol volume (bawaan browser).
- Header dinamis berisi tanggal, jam, dan tombol ``Pengaturan``.
- Modal pengaturan yang memungkinkan unggah PDF/video langsung ke server.
- Teks berjalan dan elemen visual yang disesuaikan dengan identitas instansi.

## Menjalankan Secara Lokal

Pastikan Node.js 18+ tersedia.

```bash
npm install
npm run dev
```

Buka URL yang tercetak (biasanya `http://localhost:5173`).

## Build Produksi

```bash
npm run build
```

Folder `dist/` berisi aset siap rilis. Untuk menayangkan build secara lokal gunakan:

```bash
npm run serve:dist
```

## Paket Desktop Sederhana

1. Jalankan `npm run build`.
2. Eksekusi `npm run package:win` untuk membuat `build/monitor-display.exe`.
3. Letakkan executable berdampingan dengan folder `dist/` berisi aset.
4. Jalankan `monitor-display.exe` (atau `AUTO_OPEN=false monitor-display.exe` bila tidak ingin membuka browser otomatis).

## Konfigurasi Aset

- Tekan tombol ``Pengaturan`` pada header untuk membuka modal konfigurasi.
- Anda dapat mengunggah file langsung dari komputer (akan tersimpan ke `dist/uploads/`) atau mengetik jalur relatif/URL publik secara manual.
- Saat menekan **Simpan**, aplikasi memanggil API `POST /api/assets` yang menulis konfigurasi ke `dist/config/assets.json`. Nilai ini otomatis dipakai oleh tampilan utama tanpa perlu restart server.

Jika memilih mengelola file secara manual tanpa fitur unggah:

1. Taruh PDF di `public/pdfs/` dan video di `public/videos/` (sebelum build) atau langsung di `dist/pdfs/` dan `dist/videos/` (setelah build).
2. Ubah `public/config/assets.json` sebelum build, atau edit `dist/config/assets.json` setelah build lalu refresh tampilan.
3. Pastikan jalur yang dituliskan dapat diakses oleh browser (contoh `/pdfs/Laporan-terbaru.pdf` atau URL eksternal).

> Catatan: Browser tidak bisa membaca file dari path lokal seperti `C:\Dokumen\laporan.pdf`. File harus disajikan oleh server (misalnya berada di dalam folder `dist/`).

## API Lokal

Server produksi ringan (`server.cjs`) menambahkan endpoint berikut:

- `GET /api/assets` – mengembalikan konfigurasi aset aktif.
- `POST /api/assets` – memperbarui konfigurasi aset.
- `POST /api/upload?type=pdf|video` – menyimpan file ke `dist/uploads/` dan mengembalikan jalur relatifnya.

Semua endpoint bekerja pada server yang dijalankan melalui `npm run serve:dist` atau executable hasil `npm run package:win`.

---

Developed for internal display needs of BIDDOKKES POLDA NTB.

