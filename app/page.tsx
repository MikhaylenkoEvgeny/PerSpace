'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, Sparkles } from 'lucide-react';
import { useWorkspace } from '@/components/workspace-provider';

function Panel({ title, children, eyebrow }: { title: string; eyebrow?: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-2xl p-5 shadow-glow">
      {eyebrow ? <p className="text-xs uppercase tracking-[0.2em] text-fg/55">{eyebrow}</p> : null}
      <h2 className="mb-4 mt-1 text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function HomePage() {
  const { state, updateTask, toggleFocusTask } = useWorkspace();

  const todayTasks = useMemo(() => state.tasks.filter((task) => task.status === 'today'), [state.tasks]);
  const inboxTasks = useMemo(() => state.tasks.filter((task) => task.status === 'inbox'), [state.tasks]);
  const upcomingTasks = useMemo(() => state.tasks.filter((task) => task.status === 'upcoming'), [state.tasks]);
  const completedTasks = useMemo(() => state.tasks.filter((task) => task.status === 'completed'), [state.tasks]);
  const pinnedNotes = useMemo(() => state.notes.filter((note) => note.pinned), [state.notes]);
  const focusTask = todayTasks[0] ?? inboxTasks[0] ?? state.tasks[0];
  const topFocusTasks = state.settings.focusTaskIds
    .map((taskId) => state.tasks.find((task) => task.id === taskId))
    .filter((task): task is NonNullable<typeof task> => Boolean(task));

  const moveTask = (taskId: string, status: 'today' | 'upcoming' | 'completed') => {
    updateTask(taskId, { status });
  };

  return (
    <div className="space-y-4">
      <section className="glass rounded-3xl p-6 md:p-10">
        <p className="text-sm text-fg/60">Today operating view</p>
        <h1 className="mt-2 text-3xl font-semibold md:text-5xl">Не просто список — а ясный план дня</h1>
        <p className="mt-3 max-w-2xl text-fg/70">Главный экран теперь отвечает на три вопроса: что важно сегодня, что нужно разложить из inbox и что уже движется в правильном направлении.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-panel/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-fg/55">Today</p>
            <p className="mt-2 text-3xl font-semibold">{todayTasks.length}</p>
            <p className="mt-1 text-sm text-fg/65">задач в фокусе</p>
          </div>
          <div className="rounded-2xl bg-panel/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-fg/55">Inbox</p>
            <p className="mt-2 text-3xl font-semibold">{inboxTasks.length}</p>
            <p className="mt-1 text-sm text-fg/65">нужно разложить</p>
          </div>
          <div className="rounded-2xl bg-panel/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-fg/55">Momentum</p>
            <p className="mt-2 text-3xl font-semibold">{completedTasks.length}</p>
            <p className="mt-1 text-sm text-fg/65">уже завершено</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/tasks" className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white shadow-glow">Открыть triage</Link>
          <Link href="/notes" className="rounded-xl bg-muted px-4 py-2 text-sm font-medium">Открыть заметки</Link>
          <Link href="/search" className="rounded-xl bg-muted px-4 py-2 text-sm font-medium">Command search</Link>
          <Link href="/review" className="rounded-xl bg-muted px-4 py-2 text-sm font-medium">Weekly review</Link>
          <Link href="/shutdown" className="rounded-xl bg-muted px-4 py-2 text-sm font-medium">Shutdown ritual</Link>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Panel title="Фокус дня" eyebrow="Priority now">
          {focusTask ? (
            <div className="rounded-2xl bg-gradient-to-br from-violet-500/15 to-cyan-500/15 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-fg/55">Suggested next task</p>
                  <h3 className="mt-2 text-xl font-semibold">{focusTask.title}</h3>
                  <p className="mt-2 text-sm text-fg/70">{focusTask.note ?? 'Добавь execution note, чтобы превратить задачу в конкретный next step.'}</p>
                </div>
                <Sparkles size={18} className="shrink-0 text-accent" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-fg/70">
                <span className="rounded-xl bg-panel/70 px-3 py-2">{focusTask.status}</span>
                <span className="rounded-xl bg-panel/70 px-3 py-2">{focusTask.priority}</span>
                <span className="rounded-xl bg-panel/70 px-3 py-2">{focusTask.due ?? 'Без дедлайна'}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-fg/65">Пока нет задач. Захвати первую через Quick Capture или Tasks.</p>
          )}
        </Panel>

        <Panel title="Ритм недели" eyebrow="Signals">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl bg-muted/40 p-3">
              <span className="inline-flex items-center gap-2"><CalendarDays size={16} /> Upcoming</span>
              <strong>{upcomingTasks.length}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-muted/40 p-3">
              <span className="inline-flex items-center gap-2"><Clock3 size={16} /> Inbox to triage</span>
              <strong>{inboxTasks.length}</strong>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-muted/40 p-3">
              <span className="inline-flex items-center gap-2"><CheckCircle2 size={16} /> Completed</span>
              <strong>{completedTasks.length}</strong>
            </div>
          </div>
        </Panel>
      </div>


      <Panel title="Top 3 focus" eyebrow="Tomorrow / today commitment">
        <div className="space-y-3">
          {topFocusTasks.map((task, index) => (
            <div key={task.id} className="flex items-center justify-between rounded-2xl bg-muted/40 p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-fg/55">Focus slot {index + 1}</p>
                <p className="mt-1 font-medium">{task.title}</p>
                <p className="text-sm text-fg/60">{task.status} · {task.due ?? 'Без дедлайна'}</p>
              </div>
              <button type="button" onClick={() => toggleFocusTask(task.id)} className="rounded-xl bg-panel px-3 py-2 text-xs">Убрать</button>
            </div>
          ))}
          {!topFocusTasks.length ? <p className="text-sm text-fg/65">Пока не выбран Top 3. Отметь до трёх задач на shutdown ritual или на странице задач.</p> : null}
        </div>
      </Panel>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Inbox triage" eyebrow="60-second ritual">
          <div className="space-y-3">
            {inboxTasks.slice(0, 4).map((task) => (
              <div key={task.id} className="rounded-2xl bg-muted/40 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="mt-1 text-sm text-fg/60">{task.note ?? 'Определи: это нужно сегодня, позже или можно закрыть?'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => moveTask(task.id, 'today')} className="rounded-xl bg-accent px-3 py-2 text-xs text-white">Today</button>
                    <button type="button" onClick={() => moveTask(task.id, 'upcoming')} className="rounded-xl bg-panel px-3 py-2 text-xs">Upcoming</button>
                    <button type="button" onClick={() => moveTask(task.id, 'completed')} className="rounded-xl bg-panel px-3 py-2 text-xs">Done</button>
                  </div>
                </div>
              </div>
            ))}
            {!inboxTasks.length ? <p className="text-sm text-fg/65">Inbox пуст — хороший сигнал. Можно перейти к today или weekly review.</p> : null}
            {inboxTasks.length ? <Link href="/review" className="inline-flex items-center gap-2 text-sm text-accent">Открыть weekly review <ArrowRight size={14} /></Link> : null}
          </div>
        </Panel>

        <Panel title="Pinned context" eyebrow="What supports execution">
          <div className="space-y-3">
            {pinnedNotes.slice(0, 3).map((note) => (
              <article key={note.id} className="rounded-2xl bg-gradient-to-br from-violet-500/15 to-cyan-500/15 p-4">
                <h3 className="font-medium">{note.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-fg/70">{note.content}</p>
              </article>
            ))}
            {!pinnedNotes.length ? <p className="text-sm text-fg/65">Пока нет pinned notes. Закрепи заметку, чтобы она работала как постоянный контекст для недели.</p> : null}
          </div>
        </Panel>
      </div>

      <Panel title="Recent library context" eyebrow="Files + music">
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-fg/70">Недавние файлы</h3>
            <ul className="space-y-2">{state.files.slice(0, 4).map((file) => <li key={file.id} className="flex items-center justify-between rounded-xl bg-muted/40 p-3 text-sm"><span>{file.name}</span><span className="text-fg/55">{file.updatedAt}</span></li>)}</ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-fg/70">Слушали недавно</h3>
            <ul className="space-y-2">{state.tracks.slice(0, 4).map((track) => <li key={track.id} className="flex items-center justify-between rounded-xl bg-muted/40 p-3 text-sm"><span>{track.title} — {track.artist}</span><ArrowRight size={14} className="text-fg/45" /></li>)}</ul>
          </div>
        </div>
      </Panel>
    </div>
  );
}
