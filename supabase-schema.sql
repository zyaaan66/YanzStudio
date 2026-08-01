-- =============================================
-- YanzStudio — Supabase Schema
-- Jalankan ini di Supabase SQL Editor
-- =============================================

-- Tabel Albums
CREATE TABLE IF NOT EXISTS albums (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  artist      TEXT NOT NULL DEFAULT 'YanzStudio',
  year        TEXT,
  cover       TEXT,
  cover_gradient TEXT DEFAULT 'linear-gradient(135deg,#2d0050,#6b2fa0)',
  genre       TEXT,
  description TEXT,
  track_ids   TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Tracks
CREATE TABLE IF NOT EXISTS tracks (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  artist       TEXT NOT NULL DEFAULT 'YanzStudio',
  album_id     TEXT REFERENCES albums(id) ON DELETE SET NULL,
  album_title  TEXT,
  duration     TEXT DEFAULT '00:00',
  cover        TEXT,
  source_type  TEXT NOT NULL CHECK (source_type IN ('mp3', 'youtube')),
  audio_url    TEXT,
  youtube_id   TEXT,
  lyrics       TEXT,
  genre        TEXT,
  year         TEXT,
  likes        INTEGER DEFAULT 0,
  plays        INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;

-- Policy: semua orang bisa baca (public read)
CREATE POLICY "Public read albums" ON albums FOR SELECT USING (true);
CREATE POLICY "Public read tracks" ON tracks FOR SELECT USING (true);

-- Policy: semua orang bisa insert/update/delete (karena tidak ada auth)
-- CATATAN: Untuk keamanan lebih, tambahkan auth nanti
CREATE POLICY "Public insert albums" ON albums FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update albums" ON albums FOR UPDATE USING (true);
CREATE POLICY "Public delete albums" ON albums FOR DELETE USING (true);

CREATE POLICY "Public insert tracks" ON tracks FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update tracks" ON tracks FOR UPDATE USING (true);
CREATE POLICY "Public delete tracks" ON tracks FOR DELETE USING (true);

-- =============================================
-- Seed data awal (opsional)
-- =============================================

INSERT INTO albums (id, title, artist, year, cover, cover_gradient, genre, description) VALUES
('a1', 'Midnight Vibration', 'YanzStudio', '2024',
 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80',
 'linear-gradient(135deg,#2d0050,#6b2fa0)', 'Electronic',
 'Album debut YanzStudio — perjalanan sonic melewati malam.'),
('a2', 'Vinyl Record', 'YanzStudio', '2023',
 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
 'linear-gradient(135deg,#003050,#0088b2)', 'Chill',
 'Koleksi lagu santai untuk menemani hari-harimu.'),
('a3', 'Harmony Music', 'YanzStudio', '2022',
 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
 'linear-gradient(135deg,#1a002a,#6b0050)', 'Indie',
 'Harmoni antara melodi dan ritme yang terasa dekat.'),
('a4', 'Pain', 'YanzStudio', '2021',
 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=400&q=80',
 'linear-gradient(135deg,#300020,#800060)', 'Rock',
 'Ekspresi rasa dari sudut yang paling jujur.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO tracks (id, title, artist, album_id, album_title, duration, cover, source_type, youtube_id, genre, year, likes, plays, lyrics) VALUES
('t1', 'Give Me One Moment', 'YanzStudio', 'a1', 'Midnight Vibration', '04:35',
 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=80&q=80',
 'youtube', 'aJOTlE1K90k', 'Electronic', '2024', 10240, 52000,
 '[00:05] Give me one moment in time'),
('t8', 'Terbuang Dalam Waktu', 'Barasuara', 'a4', 'Pain', '05:31',
 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=80&q=80',
 'youtube', 'aJOTlE1K90k', 'Rock', '2023', 12300, 55000,
 '[00:42] Teringat seru suaramu menepis keraguan namun dewasa
[00:52] Mengubah cara pandang dan keikhlasan bersaut dan bergulat
[01:01] Terperai-perai menghilang perih yang
[01:07] Terasa sakit yang tak sirna harapan akan
[01:16] Ada berputar
[01:22] Arah angan tenggelam dalam kabut dan amarah
[01:30] Luka terkuak dan menggebu tanpa arah tangis yang
[01:41] Terbendung terbuang dalam waktu yang meluruh
[02:08] Perih yang terasa sakit yang tak sirna
[02:16] Harapan akankah ada berubah
[02:58] Melihatmu bersemi dan bermekaran
[03:07] Tawa candamu berikan kekuatan sisa
[03:15] Hariku pagi berganti waktu
[03:28] Memelukmu kita kan tua dan kehilangan
[03:35] Pegangan lihat senyummu memberikan
[03:42] Kekuatan sisa
[03:47] Nafasku cinta tak kenal waktu menjagamu
[04:47] Kita kan tua dan kehilangan pegangan lihat senyummu
[04:57] Memberikan kekuatan sisa
[05:04] Nafasku cinta tak kenal waktu
[05:28] Menjagamu')
ON CONFLICT (id) DO NOTHING;
