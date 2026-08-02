import { supabase } from './supabase';
import { tracks as defaultTracks, albums as defaultAlbums } from './data';
import type { Track, Album } from '@/types';

function isConfigured(): boolean {
  return supabase !== null;
}

export async function getTracks(): Promise<Track[]> {
  if (!isConfigured()) return defaultTracks;
  try {
    const { data, error } = await supabase!.from('tracks').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []).map(mapTrack);
  } catch (e) {
    console.error('getTracks error:', e);
    return defaultTracks;
  }
}

export async function addTrack(track: Omit<Track, 'id'>): Promise<Track | null> {
  if (!isConfigured()) return null;
  const id = `t${Date.now()}`;
  const { data, error } = await supabase!.from('tracks').insert([mapTrackToDb({ ...track, id })]).select().single();
  if (error) { console.error('addTrack error:', error); return null; }
  return mapTrack(data);
}

export async function updateTrack(id: string, track: Partial<Track>): Promise<boolean> {
  if (!isConfigured()) return false;
  const { error } = await supabase!.from('tracks').update(mapTrackToDb(track as Track)).eq('id', id);
  if (error) { console.error('updateTrack error:', error); return false; }
  return true;
}

export async function deleteTrack(id: string): Promise<boolean> {
  if (!isConfigured()) return false;
  const { error } = await supabase!.from('tracks').delete().eq('id', id);
  if (error) { console.error('deleteTrack error:', error); return false; }
  return true;
}

export async function getAlbums(): Promise<Album[]> {
  if (!isConfigured()) return defaultAlbums;
  try {
    const { data, error } = await supabase!.from('albums').select('*').order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []).map(mapAlbum);
  } catch (e) {
    console.error('getAlbums error:', e);
    return defaultAlbums;
  }
}

export async function addAlbum(album: Omit<Album, 'id' | 'trackIds'>): Promise<Album | null> {
  if (!isConfigured()) return null;
  const id = `a${Date.now()}`;
  const { data, error } = await supabase!.from('albums').insert([mapAlbumToDb({ ...album, id, trackIds: [] })]).select().single();
  if (error) { console.error('addAlbum error:', error); return null; }
  return mapAlbum(data);
}

export async function updateAlbum(id: string, album: Partial<Album>): Promise<boolean> {
  if (!isConfigured()) return false;
  const { error } = await supabase!.from('albums').update(mapAlbumToDb(album as Album)).eq('id', id);
  if (error) { console.error('updateAlbum error:', error); return false; }
  return true;
}

export async function deleteAlbum(id: string): Promise<boolean> {
  if (!isConfigured()) return false;
  const { error } = await supabase!.from('albums').delete().eq('id', id);
  if (error) { console.error('deleteAlbum error:', error); return false; }
  return true;
}

function mapTrack(row: any): Track {
  return {
    id: row.id,
    title: row.title,
    artist: row.artist,
    albumId: row.album_id || '',
    albumTitle: row.album_title || '',
    duration: row.duration || '00:00',
    cover: row.cover || '',
    sourceType: row.source_type as 'mp3' | 'youtube',
    audioUrl: row.audio_url || '',
    youtubeId: row.youtube_id || '',
    lyrics: row.lyrics || '',
    genre: row.genre || '',
    year: row.year || '',
    likes: row.likes || 0,
    plays: row.plays || 0,
  };
}

function mapTrackToDb(t: Partial<Track>): any {
  const obj: any = {};
  if (t.id !== undefined) obj.id = t.id;
  if (t.title !== undefined) obj.title = t.title;
  if (t.artist !== undefined) obj.artist = t.artist;
  if (t.albumId !== undefined) obj.album_id = t.albumId || null;
  if (t.albumTitle !== undefined) obj.album_title = t.albumTitle;
  if (t.duration !== undefined) obj.duration = t.duration;
  if (t.cover !== undefined) obj.cover = t.cover;
  if (t.sourceType !== undefined) obj.source_type = t.sourceType;
  if (t.audioUrl !== undefined) obj.audio_url = t.audioUrl;
  if (t.youtubeId !== undefined) obj.youtube_id = t.youtubeId;
  if (t.lyrics !== undefined) obj.lyrics = t.lyrics;
  if (t.genre !== undefined) obj.genre = t.genre;
  if (t.year !== undefined) obj.year = t.year;
  if (t.likes !== undefined) obj.likes = t.likes;
  if (t.plays !== undefined) obj.plays = t.plays;
  return obj;
}

function mapAlbum(row: any): Album {
  return {
    id: row.id,
    title: row.title,
    artist: row.artist,
    year: row.year || '',
    cover: row.cover || '',
    coverGradient: row.cover_gradient || 'linear-gradient(135deg,#2d0050,#6b2fa0)',
    genre: row.genre || '',
    description: row.description || '',
    trackIds: row.track_ids || [],
  };
}

function mapAlbumToDb(a: Partial<Album>): any {
  const obj: any = {};
  if (a.id !== undefined) obj.id = a.id;
  if (a.title !== undefined) obj.title = a.title;
  if (a.artist !== undefined) obj.artist = a.artist;
  if (a.year !== undefined) obj.year = a.year;
  if (a.cover !== undefined) obj.cover = a.cover;
  if (a.coverGradient !== undefined) obj.cover_gradient = a.coverGradient;
  if (a.genre !== undefined) obj.genre = a.genre;
  if (a.description !== undefined) obj.description = a.description;
  if (a.trackIds !== undefined) obj.track_ids = a.trackIds;
  return obj;
}