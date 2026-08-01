// Parser dan helper untuk lirik bertimestamp format [mm:ss]

export interface LyricLine {
  time: number;  // detik
  text: string;
}

/**
 * Parse lirik dari string format:
 * "[00:05] Baris pertama\n[00:12] Baris kedua"
 * 
 * Jika tidak ada timestamp, tiap baris ditampilkan statis tanpa highlight.
 */
export function parseLyrics(raw: string): LyricLine[] {
  if (!raw?.trim()) return [];

  const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
  const timestampRegex = /^\[(\d{1,2}):(\d{2})\]\s*(.*)/;
  const result: LyricLine[] = [];

  for (const line of lines) {
    const match = line.match(timestampRegex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const text = match[3].trim();
      if (text) {
        result.push({ time: minutes * 60 + seconds, text });
      }
    } else {
      // Tidak ada timestamp — masukkan sebagai baris tanpa waktu (time: -1)
      if (line.trim()) {
        result.push({ time: -1, text: line });
      }
    }
  }

  return result;
}

/**
 * Cari index baris lirik yang aktif berdasarkan currentTime
 */
export function getActiveLyricIndex(lines: LyricLine[], currentTime: number): number {
  if (lines.length === 0) return -1;

  // Jika tidak ada timestamp sama sekali, return -1
  const hasTimestamps = lines.some(l => l.time >= 0);
  if (!hasTimestamps) return -1;

  let activeIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].time < 0) continue; // skip baris tanpa timestamp
    if (lines[i].time <= currentTime) {
      activeIndex = i;
    } else {
      break;
    }
  }
  return activeIndex;
}

/**
 * Cek apakah lyrics punya timestamp atau tidak
 */
export function hasTimestamps(raw: string): boolean {
  return /\[\d{1,2}:\d{2}\]/.test(raw || '');
}
