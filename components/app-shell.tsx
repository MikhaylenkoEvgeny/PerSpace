'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CheckSquare, Notebook, Search, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { GlobalMusicPlayer } from '@/components/global-music-player';
import { CommandMenu } from '@/components/command-menu';
import { QuickCapture } from '@/components/quick-capture';

const nav = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/notes', label: 'Notes', icon: Notebook },
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
    return <div className="safe-bottom min-h-screen px-4 py-6 md:px-8">{children}</div>;
  }

  return (
    <div className="safe-bottom min-h-screen bg-bg px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="surface sticky top-6 hidden h-[calc(100vh-3rem)] flex-col rounded-2xl p-4 md:flex">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-fg/45">PerSpace</p>
            <h1 className="mt-3 text-xl font-semibold tracking-[-0.02em]">Calm personal OS</h1>
          </div>

          <nav className="mt-8 space-y-1">
            {nav.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex h-10 items-center gap-3 rounded-xl px-3 text-sm ${active ? 'bg-fg text-white' : 'text-fg/72 hover:bg-muted'}`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-3">
            <div className="rounded-xl border border-dashed border-fg/10 p-3 text-sm text-fg/62">
              <p className="font-medium text-fg">Command</p>
              <p className="mt-1">Use ⌘K / Ctrl+K for quick navigation and capture.</p>
            </div>
            <button onClick={logout} className="h-10 w-full rounded-xl bg-muted text-sm font-medium text-fg/80 hover:bg-fg hover:text-white">
              Выйти
            </button>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-fg/10 bg-panel px-4 py-3 md:px-5">
            <div>
              <p className="text-sm font-medium text-fg/80">{nav.find((item) => item.href === pathname)?.label ?? 'Workspace'}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:block">
                <CommandMenu />
              </div>
              <QuickCapture />
            </div>
          </header>

          <main>
            <AnimatePresence mode="wait">
              <motion.div key={pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}>
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <QuickCapture />
      <GlobalMusicPlayer />

      <nav className="surface fixed bottom-3 left-3 right-3 z-50 rounded-2xl p-2 md:hidden">
        <ul className="grid grid-cols-5 gap-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link href={item.href} className={`flex flex-col items-center gap-1 rounded-xl py-2 text-[11px] ${active ? 'bg-fg text-white' : 'text-fg/62'}`}>
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
