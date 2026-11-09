# Villa Bukit Bunga — Pamflet Digital

Website publik statis yang melanjutkan UI/UX [Lymous/ManPro-Villa](https://github.com/Lymous/ManPro-Villa/tree/develop) (referensi commit `74cad4f`). Tampilan mengikuti logo asli, DM Sans + Playfair Display, warna `#0F2625` / `#C8A44E`, navbar transparan, hero “Complete Your Every Moment”, bento paket, kartu akomodasi, dan galeri detail dari Blade sumber.

Sesuai lingkup proyek ini, pengunjung melihat kamar, paket, fasilitas, dan foto, lalu menghubungi pengelola melalui WhatsApp. Tidak ada akun, panel admin, transaksi, formulir booking ke database, atau pembayaran. Website ini merupakan versi frontend statis; source Laravel di repository referensi tidak diubah atau di-push.

## Menjalankan lokal

Memerlukan Node.js 20 atau lebih baru dan npm.

```bash
npm ci
npm run dev
```

Buka URL Local yang dicetak Vite (biasanya `http://localhost:5173`).

```bash
npm run build
npm run preview
```

Hasil production berada di `dist/`. Tidak memerlukan PHP, database, API key, atau environment variable.

## Halaman dan interaksi

- `/` — hero dan pencarian, paket, kamar, fasilitas, cara reservasi, lokasi.
- `/paket` — 9 paket, filter kapasitas/jumlah tamu/harga/jumlah kamar, dan urutan harga.
- `/paket/paket-1-family-retreat` hingga slug Paket 9 — detail kamar dan fasilitas paket. Alamat singkat seperti `/paket/1` juga didukung.
- `/kamar` — empat tipe kamar dan harga satuan.
- `/kamar/standart`, `/kamar/duluxe`, `/kamar/private`, `/kamar/kamar-besar` — galeri foto, harga, dan pesan WhatsApp.
- `/aula` — galeri 3 foto aula, harga sewa satuan Rp500.000 per malam, dan reservasi WhatsApp. Tautan aula dari paket menyimpan konteks paket asal dan tanggal kunjungan.
- `/ruang-makan` — galeri 3 foto ruang makan. Kartu Ruang Makan muncul pada Paket 2–9 dan dapat dibuka dari fasilitas di beranda. Konteks paket serta rencana tanggal tetap diteruskan saat melihat galeri dan reservasi.
- `/kolam-renang` — galeri 3 foto kolam renang. Kartu Kolam Renang muncul pada Paket 2–9 dan fasilitas beranda. Pengunjung dapat kembali ke paket asal, dengan tanggal dan reservasi WhatsApp tetap mengacu pada paket tersebut.
- `/tentang-kami` — informasi villa dan lokasi.
- `/villa-bukit-bunga-flyer.pdf` — brosur asli.

Klik paket → pilih kartu kamar atau fasilitas yang termasuk → jelajahi galeri foto. Paket 2–9 menampilkan kartu Aula, Ruang Makan, dan Kolam Renang yang dapat diklik; Paket 1 tetap tanpa aula. Galeri mendukung thumbnail, tombol sebelumnya/berikutnya, tombol panah keyboard, dan Escape untuk menutup. Pengunjung dapat kembali ke paket asal dari setiap halaman galeri. Pada halaman aula dalam konteks paket, harga satuan tetap ditampilkan dan tautan "Reservasi aula satuan" membuka pilihan sewa aula terpisah.

Tanggal dari pencarian diteruskan ke halaman paket dan pesan WhatsApp. Pencarian mencocokkan isi katalog, **bukan memeriksa ketersediaan real time**. Reservasi tetap dikonfirmasi oleh pengelola. Tombol WhatsApp hanya membuka pesan yang sudah disiapkan; tidak mengirim pesan otomatis.

## Mengubah isi website

- `src/data.js` — harga kamar, isi/harga paket, nomor WhatsApp, alamat, tautan Maps, dan foto utama.
- `src/image-manifest.json` — daftar galeri per folder. Foto dari folder pengguna dipertahankan; versi WebP yang dilayani website ada di `public/images/`.
- `src/video-manifest.json` — video Private dan Halaman Villa beserta durasi dan gambar pratinjaunya. Video untuk web berada di `public/videos/`; sertakan folder ini saat menyimpan source untuk hosting.
- `src/styles.css` — gaya visual; mengikuti desain publik repo referensi.
- `public/logo/` — logo asli repo.
- `public/fonts/` — font lokal agar website tidak bergantung pada Google Fonts saat dibuka.

Foto/video asli di delapan folder sumber tidak ikut Git sesuai `.gitignore`; file tersebut tetap ada di komputer. Seluruh aset yang diperlukan hosting sudah berada di `public/`, termasuk salinan PDF. Jika mengganti foto, jalankan `python scripts/prepare-images.py` (memerlukan Pillow), lalu periksa kembali foto utama dan galeri. Jangan menjalankan skrip tersebut pada checkout yang tidak mempunyai foto asli.

Kartu Private memiliki tombol **Lihat video** dan pemutar di halaman detail kamar. Video Halaman Villa ditampilkan langsung di halaman utama, tepat di bawah bagian paket (`/#halaman-villa`), dengan deretan 13 foto halaman tepat di bawah video. Pengunjung dapat langsung memilih foto tanpa memutar video, menggeser deretan foto, atau membuka seluruh galeri. Video dijeda ketika galeri foto dibuka. Kedua video mendukung kontrol suara, putar/jeda, dan layar penuh. Video baru dimuat saat diputar.

Untuk menyiapkan ulang video dari file asli, pasang FFmpeg dan FFprobe lalu jalankan `node scripts/prepare-videos.mjs`. Lokasi executable khusus dapat diatur melalui `VILLA_FFMPEG_BIN` dan `VILLA_FFPROBE_BIN`. Skrip mempertahankan durasi penuh dan audio, menyiapkan MP4 H.264/AAC maksimal 1280 piksel pada 30 fps dengan progressive playback, lalu membuat gambar poster serta memperbarui manifest. Build biasa tidak memerlukan FFmpeg karena memakai video yang sudah disiapkan.

Harga satuan per kamar per malam:

| Tipe        |     Harga |
| ----------- | --------: |
| Standart    | Rp125.000 |
| Duluxe      | Rp250.000 |
| Private     | Rp500.000 |
| Kamar Besar | Rp500.000 |

Harga sewa **Aula satuan Rp500.000 per malam**. Harga ini terpisah dari harga paket; penggunaan aula dalam Paket 2–9 sudah termasuk dalam paket.

Fasilitas Paket 2–9 dirinci berdasarkan keterangan paket dan daftar fasilitas di halaman pertama flyer: aula, sound system, meja dan kursi rapat, ruang makan, dapur, kolam renang, Wi-Fi, area parkir, dan 3 kamar mandi luar. Paket 1 tidak diberi daftar fasilitas umum tersebut karena flyer hanya menyebut satu kamar besar tanpa aula; fasilitas lainnya dikonfirmasi dengan pengelola.

Isi paket mengacu pada `Villa Flyer.pdf`. Harga paket tidak dihitung ulang dari harga kamar satuan. Paket 1: satu Kamar Besar, kapasitas 10–18 orang, Rp500.000/malam, tanpa aula. Paket 2–4: sebagian tamu tidur di aula. Paket 6–7: semua tamu bisa tidur di kamar. Kamar Private ditampilkan sebagai kamar satuan karena tidak dicantumkan dalam komposisi paket PDF.

## Deploy ke Vercel

Proyek ini dipakai sebagai tugas dan demo pribadi nonkomersial. Gunakan akun personal dengan paket **Hobby (gratis)** dan alamat bawaan `*.vercel.app`; domain berbayar tidak diperlukan.

1. Gunakan repository frontend [Lymous/Villa-Bukit-Bunga](https://github.com/Lymous/Villa-Bukit-Bunga). Source mencakup `src/`, `public/`, `package.json`, `package-lock.json`, `index.html`, `vite.config.js`, dan `vercel.json`. Jangan unggah `node_modules/`, `dist/`, file `.env`, atau media asli yang sudah dikecualikan oleh `.gitignore`. Repo Laravel referensi terpisah dari versi frontend ini.
2. Push melalui Git: video halaman villa yang sudah dikompresi sekitar 45,5 MiB, melebihi batas unggah file melalui halaman web GitHub sebesar 25 MiB. Tidak perlu mengunggah ulang video asli.
3. Masuk ke Vercel dengan GitHub, gunakan paket **Hobby**, lalu pilih **Add New → Project** dan import repository frontend tersebut.
4. Gunakan root directory `.`, framework **Vite**, install command `npm ci`, build command `npm run build`, dan output directory `dist`. Environment variables tidak diperlukan.
5. Klik **Deploy**, lalu buka alamat `*.vercel.app` yang diberikan Vercel. Konfigurasi `vercel.json` sudah menyiapkan fallback untuk membuka URL detail secara langsung maupun saat refresh.
6. Periksa halaman paket, galeri foto, kedua video, PDF, dan tautan WhatsApp pada alamat hasil deploy. Push berikutnya ke branch production akan memicu deploy baru.

[Vercel Hobby](https://vercel.com/docs/plans/hobby) ditujukan untuk penggunaan personal nonkomersial, sesuai tujuan tugas/demo ini. [Alamat deployment](https://vercel.com/docs/deployments/generated-urls) disediakan oleh Vercel. Batas unggah file GitHub dijelaskan dalam [dokumentasi GitHub](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github). Source di GitHub belum menjadi website publik sampai proses deploy hosting selesai.

## Pemeriksaan

```bash
npx playwright install chromium
npm test
```

Pengujian meliputi harga, kesesuaian paket, alur paket → kamar → galeri, filter, isi pesan WhatsApp, navigasi mobile, dan tidak adanya overflow horizontal pada halaman utama.

Untuk Linux yang belum memiliki pustaka browser, gunakan `npx playwright install --with-deps chromium` jika memiliki izin memasang dependensi sistem. Browser khusus dapat ditentukan dengan `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH`.
