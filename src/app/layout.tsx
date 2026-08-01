import type { Metadata } from 'next';
import '../app/globals.css';
import Sidebar from '@/components/layout/Sidebar';
import PlayerBar from '@/components/layout/PlayerBar';

export const metadata: Metadata = {
  title: 'YanzStudio — Music Player',
  description: 'Platform streaming musik pribadi YanzStudio. Dengarkan koleksi musik terbaik dengan player yang powerful.',
  keywords: ['YanzStudio', 'music player', 'streaming musik', 'playlist'],
  openGraph: {
    title: 'YanzStudio — Music Player',
    description: 'Platform streaming musik pribadi YanzStudio.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-surface-black">
        <Sidebar />
        <main
          className="md:ml-56 pb-28 md:pb-20 min-h-screen"
          id="main-content"
        >
          {children}
        </main>
        <PlayerBar />
      </body>
    </html>
  );
}
