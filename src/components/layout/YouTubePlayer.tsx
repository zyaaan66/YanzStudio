'use client';
import { useEffect, useRef } from 'react';
import { usePlayerStore } from '@/store/playerStore';

interface Props { videoId: string; }

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function YouTubePlayer({ videoId }: Props) {
  const { setYtPlayer, setYtReady, isPlaying, _syncTime, next, repeatMode } = usePlayerStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    function initPlayer() {
      if (!containerRef.current) return;
      const p = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: { autoplay: 1, controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3, modestbranding: 1 },
        events: {
          onReady: (e: any) => {
            setYtPlayer(e.target);
            setYtReady(true);
            e.target.setVolume(usePlayerStore.getState().volume * 100);
            if (usePlayerStore.getState().isMuted) e.target.mute();
          },
          onStateChange: (e: any) => {
            // 1 = playing, 2 = paused, 0 = ended
            if (e.data === 0) {
              if (repeatMode === 'one') { e.target.seekTo(0); e.target.playVideo(); }
              else next();
            }
          },
        },
      });
      playerRef.current = p;
    }

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    // Sync time setiap detik
    const interval = setInterval(() => {
      const p = playerRef.current;
      if (!p?.getCurrentTime) return;
      try {
        const cur = p.getCurrentTime() || 0;
        const dur = p.getDuration() || 0;
        _syncTime(cur, dur);
      } catch (_) {}
    }, 500);

    return () => {
      clearInterval(interval);
      if (playerRef.current?.destroy) playerRef.current.destroy();
    };
  }, [videoId]);

  // Sync play/pause dari store ke YT
  useEffect(() => {
    const p = playerRef.current;
    if (!p?.getPlayerState) return;
    try {
      if (isPlaying) p.playVideo();
      else p.pauseVideo();
    } catch (_) {}
  }, [isPlaying]);

  return (
    <div className="fixed -top-[9999px] -left-[9999px] w-1 h-1 overflow-hidden" aria-hidden="true">
      <div ref={containerRef} />
    </div>
  );
}
