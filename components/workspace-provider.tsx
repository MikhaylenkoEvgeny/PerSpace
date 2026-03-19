'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { seedState } from '@/lib/seed';
import type { NoteItem, SettingsState, TaskItem, WorkspaceState } from '@/lib/types';

interface WorkspaceContextValue {
  state: WorkspaceState;
  addTask: (title: string) => void;
  updateTask: (id: string, patch: Partial<TaskItem>) => void;
  toggleTask: (id: string) => void;
  removeTask: (id: string) => void;
  addNote: (title: string, content: string) => void;
  updateNote: (id: string, patch: Partial<NoteItem>) => void;
  pinNote: (id: string) => void;
  removeNote: (id: string) => void;
  updateSettings: (patch: Partial<SettingsState>) => void;
  toggleFocusTask: (id: string) => void;
  queryAll: (query: string) => Array<{ type: string; id: string; title: string }>;
}

const STORAGE_KEY = 'perspace-state-v3';
const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WorkspaceState>(seedState);
  const [hydrated, setHydrated] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      try {
        const response = await fetch('/perSpace/api/workspace', { cache: 'no-store' });
        if (!response.ok) throw new Error('server_hydration_failed');
        const data = (await response.json()) as { state: WorkspaceState };
        if (mounted) {
          setState(data.state);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.state));
        }
      } catch {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw && mounted) {
          try {
            setState(JSON.parse(raw));
          } catch {
            localStorage.removeItem(STORAGE_KEY);
          }
        }
      } finally {
        if (mounted) setHydrated(true);
      }
    };

    hydrate();
    return () => {
      mounted = false;
    };
  }, []);


  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolvedTheme = state.settings.theme === 'system'
      ? (prefersDark ? 'dark' : 'light')
      : state.settings.theme;

    root.classList.toggle('dark', resolvedTheme === 'dark');
    root.classList.toggle('reduce-motion', state.settings.reducedMotion);
    root.style.colorScheme = resolvedTheme;
  }, [state.settings.theme, state.settings.reducedMotion]);

  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      fetch('/perSpace/api/workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state })
      }).catch(() => {
        // silent fallback to localStorage in poor network conditions
      });
    }, 500);

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [state, hydrated]);

  const addTask = useCallback((title: string) => {
    if (!title.trim()) return;
    const task: TaskItem = {
      id: crypto.randomUUID(),
      title,
      priority: 'medium',
      status: 'inbox',
      tags: []
    };
    setState((prev) => ({ ...prev, tasks: [task, ...prev.tasks] }));
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<TaskItem>) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => (task.id === id ? { ...task, ...patch } : task))
    }));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.id === id ? { ...task, status: task.status === 'completed' ? 'today' : 'completed' } : task
      )
    }));
  }, []);

  const removeTask = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => task.id !== id),
      settings: {
        ...prev.settings,
        focusTaskIds: prev.settings.focusTaskIds.filter((taskId) => taskId !== id)
      }
    }));
  }, []);

  const addNote = useCallback((title: string, content: string) => {
    const note: NoteItem = {
      id: crypto.randomUUID(),
      title: title || 'Без названия',
      content,
      pinned: false,
      color: 'slate',
      tags: []
    };
    setState((prev) => ({ ...prev, notes: [note, ...prev.notes] }));
  }, []);

  const updateNote = useCallback((id: string, patch: Partial<NoteItem>) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((note) => (note.id === id ? { ...note, ...patch } : note))
    }));
  }, []);

  const pinNote = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.map((note) => (note.id === id ? { ...note, pinned: !note.pinned } : note))
    }));
  }, []);

  const removeNote = useCallback((id: string) => {
    setState((prev) => ({ ...prev, notes: prev.notes.filter((note) => note.id !== id) }));
  }, []);

  const updateSettings = useCallback((patch: Partial<SettingsState>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...patch }
    }));
  }, []);

  const toggleFocusTask = useCallback((id: string) => {
    setState((prev) => {
      const alreadyFocused = prev.settings.focusTaskIds.includes(id);
      const focusTaskIds = alreadyFocused
        ? prev.settings.focusTaskIds.filter((taskId) => taskId !== id)
        : [...prev.settings.focusTaskIds.slice(-2), id];

      return {
        ...prev,
        settings: {
          ...prev.settings,
          focusTaskIds
        }
      };
    });
  }, []);

  const queryAll = useCallback((query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    return [
      ...state.tasks.map((task) => ({ type: 'task', id: task.id, title: task.title })),
      ...state.notes.map((note) => ({ type: 'note', id: note.id, title: note.title })),
      ...state.files.map((file) => ({ type: 'file', id: file.id, title: file.name })),
      ...state.tracks.map((track) => ({ type: 'music', id: track.id, title: `${track.title} — ${track.artist}` }))
    ].filter((item) => item.title.toLowerCase().includes(q));
  }, [state.tasks, state.notes, state.files, state.tracks]);

  const value = useMemo(
    () => ({
      state,
      addTask,
      updateTask,
      toggleTask,
      removeTask,
      addNote,
      updateNote,
      pinNote,
      removeNote,
      updateSettings,
      toggleFocusTask,
      queryAll
    }),
    [state, addTask, updateTask, toggleTask, removeTask, addNote, updateNote, pinNote, removeNote, updateSettings, toggleFocusTask, queryAll]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace must be used inside WorkspaceProvider');
  return context;
}
