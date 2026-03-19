'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClipboardCheck, Command, FileText, Folder, MoonStar, Music2, NotebookPen, Plus, Search, Sparkles, type LucideIcon } from 'lucide-react';
import { useWorkspace } from '@/components/workspace-provider';

type ResultItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  run: () => void;
};

const quickLinks = [
  { id: 'go-home', title: 'Открыть дашборд', subtitle: 'Перейти на главный экран', href: '/', icon: Sparkles },
  { id: 'go-tasks', title: 'Открыть задачи', subtitle: 'Inbox, Today, Upcoming, Completed', href: '/tasks', icon: NotebookPen },
  { id: 'go-notes', title: 'Открыть заметки', subtitle: 'Карточки заметок и быстрый захват идей', href: '/notes', icon: FileText },
  { id: 'go-files', title: 'Открыть файлы', subtitle: 'Ваши загрузки и поиск по ним', href: '/files', icon: Folder },
  { id: 'go-music', title: 'Открыть музыку', subtitle: 'Треки и глобальный player', href: '/music', icon: Music2 },
  { id: 'go-search', title: 'Открыть поиск', subtitle: 'Полный экран глобального поиска', href: '/search', icon: Search },
  { id: 'go-review', title: 'Открыть weekly review', subtitle: 'Рефлексия, neglected items и next-week выбор', href: '/review', icon: ClipboardCheck },
  { id: 'go-shutdown', title: 'Открыть shutdown ritual', subtitle: 'Закрыть день, перенести остатки и выбрать старт завтра', href: '/shutdown', icon: MoonStar }
] as const;

export function CommandMenu() {
  const router = useRouter();
  const { queryAll, addTask, addNote } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setSelectedIndex(0);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k';
      if (isShortcut) {
        event.preventDefault();
        setOpen((prev) => !prev);
      }

      if (event.key === 'Escape') {
        close();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [close]);

  const actionItems = useMemo<ResultItem[]>(() => {
    const trimmed = query.trim();
    const items: ResultItem[] = [];

    if (trimmed) {
      items.push({
        id: `create-task-${trimmed}`,
        title: `Создать задачу: ${trimmed}`,
        subtitle: 'Добавить в inbox и открыть раздел задач',
        icon: Plus,
        run: () => {
          addTask(trimmed);
          close();
          router.push('/tasks');
        }
      });

      items.push({
        id: `create-note-${trimmed}`,
        title: `Создать заметку: ${trimmed}`,
        subtitle: 'Создать заметку с быстрым заголовком',
        icon: FileText,
        run: () => {
          addNote(trimmed, '');
          close();
          router.push('/notes');
        }
      });
    }

    const navigationItems = quickLinks
      .filter((item) => !trimmed || `${item.title} ${item.subtitle}`.toLowerCase().includes(trimmed.toLowerCase()))
      .map<ResultItem>((item) => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        icon: item.icon,
        run: () => {
          close();
          router.push(item.href);
        }
      }));

    const entityItems = queryAll(trimmed).slice(0, 8).map<ResultItem>((result) => {
      const href = result.type === 'task'
        ? '/tasks'
        : result.type === 'note'
          ? '/notes'
          : result.type === 'file'
            ? '/files'
            : '/music';

      const icon = result.type === 'task'
        ? NotebookPen
        : result.type === 'note'
          ? FileText
          : result.type === 'file'
            ? Folder
            : Music2;

      return {
        id: `${result.type}-${result.id}`,
        title: result.title,
        subtitle: `Открыть раздел ${result.type}`,
        icon,
        run: () => {
          close();
          router.push(href);
        }
      };
    });

    return [...items, ...navigationItems, ...entityItems];
  }, [addNote, addTask, close, query, queryAll, router]);

  useEffect(() => {
    if (!open) return;
    setSelectedIndex(0);
  }, [open, query]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (!actionItems.length) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((current) => (current + 1) % actionItems.length);
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((current) => (current - 1 + actionItems.length) % actionItems.length);
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        actionItems[selectedIndex]?.run();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [actionItems, open, selectedIndex]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden w-full items-center justify-between rounded-xl border border-fg/10 bg-panel/70 px-3 py-2 text-sm text-fg/65 transition hover:border-accent/35 hover:text-fg md:flex"
      >
        <span className="flex items-center gap-2">
          <Command size={15} />
          Command palette
        </span>
        <span className="rounded-md bg-muted px-2 py-1 text-xs">⌘K</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center bg-black/40 p-3 pt-24 backdrop-blur-sm md:p-6 md:pt-24">
      <button type="button" aria-label="Закрыть command palette" className="absolute inset-0 cursor-default" onClick={close} />
      <div className="glass relative z-[91] w-full max-w-2xl rounded-3xl p-4 shadow-glow">
        <div className="flex items-center gap-3 rounded-2xl border border-fg/10 bg-panel/70 px-4 py-3">
          <Search size={18} className="text-fg/50" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Искать, перейти, создать задачу или заметку..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-fg/45"
          />
        </div>

        <div className="mt-4 flex items-center justify-between px-1 text-xs text-fg/55">
          <span>Стрелки для навигации, Enter для действия.</span>
          <span>Esc для закрытия</span>
        </div>

        <div className="mt-3 max-h-[60vh] space-y-2 overflow-y-auto">
          {actionItems.length ? (
            actionItems.map((item, index) => {
              const Icon = item.icon;
              const active = index === selectedIndex;

              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={item.run}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${active ? 'bg-accent text-white' : 'bg-muted/40 hover:bg-muted/70'}`}
                >
                  <span className={`rounded-xl p-2 ${active ? 'bg-white/15' : 'bg-panel/70'}`}>
                    <Icon size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{item.title}</span>
                    <span className={`block truncate text-xs ${active ? 'text-white/75' : 'text-fg/60'}`}>{item.subtitle}</span>
                  </span>
                </button>
              );
            })
          ) : (
            <div className="rounded-2xl bg-muted/40 p-5 text-sm text-fg/65">
              Ничего не найдено. Попробуйте название задачи, заметки или команды перехода.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
