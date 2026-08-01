'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Music2, Home, Search, Library, ListMusic, Settings, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/library', label: 'Library', icon: Library },
];

const playlistItems = [
  { href: '/playlist/favorites', label: 'Favorites', icon: ListMusic },
  { href: '/playlist/recent', label: 'Recently Played', icon: Radio },
];

const allMobileItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/library', label: 'Library', icon: Library },
  { href: '/admin', label: 'Admin', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  }

  function navClass(href: string) {
    return cn(
      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer select-none',
      isActive(href)
        ? 'bg-magenta/15 text-magenta'
        : 'text-gray-400 hover:text-white hover:bg-surface-card'
    );
  }

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="fixed left-0 top-0 h-full w-56 bg-surface-black border-r border-surface-border z-50 hidden md:flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-surface-border flex-shrink-0">
          <div className="w-8 h-8 rounded-lg bg-magenta flex items-center justify-center flex-shrink-0">
            <Music2 size={16} className="text-white" />
          </div>
          <div>
            <p className="font-display font-black text-sm text-white leading-tight">YanzStudio</p>
            <p className="text-[9px] text-gray-500 tracking-widest uppercase">Music Player</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Main navigation">
          {navItems.map(({ href, label, icon: Icon }) => (
            <div
              key={href}
              onClick={() => router.push(href)}
              className={navClass(href)}
              role="link"
              tabIndex={0}
              aria-label={label}
              aria-current={isActive(href) ? 'page' : undefined}
              onKeyDown={e => e.key === 'Enter' && router.push(href)}
            >
              <Icon size={17} aria-hidden="true" />
              {label}
            </div>
          ))}

          {/* Playlists */}
          <div className="pt-4 pb-1">
            <p className="text-[10px] tracking-widest text-gray-600 uppercase px-3 mb-2">Playlists</p>
            {playlistItems.map(({ href, label, icon: Icon }) => (
              <div
                key={href}
                onClick={() => router.push(href)}
                className={navClass(href)}
                role="link"
                tabIndex={0}
                aria-label={label}
                onKeyDown={e => e.key === 'Enter' && router.push(href)}
              >
                <Icon size={17} aria-hidden="true" />
                {label}
              </div>
            ))}
          </div>
        </nav>

        {/* Admin — pinned di bawah */}
        <div className="px-3 py-4 border-t border-surface-border flex-shrink-0">
          <div
            onClick={() => router.push('/admin')}
            className={navClass('/admin')}
            role="link"
            tabIndex={0}
            aria-label="Admin Panel"
            aria-current={isActive('/admin') ? 'page' : undefined}
            onKeyDown={e => e.key === 'Enter' && router.push('/admin')}
          >
            <Settings size={17} aria-hidden="true" />
            Admin Panel
          </div>
        </div>
      </aside>

      {/* ── Mobile Bottom Nav ──
          z-[60] → selalu di atas PlayerBar (z-50)
      ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-[60] md:hidden bg-surface-black border-t border-surface-border"
        aria-label="Mobile navigation"
      >
        <div className="flex justify-around items-center h-14">
          {allMobileItems.map(({ href, label, icon: Icon }) => (
            <button
              key={href}
              onClick={() => router.push(href)}
              aria-label={label}
              aria-current={isActive(href) ? 'page' : undefined}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 flex-1 h-full text-[10px] font-medium transition-colors',
                isActive(href) ? 'text-magenta' : 'text-gray-500'
              )}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
