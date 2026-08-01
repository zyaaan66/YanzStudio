'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getTracks, getAlbums } from '@/lib/db';
import type { Track, Album } from '@/types';
import Image from 'next/image';
import TrackRow from '@/components/ui/TrackRow';
import PlayAlbumBtn from '@/components/ui/PlayAlbumBtn';
import { Disc3, Loader2 } from 'lucide-react';

export default function AlbumPage() {
  const params = useParams();
  const id = params?.id as string;
  const [album, setAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [allAlbums, allTracks] = await Promise.all([getAlbums(), getTracks()]);
      setAlbum(allAlbums.find(a => a.id === id) || null);
      setTracks(allTracks.filter(t => t.albumId === id));
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <Loader2 size={24} className="text-magenta animate-spin" />
    </div>
  );

  if (!album) return (
    <div className="px-6 md:px-10 py-20 text-center">
      <Disc3 size={48} className="text-gray-700 mx-auto mb-4" />
      <p className="text-gray-400">Album tidak ditemukan.</p>
    </div>
  );

  return (
    <div>
      <div className="relative px-6 md:px-10 py-10 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgba(61,0,48,0.8) 0%, #0a0a0a 100%)' }}>
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="w-44 h-44 md:w-56 md:h-56 rounded-2xl overflow-hidden relative flex-shrink-0 shadow-2xl"
            style={{ background: album.coverGradient }}>
            {album.cover && <Image src={album.cover} alt={album.title} fill sizes="224px" className="object-cover" unoptimized />}
          </div>
          <div>
            <p className="text-[10px] tracking-widest text-white/60 uppercase mb-2">{album.genre} · Album</p>
            <h1 className="font-display font-black text-4xl md:text-6xl text-white tracking-tight mb-1">{album.title}</h1>
            <p className="text-gray-300 text-sm mb-1">{album.artist}</p>
            <p className="text-gray-500 text-sm">{album.year} · {tracks.length} tracks</p>
            {album.description && <p className="text-gray-400 text-sm mt-3 max-w-md">{album.description}</p>}
            {tracks.length > 0 && <div className="mt-5"><PlayAlbumBtn albumId={album.id} tracks={tracks} /></div>}
          </div>
        </div>
      </div>

      <div className="px-6 md:px-10 py-6">
        {tracks.length > 0 ? (
          <div className="space-y-1">
            {tracks.map((track, i) => (
              <TrackRow key={track.id} track={track} index={i} showAlbum={false} queue={tracks} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Disc3 size={40} className="text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Belum ada track di album ini.</p>
            <p className="text-gray-600 text-xs mt-1">Tambah lewat <a href="/admin" className="text-magenta hover:underline">Admin Panel</a>.</p>
          </div>
        )}
      </div>
    </div>
  );
}
