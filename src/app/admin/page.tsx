'use client';
import { useState, useEffect } from 'react';
import { getTracks, addTrack, updateTrack, deleteTrack, getAlbums, addAlbum, updateAlbum, deleteAlbum } from '@/lib/db';
import type { Track, Album } from '@/types';
import { Plus, Trash2, Edit3, Music, Disc3, X, RotateCcw, CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react';
import Image from 'next/image';

type Tab = 'tracks' | 'albums';
type ToastType = 'success' | 'error';

const emptyTrack: { title: string; artist: string; albumId: string; albumTitle: string; duration: string; cover: string; sourceType: import('@/types').SourceType; audioUrl: string; youtubeId: string; lyrics: string; genre: string; year: string } = {
  title: '', artist: 'YanzStudio', albumId: '', albumTitle: '',
  duration: '00:00', cover: '', sourceType: 'youtube',
  audioUrl: '', youtubeId: '', lyrics: '', genre: '', year: new Date().getFullYear().toString(),
};

const emptyAlbum = {
  title: '', artist: 'YanzStudio', year: new Date().getFullYear().toString(),
  cover: '', coverGradient: 'linear-gradient(135deg,#2d0050,#6b2fa0)', genre: '', description: '',
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('tracks');
  const [trackList, setTrackList] = useState<Track[]>([]);
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [editTrack, setEditTrack] = useState<Track | null>(null);
  const [showTrackForm, setShowTrackForm] = useState(false);
  const [trackForm, setTrackForm] = useState({ ...emptyTrack });

  const [editAlbum, setEditAlbum] = useState<Album | null>(null);
  const [showAlbumForm, setShowAlbumForm] = useState(false);
  const [albumForm, setAlbumForm] = useState({ ...emptyAlbum });

  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);
  const [showLyricHelp, setShowLyricHelp] = useState(false);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    const [t, a] = await Promise.all([getTracks(), getAlbums()]);
    setTrackList(t);
    setAlbumList(a);
    setLoading(false);
  }

  function showToast(msg: string, type: ToastType = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  // ── Track CRUD ──
  function openAddTrack() { setTrackForm({ ...emptyTrack }); setEditTrack(null); setShowTrackForm(true); }

  function openEditTrack(t: Track) {
    setTrackForm({
      title: t.title, artist: t.artist, albumId: t.albumId, albumTitle: t.albumTitle,
      duration: t.duration, cover: t.cover, sourceType: t.sourceType,
      audioUrl: t.audioUrl || '', youtubeId: t.youtubeId || '',
      lyrics: t.lyrics || '', genre: t.genre || '', year: t.year || '',
    });
    setEditTrack(t);
    setShowTrackForm(true);
  }

  async function saveTrack() {
    if (!trackForm.title.trim()) { showToast('Judul track wajib diisi', 'error'); return; }
    if (trackForm.sourceType === 'youtube' && !trackForm.youtubeId.trim()) {
      showToast('YouTube Video ID wajib diisi', 'error'); return;
    }
    if (trackForm.sourceType === 'mp3' && !trackForm.audioUrl.trim()) {
      showToast('Path MP3 wajib diisi', 'error'); return;
    }

    setSaving(true);
    const selectedAlbum = albumList.find(a => a.id === trackForm.albumId);
    const albumTitle = selectedAlbum?.title || trackForm.albumTitle;

    if (editTrack) {
      const ok = await updateTrack(editTrack.id, { ...trackForm, albumTitle });
      if (ok) { showToast('Track berhasil diperbarui ✓'); await loadData(); }
      else showToast('Gagal memperbarui track', 'error');
    } else {
      const result = await addTrack({ ...trackForm, albumTitle, likes: 0, plays: 0 });
      if (result) { showToast('Track berhasil ditambahkan ✓'); await loadData(); }
      else showToast('Gagal menambah track', 'error');
    }
    setSaving(false);
    setShowTrackForm(false);
  }

  async function handleDeleteTrack(id: string) {
    if (!confirm('Hapus track ini?')) return;
    setSaving(true);
    const ok = await deleteTrack(id);
    if (ok) { showToast('Track dihapus'); await loadData(); }
    else showToast('Gagal menghapus track', 'error');
    setSaving(false);
  }

  // ── Album CRUD ──
  function openAddAlbum() { setAlbumForm({ ...emptyAlbum }); setEditAlbum(null); setShowAlbumForm(true); }

  function openEditAlbum(a: Album) {
    setAlbumForm({
      title: a.title, artist: a.artist, year: a.year,
      cover: a.cover, coverGradient: a.coverGradient,
      genre: a.genre, description: a.description || '',
    });
    setEditAlbum(a);
    setShowAlbumForm(true);
  }

  async function saveAlbum() {
    if (!albumForm.title.trim()) { showToast('Judul album wajib diisi', 'error'); return; }
    setSaving(true);
    if (editAlbum) {
      const ok = await updateAlbum(editAlbum.id, albumForm);
      if (ok) { showToast('Album berhasil diperbarui ✓'); await loadData(); }
      else showToast('Gagal memperbarui album', 'error');
    } else {
      const result = await addAlbum(albumForm);
      if (result) { showToast('Album berhasil ditambahkan ✓'); await loadData(); }
      else showToast('Gagal menambah album', 'error');
    }
    setSaving(false);
    setShowAlbumForm(false);
  }

  async function handleDeleteAlbum(id: string) {
    if (!confirm('Hapus album ini?')) return;
    setSaving(true);
    const ok = await deleteAlbum(id);
    if (ok) { showToast('Album dihapus'); await loadData(); }
    else showToast('Gagal menghapus album', 'error');
    setSaving(false);
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <Loader2 size={24} className="text-magenta animate-spin" />
    </div>
  );

  return (
    <div className="px-6 md:px-10 py-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium shadow-2xl border ${
          toast.type === 'success' ? 'bg-green-500/20 border-green-500/30 text-green-300' : 'bg-red-500/20 border-red-500/30 text-red-300'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display font-black text-3xl text-white">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">Data tersimpan di Supabase — permanen di semua perangkat</p>
        </div>
        <button onClick={loadData}
          className="flex items-center gap-2 px-4 py-2 bg-surface-card border border-surface-border text-gray-400 hover:text-white rounded-xl text-sm transition-colors">
          <RotateCcw size={14} /> Refresh
        </button>
      </div>

      {/* Supabase info */}
      <div className="mb-6 p-4 bg-green-500/8 border border-green-500/20 rounded-2xl">
        <div className="flex items-start gap-3">
          <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-white font-medium">Terhubung ke Supabase</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Data tersimpan di cloud — tidak hilang saat refresh, bisa diakses dari perangkat manapun.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-8 border-b border-surface-border">
        {([['tracks', 'Tracks', trackList.length], ['albums', 'Albums', albumList.length]] as [Tab, string, number][]).map(([key, label, count]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === key ? 'text-magenta border-magenta' : 'text-gray-500 border-transparent hover:text-white'
            }`}>
            {key === 'tracks' ? <Music size={15} /> : <Disc3 size={15} />}
            {label}
            <span className={`text-xs px-2 py-0.5 rounded-full ${tab === key ? 'bg-magenta/20 text-magenta' : 'bg-surface-card text-gray-600'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* ── TRACKS ── */}
      {tab === 'tracks' && (
        <>
          <div className="flex justify-end mb-5">
            <button onClick={openAddTrack}
              className="flex items-center gap-2 px-5 py-2.5 bg-magenta text-white rounded-xl text-sm font-medium hover:bg-magenta-dark transition-colors">
              <Plus size={16} /> Tambah Track
            </button>
          </div>
          {trackList.length === 0 ? (
            <div className="text-center py-16">
              <Music size={40} className="text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Belum ada track.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {trackList.map((t) => (
                <div key={t.id} className="flex items-center gap-4 bg-surface-card border border-surface-border rounded-xl p-3 group hover:border-surface-elevated transition-colors">
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 relative bg-surface-elevated">
                    {t.cover
                      ? <Image src={t.cover} alt={t.title} fill sizes="40px" className="object-cover" unoptimized />
                      : <div className="w-full h-full flex items-center justify-center"><Music size={16} className="text-gray-600" /></div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{t.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${t.sourceType === 'youtube' ? 'bg-red-500/15 text-red-400' : 'bg-green-500/15 text-green-400'}`}>
                        {t.sourceType.toUpperCase()}
                      </span>
                      <span className="text-[11px] text-gray-500 truncate">{t.albumTitle || '—'}</span>
                      <span className="text-gray-700 text-[10px]">·</span>
                      <span className="text-[11px] text-gray-600">{t.duration}</span>
                      {t.lyrics && <><span className="text-gray-700 text-[10px]">·</span><span className="text-[9px] text-magenta/70">🎵 lirik</span></>}
                    </div>
                  </div>
                  <div className="hidden md:block text-[10px] text-gray-600 truncate max-w-[140px] flex-shrink-0">
                    {t.sourceType === 'mp3' ? t.audioUrl : `yt: ${t.youtubeId}`}
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditTrack(t)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-elevated text-gray-400 hover:text-white hover:bg-magenta/20 transition-colors">
                      <Edit3 size={13} />
                    </button>
                    <button onClick={() => handleDeleteTrack(t.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-elevated text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── ALBUMS ── */}
      {tab === 'albums' && (
        <>
          <div className="flex justify-end mb-5">
            <button onClick={openAddAlbum}
              className="flex items-center gap-2 px-5 py-2.5 bg-magenta text-white rounded-xl text-sm font-medium hover:bg-magenta-dark transition-colors">
              <Plus size={16} /> Tambah Album
            </button>
          </div>
          {albumList.length === 0 ? (
            <div className="text-center py-16">
              <Disc3 size={40} className="text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Belum ada album.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {albumList.map((a) => (
                <div key={a.id} className="flex items-center gap-4 bg-surface-card border border-surface-border rounded-xl p-3 group hover:border-surface-elevated transition-colors">
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 relative" style={{ background: a.coverGradient }}>
                    {a.cover && <Image src={a.cover} alt={a.title} fill sizes="40px" className="object-cover" unoptimized />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{a.title}</p>
                    <p className="text-[11px] text-gray-500">{a.artist} · {a.year} · {a.genre}</p>
                  </div>
                  <span className="text-xs text-gray-600 flex-shrink-0 hidden md:block">
                    {trackList.filter(t => t.albumId === a.id).length} tracks
                  </span>
                  <div className="flex gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEditAlbum(a)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-elevated text-gray-400 hover:text-white hover:bg-magenta/20 transition-colors">
                      <Edit3 size={13} />
                    </button>
                    <button onClick={() => handleDeleteAlbum(a.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-elevated text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── TRACK FORM MODAL ── */}
      {showTrackForm && (
        <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-surface-dark border border-surface-border rounded-3xl p-6 w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl text-white">{editTrack ? 'Edit Track' : 'Tambah Track'}</h2>
              <button onClick={() => setShowTrackForm(false)} className="text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              {/* Judul */}
              <div>
                <label className="text-[11px] tracking-widest text-gray-500 uppercase block mb-1.5">Judul <span className="text-magenta">*</span></label>
                <input value={trackForm.title} onChange={e => setTrackForm({ ...trackForm, title: e.target.value })}
                  placeholder="Nama track"
                  className="w-full bg-surface-black border border-surface-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-magenta transition-colors" />
              </div>
              {/* Artist */}
              <div>
                <label className="text-[11px] tracking-widest text-gray-500 uppercase block mb-1.5">Artist</label>
                <input value={trackForm.artist} onChange={e => setTrackForm({ ...trackForm, artist: e.target.value })}
                  className="w-full bg-surface-black border border-surface-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-magenta transition-colors" />
              </div>
              {/* Album */}
              <div>
                <label className="text-[11px] tracking-widest text-gray-500 uppercase block mb-1.5">Album</label>
                <select value={trackForm.albumId}
                  onChange={e => {
                    const a = albumList.find(al => al.id === e.target.value);
                    setTrackForm({ ...trackForm, albumId: e.target.value, albumTitle: a?.title || '' });
                  }}
                  className="w-full bg-surface-black border border-surface-border rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-magenta transition-colors">
                  <option value="">-- Pilih Album --</option>
                  {albumList.map(a => <option key={a.id} value={a.id}>{a.title}</option>)}
                </select>
              </div>
              {/* Sumber */}
              <div>
                <label className="text-[11px] tracking-widest text-gray-500 uppercase block mb-1.5">Sumber <span className="text-magenta">*</span></label>
                <div className="flex gap-2">
                  {(['mp3', 'youtube'] as const).map(s => (
                    <button key={s} type="button" onClick={() => setTrackForm({ ...trackForm, sourceType: s })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${trackForm.sourceType === s ? 'bg-magenta text-white' : 'bg-surface-black border border-surface-border text-gray-400 hover:text-white'}`}>
                      {s === 'mp3' ? '🎵 File MP3' : '▶️ YouTube'}
                    </button>
                  ))}
                </div>
              </div>
              {/* Source input */}
              {trackForm.sourceType === 'mp3' ? (
                <div>
                  <label className="text-[11px] tracking-widest text-gray-500 uppercase block mb-1.5">Path MP3 <span className="text-magenta">*</span></label>
                  <input value={trackForm.audioUrl} onChange={e => setTrackForm({ ...trackForm, audioUrl: e.target.value })}
                    placeholder="/audio/nama.mp3"
                    className="w-full bg-surface-black border border-surface-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-magenta transition-colors" />
                </div>
              ) : (
                <div>
                  <label className="text-[11px] tracking-widest text-gray-500 uppercase block mb-1.5">YouTube Video ID <span className="text-magenta">*</span></label>
                  <input value={trackForm.youtubeId} onChange={e => setTrackForm({ ...trackForm, youtubeId: e.target.value })}
                    placeholder="dQw4w9WgXcQ"
                    className="w-full bg-surface-black border border-surface-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-magenta transition-colors" />
                  <p className="text-[10px] text-gray-600 mt-1">Dari: youtube.com/watch?v=<span className="text-magenta">VIDEO_ID</span></p>
                </div>
              )}
              {/* Cover */}
              <div>
                <label className="text-[11px] tracking-widest text-gray-500 uppercase block mb-1.5">Cover URL</label>
                <input value={trackForm.cover} onChange={e => setTrackForm({ ...trackForm, cover: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-surface-black border border-surface-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-magenta transition-colors" />
                {trackForm.cover && (
                  <div className="mt-2 w-12 h-12 rounded-lg overflow-hidden relative border border-surface-border">
                    <Image src={trackForm.cover} alt="preview" fill sizes="48px" className="object-cover" unoptimized />
                  </div>
                )}
              </div>
              {/* Durasi + Genre + Tahun */}
              <div className="grid grid-cols-3 gap-3">
                {[{ label: 'Durasi', key: 'duration', placeholder: '03:45' }, { label: 'Genre', key: 'genre', placeholder: 'Chill' }, { label: 'Tahun', key: 'year', placeholder: '2024' }].map(f => (
                  <div key={f.key}>
                    <label className="text-[11px] tracking-widest text-gray-500 uppercase block mb-1.5">{f.label}</label>
                    <input value={(trackForm as any)[f.key]} onChange={e => setTrackForm({ ...trackForm, [f.key]: e.target.value })}
                      placeholder={f.placeholder}
                      className="w-full bg-surface-black border border-surface-border rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-magenta transition-colors" />
                  </div>
                ))}
              </div>
              {/* Lirik */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] tracking-widest text-gray-500 uppercase">Lirik <span className="text-gray-600">(opsional)</span></label>
                  <button type="button" onClick={() => setShowLyricHelp(h => !h)}
                    className="flex items-center gap-1 text-[10px] text-gray-600 hover:text-magenta transition-colors">
                    <Info size={11} /> Format
                  </button>
                </div>
                {showLyricHelp && (
                  <div className="mb-2 p-3 bg-surface-black border border-magenta/20 rounded-xl text-[11px] text-gray-400 leading-relaxed">
                    <p className="text-magenta font-medium mb-1">Format Timestamp (auto-scroll seperti Spotify):</p>
                    <code className="text-gray-300 block whitespace-pre">{`[00:05] Baris pertama\n[00:12] Baris kedua`}</code>
                  </div>
                )}
                <textarea value={trackForm.lyrics} onChange={e => setTrackForm({ ...trackForm, lyrics: e.target.value })}
                  rows={6} placeholder={`[00:05] Baris pertama\n[00:12] Baris kedua`}
                  className="w-full bg-surface-black border border-surface-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-magenta transition-colors resize-none font-mono" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowTrackForm(false)}
                className="flex-1 py-3 rounded-xl border border-surface-border text-gray-400 hover:text-white text-sm font-medium transition-colors">
                Batal
              </button>
              <button onClick={saveTrack} disabled={saving}
                className="flex-1 py-3 rounded-xl bg-magenta text-white text-sm font-medium hover:bg-magenta-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                {editTrack ? 'Simpan Perubahan' : 'Tambah Track'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ALBUM FORM MODAL ── */}
      {showAlbumForm && (
        <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-surface-dark border border-surface-border rounded-3xl p-6 w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-xl text-white">{editAlbum ? 'Edit Album' : 'Tambah Album'}</h2>
              <button onClick={() => setShowAlbumForm(false)} className="text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] tracking-widest text-gray-500 uppercase block mb-1.5">Judul <span className="text-magenta">*</span></label>
                <input value={albumForm.title} onChange={e => setAlbumForm({ ...albumForm, title: e.target.value })}
                  placeholder="Nama album"
                  className="w-full bg-surface-black border border-surface-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-magenta transition-colors" />
              </div>
              <div>
                <label className="text-[11px] tracking-widest text-gray-500 uppercase block mb-1.5">Artist</label>
                <input value={albumForm.artist} onChange={e => setAlbumForm({ ...albumForm, artist: e.target.value })}
                  className="w-full bg-surface-black border border-surface-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-magenta transition-colors" />
              </div>
              <div>
                <label className="text-[11px] tracking-widest text-gray-500 uppercase block mb-1.5">Cover URL</label>
                <input value={albumForm.cover} onChange={e => setAlbumForm({ ...albumForm, cover: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full bg-surface-black border border-surface-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-magenta transition-colors" />
                {albumForm.cover && (
                  <div className="mt-2 w-12 h-12 rounded-lg overflow-hidden relative border border-surface-border">
                    <Image src={albumForm.cover} alt="preview" fill sizes="48px" className="object-cover" unoptimized />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] tracking-widest text-gray-500 uppercase block mb-1.5">Genre</label>
                  <input value={albumForm.genre} onChange={e => setAlbumForm({ ...albumForm, genre: e.target.value })}
                    placeholder="Electronic"
                    className="w-full bg-surface-black border border-surface-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-magenta transition-colors" />
                </div>
                <div>
                  <label className="text-[11px] tracking-widest text-gray-500 uppercase block mb-1.5">Tahun</label>
                  <input value={albumForm.year} onChange={e => setAlbumForm({ ...albumForm, year: e.target.value })}
                    placeholder="2024"
                    className="w-full bg-surface-black border border-surface-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-magenta transition-colors" />
                </div>
              </div>
              <div>
                <label className="text-[11px] tracking-widest text-gray-500 uppercase block mb-1.5">Deskripsi</label>
                <textarea value={albumForm.description} onChange={e => setAlbumForm({ ...albumForm, description: e.target.value })}
                  rows={3} placeholder="Deskripsi singkat album..."
                  className="w-full bg-surface-black border border-surface-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-magenta transition-colors resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAlbumForm(false)}
                className="flex-1 py-3 rounded-xl border border-surface-border text-gray-400 hover:text-white text-sm font-medium transition-colors">
                Batal
              </button>
              <button onClick={saveAlbum} disabled={saving}
                className="flex-1 py-3 rounded-xl bg-magenta text-white text-sm font-medium hover:bg-magenta-dark transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                {editAlbum ? 'Simpan Perubahan' : 'Tambah Album'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
