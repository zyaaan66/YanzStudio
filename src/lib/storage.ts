// Utility: baca/tulis data ke localStorage dengan fallback ke data.ts

import { tracks as defaultTracks, albums as defaultAlbums } from './data';
import type { Track, Album } from '@/types';

const TRACKS_KEY = 'yanzstudio_tracks';
const ALBUMS_KEY = 'yanzstudio_albums';

// ── Tracks ──────────────────────────────────────────────
export function getTracks(): Track[] {
  if (typeof window === 'undefined') return defaultTracks;
  try {
    const raw = localStorage.getItem(TRACKS_KEY);
    if (!raw) return defaultTracks;
    const parsed: Track[] = JSON.parse(raw);
    return parsed.length > 0 ? parsed : defaultTracks;
  } catch {
    return defaultTracks;
  }
}

export function saveTracks(tracks: Track[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TRACKS_KEY, JSON.stringify(tracks));
  } catch {
    console.error('Failed to save tracks to localStorage');
  }
}

export function resetTracks(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TRACKS_KEY);
}

// ── Albums ──────────────────────────────────────────────
export function getAlbums(): Album[] {
  if (typeof window === 'undefined') return defaultAlbums;
  try {
    const raw = localStorage.getItem(ALBUMS_KEY);
    if (!raw) return defaultAlbums;
    const parsed: Album[] = JSON.parse(raw);
    return parsed.length > 0 ? parsed : defaultAlbums;
  } catch {
    return defaultAlbums;
  }
}

export function saveAlbums(albums: Album[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ALBUMS_KEY, JSON.stringify(albums));
  } catch {
    console.error('Failed to save albums to localStorage');
  }
}

export function resetAlbums(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ALBUMS_KEY);
}

// ── Reset semua ─────────────────────────────────────────
export function resetAll(): void {
  resetTracks();
  resetAlbums();
}
