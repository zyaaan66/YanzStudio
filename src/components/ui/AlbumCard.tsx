'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Play } from 'lucide-react';
import type { Album, Track } from '@/types';
import { usePlayerStore } from '@/store/playerStore';
import { useState } from 'react';

interface Props {
  album: Album;
  allTracks: Track[]; // tracks dipass dari parent (sudah baca dari localStorage)
}

export default function AlbumCard({ album, allTracks }: Props) {
  const { playQueue, currentTrack, isPlaying, togglePlay } = usePlayerStore();
  const [imgErr, setImgErr] = useState(false);
  const router = useRouter();

  const albumTracks = allTracks.filter(t => t.albumId === album.id);
  const isAlbumActive = currentTrack?.albumId === album.id;
  const isAlbumPlaying = isAlbumActive && isPlaying;

  function handlePlay(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (albumTracks.length === 0) return;
    if (isAlbumActive) { togglePlay(); return; }
    playQueue(albumTracks, 0);
  }

  return (
    <div
      onClick={() => router.push(`/album/${album.id}`)}
      className="group block bg-surface-card hover:bg-surface-elevated rounded-2xl p-4 transition-all duration-200 hover:-translate-y-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-magenta"
      role="link"
      tabIndex={0}
      aria-label={`${album.title} by ${album.artist}`}
      onKeyDown={e => e.key === 'Enter' && router.push(`/album/${album.id}`)}
    >
      {/* Cover */}
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4"
        style={{ background: album.coverGradient }}>
        {!imgErr && album.cover && (
          <Image src={album.cover} alt={`${album.title} cover`} fill
            sizes="(max-width:768px)50vw,25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            unoptimized onError={() => setImgErr(true)} />
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-end justify-end p-3">
          <button
            onClick={handlePlay}
            aria-label={`${isAlbumPlaying ? 'Pause' : 'Play'} ${album.title}`}
            className="w-11 h-11 rounded-full bg-magenta flex items-center justify-center hover:bg-magenta-dark transition-all hover:scale-110 focus-visible:outline-2 focus-visible:outline-white shadow-xl animate-pulse-glow"
          >
            {isAlbumPlaying
              ? <span className="flex items-end gap-0.5 h-4" aria-hidden="true">
                  {[1,2,3].map(i => (
                    <span key={i} className="w-0.5 bg-white rounded-full"
                      style={{ height: '100%', animation: `soundBars 0.8s ease-in-out ${i*0.15}s infinite alternate` }} />
                  ))}
                </span>
              : <Play size={18} className="text-white ml-0.5" />
            }
          </button>
        </div>
      </div>

      {/* Info */}
      <p className="font-display font-bold text-sm text-white truncate">{album.title}</p>
      <div className="flex items-center gap-1.5 mt-0.5">
        <span className="text-[10px] text-gray-600 tracking-widest uppercase">{album.year}</span>
        <span className="text-gray-700">·</span>
        <span className="text-[10px] text-gray-600 uppercase tracking-widest">{album.genre}</span>
      </div>
    </div>
  );
}
