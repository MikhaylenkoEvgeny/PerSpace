'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowRight, CheckCircle2, CircleDashed, Sparkles, Target } from 'lucide-react';
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

export default function ReviewPage() {
  const { state, updateTask } = useWorkspace();

  const completed = useMemo(() => state.tasks.filter((task) => task.status === 'completed'), [state.tasks]);
  const today = useMemo(() => state.tasks.filter((task) => task.status === 'today'), [state.tasks]);
  const upcoming = useMemo(() => state.tasks.filter((task) => task.status === 'upcoming'), [state.tasks]);
  const inbox = useMemo(() => state.tasks.filter((task) => task.status === 'inbox'), [state.tasks]);
  const pinnedNotes = useMemo(() => state.notes.filter((note) => note.pinned), [state.notes]);

  const neglected = [...inbox, ...upcoming.filter((task) => !task.due)].slice(0, 5);
  const nextWeekCandidates = [...upcoming, ...inbox].slice(0, 6);

  return (
    <div className="space-y-4">
      <section className="glass rounded-3xl p-6 md:p-10">
        <p className="text-sm text-fg/60">Weekly review</p>
        <h1 className="mt-2 text-3xl font-semibold md:text-5xl">Закрыть петли недели и выбрать, что важно дальше</h1>
        <p className="mt-3 max-w-3xl text-fg/70">Этот экран нужен не для отчётности, а для ясности: увидеть, что завершено, что зависло, что потеряло контекст и что стоит осознанно перенести в следующий цикл.</p>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <div className="rounded-2xl bg-panel/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-fg/55">Completed</p>
            <p className="mt-2 text-3xl font-semibold">{completed.length}</p>
          </div>
          <div className="rounded-2xl bg-panel/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-fg/55">Today</p>
            <p className="mt-2 text-3xl font-semibold">{today.length}</p>
          </div>
          <div className="rounded-2xl bg-panel/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-fg/55">Upcoming</p>
            <p className="mt-2 text-3xl font-semibold">{upcoming.length}</p>
          </div>
          <div className="rounded-2xl bg-panel/70 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-fg/55">Inbox</p>
            <p className="mt-2 text-3xl font-semibold">{inbox.length}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Что реально завершено" subtitle="Зафиксируй прогресс, чтобы система чувствовалась как движение, а не только как давление.">
          <div className="space-y-3">
            {completed.slice(0, 6).map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-2xl bg-muted/40 p-4">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-fg/60">{task.note ?? 'Без execution note'}</p>
                </div>
                <CheckCircle2 size={18} className="text-emerald-500" />
              </div>
            ))}
            {!completed.length ? <p className="text-sm text-fg/65">На этой неделе пока нет завершённых задач. Следующий шаг — собрать день в Today и закрыть хотя бы один meaningful loop.</p> : null}
          </div>
        </Section>

        <Section title="Зависшие или neglected" subtitle="Это задачи, которые потеряли импульс и требуют осознанного решения — убрать, отложить или вернуть в фокус.">
          <div className="space-y-3">
            {neglected.map((task) => (
              <div key={task.id} className="rounded-2xl bg-muted/40 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-fg/60">{task.note ?? 'Нет контекста — хороший кандидат на уточнение или перенос.'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => updateTask(task.id, { status: 'today' })} className="rounded-xl bg-accent px-3 py-2 text-xs text-white">Вернуть в today</button>
                    <button type="button" onClick={() => updateTask(task.id, { status: 'upcoming' })} className="rounded-xl bg-panel px-3 py-2 text-xs">Оставить позже</button>
                    <button type="button" onClick={() => updateTask(task.id, { status: 'completed' })} className="rounded-xl bg-panel px-3 py-2 text-xs">Закрыть</button>
                  </div>
                </div>
              </div>
            ))}
            {!neglected.length ? <p className="text-sm text-fg/65">Сейчас нет явных neglected items — хороший момент выбрать next-week bets осознанно.</p> : null}
          </div>
        </Section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <Section title="Кандидаты на следующую неделю" subtitle="Не тащи весь backlog в следующий цикл. Выбери задачи, которые действительно должны получить внимание.">
          <div className="space-y-3">
            {nextWeekCandidates.map((task) => (
              <div key={task.id} className="rounded-2xl bg-muted/40 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-fg/60">{task.status} · {task.due ?? 'Без дедлайна'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => updateTask(task.id, { status: 'today' })} className="rounded-xl bg-accent px-3 py-2 text-xs text-white">В today</button>
                    <button type="button" onClick={() => updateTask(task.id, { status: 'upcoming' })} className="rounded-xl bg-panel px-3 py-2 text-xs">Оставить upcoming</button>
                  </div>
                </div>
              </div>
            ))}
            {!nextWeekCandidates.length ? <p className="text-sm text-fg/65">Нет кандидатов — это значит, что нужно сначала наполнить inbox или upcoming meaningful задачами.</p> : null}
          </div>
        </Section>

        <Section title="Контекст для рефлексии" subtitle="Pinned notes хорошо работают как weekly anchors: темы недели, решения, обещания себе.">
          <div className="space-y-3">
            {pinnedNotes.slice(0, 3).map((note) => (
              <article key={note.id} className="rounded-2xl bg-gradient-to-br from-violet-500/15 to-cyan-500/15 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium">{note.title}</h3>
                    <p className="mt-2 line-clamp-4 text-sm text-fg/70">{note.content}</p>
                  </div>
                  <Sparkles size={16} className="text-accent" />
                </div>
              </article>
            ))}
            <div className="rounded-2xl bg-muted/40 p-4 text-sm text-fg/65">
              <p className="font-medium text-fg">Reflection prompt</p>
              <p className="mt-2">Что создало наибольший прогресс? Что ты постоянно переносишь? Какую одну тему стоит сделать центральной на следующей неделе?</p>
            </div>
            {!pinnedNotes.length ? <p className="text-sm text-fg/65">Закреплённые заметки помогут сделать weekly review глубже. Пока можно использовать этот экран как слой triage + reflection.</p> : null}
          </div>
        </Section>
      </div>

      <Section title="One-sentence next step" subtitle="Weekly review должен заканчиваться конкретным выбором, а не красивым обзором.">
        <div className="flex flex-col gap-3 rounded-2xl bg-gradient-to-br from-violet-500/15 to-cyan-500/15 p-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-sm font-medium"><Target size={16} /> Suggested commitment</p>
            <p className="mt-2 text-sm text-fg/70">Выбери 1–3 задачи из блока выше и переведи их в `today`, чтобы понедельник начинался с ясного старта, а не с нового хаоса.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/shutdown" className="rounded-xl bg-accent px-4 py-2 text-sm text-white">Перейти в shutdown ritual</Link>
            <div className="inline-flex items-center gap-2 rounded-2xl bg-panel/70 px-4 py-3 text-sm text-fg/70">
              <CircleDashed size={16} /> Review → decide → schedule <ArrowRight size={14} /> done
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
