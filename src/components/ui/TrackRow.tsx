'use client';
import { usePlayerStore } from '@/store/playerStore';
import { Play, Pause, MoreHorizontal, Plus, Heart } from 'lucide-react';
import Image from 'next/image';
import type { Track } from '@/types';
import { formatTime, formatPlays } from '@/lib/utils';
import { useState } from 'react';

interface Props {
  track: Track;
  index?: number;
  showAlbum?: boolean;
  queue?: Track[];
}

export default function TrackRow({ track, index, showAlbum = true, queue = [] }: Props) {
  const { currentTrack, isPlaying, setTrack, togglePlay, playQueue, addToQueue } = usePlayerStore();
  const [liked, setLiked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = currentTrack?.id === track.id;
  const isCurrentPlaying = isActive && isPlaying;

  function handleClick() {
    if (isActive) { togglePlay(); return; }
    if (queue.length > 0) {
      const idx = queue.findIndex(t => t.id === track.id);
      playQueue(queue, idx >= 0 ? idx : 0);
    } else {
      setTrack(track);
    }
  }

  return (
    <div
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${isActive ? 'bg-magenta/10' : 'hover:bg-surface-card'}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`${isActive ? (isPlaying ? 'Pause' : 'Resume') : 'Play'} ${track.title}`}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
    >
      {/* Index / Play icon */}
      <div className="w-8 flex-shrink-0 flex items-center justify-center">
        {isCurrentPlaying ? (
          <div className="flex items-end gap-0.5 h-4" aria-hidden="true">
            {[1,2,3].map(i => (
              <div key={i} className="w-0.5 bg-magenta rounded-full"
                style={{ height: '100%', animation: `soundBars 0.8s ease-in-out ${i*0.15}s infinite alternate` }} />
            ))}
          </div>
        ) : (
          <>
            {index !== undefined && (
              <span className="text-xs text-gray-600 group-hover:hidden">{index + 1}</span>
            )}
            <Play size={14} className={`text-magenta ${index !== undefined ? 'hidden group-hover:block' : 'block'}`} />
          </>
        )}
      </div>

      {/* Cover */}
      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 relative bg-surface-card">
        <Image src={track.cover} alt={track.title} fill sizes="40px" className="object-cover" unoptimized />
        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          {isCurrentPlaying
            ? <Pause size={14} className="text-white" />
            : <Play size={14} className="text-white ml-0.5" />
          }
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isActive ? 'text-magenta' : 'text-white'}`}>{track.title}</p>
        <div className="flex items-center gap-1.5">
          <p className="text-[11px] text-gray-500 truncate">{track.artist}</p>
          {showAlbum && <span className="text-gray-700 text-[10px]">·</span>}
          {showAlbum && <p className="text-[11px] text-gray-600 truncate hidden sm:block">{track.albumTitle}</p>}
        </div>
      </div>

      {/* Source badge */}
      <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium hidden md:block flex-shrink-0 ${
        track.sourceType === 'youtube'
          ? 'bg-red-500/15 text-red-400'
          : 'bg-green-500/15 text-green-400'
      }`}>
        {track.sourceType === 'youtube' ? 'YT' : 'MP3'}
      </span>

      {/* Plays */}
      <span className="text-xs text-gray-600 w-14 text-right flex-shrink-0 hidden lg:block">
        {formatPlays(track.plays)}
      </span>

      {/* Duration */}
      <span className="text-xs text-gray-500 w-10 text-right flex-shrink-0 tabular-nums">{track.duration}</span>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={e => { e.stopPropagation(); setLiked(l => !l); }}
          aria-label={liked ? 'Unlike' : 'Like'}
          className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${liked ? 'text-magenta' : 'text-gray-600 hover:text-white'}`}>
          <Heart size={13} className={liked ? 'fill-magenta' : ''} />
        </button>
        <div className="relative">
          <button onClick={e => { e.stopPropagation(); setMenuOpen(m => !m); }}
            aria-label="More options"
            className="w-7 h-7 flex items-center justify-center rounded-full text-gray-600 hover:text-white transition-colors">
            <MoreHorizontal size={13} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 bottom-8 bg-surface-elevated border border-surface-border rounded-xl shadow-2xl py-1.5 w-44 z-50">
              <button onClick={e => { e.stopPropagation(); addToQueue(track); setMenuOpen(false); }}
                className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-surface-card transition-colors">
                <Plus size={14} /> Add to Queue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
