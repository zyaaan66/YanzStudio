'use client';
import { useEffect, useState } from 'react';
import { getTracks, getAlbums } from '@/lib/db';
import type { Track, Album } from '@/types';
import AlbumCard from '@/components/ui/AlbumCard';
import { Library, Loader2 } from 'lucide-react';

export default function LibraryPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [t, a] = await Promise.all([getTracks(), getAlbums()]);
      setTracks(t); setAlbums(a); setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <Loader2 size={24} className="text-magenta animate-spin" />
    </div>
  );

  return (
    <div className="px-6 md:px-10 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Library size={24} className="text-magenta" />
        <h1 className="font-display font-black text-3xl text-white">Your Library</h1>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Albums', value: albums.length },
          { label: 'Tracks', value: tracks.length },
          { label: 'Artists', value: [...new Set(tracks.map(t => t.artist))].length },
        ].map(s => (
          <div key={s.label} className="bg-surface-card rounded-2xl p-5 text-center border border-surface-border">
            <p className="font-display font-black text-3xl text-gradient">{s.value}</p>
            <p className="text-[11px] tracking-widest text-gray-500 uppercase mt-1">{s.label}</p>
          </div>
        ))}
      </div>
      <h2 className="font-display font-bold text-xl text-white mb-5">All Albums</h2>
      {albums.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {albums.map(a => <AlbumCard key={a.id} album={a} allTracks={tracks} />)}
        </div>
      ) : (
        <p className="text-gray-600 text-sm">Belum ada album. Tambah lewat <a href="/admin" className="text-magenta hover:underline">Admin Panel</a>.</p>
      )}
    </div>
  );
}
