'use client';
import { usePlayerStore } from '@/store/playerStore';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Shuffle, Repeat, Repeat1, X, Mic2,
} from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';
import { formatTime } from '@/lib/utils';
import YouTubePlayer from './YouTubePlayer';
import LyricsOverlay from './LyricsOverlay';

export default function PlayerBar() {
  const {
    currentTrack, isPlaying, progress, currentTime, duration,
    volume, isMuted, isShuffle, repeatMode, showLyrics,
    togglePlay, next, prev, seek, setVolume, toggleMute,
    toggleShuffle, cycleRepeat, toggleLyrics, closePlayer,
  } = usePlayerStore();

  const progressRef = useRef<HTMLDivElement>(null);

  if (!currentTrack) return null;

  function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    seek(Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)));
  }

  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;

  return (
    <>
      {/* Hidden YouTube engine */}
      {currentTrack.sourceType === 'youtube' && currentTrack.youtubeId && (
        <YouTubePlayer videoId={currentTrack.youtubeId} />
      )}

      {/* Lyrics overlay fullscreen */}
      <LyricsOverlay />

      {/* Player Bar */}
      <div className="fixed bottom-14 md:bottom-0 left-0 md:left-56 right-0 z-50 bg-[#0d0d0d]/98 backdrop-blur-xl border-t border-surface-border">
        {/* Seek bar */}
        <div
          ref={progressRef}
          className="h-1 bg-surface-border cursor-pointer group relative"
          onClick={handleProgressClick}
          role="slider"
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress)}
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'ArrowRight') seek(Math.min(progress + 1, 100));
            if (e.key === 'ArrowLeft') seek(Math.max(progress - 1, 0));
          }}
        >
          <div
            className="h-full bg-magenta transition-all duration-150 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform shadow" />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 md:gap-4 px-3 md:px-5 h-14">

          {/* Cover + Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-lg overflow-hidden flex-shrink-0 relative bg-surface-card">
              {currentTrack.cover ? (
                <Image
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  fill sizes="40px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-magenta/20 flex items-center justify-center">
                  <span className="text-magenta text-xs font-bold">♪</span>
                </div>
              )}
            </div>
            <div className="min-w-0 hidden sm:block">
              <p className="text-xs md:text-sm font-semibold text-white truncate leading-tight">
                {currentTrack.title}
              </p>
              <p className="text-[11px] text-gray-500 truncate">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={toggleShuffle} aria-label="Shuffle"
              className={`hidden md:flex w-8 h-8 items-center justify-center rounded-full transition-colors ${isShuffle ? 'text-magenta' : 'text-gray-500 hover:text-white'}`}>
              <Shuffle size={14} />
            </button>

            <button onClick={prev} aria-label="Previous"
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-full">
              <SkipBack size={16} />
            </button>

            <button onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}
              className="w-10 h-10 rounded-full bg-magenta flex items-center justify-center hover:bg-magenta-dark transition-all focus-visible:outline-2 focus-visible:outline-white animate-pulse-glow">
              {isPlaying
                ? <Pause size={16} className="text-white" />
                : <Play size={16} className="text-white ml-0.5" />
              }
            </button>

            <button onClick={next} aria-label="Next"
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors rounded-full">
              <SkipForward size={16} />
            </button>

            <button onClick={cycleRepeat} aria-label={`Repeat: ${repeatMode}`}
              className={`hidden md:flex w-8 h-8 items-center justify-center rounded-full transition-colors ${repeatMode !== 'none' ? 'text-magenta' : 'text-gray-500 hover:text-white'}`}>
              <RepeatIcon size={14} />
            </button>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1 md:gap-2 flex-1 justify-end">
            <span className="text-[10px] text-gray-600 tabular-nums hidden md:block">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            {/* Tombol Lirik — muncul jika ada lirik */}
            {currentTrack.lyrics && (
              <button
                onClick={toggleLyrics}
                aria-label="Tampilkan lirik"
                title="Lirik"
                className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
                  showLyrics ? 'text-magenta bg-magenta/15' : 'text-gray-500 hover:text-white'
                }`}
              >
                <Mic2 size={14} />
              </button>
            )}

            {/* Volume */}
            <div className="hidden md:flex items-center gap-2">
              <button onClick={toggleMute} aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="text-gray-500 hover:text-white transition-colors">
                {isMuted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <input type="range" min={0} max={1} step={0.02}
                value={isMuted ? 0 : volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                aria-label="Volume" className="w-20 cursor-pointer" />
            </div>

            <button onClick={closePlayer} aria-label="Tutup player"
              className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-white transition-colors rounded-full">
              <X size={14} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
