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

export default function ReviewPage() {
  const { state, updateTask } = useWorkspace();
  const completed = state.tasks.filter((task) => task.status === 'completed');
  const neglected = state.tasks.filter((task) => task.status !== 'completed').slice(0, 5);
  const candidates = state.tasks.filter((task) => task.status !== 'completed').slice(0, 5);

  return (
    <div className="page-shell">
      <header className="page-header">
        <p className="text-sm font-medium text-fg/50">Weekly review</p>
        <h1 className="page-title">Три шага, чтобы закрыть неделю без ощущения хаоса.</h1>
        <p className="page-subtitle">Review больше не выглядит как аналитический дашборд. Только progress, neglected items и выбор следующего цикла.</p>
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <Step title="1. Что завершено" description="Зафиксируй движение, чтобы система ощущалась полезной.">
          <div className="space-y-2">
            {completed.slice(0, 5).map((task) => (
              <div key={task.id} className="rounded-xl border border-fg/10 px-4 py-3">
                <p className="font-medium">{task.title}</p>
              </div>
            ))}
            {!completed.length ? <p className="text-sm text-fg/55">Пока нет завершённых задач.</p> : null}
          </div>
        </Step>

        <Step title="2. Что зависло" description="Оставляем только те элементы, которые требуют решения.">
          <div className="space-y-2">
            {neglected.map((task) => (
              <div key={task.id} className="rounded-xl border border-fg/10 px-4 py-3">
                <p className="font-medium">{task.title}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => updateTask(task.id, { status: 'today' })} className="h-9 rounded-lg bg-fg px-3 text-sm text-white">Today</button>
                  <button type="button" onClick={() => updateTask(task.id, { status: 'upcoming' })} className="h-9 rounded-lg bg-muted px-3 text-sm text-fg/75">Later</button>
                </div>
              </div>
            ))}
          </div>
        </Step>

        <Step title="3. Что пойдёт дальше" description="Выбери несколько задач, которые реально получат внимание.">
          <div className="space-y-2">
            {candidates.map((task) => (
              <div key={task.id} className="rounded-xl border border-fg/10 px-4 py-3">
                <p className="font-medium">{task.title}</p>
                <button type="button" onClick={() => updateTask(task.id, { status: 'today' })} className="mt-3 h-9 rounded-lg bg-fg px-3 text-sm text-white">Move to today</button>
              </div>
            ))}
          </div>
        </Step>
      </div>

      <div className="flex justify-end">
        <Link href="/shutdown" className="inline-flex h-10 items-center rounded-xl bg-fg px-4 text-sm font-medium text-white">Перейти к shutdown</Link>
      </div>
    </div>
  );
}
