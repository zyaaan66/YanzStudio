# 🎵 YanzStudio — Music Player

Platform streaming musik pribadi bergaya Spotify, dibangun dengan Next.js 14.

## Fitur
- ✅ Hybrid player: MP3 lokal + YouTube embed
- ✅ Queue, shuffle, repeat (none/all/one)
- ✅ Lirik lagu (tekan ikon mic di player)
- ✅ Search & filter by genre
- ✅ Album detail page
- ✅ Admin panel (tambah/edit/hapus track)
- ✅ Playlist (Favorites, Recently Played)
- ✅ Responsive (desktop + mobile)
- ✅ Accessible (WCAG AA)
- ✅ Dark mode (default)

## Quick Start
```bash
npm install
npm run dev
# Buka http://localhost:3000
```

## Tambah Musik
### Via YouTube
Edit `src/lib/data.ts`, set `sourceType: 'youtube'` dan `youtubeId: 'VIDEO_ID'`

### Via MP3
1. Taruh file `.mp3` di `public/audio/`
2. Edit `src/lib/data.ts`, set `sourceType: 'mp3'` dan `audioUrl: '/audio/nama.mp3'`
3. Atau gunakan Admin Panel di `/admin`

## Deploy
```bash
npm run build
vercel deploy
```
