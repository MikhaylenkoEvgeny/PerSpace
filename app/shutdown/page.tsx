'use client';

import Link from 'next/link';
import { useWorkspace } from '@/components/workspace-provider';

function Step({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="surface p-5 md:p-6">
      <h2 className="text-lg font-semibold tracking-[-0.02em]">{title}</h2>
      <p className="mt-1 text-sm text-fg/58">{description}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function ShutdownPage() {
  const { state, updateTask, toggleFocusTask } = useWorkspace();
  const todayTasks = state.tasks.filter((task) => task.status === 'today');
  const inboxTasks = state.tasks.filter((task) => task.status === 'inbox');
  const tomorrowCandidates = state.tasks.filter((task) => task.status === 'upcoming' || task.status === 'inbox').slice(0, 5);

  return (
    <div className="page-shell">
      <header className="page-header">
        <p className="text-sm font-medium text-fg/50">Shutdown</p>
        <h1 className="page-title">Спокойно закрыть день и подготовить ясное завтра.</h1>
        <p className="page-subtitle">Только три действия: закрыть открытые петли, очистить inbox, выбрать старт завтрашнего дня.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <Step title="1. Today" description="Что закрыть или осознанно перенести.">
          <div className="space-y-2">
            {todayTasks.map((task) => (
              <div key={task.id} className="rounded-xl border border-fg/10 px-4 py-3">
                <p className="font-medium">{task.title}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => updateTask(task.id, { status: 'completed' })} className="h-9 rounded-lg bg-fg px-3 text-sm text-white">Done</button>
                  <button type="button" onClick={() => updateTask(task.id, { status: 'upcoming' })} className="h-9 rounded-lg bg-muted px-3 text-sm text-fg/75">Move</button>
                </div>
              </div>
            ))}
          </div>
        </Step>

        <Step title="2. Inbox" description="Не оставлять неопределённость на утро.">
          <div className="space-y-2">
            {inboxTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="rounded-xl border border-fg/10 px-4 py-3">
                <p className="font-medium">{task.title}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => updateTask(task.id, { status: 'today' })} className="h-9 rounded-lg bg-fg px-3 text-sm text-white">Tomorrow</button>
                  <button type="button" onClick={() => updateTask(task.id, { status: 'upcoming' })} className="h-9 rounded-lg bg-muted px-3 text-sm text-fg/75">Later</button>
                </div>
              </div>
            ))}
          </div>
        </Step>

        <Step title="3. First task tomorrow" description="Выбери один ясный старт.">
          <div className="space-y-2">
            {tomorrowCandidates.map((task) => (
              <div key={task.id} className="rounded-xl border border-fg/10 px-4 py-3">
                <p className="font-medium">{task.title}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => updateTask(task.id, { status: 'today' })} className="h-9 rounded-lg bg-fg px-3 text-sm text-white">Make first</button>
                  <button type="button" onClick={() => toggleFocusTask(task.id)} className="h-9 rounded-lg bg-muted px-3 text-sm text-fg/75">Top 3</button>
                </div>
              </div>
            ))}
          </div>
        </Step>
      </div>

      <div className="flex justify-end">
        <Link href="/" className="inline-flex h-10 items-center rounded-xl bg-fg px-4 text-sm font-medium text-white">Вернуться на Home</Link>
      </div>
    </div>
  );
}
