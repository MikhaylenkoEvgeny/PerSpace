'use client';

import { useMemo, useState } from 'react';
import { useWorkspace } from '@/components/workspace-provider';

export default function NotesPage() {
  const { state, addNote, updateNote, pinNote, removeNote } = useWorkspace();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [query, setQuery] = useState('');

  const visibleNotes = useMemo(
    () => state.notes.filter((note) => `${note.title} ${note.content}`.toLowerCase().includes(query.toLowerCase())),
    [query, state.notes]
  );

  return (
    <div className="page-shell">
      <header className="page-header">
        <p className="text-sm font-medium text-fg/50">Notes</p>
        <h1 className="page-title">Тихий список заметок вместо шумной доски.</h1>
        <p className="page-subtitle">Оставляем только поиск, создание и редактирование. Никаких лишних визуальных слоёв.</p>
      </header>

      <section className="surface p-5 md:p-6">
        <div className="grid gap-3 md:grid-cols-[220px_1fr_auto]">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Заголовок" className="h-11 rounded-xl border border-fg/10 bg-transparent px-4 text-sm outline-none focus:ring-2 focus:ring-accent/25" />
          <input value={content} onChange={(e) => setContent(e.target.value)} placeholder="Короткая мысль или заметка" className="h-11 rounded-xl border border-fg/10 bg-transparent px-4 text-sm outline-none focus:ring-2 focus:ring-accent/25" />
          <button onClick={() => { addNote(title, content); setTitle(''); setContent(''); }} className="h-11 rounded-xl bg-fg px-4 text-sm font-medium text-white">Create</button>
        </div>
        <div className="mt-3">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search notes" className="h-11 w-full rounded-xl border border-fg/10 bg-transparent px-4 text-sm outline-none focus:ring-2 focus:ring-accent/25" />
        </div>
      </section>

      <section className="surface p-5 md:p-6">
        <div className="space-y-3">
          {visibleNotes.map((note) => (
            <article key={note.id} className="rounded-xl border border-fg/10 px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <input
                    value={note.title}
                    onChange={(event) => updateNote(note.id, { title: event.target.value || 'Без названия' })}
                    className="w-full bg-transparent text-base font-semibold outline-none"
                  />
                  <textarea
                    value={note.content}
                    onChange={(event) => updateNote(note.id, { content: event.target.value })}
                    className="mt-2 min-h-24 w-full resize-none bg-transparent text-sm leading-6 text-fg/72 outline-none"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-fg/55">
                  <button onClick={() => pinNote(note.id)}>{note.pinned ? 'Unpin' : 'Pin'}</button>
                  <button onClick={() => removeNote(note.id)} className="text-red-600">Delete</button>
                </div>
              </div>
            </article>
          ))}
          {!visibleNotes.length ? <p className="text-sm text-fg/55">Ничего не найдено. Это хорошо: экран остаётся тихим и читаемым.</p> : null}
        </div>
      </section>
    </div>
  );
}
