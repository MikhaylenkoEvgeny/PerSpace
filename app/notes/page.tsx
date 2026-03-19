'use client';

import { useMemo, useState } from 'react';
import { useWorkspace } from '@/components/workspace-provider';

export default function NotesPage() {
  const { state, addNote, updateNote, pinNote, removeNote } = useWorkspace();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [query, setQuery] = useState('');

  const visibleNotes = useMemo(() => state.notes.filter((note) => `${note.title} ${note.content}`.toLowerCase().includes(query.toLowerCase())), [query, state.notes]);

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-6">
        <h1 className="text-2xl font-semibold">Notes</h1>
        <p className="mt-2 text-fg/70">Карточки заметок с pin, autosave-style поведением и мягкой визуальной иерархией.</p>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Заголовок" className="rounded-xl border border-fg/15 bg-panel px-3 py-2 outline-none focus:ring-2 focus:ring-accent/50" />
          <button onClick={() => { addNote(title, content); setTitle(''); setContent(''); }} className="rounded-xl bg-accent px-4 py-2 text-white">Создать карточку</button>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Содержание..." className="md:col-span-2 min-h-28 rounded-xl border border-fg/15 bg-panel px-3 py-2 outline-none focus:ring-2 focus:ring-accent/50" />
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Editable note board</h2>
            <p className="text-sm text-fg/65">Каждая карточка редактируется прямо на месте и сохраняется автоматически.</p>
          </div>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск по заметкам" className="w-full max-w-sm rounded-xl border border-fg/15 bg-panel px-3 py-2 outline-none focus:ring-2 focus:ring-accent/50" />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {visibleNotes.map((note) => (
          <article key={note.id} className="glass rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-fg/55">{note.pinned ? 'Pinned note' : 'Note'}</p>
                <p className="mt-1 text-xs text-fg/50">Autosave active</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => pinNote(note.id)} className={`rounded-md px-2 py-1 text-xs ${note.pinned ? 'bg-accent text-white' : 'bg-muted'}`}>
                  {note.pinned ? 'Pinned' : 'Pin'}
                </button>
                <button onClick={() => removeNote(note.id)} className="rounded-md border border-red-300 bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                  Удалить
                </button>
              </div>
            </div>

            <input
              value={note.title}
              onChange={(event) => updateNote(note.id, { title: event.target.value || 'Без названия' })}
              className="mt-4 w-full bg-transparent text-lg font-semibold outline-none"
            />
            <textarea
              value={note.content}
              onChange={(event) => updateNote(note.id, { content: event.target.value })}
              className="mt-3 min-h-40 w-full resize-none rounded-2xl border border-fg/10 bg-panel/60 px-3 py-3 text-sm text-fg/75 outline-none focus:ring-2 focus:ring-accent/35"
            />

            <div className="mt-3 flex items-center justify-between text-xs text-fg/55">
              <span>Autosave active</span>
              <span>{note.tags.length ? note.tags.join(', ') : 'Без тегов'}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
