'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowRight, CheckCircle2, MoonStar, RotateCcw, Sunrise, Inbox } from 'lucide-react';
import { useWorkspace } from '@/components/workspace-provider';

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="glass rounded-2xl p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-fg/65">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function ShutdownPage() {
  const { state, updateTask, toggleFocusTask } = useWorkspace();

  const todayTasks = useMemo(() => state.tasks.filter((task) => task.status === 'today'), [state.tasks]);
  const inboxTasks = useMemo(() => state.tasks.filter((task) => task.status === 'inbox'), [state.tasks]);
  const upcomingTasks = useMemo(() => state.tasks.filter((task) => task.status === 'upcoming'), [state.tasks]);
  const unfinishedToday = todayTasks.filter((task) => task.status !== 'completed');
  const tomorrowCandidates = [...upcomingTasks, ...inboxTasks].slice(0, 5);
  const focusTaskIds = state.settings.focusTaskIds;

  return (
    <div className="space-y-4">
      <section className="glass rounded-3xl p-6 md:p-10">
        <p className="text-sm text-fg/60">Shutdown ritual</p>
        <h1 className="mt-2 text-3xl font-semibold md:text-5xl">Закрыть день спокойно и не тащить хаос в завтра</h1>
        <p className="mt-3 max-w-3xl text-fg/70">Вечерний ритуал должен отвечать на три вопроса: что закрыто, что нужно сознательно перенести, и с чем должен начаться следующий день.</p>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-panel/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-fg/55">Today open</p>
            <p className="mt-2 text-3xl font-semibold">{unfinishedToday.length}</p>
          </div>
          <div className="rounded-2xl bg-panel/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-fg/55">Inbox left</p>
            <p className="mt-2 text-3xl font-semibold">{inboxTasks.length}</p>
          </div>
          <div className="rounded-2xl bg-panel/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-fg/55">Tomorrow pool</p>
            <p className="mt-2 text-3xl font-semibold">{tomorrowCandidates.length}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Закрыть сегодняшние открытые петли" subtitle="Если задача не будет завершена сегодня, решение должно быть явным: закрыть, перенести или оставить в текущем фокусе осознанно.">
          <div className="space-y-3">
            {unfinishedToday.map((task) => (
              <div key={task.id} className="rounded-2xl bg-muted/40 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-fg/60">{task.note ?? 'Уточни execution note, если задача останется с тобой завтра.'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => updateTask(task.id, { status: 'completed' })} className="rounded-xl bg-accent px-3 py-2 text-xs text-white">Закрыть</button>
                    <button type="button" onClick={() => updateTask(task.id, { status: 'upcoming' })} className="rounded-xl bg-panel px-3 py-2 text-xs">Перенести</button>
                    <button type="button" onClick={() => updateTask(task.id, { status: 'today' })} className="rounded-xl bg-panel px-3 py-2 text-xs">Оставить</button>
                  </div>
                </div>
              </div>
            ))}
            {!unfinishedToday.length ? <p className="text-sm text-fg/65">Today пуст или уже завершён — отличный знак для спокойного завершения дня.</p> : null}
          </div>
        </Section>

        <Section title="Очистить остатки inbox" subtitle="Shutdown хорош, когда завтра не начинается с новой кучи неопределённости.">
          <div className="space-y-3">
            {inboxTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="rounded-2xl bg-muted/40 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-fg/60">Реши: это нужно завтра, позже или уже неактуально.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => updateTask(task.id, { status: 'today' })} className="rounded-xl bg-accent px-3 py-2 text-xs text-white">В tomorrow focus</button>
                    <button type="button" onClick={() => updateTask(task.id, { status: 'upcoming' })} className="rounded-xl bg-panel px-3 py-2 text-xs">Later</button>
                    <button type="button" onClick={() => updateTask(task.id, { status: 'completed' })} className="rounded-xl bg-panel px-3 py-2 text-xs">Done</button>
                  </div>
                </div>
              </div>
            ))}
            {!inboxTasks.length ? <p className="text-sm text-fg/65">Inbox уже чист — значит утро начнётся с выбора, а не с разборки.</p> : null}
          </div>
        </Section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <Section title="Выбери старт завтрашнего дня" subtitle="Сильный shutdown заканчивается заранее выбранным стартом, а не надеждой ‘утром разберусь’.">
          <div className="space-y-3">
            {tomorrowCandidates.map((task) => (
              <div key={task.id} className="rounded-2xl bg-muted/40 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-fg/60">{task.status} · {task.due ?? 'Без дедлайна'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => updateTask(task.id, { status: 'today' })} className="rounded-xl bg-accent px-3 py-2 text-xs text-white">Сделать первым завтра</button>
                    <button type="button" onClick={() => toggleFocusTask(task.id)} className={`rounded-xl px-3 py-2 text-xs ${focusTaskIds.includes(task.id) ? 'bg-violet-500 text-white' : 'bg-panel'}`}>
                      {focusTaskIds.includes(task.id) ? 'Убрать из Top 3' : 'Добавить в Top 3'}
                    </button>
                    <button type="button" onClick={() => updateTask(task.id, { status: 'upcoming' })} className="rounded-xl bg-panel px-3 py-2 text-xs">Оставить в backlog</button>
                  </div>
                </div>
              </div>
            ))}
            {!tomorrowCandidates.length ? <p className="text-sm text-fg/65">Нет кандидатов на завтра — можно создать одну намеренную задачу через Quick Capture и не перегружать себя.</p> : null}
          </div>
        </Section>

        <Section title="Ритуал завершения" subtitle="Небольшая структура снижает вечернюю тревожность и помогает мозгу отпустить незавершённое.">
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-4"><CheckCircle2 size={18} className="text-emerald-500" /> Заверши или осознанно перенеси всё из today.</div>
            <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-4"><Inbox size={18} className="text-accent" /> Не оставляй inbox без решения на утро.</div>
            <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-4"><Sunrise size={18} className="text-amber-500" /> Выбери один стартовый next step на завтра.</div>
            <div className="flex items-center gap-3 rounded-2xl bg-muted/40 p-4"><MoonStar size={18} className="text-violet-500" /> Закрой приложение с чувством завершённости, а не долга.</div>
          </div>
        </Section>
      </div>

      <Section title="Что дальше" subtitle="Shutdown должен мягко переводить в завтрашнюю ясность и еженедельную рефлексию.">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between rounded-2xl bg-gradient-to-br from-violet-500/15 to-cyan-500/15 p-4">
          <p className="text-sm text-fg/70">Если день завершён, следующий сильный шаг — weekly review или спокойный старт с Today dashboard утром.</p>
          <div className="flex flex-wrap gap-2">
            <Link href="/review" className="rounded-xl bg-accent px-4 py-2 text-sm text-white">Перейти в weekly review</Link>
            <Link href="/" className="inline-flex items-center gap-2 rounded-xl bg-panel px-4 py-2 text-sm">Вернуться на dashboard <ArrowRight size={14} /></Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
