'use client';
import { useState, useEffect, useMemo } from 'react';
import { getTracks, getAlbums } from '@/lib/db';
import type { Track, Album } from '@/types';
import SearchBar from '@/components/ui/SearchBar';
import TrackRow from '@/components/ui/TrackRow';
import AlbumCard from '@/components/ui/AlbumCard';
import { Search, Loader2 } from 'lucide-react';

const genres = ['All', 'Electronic', 'Chill', 'Indie', 'Rock', 'Pop'];

export default function SearchPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [query, setQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [t, a] = await Promise.all([getTracks(), getAlbums()]);
      setTracks(t); setAlbums(a); setLoading(false);
    }
    load();
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return { tracks: [], albums: [] };
    const q = query.toLowerCase();
    return {
      tracks: tracks.filter(t =>
        t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q) ||
        t.albumTitle.toLowerCase().includes(q) || (t.genre?.toLowerCase().includes(q))
      ),
      albums: albums.filter(a =>
        a.title.toLowerCase().includes(q) || a.artist.toLowerCase().includes(q) || a.genre.toLowerCase().includes(q)
      ),
    };
  }, [query, tracks, albums]);

  const filteredAlbums = useMemo(() => {
    if (activeGenre === 'All') return albums;
    return albums.filter(a => a.genre === activeGenre);
  }, [activeGenre, albums]);

  const hasResults = query && (results.tracks.length > 0 || results.albums.length > 0);
  const noResults = query && results.tracks.length === 0 && results.albums.length === 0;

  if (loading) return (
    <div className="flex items-center justify-center min-h-64">
      <Loader2 size={24} className="text-magenta animate-spin" />
    </div>
  );

  return (
    <div className="px-6 md:px-10 py-8">
      <h1 className="font-display font-black text-3xl text-white mb-6">Search</h1>
      <div className="mb-6"><SearchBar value={query} onChange={setQuery} /></div>

      {!query && (
        <>
          <div className="flex gap-2 flex-wrap mb-8">
            {genres.map(g => (
              <button key={g} onClick={() => setActiveGenre(g)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeGenre === g ? 'bg-magenta text-white' : 'bg-surface-card text-gray-400 hover:text-white border border-surface-border'
                }`}>{g}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredAlbums.map(a => <AlbumCard key={a.id} album={a} allTracks={tracks} />)}
          </div>
        </>
      )}

      {hasResults && (
        <div className="space-y-8">
          {results.tracks.length > 0 && (
            <section>
              <h2 className="font-display font-bold text-lg text-white mb-4">
                Tracks <span className="text-gray-600 font-normal text-sm">({results.tracks.length})</span>
              </h2>
              <div className="space-y-1">
                {results.tracks.map((t, i) => <TrackRow key={t.id} track={t} index={i} queue={results.tracks} />)}
              </div>
            </section>
          )}
          {results.albums.length > 0 && (
            <section>
              <h2 className="font-display font-bold text-lg text-white mb-4">
                Albums <span className="text-gray-600 font-normal text-sm">({results.albums.length})</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {results.albums.map(a => <AlbumCard key={a.id} album={a} allTracks={tracks} />)}
              </div>
            </section>
          )}
        </div>
      )}

      {noResults && (
        <div className="text-center py-20">
          <Search size={48} className="text-gray-700 mx-auto mb-4" />
          <p className="text-gray-400 font-medium">Tidak ada hasil untuk &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  );
}
