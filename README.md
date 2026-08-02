<div align="center">

# 🎵 YanzStudio Music Player

**Platform streaming musik pribadi bergaya Spotify**  
Dibangun dengan Next.js 14, Tailwind CSS, Supabase, dan YouTube IFrame API.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?style=flat-square&logo=supabase)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

[Demo](#) · [Fitur](#fitur) · [Setup](#setup) · [Deploy](#deploy)

</div>

---

## 📖 Tentang Proyek

YanzStudio adalah platform streaming musik pribadi yang dibangun sebagai proyek personal. Terinspirasi dari desain Crafto Music dan antarmuka Spotify, proyek ini menggabungkan player musik yang powerful dengan manajemen konten yang mudah lewat Admin Panel bawaan.
<img width="1902" height="898" alt="image" src="https://github.com/user-attachments/assets/98fd1351-ba1d-42f9-8a02-fb3e4501922c" />
Proyek ini **open source dan bebas digunakan** oleh siapa saja untuk keperluan pribadi maupun komersial.

---

## ✨ Fitur

### 🎵 Music Player
- **Hybrid player** — mendukung file MP3 lokal dan YouTube embed sekaligus
- **Queue system** — antrian lagu dengan shuffle dan repeat (none / all / one)
- **Persistent mini player** — tetap tampil saat berpindah halaman
- **Seek bar** — klik untuk loncat ke posisi manapun
- **Volume control** dengan mute/unmute
- **Prev / Next** track

### 📝 Lirik Sinkron
- Lirik berjalan otomatis seperti Spotify
- Format timestamp `[mm:ss]` per baris
- Auto-scroll ke baris aktif
- Tampilan fullscreen dengan highlight magenta

### 🔍 Pencarian & Browse
- Search realtime by judul, artis, album, genre
- Filter album by genre
- Halaman detail album dengan tracklist lengkap
- Playlist otomatis (Favorites, Recently Added)

### ⚙️ Admin Panel
- Tambah, edit, hapus track dan album langsung dari web
- Preview cover art sebelum disimpan
- Panduan format lirik timestamp bawaan
- Data tersimpan di Supabase — permanen di semua perangkat

### 🎨 Desain
- Dark mode by default
- Warna brand: neon magenta + gold + hitam pekat
- Animasi marquee, sound bars, parallax rings
- Fully responsive (desktop + mobile)
- Accessible (WCAG AA)

---

## 🗂️ Struktur Proyek

```
yanzstudio/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx              # Home — hero, albums, popular, recent
│   │   ├── search/page.tsx       # Search + filter genre
│   │   ├── library/page.tsx      # Library + statistik
│   │   ├── album/[id]/page.tsx   # Detail album + tracklist
│   │   ├── playlist/[id]/page.tsx# Favorites, Recently Added
│   │   └── admin/page.tsx        # Admin Panel
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx       # Navigasi kiri (desktop) + bottom nav (mobile)
│   │   │   ├── PlayerBar.tsx     # Player bar persisten di bawah
│   │   │   ├── LyricsOverlay.tsx # Tampilan lirik fullscreen
│   │   │   └── YouTubePlayer.tsx # Hidden YouTube audio engine
│   │   └── ui/
│   │       ├── TrackRow.tsx      # Baris lagu reusable
│   │       ├── AlbumCard.tsx     # Card album dengan play button
│   │       ├── PlayAlbumBtn.tsx  # Tombol play album
│   │       └── SearchBar.tsx     # Input pencarian
│   ├── lib/
│   │   ├── supabase.ts           # Inisialisasi Supabase client
│   │   ├── db.ts                 # Semua operasi database (CRUD)
│   │   ├── data.ts               # Data default / fallback
│   │   ├── lyrics.ts             # Parser timestamp lirik
│   │   └── utils.ts              # Helper functions
│   ├── store/
│   │   └── playerStore.ts        # Zustand — state audio player global
│   ├── hooks/
│   │   └── useScrollReveal.ts    # Intersection Observer scroll animation
│   └── types/
│       └── index.ts              # TypeScript types
├── public/
│   └── audio/                    # Letakkan file MP3 di sini
├── supabase-schema.sql           # Schema SQL untuk Supabase
├── .env.local                    # Environment variables (JANGAN di-commit)
└── .gitignore
```

---

## 🗄️ Database — Supabase

Proyek ini menggunakan **Supabase** (PostgreSQL) sebagai database cloud gratis.

### Struktur Tabel

#### Tabel `albums`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | TEXT (PK) | ID unik album |
| `title` | TEXT | Judul album |
| `artist` | TEXT | Nama artis |
| `year` | TEXT | Tahun rilis |
| `cover` | TEXT | URL gambar cover |
| `cover_gradient` | TEXT | CSS gradient fallback |
| `genre` | TEXT | Genre musik |
| `description` | TEXT | Deskripsi album |
| `track_ids` | TEXT[] | Array ID track |
| `created_at` | TIMESTAMPTZ | Waktu dibuat |

#### Tabel `tracks`
| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | TEXT (PK) | ID unik track |
| `title` | TEXT | Judul lagu |
| `artist` | TEXT | Nama artis |
| `album_id` | TEXT (FK) | Relasi ke albums.id |
| `album_title` | TEXT | Nama album (denormalized) |
| `duration` | TEXT | Durasi format `mm:ss` |
| `cover` | TEXT | URL gambar cover |
| `source_type` | TEXT | `mp3` atau `youtube` |
| `audio_url` | TEXT | Path file MP3 |
| `youtube_id` | TEXT | YouTube Video ID |
| `lyrics` | TEXT | Lirik dengan timestamp |
| `genre` | TEXT | Genre |
| `year` | TEXT | Tahun |
| `likes` | INTEGER | Jumlah likes |
| `plays` | INTEGER | Jumlah plays |
| `created_at` | TIMESTAMPTZ | Waktu dibuat |

### Row Level Security (RLS)
Supabase menggunakan RLS untuk keamanan akses data. Konfigurasi saat ini:
- **SELECT** — publik (semua bisa baca)
- **INSERT / UPDATE / DELETE** — publik (karena tidak ada sistem login)

> Untuk keamanan lebih lanjut, tambahkan Supabase Auth dan batasi operasi write hanya untuk user yang login.

### Fallback
Jika Supabase belum dikonfigurasi (`.env.local` kosong), aplikasi otomatis fallback ke data statis di `src/lib/data.ts`.

---

## ⚙️ Admin Panel

Admin Panel tersedia di `/admin` — tidak perlu login (proyek pribadi).

### Cara Kerja

#### Tambah Track
1. Buka `/admin` → klik **Tambah Track**
2. Pilih sumber: **YouTube** (paste Video ID) atau **MP3** (path file)
3. Isi judul, artis, album, cover URL, durasi, genre
4. Isi lirik dengan format timestamp (opsional):
   ```
   [00:05] Baris pertama
   [00:12] Baris kedua
   [00:20] Baris ketiga
   ```
5. Klik **Tambah Track** → langsung tersimpan di Supabase ✓

#### Cara Dapat YouTube Video ID
```
URL: https://www.youtube.com/watch?v=dQw4w9WgXcQ
                                    ^^^^^^^^^^^^ ← ini Video ID-nya
```

#### Cara Dapat Cover URL
- **Unsplash** (gratis, stabil): cari foto → klik kanan → Copy Image Address
- **Folder lokal**: taruh gambar di `public/images/` → pakai `/images/nama.jpg`
- **Google Images**: cari → klik kanan → Copy Image Address (bisa tidak stabil)

#### Format Lirik Timestamp
Lirik dengan timestamp akan auto-scroll dan highlight seperti Spotify:
```
[00:05] Baris pertama
[00:12] Baris kedua
[01:30] Baris dengan menit
```
Tanpa timestamp, lirik tampil statis.

---

## 🔐 Keamanan Environment Variables

> **PENTING: Jangan pernah commit `.env.local` ke GitHub**

File `.env.local` sudah masuk ke `.gitignore` — aman dari GitHub.

### Tentang `NEXT_PUBLIC_` prefix

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxx...
```

Key dengan prefix `NEXT_PUBLIC_` memang **sengaja terekspos ke browser** — ini desain resmi dari Supabase dan Next.js. **Ini aman** karena:

1. **Anon key bukan secret key** — anon key hanya punya akses terbatas sesuai RLS policy
2. **RLS melindungi data** — Supabase Row Level Security mengontrol siapa yang bisa baca/tulis
3. **Bukan service_role key** — service_role key (yang berbahaya) TIDAK pernah dipakai di frontend
4. **Supabase merancang ini** — anon key memang untuk dipakai di client-side

### Yang TIDAK boleh diekspos
```
# Jangan pernah taruh ini di NEXT_PUBLIC_
SUPABASE_SERVICE_ROLE_KEY=...  # ← ini yang berbahaya, jangan dipakai di frontend
```

### Cara aman deploy ke Vercel
Jangan upload `.env.local`. Masukkan langsung di Vercel Dashboard:
```
Vercel Dashboard → Project → Settings → Environment Variables
→ Add: NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
→ Add: NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJxxxxxx...
```
Vercel menyimpannya secara encrypted — tidak pernah terekspos ke publik.

---

## 🚀 Setup Lokal

### Prasyarat
- Node.js v18+
- Akun Supabase (gratis)

### Langkah 1 — Clone / Extract project
```bash
cd yanzstudio
npm install
```

### Langkah 2 — Setup Supabase
1. Buat project baru di [supabase.com](https://supabase.com)
2. Buka **SQL Editor** → paste isi `supabase-schema.sql` → klik **Run**
3. Buka **Settings → API** → copy **Project URL** dan **anon public key**

### Langkah 3 — Buat file `.env.local`
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxx...
```

### Langkah 4 — Jalankan
```bash
npm run dev
# Buka http://localhost:3000
```

---

## 📦 Deploy ke Vercel

### Via GitHub (recommended)

```bash
# 1. Push ke GitHub (env tidak ikut karena ada di .gitignore)
git init
git add .
git commit -m "feat: initial YanzStudio music player"
git remote add origin https://github.com/username/yanzstudio.git
git push -u origin main

# 2. Import di Vercel
# vercel.com → New Project → Import Git Repository → pilih repo ini

# 3. Tambah Environment Variables di Vercel Dashboard:
# NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJxxxxxx...

# 4. Deploy → selesai, dapat URL seperti yanzstudio.vercel.app
```

### Via Vercel CLI
```bash
npm i -g vercel
vercel
# Ikuti instruksi → saat diminta env variables, masukkan URL dan key Supabase
```

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|---|---|
| Framework | Next.js 14 (App Router + RSC) |
| Language | TypeScript |
| Styling | Tailwind CSS v3 |
| Database | Supabase (PostgreSQL) |
| State | Zustand |
| Audio | HTML5 Audio API + YouTube IFrame API |
| Animation | CSS Keyframes + Intersection Observer |
| Icons | Lucide React |
| Fonts | Manrope + DM Sans (Google Fonts) |
| Deploy | Vercel |

---

## 📝 Tambah Musik

### Via YouTube
Edit di Admin Panel → pilih sumber YouTube → paste Video ID.

### Via MP3
1. Taruh file `.mp3` di `public/audio/`
2. Admin Panel → pilih sumber MP3 → isi path `/audio/nama.mp3`

### Via `data.ts` (data default)
Edit `src/lib/data.ts` langsung untuk mengubah data fallback.

---

## 📄 Lisensi

MIT License — bebas digunakan, dimodifikasi, dan didistribusikan untuk keperluan apapun.

Proyek ini dibuat sebagai platform musik pribadi dan dibagikan secara open source.

---

<div align="center">
  <p>Dibuat dengan ❤️ menggunakan Next.js + Supabase</p>
  <p><strong>YanzStudio</strong> — Your personal music, your way.</p>
</div>
