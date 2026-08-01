'use client';
import { Search, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Search songs, albums, artists...' }: Props) {
  return (
    <div className="relative">
      <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search music"
        className="w-full bg-surface-card border border-surface-border rounded-2xl pl-11 pr-10 py-3 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-magenta focus:bg-surface-elevated"
      />
      {value && (
        <button onClick={() => onChange('')} aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
          <X size={15} />
        </button>
      )}
    </div>
  );
}
