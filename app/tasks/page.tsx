'use client';

import { useMemo, useState } from 'react';
import { GripVertical, X } from 'lucide-react';
import { useWorkspace } from '@/components/workspace-provider';
import type { TaskStatus } from '@/lib/types';

const STATUSES: TaskStatus[] = ['inbox', 'today', 'upcoming', 'completed'];

export default function TasksPage() {
  const { state, addTask, updateTask, toggleTask, removeTask, toggleFocusTask } = useWorkspace();
  const [draft, setDraft] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);

  const groupedTasks = useMemo(
    () => Object.fromEntries(STATUSES.map((status) => [status, state.tasks.filter((task) => task.status === status)])) as Record<TaskStatus, typeof state.tasks>,
    [state]
  );
  const selectedTask = state.tasks.find((task) => task.id === selectedTaskId) ?? null;

  const handleCreateTask = () => {
    addTask(draft);
    setDraft('');
  };

  const handleDropToStatus = (status: TaskStatus) => {
    if (!draggedTaskId) return;
    updateTask(draggedTaskId, { status });
    setDraggedTaskId(null);
    setDragOverStatus(null);
  };

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-6">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <p className="mt-2 text-fg/70">Теперь задачи можно перетаскивать мышкой между inbox, today, upcoming и completed.</p>
        <div className="mt-4 flex gap-2">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Например: Позвонить Андрею завтра в 15:00" className="w-full rounded-xl border border-fg/15 bg-panel px-3 py-2 outline-none focus:ring-2 focus:ring-accent/50" />
          <button onClick={handleCreateTask} className="rounded-xl bg-accent px-4 py-2 text-white">Добавить</button>
        </div>
      </div>

      {tab === 'inbox' ? (
        <div className="glass rounded-2xl p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Inbox triage</h2>
              <p className="text-sm text-fg/65">Быстро реши: это задача на сегодня, позже или уже можно закрыть.</p>
            </div>
            <p className="text-sm text-fg/55">Лучший ритуал: разобрать inbox до нуля утром и вечером.</p>
          </div>
        </div>
      ) : null}

      <div className="glass rounded-2xl p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Drag & drop board</h2>
            <p className="text-sm text-fg/65">Тяни карточку за любую часть и бросай в нужную колонку, чтобы быстро разложить день.</p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-fg/60">
            {STATUSES.map((status) => (
              <span key={status} className="rounded-xl bg-muted px-3 py-2">{status}: {groupedTasks[status].length}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        {STATUSES.map((status) => (
          <section
            key={status}
            onDragOver={(event) => {
              event.preventDefault();
              setDragOverStatus(status);
            }}
            onDragLeave={() => setDragOverStatus((current) => (current === status ? null : current))}
            onDrop={() => handleDropToStatus(status)}
            className={`glass min-h-[16rem] rounded-2xl p-4 transition ${dragOverStatus === status ? 'border-accent/60 bg-accent/10' : ''}`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-fg/55">Lane</p>
                <h2 className="mt-1 text-lg font-semibold capitalize">{status}</h2>
              </div>
              <span className="rounded-xl bg-muted px-3 py-1 text-xs">{groupedTasks[status].length}</span>
            </div>

            {status === 'inbox' ? <p className="mt-3 text-sm text-fg/60">Лучший ритуал — разбирать inbox до нуля утром и вечером.</p> : null}

            <div className="mt-4 space-y-3">
              {groupedTasks[status].map((task) => (
                <article
                  key={task.id}
                  draggable
                  onDragStart={() => setDraggedTaskId(task.id)}
                  onDragEnd={() => {
                    setDraggedTaskId(null);
                    setDragOverStatus(null);
                  }}
                  className={`cursor-grab rounded-2xl bg-muted/50 p-4 active:cursor-grabbing ${draggedTaskId === task.id ? 'opacity-60 ring-2 ring-accent/40' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <button onClick={() => setSelectedTaskId(task.id)} className="min-w-0 flex-1 text-left">
                      <div className="flex items-center gap-2 text-fg/45">
                        <GripVertical size={14} />
                        <span className="text-[11px] uppercase tracking-[0.2em]">drag</span>
                      </div>
                      <p className={`mt-2 font-medium ${task.status === 'completed' ? 'line-through opacity-60' : ''}`}>{task.title}</p>
                      <p className="mt-1 text-xs text-fg/60">{task.due ?? 'Без дедлайна'} · {task.priority}</p>
                      {task.note ? <p className="mt-2 line-clamp-3 text-xs text-fg/60">{task.note}</p> : null}
                    </button>
                    <button onClick={() => toggleFocusTask(task.id)} className={`shrink-0 rounded-lg px-3 py-1 text-xs ${state.settings.focusTaskIds.includes(task.id) ? 'bg-violet-500 text-white' : 'bg-panel'}`}>
                      {state.settings.focusTaskIds.includes(task.id) ? 'Top 3' : 'В Top 3'}
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button onClick={() => toggleTask(task.id)} className="rounded-lg bg-panel px-3 py-1 text-xs">
                      {task.status === 'completed' ? 'Восстановить' : 'Завершить'}
                    </button>
                    <button onClick={() => setSelectedTaskId(task.id)} className="rounded-lg bg-panel px-3 py-1 text-xs">
                      Детали
                    </button>
                    <button onClick={() => removeTask(task.id)} className="rounded-lg border border-red-300 bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
                      Удалить
                    </button>
                  </div>
                </article>
              ))}

              {!groupedTasks[status].length ? (
                <div className="rounded-2xl border border-dashed border-fg/15 bg-panel/40 p-4 text-sm text-fg/55">
                  {dragOverStatus === status ? 'Отпускай сюда — задача переместится в эту категорию.' : 'Пусто. Перетащи сюда задачу из другой колонки.'}
                </div>
              ) : null}
            </div>
          </section>
        ))}
      </div>

      {selectedTask ? (
        <div className="fixed inset-0 z-[92] flex justify-end bg-black/40 backdrop-blur-sm">
          <button type="button" aria-label="Закрыть drawer" className="flex-1 cursor-default" onClick={() => setSelectedTaskId(null)} />
          <aside className="glass relative h-full w-full max-w-xl overflow-y-auto p-5 shadow-glow">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-fg/55">Task detail</p>
                <h2 className="mt-1 text-2xl font-semibold">Сфокусируй задачу до конкретного next step</h2>
              </div>
              <button type="button" onClick={() => setSelectedTaskId(null)} className="rounded-xl bg-muted p-2">
                <X size={16} />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-fg/55">Title</label>
                <input
                  value={selectedTask.title}
                  onChange={(event) => updateTask(selectedTask.id, { title: event.target.value })}
                  className="w-full rounded-2xl border border-fg/10 bg-panel/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/35"
                />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-fg/55">Due</label>
                  <input
                    value={selectedTask.due ?? ''}
                    onChange={(event) => updateTask(selectedTask.id, { due: event.target.value || undefined })}
                    placeholder="Например: Завтра 15:00"
                    className="w-full rounded-2xl border border-fg/10 bg-panel/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/35"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-fg/55">Priority</label>
                  <select
                    value={selectedTask.priority}
                    onChange={(event) => updateTask(selectedTask.id, { priority: event.target.value as 'low' | 'medium' | 'high' })}
                    className="w-full rounded-2xl border border-fg/10 bg-panel/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/35"
                  >
                    <option value="low">low</option>
                    <option value="medium">medium</option>
                    <option value="high">high</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-fg/55">Status</label>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => updateTask(selectedTask.id, { status })}
                      className={`rounded-xl px-3 py-2 text-sm ${selectedTask.status === status ? 'bg-accent text-white' : 'bg-muted'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-fg/55">Execution note</label>
                <textarea
                  value={selectedTask.note ?? ''}
                  onChange={(event) => updateTask(selectedTask.id, { note: event.target.value || undefined })}
                  placeholder="Что именно нужно сделать? Какой следующий шаг?"
                  className="min-h-40 w-full rounded-2xl border border-fg/10 bg-panel/80 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/35"
                />
              </div>

              <div className="rounded-2xl bg-muted/40 p-4 text-sm text-fg/65">
                Изменения сохраняются автоматически. Перетаскивание между колонками и drawer теперь работают как один и тот же статусный workflow.
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
