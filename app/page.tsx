'use client';

import Link from 'next/link';
import { useWorkspace } from '@/components/workspace-provider';

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-2xl p-5 shadow-glow">
      <h2 className="mb-4 text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function HomePage() {
  const { state } = useWorkspace();

  return (
    <div className="space-y-4">
      <section className="glass rounded-3xl p-6 md:p-10">
        <p className="text-sm text-fg/60">Digital sanctuary</p>
        <h1 className="mt-2 text-3xl font-semibold md:text-5xl">Добро пожаловать в Personal Space</h1>
        <p className="mt-3 max-w-2xl text-fg/70">Центр контроля жизни: задачи, заметки, файлы и музыка в одном спокойном премиальном пространстве.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/tasks" className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white shadow-glow">Новая задача</Link>
          <Link href="/notes" className="rounded-xl bg-muted px-4 py-2 text-sm font-medium">Новая заметка</Link>
          <Link href="/files" className="rounded-xl bg-muted px-4 py-2 text-sm font-medium">Загрузить файл</Link>
          <Link href="/music" className="rounded-xl bg-muted px-4 py-2 text-sm font-medium">Добавить трек</Link>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Ближайшие задачи">
          <ul className="space-y-2">
            {state.tasks.slice(0, 4).map((task) => (
              <li key={task.id} className="rounded-xl bg-muted/50 p-3">
                {task.title} <span className="text-fg/60">{task.due ?? 'Без дедлайна'}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Закрепленные заметки">
          <div className="grid gap-2 md:grid-cols-2">
            {state.notes.filter((note) => note.pinned).map((note) => (
              <article key={note.id} className="rounded-xl bg-gradient-to-br from-violet-500/15 to-cyan-500/15 p-3">{note.title}</article>
            ))}
          </div>
        </Panel>
        <Panel title="Недавние файлы">
          <ul className="space-y-2">{state.files.slice(0, 4).map((file) => <li key={file.id} className="rounded-xl bg-muted/50 p-3">{file.name} · {file.updatedAt}</li>)}</ul>
        </Panel>
        <Panel title="Слушали недавно">
          <ul className="space-y-2">{state.tracks.slice(0, 4).map((track) => <li key={track.id} className="rounded-xl bg-muted/50 p-3">{track.title} — {track.artist} <span className="text-fg/60">{track.duration}</span></li>)}</ul>
        </Panel>
      </div>
    </div>
  );
}
