'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Track, QueueItem } from '@/types';
import { generateId } from '@/lib/utils';

interface PlayerState {
  currentTrack: Track | null;
  queue: QueueItem[];
  queueIndex: number;
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: 'none' | 'one' | 'all';
  showLyrics: boolean;
  audioEl: HTMLAudioElement | null;
  ytPlayer: any | null;
  ytReady: boolean;

  // Actions
  setTrack: (track: Track, autoPlay?: boolean) => void;
  playQueue: (tracks: Track[], startIndex?: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (percent: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  toggleLyrics: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (queueId: string) => void;
  clearQueue: () => void;
  setYtPlayer: (p: any) => void;
  setYtReady: (r: boolean) => void;
  _syncTime: (currentTime: number, duration: number) => void;
  closePlayer: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      queue: [],
      queueIndex: -1,
      isPlaying: false,
      progress: 0,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      isMuted: false,
      isShuffle: false,
      repeatMode: 'none',
      showLyrics: false,
      audioEl: null,
      ytPlayer: null,
      ytReady: false,

      setTrack: (track, autoPlay = true) => {
        const state = get();

        // Stop existing
        if (state.audioEl) { state.audioEl.pause(); state.audioEl.src = ''; }
        if (state.ytPlayer?.pauseVideo) state.ytPlayer.pauseVideo();

        if (track.sourceType === 'mp3' && track.audioUrl) {
          const audio = new Audio(track.audioUrl);
          audio.volume = state.isMuted ? 0 : state.volume;

          audio.addEventListener('timeupdate', () => {
            const dur = audio.duration || 0;
            const cur = audio.currentTime;
            get()._syncTime(cur, dur);
          });
          audio.addEventListener('ended', () => {
            const { repeatMode } = get();
            if (repeatMode === 'one') { audio.currentTime = 0; audio.play(); }
            else get().next();
          });
          audio.addEventListener('loadedmetadata', () => {
            set({ duration: audio.duration });
          });

          set({ currentTrack: track, audioEl: audio, ytPlayer: null, isPlaying: autoPlay, progress: 0, currentTime: 0, duration: 0 });
          if (autoPlay) audio.play().catch(() => set({ isPlaying: false }));

        } else if (track.sourceType === 'youtube' && track.youtubeId) {
          set({ currentTrack: track, audioEl: null, isPlaying: autoPlay, progress: 0, currentTime: 0, duration: 0 });
          // YT player akan di-load oleh YouTubePlayer component
        }
      },

      playQueue: (tracks, startIndex = 0) => {
        const items: QueueItem[] = tracks.map(t => ({ track: t, queueId: generateId() }));
        set({ queue: items, queueIndex: startIndex });
        get().setTrack(tracks[startIndex]);
      },

      togglePlay: () => {
        const { audioEl, ytPlayer, isPlaying, currentTrack } = get();
        if (!currentTrack) return;
        if (currentTrack.sourceType === 'mp3' && audioEl) {
          if (isPlaying) { audioEl.pause(); set({ isPlaying: false }); }
          else { audioEl.play().catch(() => {}); set({ isPlaying: true }); }
        } else if (currentTrack.sourceType === 'youtube' && ytPlayer) {
          if (isPlaying) { ytPlayer.pauseVideo(); set({ isPlaying: false }); }
          else { ytPlayer.playVideo(); set({ isPlaying: true }); }
        }
      },

      next: () => {
        const { queue, queueIndex, isShuffle, repeatMode } = get();
        if (queue.length === 0) return;
        let nextIdx: number;
        if (isShuffle) {
          nextIdx = Math.floor(Math.random() * queue.length);
        } else if (queueIndex < queue.length - 1) {
          nextIdx = queueIndex + 1;
        } else if (repeatMode === 'all') {
          nextIdx = 0;
        } else return;
        set({ queueIndex: nextIdx });
        get().setTrack(queue[nextIdx].track);
      },

      prev: () => {
        const { queue, queueIndex, currentTime } = get();
        // Jika sudah > 3 detik, restart lagu saat ini
        if (currentTime > 3) { get().seek(0); return; }
        if (queueIndex > 0) {
          const prevIdx = queueIndex - 1;
          set({ queueIndex: prevIdx });
          get().setTrack(queue[prevIdx].track);
        }
      },

      seek: (percent) => {
        const { audioEl, ytPlayer, duration, currentTrack } = get();
        const newTime = (percent / 100) * duration;
        if (currentTrack?.sourceType === 'mp3' && audioEl && duration) {
          audioEl.currentTime = newTime;
        } else if (currentTrack?.sourceType === 'youtube' && ytPlayer) {
          ytPlayer.seekTo(newTime, true);
        }
        set({ progress: percent, currentTime: newTime });
      },

      setVolume: (v) => {
        const { audioEl, ytPlayer } = get();
        if (audioEl) audioEl.volume = v;
        if (ytPlayer?.setVolume) ytPlayer.setVolume(v * 100);
        set({ volume: v, isMuted: v === 0 });
      },

      toggleMute: () => {
        const { audioEl, ytPlayer, isMuted, volume } = get();
        const next = !isMuted;
        if (audioEl) audioEl.muted = next;
        if (ytPlayer) next ? ytPlayer.mute() : ytPlayer.unMute();
        set({ isMuted: next });
        if (!next && volume === 0) {
          if (audioEl) audioEl.volume = 0.5;
          set({ volume: 0.5 });
        }
      },

      toggleShuffle: () => set(s => ({ isShuffle: !s.isShuffle })),

      cycleRepeat: () => set(s => ({
        repeatMode: s.repeatMode === 'none' ? 'all' : s.repeatMode === 'all' ? 'one' : 'none'
      })),

      toggleLyrics: () => set(s => ({ showLyrics: !s.showLyrics })),

      addToQueue: (track) => {
        set(s => ({ queue: [...s.queue, { track, queueId: generateId() }] }));
      },

      removeFromQueue: (queueId) => {
        set(s => ({ queue: s.queue.filter(q => q.queueId !== queueId) }));
      },

      clearQueue: () => set({ queue: [], queueIndex: -1 }),

      setYtPlayer: (p) => set({ ytPlayer: p }),
      setYtReady: (r) => set({ ytReady: r }),

      _syncTime: (currentTime, duration) => {
        set({
          currentTime,
          duration,
          progress: duration > 0 ? (currentTime / duration) * 100 : 0,
        });
      },

      closePlayer: () => {
        const { audioEl, ytPlayer } = get();
        if (audioEl) { audioEl.pause(); audioEl.src = ''; }
        if (ytPlayer?.pauseVideo) ytPlayer.pauseVideo();
        set({ currentTrack: null, isPlaying: false, progress: 0, currentTime: 0, duration: 0, audioEl: null, queue: [], queueIndex: -1 });
      },
    }),
    {
      name: 'yanzstudio-player',
      partialize: (s) => ({ volume: s.volume, isMuted: s.isMuted, isShuffle: s.isShuffle, repeatMode: s.repeatMode }),
    }
  )
);
