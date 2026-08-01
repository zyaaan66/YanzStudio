import type { Track, Album } from '@/types';

// Format lirik dengan timestamp: "[mm:ss] baris lirik"
// Kosongkan timestamp jika tidak tahu waktu persisnya

export const albums: Album[] = [
  {
    id: 'a1',
    title: 'Midnight Vibration',
    artist: 'YanzStudio',
    year: '2024',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80',
    coverGradient: 'linear-gradient(135deg,#2d0050,#6b2fa0)',
    genre: 'Electronic',
    description: 'Album debut YanzStudio — perjalanan sonic melewati malam.',
    trackIds: ['t1','t2','t3'],
  },
  {
    id: 'a2',
    title: 'Vinyl Record',
    artist: 'YanzStudio',
    year: '2023',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80',
    coverGradient: 'linear-gradient(135deg,#003050,#0088b2)',
    genre: 'Chill',
    description: 'Koleksi lagu santai untuk menemani hari-harimu.',
    trackIds: ['t4','t5'],
  },
  {
    id: 'a3',
    title: 'Harmony Music',
    artist: 'YanzStudio',
    year: '2022',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
    coverGradient: 'linear-gradient(135deg,#1a002a,#6b0050)',
    genre: 'Indie',
    description: 'Harmoni antara melodi dan ritme yang terasa dekat.',
    trackIds: ['t6','t7'],
  },
  {
    id: 'a4',
    title: 'Pain',
    artist: 'YanzStudio',
    year: '2021',
    cover: 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=400&q=80',
    coverGradient: 'linear-gradient(135deg,#300020,#800060)',
    genre: 'Rock',
    description: 'Ekspresi rasa dari sudut yang paling jujur.',
    trackIds: ['t8'],
  },
];

