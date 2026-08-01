'use client';
import { usePlayerStore } from '@/store/playerStore';
import { Play, Pause } from 'lucide-react';
import type { Track } from '@/types';

interface Props { albumId: string; tracks: Track[]; }

export default function PlayAlbumBtn({ albumId, tracks }: Props) {
  const { currentTrack, isPlaying, playQueue, togglePlay } = usePlayerStore();
  const isAlbumActive = currentTrack?.albumId === albumId;
  const isAlbumPlaying = isAlbumActive && isPlaying;

  function handle() {
    if (isAlbumActive) { togglePlay(); return; }
    playQueue(tracks, 0);
  }

  return (
    <button onClick={handle} aria-label={isAlbumPlaying ? 'Pause album' : 'Play album'}
      className="flex items-center gap-2 px-6 py-3 bg-magenta text-white rounded-full font-medium text-sm hover:bg-magenta-dark transition-all focus-visible:outline-2 focus-visible:outline-white animate-pulse-glow">
      {isAlbumPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
      {isAlbumPlaying ? 'Pause' : 'Play Album'}
    </button>
  );
}
