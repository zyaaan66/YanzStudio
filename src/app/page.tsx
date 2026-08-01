'use client';
import { useEffect, useState } from 'react';
import { getTracks, getAlbums } from '@/lib/db';
import type { Track, Album } from '@/types';
import AlbumCard from '@/components/ui/AlbumCard';
import TrackRow from '@/components/ui/TrackRow';
import { Flame, Disc3, Clock, Loader2 } from 'lucide-react';

export default function HomePage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [t, a] = await Promise.all([getTracks(), getAlbums()]);
      setTracks(t);
      setAlbums(a);
      setLoading(false);
    }
    load();
  }, []);

  const featuredAlbums = albums.slice(0, 4);
  const popularTracks = [...tracks].sort((a, b) => b.plays - a.plays).slice(0, 5);
  const recentTracks = tracks.slice(-5).reverse();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 size={24} className="text-magenta animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-6 md:px-10 py-8">
      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden mb-10 min-h-[240px] flex items-end p-8"
        style={{ background: 'radial-gradient(ellipse at 60% 30%, #3d0030 0%, #1a001a 50%, #111 100%)' }}>
        <div className="absolute top-6 right-10 w-52 h-52 opacity-20 pointer-events-none" aria-hidden="true">
          {[0,1,2,3].map(i => (
            <div key={i} className="absolute inset-0 rounded-full border border-magenta"
              style={{ transform: `scale(${0.3 + i * 0.2})` }} />
          ))}
        </div>
        <span className="absolute right-6 top-1/2 -translate-y-1/2 font-display font-black text-[80px] md:text-[120px] text-magenta/10 leading-none tracking-tighter select-none pointer-events-none" aria-hidden="true">
          YANZ
        </span>
        <div className="relative z-10">
          <p className="text-[10px] tracking-[0.2em] text-magenta uppercase mb-2">Music Platform</p>
          <h1 className="font-display font-black text-4xl md:text-5xl text-white leading-tight tracking-tight">
            YanzStudio<br /><span className="text-gradient">Music</span>
          </h1>
          <p className="text-gray-400 text-sm mt-3">{tracks.length} lagu · {albums.length} album</p>
        </div>
      </section>

      {/* Albums */}
      {albums.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Disc3 size={18} className="text-magenta" />
            <h2 className="font-display font-bold text-xl text-white">Albums</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredAlbums.map(album => <AlbumCard key={album.id} album={album} allTracks={tracks} />)}
          </div>
        </section>
      )}

      {/* Popular */}
      {popularTracks.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <Flame size={18} className="text-magenta" />
            <h2 className="font-display font-bold text-xl text-white">Popular</h2>
          </div>
          <div className="space-y-1">
            {popularTracks.map((track, i) => (
              <TrackRow key={track.id} track={track} index={i} queue={popularTracks} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Added */}
      {recentTracks.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Clock size={18} className="text-magenta" />
            <h2 className="font-display font-bold text-xl text-white">Recently Added</h2>
          </div>
          <div className="space-y-1">
            {recentTracks.map((track, i) => (
              <TrackRow key={track.id} track={track} index={i} queue={recentTracks} />
            ))}
          </div>
        </section>
      )}

      {tracks.length === 0 && (
        <div className="text-center py-20">
          <Disc3 size={48} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">Belum ada musik</p>
          <p className="text-gray-600 text-sm mt-1">
            Tambah musik lewat <a href="/admin" className="text-magenta hover:underline">Admin Panel</a>
          </p>
        </div>
      )}
    </div>
  );
}
