'use client';
import { useEffect, useRef, useMemo } from 'react';
import { usePlayerStore } from '@/store/playerStore';
import { X, Mic2, Music } from 'lucide-react';
import { parseLyrics, getActiveLyricIndex, hasTimestamps } from '@/lib/lyrics';

export default function LyricsOverlay() {
  const { currentTrack, showLyrics, toggleLyrics, currentTime } = usePlayerStore();
  const activeLyricRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const lines = useMemo(() => {
    if (!currentTrack?.lyrics) return [];
    return parseLyrics(currentTrack.lyrics);
  }, [currentTrack?.lyrics]);

  const activeIndex = useMemo(() => {
    return getActiveLyricIndex(lines, currentTime);
  }, [lines, currentTime]);

  const isTimestamped = currentTrack?.lyrics ? hasTimestamps(currentTrack.lyrics) : false;

  // Auto-scroll ke baris aktif
  useEffect(() => {
    if (!activeLyricRef.current || !containerRef.current) return;
    const container = containerRef.current;
    const el = activeLyricRef.current;
    const containerHeight = container.clientHeight;
    const elTop = el.offsetTop;
    const elHeight = el.clientHeight;
    // Scroll agar baris aktif ada di tengah container
    container.scrollTo({
      top: elTop - containerHeight / 2 + elHeight / 2,
      behavior: 'smooth',
    });
  }, [activeIndex]);

  if (!showLyrics || !currentTrack) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col"
      style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #1a001a 50%, #0a0a0a 100%)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <Mic2 size={18} className="text-magenta" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-white">{currentTrack.title}</p>
            <p className="text-[11px] text-gray-500">{currentTrack.artist}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isTimestamped && (
            <span className="text-[10px] text-gray-600 bg-surface-card px-2 py-1 rounded-full">
              Tanpa timestamp
            </span>
          )}
          <button
            onClick={toggleLyrics}
            aria-label="Tutup lirik"
            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-white hover:bg-surface-card transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Lyrics body */}
      {lines.length === 0 ? (
        // Tidak ada lirik
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Music size={48} className="text-gray-700" aria-hidden="true" />
          <p className="text-gray-500 text-sm">Lirik tidak tersedia untuk lagu ini.</p>
          <p className="text-gray-600 text-xs">Tambah lirik lewat Admin Panel.</p>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="flex-1 overflow-y-auto py-12 px-6 no-scrollbar"
        >
          <div className="max-w-xl mx-auto space-y-2">
            {lines.map((line, i) => {
              const isActive = i === activeIndex;
              const isPast = i < activeIndex;
              const isFuture = i > activeIndex;

              return (
                <div
                  key={i}
                  ref={isActive ? activeLyricRef : null}
                  className="transition-all duration-500 text-center py-1"
                  style={{
                    transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  }}
                >
                  <p
                    className="font-display leading-relaxed transition-all duration-500"
                    style={{
                      fontSize: isActive ? '1.5rem' : '1.1rem',
                      fontWeight: isActive ? 700 : 400,
                      color: isActive
                        ? '#ffffff'
                        : isPast
                        ? 'rgba(255,255,255,0.3)'
                        : isFuture
                        ? 'rgba(255,255,255,0.45)'
                        : 'rgba(255,255,255,0.45)',
                      textShadow: isActive ? '0 0 30px rgba(255,45,120,0.5)' : 'none',
                    }}
                  >
                    {line.text}
                  </p>
                </div>
              );
            })}
            {/* Padding bawah agar baris terakhir bisa scroll ke tengah */}
            <div className="h-48" />
          </div>
        </div>
      )}

      {/* Progress bar mini di bawah */}
      <div className="px-6 py-4 border-t border-surface-border flex-shrink-0">
        <div className="max-w-xl mx-auto">
          <div className="h-1 bg-surface-border rounded-full overflow-hidden">
            <div
              className="h-full bg-magenta rounded-full transition-all duration-300"
              style={{ width: `${usePlayerStore.getState().progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-gray-600 tabular-nums">
              {formatTime(currentTime)}
            </span>
            <span className="text-[10px] text-gray-600 tabular-nums">
              {currentTrack.duration}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime(s: number): string {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}
