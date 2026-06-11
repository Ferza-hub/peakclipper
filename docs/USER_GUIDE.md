# PeakClipper — User Guide

**Panduan lengkap dari nol hingga berhasil mengekspor klip viral pertama kamu.**

---

## Daftar Isi

1. [Apa Itu PeakClipper?](#1-apa-itu-peakclipper)
2. [Cara Membuka Aplikasi](#2-cara-membuka-aplikasi)
3. [Onboarding — Pertama Kali Masuk](#3-onboarding--pertama-kali-masuk)
   - 3.1 [Pilih Peran (Role)](#31-pilih-peran-role)
   - 3.2 [Masuk / Daftar Akun](#32-masuk--daftar-akun)
   - 3.3 [Isi Profil Kreator](#33-isi-profil-kreator)
   - 3.4 [Isi Info Bisnis (khusus Business)](#34-isi-info-bisnis-khusus-business)
4. [Halaman Utama — Dashboard](#4-halaman-utama--dashboard)
5. [Membuat Klip Baru](#5-membuat-klip-baru)
   - 5.1 [Dari URL Video](#51-dari-url-video)
   - 5.2 [Upload File Video](#52-upload-file-video)
6. [Jendela Konfigurasi (Configure)](#6-jendela-konfigurasi-configure)
   - 6.1 [Mode Klip](#61-mode-klip)
   - 6.2 [Panjang Klip](#62-panjang-klip)
   - 6.3 [Bahasa](#63-bahasa)
   - 6.4 [Gaya Caption](#64-gaya-caption)
   - 6.5 [Pengaturan Lanjutan (Advanced)](#65-pengaturan-lanjutan-advanced)
7. [Proses Klipping Berjalan](#7-proses-klipping-berjalan)
8. [Melihat Hasil Klip](#8-melihat-hasil-klip)
   - 8.1 [Preview Video](#81-preview-video)
   - 8.2 [Download Klip](#82-download-klip)
   - 8.3 [Download Semua Klip](#83-download-semua-klip)
   - 8.4 [Memahami Skor Klip](#84-memahami-skor-klip)
9. [Mengelola Proyek di Dashboard](#9-mengelola-proyek-di-dashboard)
   - 9.1 [Rename Proyek](#91-rename-proyek)
   - 9.2 [Hapus Proyek](#92-hapus-proyek)
10. [Halaman Analytics](#10-halaman-analytics)
11. [Profil & Keluar](#11-profil--keluar)
12. [Demo Mode vs Full Mode](#12-demo-mode-vs-full-mode)
13. [Pertanyaan Umum (FAQ)](#13-pertanyaan-umum-faq)
14. [Pemecahan Masalah (Troubleshooting)](#14-pemecahan-masalah-troubleshooting)

---

## 1. Apa Itu PeakClipper?

PeakClipper adalah alat otomatis yang **memotong momen terbaik** dari video panjang (podcast, livestream, wawancara, webinar) dan mengubahnya menjadi klip pendek siap posting ke:

- **TikTok**
- **Instagram Reels**
- **YouTube Shorts**

**Cara kerjanya singkat:**
1. Kamu tempel link video (YouTube, TikTok, dll.) atau upload file video sendiri.
2. PeakClipper mentranskripsi audio secara otomatis.
3. Algoritma menilai setiap bagian berdasarkan kata-kata kuat, pertanyaan, emosi, dan kecepatan bicara.
4. Bagian dengan nilai tertinggi dipotong dan diekspor sebagai klip MP4.
5. Kamu bisa langsung download dan posting.

Tidak perlu keahlian editing. Tidak perlu tahu cara pakai ffmpeg. Cukup tempel link, klik, selesai.

---

## 2. Cara Membuka Aplikasi

### Jika kamu mengakses versi online:

1. Buka browser (Chrome, Firefox, Safari, Edge — semua bisa).
2. Ketik atau buka link aplikasi yang diberikan admin/developer kamu.
3. Tekan Enter. Halaman akan terbuka dalam beberapa detik.

### Jika kamu menjalankan sendiri di komputer:

1. Buka Terminal (Mac/Linux) atau Command Prompt (Windows).
2. Masuk ke folder proyek:
   ```
   cd peakclipper
   ```
3. Jalankan perintah:
   ```
   npm run dev
   ```
4. Buka browser dan ketik:
   ```
   http://localhost:3000
   ```
5. Tekan Enter. Aplikasi siap digunakan.

> **Catatan:** Jika layar tetap putih atau error "connection refused", pastikan terminal masih berjalan dan tidak ada pesan error merah di sana.

---

## 3. Onboarding — Pertama Kali Masuk

Saat pertama kali membuka PeakClipper, kamu akan melalui proses pengenalan singkat (onboarding). Ini hanya dilakukan **sekali**. Setelah selesai, kamu langsung masuk ke dashboard tiap kali buka aplikasi.

---

### 3.1 Pilih Peran (Role)

Layar pertama menanyakan: **"Kamu siapa?"**

Kamu akan melihat dua pilihan kartu:

| Kartu | Untuk Siapa |
|---|---|
| **Creator** | YouTuber, TikToker, podcaster, content creator individu |
| **Business** | Agensi, brand, tim konten, freelancer dengan banyak klien |

**Cara memilih:**
1. Klik kartu yang sesuai denganmu.
2. Kartu yang dipilih akan menyala dengan border biru/ungu.
3. Aplikasi otomatis lanjut ke langkah berikutnya.

> Tidak ada pilihan yang "benar" atau "salah". Pilih yang paling mendekati situasimu. Kamu bisa ubah nanti lewat profil.

---

### 3.2 Masuk / Daftar Akun

Langkah ini menyimpan preferensimu. Ada tiga cara masuk:

#### Opsi A — Google

1. Klik tombol **"Continue with Google"**.
2. Pilih akun Google-mu.
3. Selesai, kamu langsung lanjut.

> **Catatan:** Ini adalah integrasi mock (simulasi) di versi saat ini. Tidak ada proses OAuth nyata ke server Google. Nama dan email dari akun Google yang kamu pilih akan tersimpan di browser-mu saja.

#### Opsi B — Apple

1. Klik tombol **"Continue with Apple"**.
2. Sama seperti Google, ini mock dan tidak membuka popup Apple ID sungguhan.

#### Opsi C — Email & Password

1. Ketik alamat email-mu di kolom **"Email address"**.
2. Ketik password (minimal 8 karakter) di kolom **"Password"**.
3. Klik tombol **"Continue with email"**.

> **Penting:** Data ini disimpan hanya di browser-mu (`localStorage`). Tidak dikirim ke server manapun. Ini berarti:
> - Kalau kamu ganti browser, data tidak terbawa.
> - Kalau kamu buka di incognito/private, harus isi ulang.

---

### 3.3 Isi Profil Kreator

*(Hanya muncul jika kamu memilih "Creator" di langkah 3.1)*

Layar ini memiliki beberapa kolom:

#### Nama Tampilan
- Ketik nama panggilanmu atau nama channel.
- Contoh: `Budi Santoso`, `BudiTech`, `PodcastNusantara`

#### Platform Utama
- Pilih platform yang **paling banyak** kamu gunakan untuk posting.
- Opsi: `YouTube`, `TikTok`, `Instagram`, `Twitter/X`, `LinkedIn`
- Klik salah satu. Pilihan yang aktif akan menyala.

#### Niche Konten
- Pilih kategori konten yang paling sesuai.
- Opsi: `Education`, `Entertainment`, `Lifestyle`, `Business`, `Gaming`, `Tech`, `Health`, `Other`
- Ini membantu sistem memahami audiensmu (untuk fitur mendatang).

**Setelah semua diisi:**
- Klik tombol **"Get started →"** di bawah.
- Kamu akan langsung masuk ke dashboard.

---

### 3.4 Isi Info Bisnis (khusus Business)

*(Hanya muncul jika kamu memilih "Business" di langkah 3.1)*

#### Nama Agensi / Bisnis
- Ketik nama bisnis atau agensimu.
- Contoh: `Kreativa Studio`, `Viral Agency ID`

#### Ukuran Tim
- Pilih seberapa besar timmu:
  - `Solo` — kamu bekerja sendiri
  - `2–5` — tim kecil
  - `6–20` — tim menengah
  - `20+` — perusahaan besar

**Setelah diisi:**
- Klik **"Get started →"**.
- Kamu masuk ke dashboard.

---

## 4. Halaman Utama — Dashboard

Dashboard adalah pusat kendali PeakClipper. Ini yang kamu lihat:

```
┌──────────────────────────────────────────────────────────┐
│  ⚡ PeakClipper          Analytics    [Avatar]           │
├──────────────────────────────────────────────────────────┤
│                                                          │
│       Clips                                              │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │  [Thumbnail] │  │  [Thumbnail] │  │  [Thumbnail] │   │
│  │  Judul Video │  │  Judul Video │  │  Judul Video │   │
│  │  5 clips     │  │  3 clips     │  │  7 clips     │   │
│  │         ···  │  │         ···  │  │         ···  │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                          │
├──────────────────────────────────────────────────────────┤
│  [ Tempel link atau ketik nama video...    ] [Generate]  │
└──────────────────────────────────────────────────────────┘
```

**Bagian-bagian dashboard:**

| Area | Fungsi |
|---|---|
| **Navbar atas** | Logo, link Analytics, tombol avatar/profil |
| **Area kartu proyek** | Semua proyek yang pernah kamu buat |
| **Input bar bawah** | Tempat memasukkan URL atau nama file untuk klip baru |

**Jika belum ada proyek:**
- Dashboard akan menampilkan layar kosong dengan pesan ajakan membuat klip pertama.
- Langsung ketik URL di input bar bawah.

---

## 5. Membuat Klip Baru

Ada dua cara membuat klip: dari URL online atau upload file dari komputer.

---

### 5.1 Dari URL Video

Ini cara paling cepat. Cocok untuk video yang sudah ada di internet.

**Langkah-langkah:**

1. Buka video yang ingin kamu potong di browser lain (YouTube, TikTok, dll.).
2. Salin URL-nya dari address bar. Contoh:
   ```
   https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ```
3. Kembali ke PeakClipper.
4. Klik di **input bar** di bagian bawah layar (ada tulisan *"Paste a link or type a video name…"*).
5. Tempel URL dengan `Ctrl+V` (Windows/Linux) atau `Cmd+V` (Mac).
6. Klik tombol **"Generate"** (tombol ungu di kanan input bar).
7. Jendela konfigurasi akan terbuka. Lanjut ke [Bagian 6](#6-jendela-konfigurasi-configure).

**URL yang didukung:**
- YouTube: `youtube.com/watch?v=...` atau `youtu.be/...`
- TikTok: `tiktok.com/@username/video/...`
- Instagram Reels: `instagram.com/reel/...`
- Twitter/X: `twitter.com/i/status/...`
- Facebook Video: `facebook.com/watch?v=...`
- Vimeo: `vimeo.com/...`
- Dan 1000+ situs lain yang didukung yt-dlp

> **Jika video bersifat private atau memerlukan login:** Proses akan gagal. Pastikan video bisa diakses publik.

---

### 5.2 Upload File Video

Cocok jika kamu punya file video di komputer (rekaman Zoom, hasil export dari kamera, dll.).

**Langkah-langkah:**

1. Klik ikon **Upload** (ikon panah ke atas atau clip) di sebelah input bar.
   - Atau langsung seret file video ke area input bar.
2. Jendela pemilih file sistem operasimu akan terbuka.
3. Cari dan pilih file video-mu.
4. Klik **"Open"** / **"Buka"**.
5. Nama file akan muncul di input bar.
6. Klik **"Generate"**.
7. Jendela konfigurasi akan terbuka.

**Format yang didukung:**
- MP4 (`.mp4`) — paling umum, disarankan
- MOV (`.mov`) — dari kamera Apple/GoPro
- AVI (`.avi`) — format lama Windows
- MKV (`.mkv`) — format container umum
- WebM (`.webm`) — format web Google
- Dan format lain yang bisa dibaca ffmpeg

**Batas ukuran file:**
- Tidak ada batas keras dari aplikasi, tapi semakin besar file, semakin lama diproses.
- Disarankan di bawah 2 GB untuk pengalaman terbaik.

---

## 6. Jendela Konfigurasi (Configure)

Setelah klik Generate, jendela **Configure** akan muncul di tengah layar. Di sini kamu mengatur bagaimana klip akan dibuat.

---

### 6.1 Mode Klip

Di bagian paling atas ada tiga tombol mode:

| Mode | Ikon | Fungsi |
|---|---|---|
| **Shorts** | ✂️ | Mode utama — potong momen terbaik secara otomatis |
| **Captions** | 💬 | Fokus ke klip dengan dialog kuat, teks terbakar di video |
| **Reframe** | 📐 | Ubah rasio aspek video (landscape → portrait, dll.) |

**Cara memilih:**
- Klik salah satu tombol. Tombol yang aktif akan menyala biru.
- Ketika kamu klik mode berbeda, halaman otomatis scroll ke pengaturan yang relevan.

**Mana yang harus dipilih?**
- Buat pertama kali: pilih **Shorts** — ini yang paling umum dan aman.
- Jika videomu banyak dialog penting: pilih **Captions**.
- Jika videomu horizontal dan mau diposting ke TikTok: pilih **Reframe**.

---

### 6.2 Panjang Klip

Di seksi **"Clip Length"** ada slider atau pilihan durasi:

| Opsi | Durasi | Cocok Untuk |
|---|---|---|
| **Auto** | Otomatis oleh AI | Biarkan algoritma yang putuskan |
| **15s** | 15 detik | Hook pendek, teaser |
| **30s** | 30 detik | TikTok, Reels standard |
| **60s** | 60 detik | YouTube Shorts, konten yang butuh konteks |
| **90s** | 90 detik | Klip lebih panjang untuk cerita |

> **Saran pemula:** Gunakan **Auto** dulu. Algoritma cukup pintar memilih durasi alami per segmen.

---

### 6.3 Bahasa

Di seksi **"Language"** pilih bahasa konten video:

- `English (en)` — untuk video bahasa Inggris
- `Indonesian (id)` — untuk video bahasa Indonesia
- `Spanish (es)`, `Portuguese (pt)`, `French (fr)`, `German (de)`, dll.

**Mengapa ini penting?**
Algoritma mendeteksi *hook words* (kata pemancing) dan *kata emosional* berdasarkan bahasa. Jika kamu memilih bahasa yang salah, skor klip bisa tidak akurat.

---

### 6.4 Gaya Caption

Di seksi **"Caption Style"** ada 9 pilihan gaya teks yang akan terbakar di video:

| Gaya | Tampilan | Cocok Untuk |
|---|---|---|
| **Bold Yellow** | Teks kuning tebal, latar hitam | Gaming, energetik |
| **Minimal** | Teks putih tipis, tanpa latar | Podcast, konten serius |
| **Neon** | Teks cyan/hijau menyala | Konten tech, futuristik |
| **Fire** | Teks oranye/merah bergradient | Motivasi, hype |
| **Elegant** | Serif putih di bawah | Lifestyle, fashion |
| **Pop** | Warna-warni, Comic Sans-ish | Fun, anak muda |
| **Cinematic** | Letterbox, subtitle putih | Film, dokumenter |
| **Duotone** | Dua warna kontras | Artistik |
| **Karaoke** | Highlight kata per kata | Lagu, sing-along |

**Cara memilih:**
- Klik salah satu kotak preview.
- Preview mini di kotak menunjukkan seperti apa tampilan captionnya.
- Kotak yang dipilih akan diberi border.

---

### 6.5 Pengaturan Lanjutan (Advanced)

Klik tombol **"Advanced"** (ada chevron ▾) untuk membuka pengaturan tambahan:

#### Rasio Aspek (Aspect Ratio)

| Opsi | Dimensi | Platform |
|---|---|---|
| **9:16** | Vertikal (portrait) | TikTok, Reels, Shorts ✓ |
| **1:1** | Kotak | Instagram Feed |
| **16:9** | Horizontal (landscape) | YouTube standard |

> Untuk TikTok/Reels/Shorts: pilih **9:16** (default).
> Untuk YouTube standard: pilih **16:9**.

#### Intro Title

- Toggle **On/Off**.
- Jika **On**: judul klip akan muncul 2 detik di awal video sebagai overlay teks.
- Jika **Off**: video langsung mulai tanpa teks intro.

#### Captions (Subtitle)

- Toggle **On/Off**.
- Jika **On**: subtitle akan terbakar ke dalam video sesuai gaya yang kamu pilih di atas.
- Jika **Off**: video tanpa teks sama sekali.

---

**Setelah semua pengaturan selesai:**

Klik tombol **"Generate clips"** (tombol besar biru/ungu di bagian bawah jendela).

Proses klipping akan dimulai.

---

## 7. Proses Klipping Berjalan

Setelah klik Generate, tampilan berubah ke layar **Processing**. Ini yang terjadi di belakang layar:

```
┌─────────────────────────────────────────┐
│  Processing your video...               │
│                                         │
│  ████████████░░░░░░░░  57%             │
│                                         │
│  Analyzing transcript...               │
│                                         │
│  ⏱ Estimated: ~45 seconds             │
└─────────────────────────────────────────┘
```

**Tahapan yang akan kamu lihat (status bar):**

| Status | Artinya |
|---|---|
| Fetching video info | Mengambil metadata video (judul, durasi, thumbnail) |
| Downloading video | Mengunduh file video dari internet |
| Extracting transcript | Mengekstrak subtitle/transkripsi dari audio |
| Analyzing content | Algoritma menilai setiap segmen |
| Clipping | Memotong dan mengekspor setiap klip |
| Done! | Selesai, klip siap dilihat |

**Progress bar** menunjukkan persentase (0% sampai 100%).

**Berapa lama prosesnya?**

| Kondisi | Durasi estimasi |
|---|---|
| Demo Mode (tanpa yt-dlp/ffmpeg) | ~8–12 detik |
| Video YouTube 10 menit (Full Mode) | ~2–4 menit |
| Video 60 menit | ~15–25 menit |
| Upload file 500 MB | ~10–20 menit |

> **Jangan tutup tab browser** selama proses berlangsung. Jika tab ditutup, proses tetap berjalan di server tapi kamu tidak bisa melihat hasilnya di tab yang sama.

---

## 8. Melihat Hasil Klip

Setelah proses selesai, tampilan berubah ke layar **Results**. Kamu akan melihat daftar klip yang dihasilkan.

```
┌─────────────────────────────────────────────────────────┐
│  ✅ 5 clips ready                        [Download All] │
├────────────────────────────────────────────────────────┤
│  ┌──────────┐  The moment that changes everything      │
│  │  VIDEO   │  Score: 92 ▓▓▓▓▓▓▓▓▓▓░░                 │
│  │  PREVIEW │  Duration: 0:47  |  ▶ Preview  ⬇ Download│
│  └──────────┘                                           │
├────────────────────────────────────────────────────────┤
│  ┌──────────┐  Why most people get this wrong          │
│  │  VIDEO   │  Score: 87 ▓▓▓▓▓▓▓▓▓░░░                 │
│  │  PREVIEW │  Duration: 1:02  |  ▶ Preview  ⬇ Download│
│  └──────────┘                                           │
└─────────────────────────────────────────────────────────┘
```

---

### 8.1 Preview Video

Untuk menonton klip sebelum download:

1. Klik thumbnail video atau tombol **"▶ Preview"** di kartu klip.
2. Video player kecil akan terbuka.
3. Klik tombol play ▶ di player.
4. Kamu bisa:
   - Pause/play dengan klik di video atau tekan Spasi.
   - Geser progress bar untuk loncat ke bagian tertentu.
   - Aktifkan fullscreen dengan ikon ⛶ di pojok kanan bawah player.
5. Klik di luar video untuk menutup player.

---

### 8.2 Download Klip

Untuk menyimpan satu klip:

1. Klik tombol **"⬇ Download"** di kartu klip yang diinginkan.
2. Browser akan mengunduh file MP4 ke folder **Downloads** komputer-mu.
3. Nama file: `clip-[id].mp4` atau nama yang relevan dengan konten.

> **Di mobile:** Tombol download akan membuka video di tab baru. Tekan lama pada video dan pilih "Save video" atau "Download video".

---

### 8.3 Download Semua Klip

Untuk mengunduh semua klip sekaligus:

1. Klik tombol **"Download All"** di pojok kanan atas layar Results.
2. Setiap klip akan diunduh satu per satu oleh browser.

> **Catatan:** Browser mungkin memblokir multiple download sekaligus. Jika muncul notifikasi "Allow downloads?", klik Allow/Izinkan.

---

### 8.4 Memahami Skor Klip

Setiap klip punya **Score** (angka 0–100). Ini menunjukkan seberapa "viral" algoritma menilai bagian tersebut.

**Cara skor dihitung:**

| Sinyal | Nilai | Contoh |
|---|---|---|
| Hook words | +12 per kata | "rahasia", "kesalahan", "jujur", "secret" |
| Kata emosional | +8 per kata | "luar biasa", "gagal", "cinta", "incredible" |
| Frasa transisi | +10 per frasa | "alasannya adalah", "begini caranya" |
| Pertanyaan | +6 per pertanyaan | "Kenapa ini penting?" |
| Kecepatan bicara tinggi | +5 | Pembicara berbicara cepat = energetik |
| Angka & statistik | +4 per data | "73% orang...", "dalam 3 hari..." |

**Interpretasi skor:**

| Skor | Artinya |
|---|---|
| 85–100 | Sangat kuat — prioritas posting pertama |
| 70–84 | Bagus — layak diposting |
| 55–69 | Cukup — perlu review manual dulu |
| Di bawah 55 | Lemah — mungkin tidak cukup menarik |

> Skor bukan jaminan viral. Ini heuristik. Pertimbanganmu sebagai kreator tetap paling penting.

---

## 9. Mengelola Proyek di Dashboard

Semua video yang pernah kamu proses tersimpan sebagai **proyek** di dashboard. Setiap proyek ditampilkan sebagai kartu.

---

### 9.1 Rename Proyek

Kadang nama otomatis kurang deskriptif. Kamu bisa ubah.

**Cara 1 — via menu tiga titik:**
1. Arahkan kursor ke kartu proyek.
2. Klik ikon tiga titik **`⋯`** yang muncul di pojok kanan atas kartu.
3. Klik **"Rename"** dari dropdown menu.
4. Kolom nama proyek berubah jadi input yang bisa diedit.
5. Hapus nama lama, ketik nama baru.
6. Tekan **Enter** atau klik di luar kolom untuk menyimpan.

**Cara 2 — klik langsung pada nama:**
1. Klik dua kali pada judul proyek di kartu.
2. Judul berubah jadi input.
3. Edit dan tekan Enter.

---

### 9.2 Hapus Proyek

**Perhatian:** Menghapus proyek akan menghapus data job dari memori server. Klip yang sudah didownload di komputermu tidak terpengaruh.

**Langkah:**
1. Arahkan kursor ke kartu proyek.
2. Klik ikon tiga titik **`⋯`** di pojok kanan atas kartu.
3. Klik **"Delete"** dari dropdown.
4. Konfirmasi penghapusan jika ada dialog konfirmasi.
5. Kartu proyek hilang dari dashboard.

> **Tidak ada undo.** Pastikan kamu sudah download semua klip yang kamu butuhkan sebelum menghapus proyek.

---

## 10. Halaman Analytics

Klik **"Analytics"** di navbar atas untuk melihat statistik penggunaan.

**Apa yang kamu lihat:**

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  47          │ │  84          │ │  12h 30m     │ │  2.3x        │
│  Clips Made  │ │  Avg Score   │ │  Time Saved  │ │  Speed       │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

| Metrik | Penjelasan |
|---|---|
| **Clips Made** | Total klip yang pernah dihasilkan sejak awal |
| **Avg Score** | Rata-rata skor semua klip |
| **Time Saved** | Estimasi waktu yang kamu hemat vs edit manual |
| **Processing Speed** | Rasio durasi video vs waktu proses |

**Grafik mingguan** di bawah kartu menunjukkan aktivitas klipping per hari dalam seminggu terakhir.

> **Catatan:** Data analytics diambil dari job yang ada di memori server. Jika server restart, data bisa berkurang. Ini adalah fitur yang akan dikembangkan lebih lanjut dengan penyimpanan permanen.

---

## 11. Profil & Keluar

### Melihat Profil

1. Klik **avatar** (ikon lingkaran dengan inisial namamu) di pojok kanan atas navbar.
2. Dropdown profil akan terbuka.

**Dropdown berisi:**
- Foto/inisial avatar
- Nama lengkapmu
- Alamat email
- Badge peranmu (Creator / Business)
- Platform utama dan niche konten (Creator) atau ukuran tim (Business)

### Edit Profil

1. Di dropdown profil, klik **"Edit profile"**.
2. *(Fitur ini akan membuka modal pengaturan profil di versi mendatang. Saat ini masih placeholder.)*

### Ke Halaman Analytics

Di dropdown profil ada shortcut ke halaman **"Analytics"** — klik untuk langsung ke sana.

### Keluar (Sign Out)

1. Klik avatar di navbar.
2. Di bawah dropdown, klik **"Sign out"** (ada ikon pintu keluar).
3. Semua preferensi terhapus dari browser.
4. Kamu diarahkan kembali ke halaman Onboarding.
5. Untuk masuk lagi, isi ulang onboarding dari awal.

> **Penting:** Sign out menghapus semua data preferensi dari browser (`localStorage`). Proyek yang ada di dashboard (yang disimpan di memori server) **tidak terhapus** — tapi karena nama/profil hilang, kamu tidak akan terhubung ke sesi sebelumnya.

---

## 12. Demo Mode vs Full Mode

Aplikasi otomatis mendeteksi apakah yt-dlp dan ffmpeg tersedia. Jika tidak tersedia (misalnya di hosting serverless seperti Vercel), aplikasi beralih ke **Demo Mode**.

### Demo Mode

- Tersedia di: Vercel, hosting serverless, atau komputer tanpa yt-dlp/ffmpeg
- Apa yang terjadi: Proses disimulasikan, klip yang dihasilkan adalah placeholder (video sampel berwarna)
- Download: Mengunduh file sampel MP4 (bukan potongan dari video asli)
- Tujuan: Menunjukkan alur kerja aplikasi secara utuh tanpa perlu instalasi tambahan

**Tanda kamu di Demo Mode:**
- Di layar Results, ada label **"Demo"** di kartu klip.
- Klip yang didownload adalah video placeholder (bukan konten asli videomu).
- Prosesnya sangat cepat (~8 detik).

### Full Mode

- Tersedia di: VPS, Railway, Docker, atau komputer lokal dengan yt-dlp + ffmpeg terpasang
- Apa yang terjadi: Video benar-benar diunduh, dipotong, dikompres, diberi caption
- Download: File MP4 nyata dari konten video asli

**Cara aktifkan Full Mode:**
Ikuti panduan instalasi di [README.md](../README.md) untuk memasang yt-dlp dan ffmpeg sesuai sistem operasimu.

---

## 13. Pertanyaan Umum (FAQ)

**Q: Apakah PeakClipper gratis?**
A: PeakClipper adalah engine yang dijual sebagai lisensi sekali beli. Tidak ada biaya langganan. Setelah kamu punya aksesnya, kamu bisa pakai selamanya.

---

**Q: Apakah video saya disimpan di server?**
A: Sementara iya — video diunduh ke server untuk diproses, lalu klip disimpan sementara agar bisa didownload. Tapi data ini bersifat **sementara** (in-memory) dan hilang saat server restart. Untuk privasi maksimal, jalankan di server privatmu sendiri.

---

**Q: Berapa banyak klip yang dihasilkan per video?**
A: Standarnya 5 klip terbaik. Jumlah ini mengikuti berapa banyak segmen yang nilainya di atas median. Video sangat panjang (1 jam+) bisa menghasilkan lebih banyak.

---

**Q: Saya paste URL tapi error "Video not available"?**
A: Kemungkinan penyebab:
1. Video bersifat private atau dibatasi geografis.
2. Platform memblokir pengunduhan (Instagram kadang melakukan ini).
3. URL salah format — pastikan lengkap termasuk `https://`.

---

**Q: Apakah bisa untuk video Indonesia?**
A: Ya! Pilih `Indonesian (id)` di pengaturan bahasa. Algoritma akan mendeteksi hook words dan kata emosional dalam bahasa Indonesia.

---

**Q: Kenapa klip yang dihasilkan tidak cocok dengan yang saya harapkan?**
A: Algoritma berbasis heuristik — mendeteksi pola bahasa, bukan memahami makna secara semantik. Untuk hasil lebih baik:
- Pastikan video punya audio yang jelas (bukan musik instrumental saja)
- Pilih bahasa yang tepat
- Coba ganti mode (Shorts → Captions)

---

**Q: Apa bedanya "Captions" dan "Intro Title"?**
A: 
- **Captions** = subtitle yang muncul sepanjang video, mengikuti kata yang diucapkan
- **Intro Title** = teks judul klip yang muncul 2 detik di awal video saja, lalu hilang

---

**Q: Bisa upload video dari Google Drive atau Dropbox?**
A: Saat ini belum. Kamu perlu download dulu ke komputer, lalu upload via fitur File Upload. Integrasi cloud storage direncanakan untuk versi mendatang.

---

**Q: Data saya hilang setelah refresh halaman?**
A: Proyek dan klip disimpan di memori server (in-memory). Selama server tidak restart, data tetap ada meskipun kamu refresh browser. Tapi kalau server restart (misalnya di Vercel saat deploy baru), data akan hilang. Solusinya: **download klip setelah selesai proses, jangan tunggu lama.**

---

## 14. Pemecahan Masalah (Troubleshooting)

### "spawn yt-dlp ENOENT"

**Artinya:** yt-dlp tidak terpasang di server.
**Solusi:** 
- Jika di server: install yt-dlp (lihat README.md bagian instalasi).
- Jika tidak bisa install: aplikasi otomatis beralih ke Demo Mode — ini normal.

---

### Halaman putih / blank setelah onboarding

**Artinya:** Ada error JavaScript di halaman dashboard.
**Solusi:**
1. Buka Developer Tools (F12 atau klik kanan → Inspect).
2. Lihat tab "Console" untuk pesan error merah.
3. Coba refresh halaman (`Ctrl+R` / `Cmd+R`).
4. Jika masih kosong, coba hapus localStorage:
   - Di Chrome: Developer Tools → Application → Local Storage → klik kanan → Clear.
   - Refresh lagi. Onboarding akan muncul, isi ulang dari awal.

---

### Video processing stuck di persentase tertentu

**Artinya:** Proses terhenti (mungkin karena timeout atau error di server).
**Solusi:**
1. Tunggu 2–3 menit lebih — proses besar butuh waktu.
2. Jika tidak ada perubahan, refresh halaman.
3. Buat proyek baru dengan URL yang sama.
4. Periksa log terminal (jika menjalankan sendiri) untuk pesan error.

---

### Download tidak berjalan / tombol tidak merespons

**Artinya:** Browser memblokir download atau file tidak tersedia.
**Solusi:**
1. Cek apakah browser memblokir popup/download — izinkan di notification bar.
2. Coba klik kanan tombol Download → "Save link as".
3. Jika di Demo Mode, file yang diunduh adalah video sampel — ini normal.

---

### "Job not found" error

**Artinya:** Server sudah restart dan data proyek hilang dari memori.
**Solusi:**
- Buat proyek baru. Data yang sudah diunduh ke komputer tetap aman.
- Untuk mencegah ini, download klip segera setelah proses selesai.

---

### Caption tidak muncul di video hasil download

**Artinya:** Pastikan toggle "Captions" dalam keadaan **On** saat konfigurasi.
**Catatan:** Di Demo Mode, caption tidak benar-benar terbakar ke video (karena ffmpeg tidak tersedia). Caption hanya aktif di Full Mode.

---

### Aplikasi sangat lambat saat loading

**Kemungkinan penyebab:**
- Koneksi internet lambat (terutama saat fetch dari YouTube).
- Server sedang memproses banyak job sekaligus.
- Video yang diproses sangat panjang.

**Solusi:**
- Tunggu dan bersabar — proses video memang resource-intensive.
- Coba di jam sepi.
- Jika self-hosted, upgrade spesifikasi server (minimal 2 CPU core, 4 GB RAM disarankan).

---

*Panduan ini akan diperbarui seiring penambahan fitur baru. Jika ada pertanyaan yang belum terjawab, buka issue di repositori GitHub proyek ini.*