export const tracks: Track[] = [
  {
    id: 't1', title: 'Give Me One Moment', artist: 'YanzStudio',
    albumId: 'a1', albumTitle: 'Midnight Vibration', duration: '04:35',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=80&q=80',
    sourceType: 'youtube', youtubeId: 'aJOTlE1K90k',
    genre: 'Electronic', year: '2024', likes: 10240, plays: 52000,
    lyrics: '[00:05] Give me one moment in time\n[00:10] When I\'m more than I thought I could be\n[00:16] When all of my dreams are a heartbeat away\n[00:22] And the answers are all up to me\n[00:28] Give me one moment in time\n[00:34] When I\'m racing with destiny\n[00:40] Then in that one moment of time\n[00:46] I will feel, I will feel eternity',
  },
  {
    id: 't2', title: 'Everything I Do', artist: 'YanzStudio',
    albumId: 'a1', albumTitle: 'Midnight Vibration', duration: '03:25',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=80&q=80',
    sourceType: 'mp3', audioUrl: '/audio/track-2.mp3',
    genre: 'Electronic', year: '2024', likes: 8300, plays: 41000,
    lyrics: '[00:05] Everything I do, I do it for you\n[00:12] Look into my heart, you will find\n[00:18] There\'s nothing there to hide\n[00:24] Take me as I am, take my life\n[00:30] I would give it all, I would sacrifice\n[00:36] Don\'t tell me it\'s not worth fighting for\n[00:42] I can\'t help it, there\'s nothing I want more',
  },
  {
    id: 't3', title: 'Waiting for You', artist: 'YanzStudio',
    albumId: 'a1', albumTitle: 'Midnight Vibration', duration: '05:15',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=80&q=80',
    sourceType: 'youtube', youtubeId: 'aJOTlE1K90k',
    genre: 'Electronic', year: '2024', likes: 16100, plays: 78000,
    lyrics: '[00:08] Oceans apart, day after day\n[00:15] And I slowly go insane\n[00:22] I hear your voice on the line\n[00:29] But it doesn\'t stop the pain\n[00:36] If I see you next to never\n[00:43] How can we say forever\n[00:50] Wherever you go, whatever you do\n[00:57] I will be right here waiting for you',
  },
  {
    id: 't4', title: 'Close Your Eyes', artist: 'YanzStudio',
    albumId: 'a2', albumTitle: 'Vinyl Record', duration: '04:18',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=80&q=80',
    sourceType: 'mp3', audioUrl: '/audio/track-4.mp3',
    genre: 'Chill', year: '2023', likes: 15200, plays: 63000,
    lyrics: '[00:06] Close your eyes, give me your hand\n[00:13] Do you feel my heart beating?\n[00:20] Do you understand?\n[00:27] Do you feel the same?\n[00:34] Am I only dreaming?\n[00:41] Is this burning an eternal flame?',
  },
  {
    id: 't5', title: "Can't Fight This Feeling", artist: 'YanzStudio',
    albumId: 'a2', albumTitle: 'Vinyl Record', duration: '03:35',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=80&q=80',
    sourceType: 'youtube', youtubeId: 'aJOTlE1K90k',
    genre: 'Chill', year: '2023', likes: 7800, plays: 38000,
    lyrics: '[00:10] I can\'t fight this feeling anymore\n[00:18] I\'ve forgotten what I started fighting for\n[00:26] It\'s time to bring this ship into the shore\n[00:34] And throw away the oars, forever\n[00:42] \'Cause I can\'t fight this feeling anymore',
  },
  {
    id: 't6', title: 'Harmony', artist: 'YanzStudio',
    albumId: 'a3', albumTitle: 'Harmony Music', duration: '03:50',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=80&q=80',
    sourceType: 'mp3', audioUrl: '/audio/track-6.mp3',
    genre: 'Indie', year: '2022', likes: 5400, plays: 29000,
    lyrics: '[00:08] In harmony we find our peace\n[00:16] Where melodies never cease\n[00:24] Every note a story told\n[00:32] Every rhythm, brave and bold',
  },
  {
    id: 't7', title: 'Moonlight', artist: 'YanzStudio',
    albumId: 'a3', albumTitle: 'Harmony Music', duration: '04:02',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=80&q=80',
    sourceType: 'youtube', youtubeId: 'aJOTlE1K90k',
    genre: 'Indie', year: '2022', likes: 9100, plays: 47000,
    lyrics: '[00:06] Moonlight shining through the trees\n[00:14] Carrying your voice on the breeze\n[00:22] Stars align to tell our story\n[00:30] Of a love in all its glory',
  },
  {
    id: 't8', title: 'Pain', artist: 'YanzStudio',
    albumId: 'a4', albumTitle: 'Pain', duration: '04:45',
    cover: 'https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=80&q=80',
    sourceType: 'mp3', audioUrl: '/audio/track-8.mp3',
    genre: 'Rock', year: '2021', likes: 12300, plays: 55000,
    lyrics: '[00:05] Perih yang terasa\n[00:10] Sakit yang tak sirna\n[00:15] Harapan akankah ada?\n[00:20] Berputar arah\n[00:28] Angan tenggelam dalam kabut dan amarah\n[00:35] Luka terkuak dan menggebu tanpa arah\n[00:42] Tangis yang terbendung\n[00:48] Terbuang dalam waktu\n[00:54] Yang meluruh\n[01:02] Perih yang terasa\n[01:07] Sakit yang tak sirna\n[01:12] Harapan akankah ada?\n[01:18] Berubah\n[01:26] Melihatmu bersemi dan bermekaran\n[01:33] Tawa candamu berikan kekuatan\n[01:40] Sisa hariku, pagi berganti waktu',
  },
];

export function getAlbumById(id: string) {
  return albums.find(a => a.id === id);
}

export function getTracksByAlbum(albumId: string) {
  return tracks.filter(t => t.albumId === albumId);
}

export function searchTracks(query: string) {
  const q = query.toLowerCase();
  return tracks.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.artist.toLowerCase().includes(q) ||
    t.albumTitle.toLowerCase().includes(q) ||
    (t.genre?.toLowerCase().includes(q))
  );
}

export function searchAlbums(query: string) {
  const q = query.toLowerCase();
  return albums.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.artist.toLowerCase().includes(q) ||
    a.genre.toLowerCase().includes(q)
  );
}
