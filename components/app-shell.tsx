'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CheckSquare, Notebook, Folder, Music2, Search, Settings, ClipboardCheck } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { GlobalMusicPlayer } from '@/components/global-music-player';
import { CommandMenu } from '@/components/command-menu';
import { QuickCapture } from '@/components/quick-capture';

const nav = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/notes', label: 'Notes', icon: Notebook },
  { href: '/files', label: 'Files', icon: Folder },
  { href: '/music', label: 'Music', icon: Music2 },
  { href: '/search', label: 'Search', icon: Search },
  { href: '/review', label: 'Review', icon: ClipboardCheck },
  { href: '/settings', label: 'Settings', icon: Settings }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  const logout = async () => {
    await fetch('/perSpace/api/auth/logout', { method: 'POST' });
    window.location.href = '/perSpace/login';
  };

  if (isLoginPage) {
    return <div className="safe-bottom min-h-screen p-3 md:p-6">{children}</div>;
  }

  return (
    <div className="safe-bottom min-h-screen p-3 md:p-6 pb-44 md:pb-24">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[260px_1fr]">
        <aside className="glass sticky top-6 hidden h-[calc(100vh-3rem)] rounded-2xl p-4 md:block">
          <h1 className="text-sm font-medium uppercase tracking-[0.25em] text-fg/70">Personal Space</h1>
          <div className="mt-4">
            <CommandMenu />
          </div>
          <nav className="mt-6 space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${active ? 'bg-accent text-white shadow-glow' : 'hover:bg-muted/60'}`}>
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button onClick={logout} className="mt-6 w-full rounded-xl bg-muted px-3 py-2 text-sm hover:bg-muted/80">
            Выйти
          </button>
        </aside>
        <main>
          <AnimatePresence mode="wait">
            <motion.div key={pathname} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <QuickCapture />
      <GlobalMusicPlayer />

      <nav className="glass fixed bottom-2 left-2 right-2 z-50 rounded-2xl p-2 md:hidden">
        <ul className="grid grid-cols-8 gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link href={item.href} className={`flex flex-col items-center rounded-xl py-2 text-[11px] ${active ? 'bg-accent text-white' : 'text-fg/70'}`}>
                  <Icon size={15} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
