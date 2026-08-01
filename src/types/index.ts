export type SourceType = 'mp3' | 'youtube';

export interface Track {
  id: string;
  title: string;
  artist: string;
  albumId: string;
  albumTitle: string;
  duration: string;        // "03:45"
  cover: string;           // URL gambar
  sourceType: SourceType;
  audioUrl?: string;       // path MP3 misal /audio/track-1.mp3
  youtubeId?: string;      // YouTube video ID misal "dQw4w9WgXcQ"
  lyrics?: string;         // teks lirik, newline sebagai baris baru
  genre?: string;
  year?: string;
  likes: number;
  plays: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  year: string;
  cover: string;
  coverGradient: string;
  genre: string;
  description?: string;
  trackIds: string[];
}

export interface Playlist {
  id: string;
  name: string;
  cover?: string;
  trackIds: string[];
  createdAt: string;
}

export interface QueueItem {
  track: Track;
  queueId: string; // unique id untuk queue (track bisa duplikat)
}
