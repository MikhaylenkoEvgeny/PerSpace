'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useWorkspace } from '@/components/workspace-provider';

function Panel({ title, children, eyebrow, action }: { title: string; children: React.ReactNode; eyebrow?: string; action?: React.ReactNode }) {
  return (
    <section className="surface p-5 md:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          {eyebrow ? <p className="text-xs uppercase tracking-[0.16em] text-fg/45">{eyebrow}</p> : null}
          <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em]">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export default function HomePage() {
  const { state, updateTask } = useWorkspace();

  const todayTasks = state.tasks.filter((task) => task.status === 'today');
  const inboxTasks = state.tasks.filter((task) => task.status === 'inbox');
  const focusTasks = state.settings.focusTaskIds
    .map((taskId) => state.tasks.find((task) => task.id === taskId))
    .filter((task): task is NonNullable<typeof task> => Boolean(task))
    .slice(0, 3);

  const primaryTask = focusTasks[0] ?? todayTasks[0] ?? inboxTasks[0] ?? state.tasks[0] ?? null;

  return (
    <div className="page-shell">
      <header className="page-header">
        <p className="text-sm font-medium text-fg/50">Today</p>
        <h1 className="page-title">Один спокойный экран, чтобы понять, что важно прямо сейчас.</h1>
        <p className="page-subtitle">Home больше не пытается быть всем сразу. Только фокус, только ближайшие задачи, только ясное следующее действие.</p>
      </header>

      <section className="surface p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-fg/50">Primary focus</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] md:text-4xl">
              {primaryTask ? primaryTask.title : 'Сегодня пока нет главной задачи'}
            </h2>
            <p className="mt-3 text-sm leading-6 text-fg/68">
              {primaryTask?.note ?? 'Собери одну meaningful задачу в Tasks или через Quick Capture и не распыляй внимание.'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/tasks" className="inline-flex h-10 items-center rounded-xl bg-fg px-4 text-sm font-medium text-white">
              Открыть Tasks
            </Link>
            <button
              type="button"
              onClick={() => primaryTask && updateTask(primaryTask.id, { status: 'completed' })}
              className="inline-flex h-10 items-center rounded-xl bg-muted px-4 text-sm font-medium text-fg/80"
              disabled={!primaryTask}
            >
              Завершить
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-3 md:grid-cols-3">
          <div className="surface-muted p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-fg/45">Today</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.03em]">{todayTasks.length}</p>
          </div>
          <div className="surface-muted p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-fg/45">Inbox</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.03em]">{inboxTasks.length}</p>
          </div>
          <div className="surface-muted p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-fg/45">Top 3</p>
            <p className="mt-2 text-3xl font-semibold tracking-[-0.03em]">{focusTasks.length}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Today list" action={<Link href="/tasks" className="text-sm text-fg/55 hover:text-fg">Open all</Link>}>
          <div className="space-y-2">
            {(todayTasks.length ? todayTasks : state.tasks.slice(0, 3)).map((task) => (
              <div key={task.id} className="flex items-center justify-between gap-3 rounded-xl border border-fg/10 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{task.title}</p>
                  <p className="mt-1 text-sm text-fg/55">{task.due ?? 'Без дедлайна'}</p>
                </div>
                <button type="button" onClick={() => updateTask(task.id, { status: 'completed' })} className="text-sm text-fg/55 hover:text-fg">
                  Done
                </button>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          title="Inbox needs triage"
          action={
            <Link href="/tasks" className="inline-flex items-center gap-1 text-sm text-fg/55 hover:text-fg">
              Open Tasks <ArrowRight size={14} />
            </Link>
          }
        >
          <div className="space-y-2">
            {inboxTasks.slice(0, 3).map((task) => (
              <div key={task.id} className="rounded-xl border border-fg/10 px-4 py-3">
                <p className="font-medium">{task.title}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => updateTask(task.id, { status: 'today' })} className="h-9 rounded-lg bg-fg px-3 text-sm text-white">
                    Today
                  </button>
                  <button type="button" onClick={() => updateTask(task.id, { status: 'upcoming' })} className="h-9 rounded-lg bg-muted px-3 text-sm text-fg/75">
                    Later
                  </button>
                </div>
              </div>
            ))}
            {!inboxTasks.length ? <p className="text-sm text-fg/55">Inbox пуст. Это именно то ощущение порядка, которое нужно сохранить.</p> : null}
          </div>
        </Panel>

        <Panel title="Recent library context" eyebrow="Files + music">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-fg/70">Недавние файлы</h3>
              <ul className="space-y-2">
                {state.files.slice(0, 4).map((file) => (
                  <li key={file.id} className="flex items-center justify-between rounded-xl bg-muted/40 p-3 text-sm">
                    <span>{file.name}</span>
                    <span className="text-fg/55">{file.updatedAt}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-fg/70">Слушали недавно</h3>
              <ul className="space-y-2">
                {state.tracks.slice(0, 4).map((track) => (
                  <li key={track.id} className="flex items-center justify-between rounded-xl bg-muted/40 p-3 text-sm">
                    <span>{track.title} — {track.artist}</span>
                    <ArrowRight size={14} className="text-fg/45" />
                  </li>
                ))}
              </ul>
            </div>
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
