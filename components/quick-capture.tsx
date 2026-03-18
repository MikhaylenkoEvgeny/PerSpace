'use client';

import { useEffect, useState } from 'react';
import { Plus, NotebookPen, FileText, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useWorkspace } from '@/components/workspace-provider';

export function QuickCapture() {
  const router = useRouter();
  const { addTask, addNote } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'task' | 'note'>('task');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'j') {
        event.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const reset = () => {
    setTitle('');
    setContent('');
    setMode('task');
    setOpen(false);
  };

  const submit = () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (mode === 'task') {
      if (!trimmedTitle) return;
      addTask(trimmedTitle);
      reset();
      router.push('/tasks');
      return;
    }

    if (!trimmedTitle && !trimmedContent) return;
    addNote(trimmedTitle || 'Быстрая заметка', trimmedContent);
    reset();
    router.push('/notes');
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="glass fixed bottom-24 right-4 z-40 inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium shadow-glow transition hover:-translate-y-0.5 md:bottom-6 md:right-6"
      >
        <Plus size={16} />
        Quick capture
      </button>

      {open ? (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/45 p-3 backdrop-blur-sm md:p-6">
          <button type="button" className="absolute inset-0 cursor-default" aria-label="Закрыть quick capture" onClick={reset} />
          <div className="glass relative z-[96] w-full max-w-xl rounded-3xl p-5 shadow-glow">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-fg/55">Quick capture</p>
                <h2 className="mt-1 text-xl font-semibold">Сохранить мысль до того, как она потеряется</h2>
              </div>
              <button type="button" onClick={reset} className="rounded-xl bg-muted p-2 text-fg/70 hover:text-fg">
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setMode('task')}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${mode === 'task' ? 'bg-accent text-white' : 'bg-muted'}`}
              >
                <NotebookPen size={16} />
                Task
              </button>
              <button
                type="button"
                onClick={() => setMode('note')}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${mode === 'note' ? 'bg-accent text-white' : 'bg-muted'}`}
              >
                <FileText size={16} />
                Note
              </button>
              <span className="ml-auto self-center text-xs text-fg/55">⌘J / Ctrl+J</span>
            </div>

            <div className="mt-4 space-y-3">
              <input
                autoFocus
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder={mode === 'task' ? 'Например: Позвонить Андрею завтра в 15:00' : 'Заголовок заметки'}
                className="w-full rounded-2xl border border-fg/10 bg-panel/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/35"
              />

              {mode === 'note' ? (
                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Быстрый контекст, мысли, ссылка на идею..."
                  className="min-h-32 w-full rounded-2xl border border-fg/10 bg-panel/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/35"
                />
              ) : (
                <div className="rounded-2xl bg-muted/40 p-4 text-sm text-fg/65">
                  Задача сразу попадёт в inbox. На следующем шаге её можно будет разложить через triage flow.
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={reset} className="rounded-xl bg-muted px-4 py-2 text-sm">
                Отмена
              </button>
              <button type="button" onClick={submit} className="rounded-xl bg-accent px-4 py-2 text-sm text-white">
                {mode === 'task' ? 'Создать задачу' : 'Создать заметку'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
