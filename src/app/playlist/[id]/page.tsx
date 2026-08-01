'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getTracks } from '@/lib/db';
import type { Track } from '@/types';
import TrackRow from '@/components/ui/TrackRow';
import { ListMusic, Loader2 } from 'lucide-react';

const PLAYLIST_CONFIG: Record<string, { name: string; filter: (t: Track[]) => Track[] }> = {
  favorites: { name: 'Favorites', filter: (t) => [...t].sort((a, b) => b.likes - a.likes).slice(0, 10) },
  recent: { name: 'Recently Added', filter: (t) => t.slice(-10).reverse() },
};

export default function PlaylistPage() {
  const params = useParams();
  const id = params?.id as string;
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const all = await getTracks();
      const config = PLAYLIST_CONFIG[id];
      setTracks(config ? config.filter(all) : []);
      setLoading(false);
    }
    load();
  }, [id]);

  const config = PLAYLIST_CONFIG[id];

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <Loader2 size={24} className="text-magenta animate-spin" />
    </div>
  );

  if (!config) return (
    <div className="px-6 md:px-10 py-20 text-center">
      <p className="text-gray-400">Playlist tidak ditemukan.</p>
    </div>
  );

  return (
    <div className="px-6 md:px-10 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-magenta/20 border border-magenta/30 flex items-center justify-center">
          <ListMusic size={28} className="text-magenta" />
        </div>
        <div>
          <p className="text-[10px] tracking-widest text-gray-500 uppercase">Playlist</p>
          <h1 className="font-display font-black text-3xl text-white">{config.name}</h1>
          <p className="text-gray-500 text-sm">{tracks.length} tracks</p>
        </div>
      </div>
      {tracks.length > 0 ? (
        <div className="space-y-1">
          {tracks.map((t, i) => <TrackRow key={t.id} track={t} index={i} queue={tracks} />)}
        </div>
      ) : (
        <div className="text-center py-16">
          <ListMusic size={40} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Belum ada lagu.</p>
        </div>
      )}
    </div>
  );
}
