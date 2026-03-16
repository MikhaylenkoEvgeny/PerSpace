'use client';

import { useState } from 'react';
import { useWorkspace } from '@/components/workspace-provider';

export default function NotesPage() {
  const { state, addNote, pinNote } = useWorkspace();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

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

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {state.notes.map((note) => (
          <article key={note.id} className="glass rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <h2 className="font-semibold">{note.title}</h2>
              <button onClick={() => pinNote(note.id)} className={`rounded-md px-2 py-1 text-xs ${note.pinned ? 'bg-accent text-white' : 'bg-muted'}`}>
                {note.pinned ? 'Pinned' : 'Pin'}
              </button>
            </div>
            <p className="mt-2 text-sm text-fg/75">{note.content}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
