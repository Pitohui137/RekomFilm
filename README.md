# <img width="32" height="32" alt="tripix" src="https://github.com/user-attachments/assets/3cd468fc-8e2f-45d6-bce4-8684ebf8f781" /> TriPix - Film & TV Show Recommendation


## 📖 Deskripsi Proyek

**TriPix** adalah aplikasi web untuk menemukan dan mengeksplorasi film serta acara TV populer. Aplikasi ini menyediakan rekomendasi film trending, fitur pencarian, informasi detail lengkap, serta link ke berbagai platform streaming.

### ✨ Fitur Utama

- 🎯 **Rekomendasi Random** - Dapatkan 3 rekomendasi film/TV show trending secara acak
- 🔍 **Pencarian Cerdas** - Cari film dan TV show favorit dengan mudah
- 📊 **Informasi Lengkap** - Rating, durasi, tahun rilis, sinopsis, genre, dan cast
- 🎬 **Trailer YouTube** - Tonton trailer langsung dari website
- 🌐 **Link Streaming** - Akses cepat ke Netflix, Disney+, Prime Video, HBO Max, Hulu, dan Vidio
- 📱 **Responsive Design** - Tampilan optimal di desktop, tablet, dan mobile

---

## 🚀 Cara Menggunakan

### 1. Clone atau Download Repository
```bash
git clone https://github.com/username/tripix.git
cd tripix
```

### 2. Setup File Logo (Opsional)
- Siapkan file logo PNG Anda dengan nama `logo.png`
- Letakkan di folder yang sama dengan `index.html`
- Ukuran rekomendasi: 512x512px untuk hasil optimal

### 3. Jalankan Aplikasi
- Buka file `index.html` di browser
- Atau gunakan live server untuk pengalaman yang lebih baik

### 4. Mulai Eksplorasi
- Klik **"Rekomendasi"** untuk mendapatkan 3 film/TV show random
- Gunakan **search bar** untuk mencari judul spesifik
- Klik **poster** untuk melihat detail lengkap
- Klik **"Nonton Trailer"** untuk menonton trailer

---

## 🛠️ Teknologi yang Digunakan

- **HTML5** - Struktur aplikasi
- **CSS3** - Styling dengan custom properties dan animasi
- **JavaScript (ES6+)** - Logika aplikasi dan API handling
- **TMDB API** - Sumber data film dan TV show
- **Google Fonts (Outfit)** - Typography

---

## 📁 Struktur File

```
tripix/
│
├── index.html           # File HTML utama
├── styles.css           # Styling aplikasi
├── script.js            # Logika JavaScript
├── logo.png            # Logo favicon (Anda tambahkan sendiri)
├── README.md           # Dokumentasi
│
└── assets/             # Folder assets (opsional)
    ├── CalendarBlank.svg
    ├── Clock.svg
    └── Star.svg
```

---

## 🎨 Fitur Detail

### 1. Sistem Rekomendasi
- Mengambil data dari trending movies dan TV shows
- Random selection 3 item setiap kali tombol diklik
- Smooth fade-in animation

### 2. Pencarian
- Real-time search dengan TMDB API
- Filter otomatis (hanya movie dan TV, no person)
- Menampilkan maksimal 12 hasil
- Support Enter key untuk search

### 3. Modal Detail
- Backdrop/poster full-size
- Rating, tahun rilis, durasi
- Sinopsis lengkap
- Genre tags
- Cast dengan foto dan character name
- Link langsung ke 6 platform streaming

### 4. Trailer Player
- Embedded YouTube player
- Autoplay on modal open
- Responsive video container

---

## 🔑 API Key

Aplikasi ini menggunakan **The Movie Database (TMDB) API**. API key sudah disertakan untuk kemudahan testing, namun untuk production disarankan menggunakan API key sendiri.

### Cara Mendapatkan API Key Sendiri:
1. Daftar di [TMDB](https://www.themoviedb.org/signup)
2. Verifikasi email Anda
3. Buka [API Settings](https://www.themoviedb.org/settings/api)
4. Request API key (gratis)
5. Ganti API key di file `script.js`:

```javascript
const API_KEY = 'YOUR_API_KEY_HERE';
```

---

## 👥 Tim Pengembang

Proyek ini dikembangkan oleh kelompok:

| Nama | NIM |
|------|-----|
| **[Pramesty Ayuningtiyas]** | [231111025] |
| **[Abyan Farhan Muhammad]** | [231111029] | 
| **[Nasywa Zhafirah ]** | [231111033] | 
| **[Aldi Adriansyah]** | [231111064] | 


---

## 🙏 Credits & Attribution

### Data Provider
Aplikasi ini menggunakan **The Movie Database (TMDB) API** untuk semua data film dan TV show.

<img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_long_2-9665a76b1ae401a510ec1e0ca40ddcb3b0cfe45f1d51b77a308fea0845885648.svg" alt="TMDB Logo" width="200">

> *"This product uses the TMDB API but is not endorsed or certified by TMDB."*

**TMDB** menyediakan:
- Database film dan TV show terlengkap
- Rating dan review dari komunitas
- Poster, backdrop, dan media assets
- Informasi cast dan crew
- Trailer dan video content

Kunjungi: [https://www.themoviedb.org/](https://www.themoviedb.org/)

### External Resources
- **Google Fonts** - Outfit font family
- **YouTube Embed API** - Trailer playback
- **Platform Streaming** - Link integration (Netflix, Disney+, Prime Video, HBO Max, Hulu, Vidio)

---

## 📱 Platform Streaming yang Didukung

- 🎬 **Netflix** - [netflix.com](https://www.netflix.com)
- ✨ **Disney+** - [disneyplus.com](https://www.disneyplus.com)
- 📺 **Prime Video** - [primevideo.com](https://www.primevideo.com)
- 🟢 **Hulu** - [hulu.com](https://www.hulu.com)
- 🔷 **HBO Max** - [hbomax.com](https://www.hbomax.com)
- 🇮🇩 **Vidio** - [vidio.com](https://www.vidio.com)

---

## 📄 License

Proyek ini dibuat untuk tujuan **edukasi** dan **non-komersial**.

- **Code**: Free to use and modify
- **TMDB Data**: Tunduk pada [TMDB Terms of Use](https://www.themoviedb.org/terms-of-use)
- **Assets**: Original assets by project team

---


## 🌟 Acknowledgments

Terima kasih kepada:
- **TMDB** untuk API yang luar biasa
- **Pak Adi Sopian S.Kom ,M.Kom** 
- **Institut Teknologi & Bisnis Swadharma**
- Semua pihak yang telah mendukung proyek ini

---

<div align="center">

### ⭐ Jika Anda menyukai proyek ini, berikan star di GitHub!

**Made with ❤️ by [Kelompok 14/Sistem Informasi]**

*© 2024 TriPix. All Rights Reserved.*

</div>
