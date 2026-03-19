'use client';

import { useState } from 'react';
import { GripVertical, X } from 'lucide-react';
import { useWorkspace } from '@/components/workspace-provider';
import type { TaskStatus } from '@/lib/types';

const STATUSES: Array<{ key: TaskStatus; label: string }> = [
  { key: 'inbox', label: 'Inbox' },
  { key: 'today', label: 'Today' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' }
];

export default function TasksPage() {
  const { state, addTask, updateTask, toggleTask, removeTask } = useWorkspace();
  const [draft, setDraft] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);

  const groupedTasks = Object.fromEntries(STATUSES.map(({ key }) => [key, state.tasks.filter((task) => task.status === key)])) as Record<TaskStatus, typeof state.tasks>;
  const selectedTask = state.tasks.find((task) => task.id === selectedTaskId) ?? null;

  const createTask = () => {
    addTask(draft);
    setDraft('');
  };

  const moveTask = (status: TaskStatus) => {
    if (!draggedTaskId) return;
    updateTask(draggedTaskId, { status });
    setDraggedTaskId(null);
    setDragOverStatus(null);
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <p className="text-sm font-medium text-fg/50">Tasks</p>
        <h1 className="page-title">Чистая операционная доска без визуального шума.</h1>
        <p className="page-subtitle">Один экран для triage, execution и завершения. Никаких лишних блоков между тобой и задачами.</p>
      </header>

      <section className="surface p-5 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Добавить задачу"
            className="h-11 flex-1 rounded-xl border border-fg/10 bg-transparent px-4 text-sm outline-none focus:ring-2 focus:ring-accent/25"
          />
          <button onClick={createTask} className="h-11 rounded-xl bg-fg px-4 text-sm font-medium text-white">
            Create task
          </button>
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-4 md:grid-cols-2">
        {STATUSES.map(({ key, label }) => (
          <section
            key={key}
            onDragOver={(event) => {
              event.preventDefault();
              setDragOverStatus(key);
            }}
            onDragLeave={() => setDragOverStatus((current) => (current === key ? null : current))}
            onDrop={() => moveTask(key)}
            className={`surface p-4 ${dragOverStatus === key ? 'ring-2 ring-accent/30' : ''}`}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-fg/45">Lane</p>
                <h2 className="mt-1 text-lg font-semibold tracking-[-0.02em]">{label}</h2>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs text-fg/65">{groupedTasks[key].length}</span>
            </div>

            <div className="space-y-2">
              {groupedTasks[key].map((task) => (
                <article
                  key={task.id}
                  draggable
                  onDragStart={() => setDraggedTaskId(task.id)}
                  onDragEnd={() => {
                    setDraggedTaskId(null);
                    setDragOverStatus(null);
                  }}
                  className="rounded-xl border border-fg/10 bg-panel px-4 py-3"
                >
                  <button onClick={() => setSelectedTaskId(task.id)} className="w-full text-left">
                    <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-fg/40">
                      <GripVertical size={12} /> drag
                    </div>
                    <p className={`mt-2 font-medium ${task.status === 'completed' ? 'line-through text-fg/45' : ''}`}>{task.title}</p>
                    <p className="mt-1 text-sm text-fg/52">{task.due ?? 'Без дедлайна'} · {task.priority}</p>
                  </button>
                  <div className="mt-3 flex items-center gap-3 text-sm text-fg/55">
                    <button onClick={() => toggleTask(task.id)}>{task.status === 'completed' ? 'Restore' : 'Done'}</button>
                    <button onClick={() => setSelectedTaskId(task.id)}>Edit</button>
                    <button onClick={() => removeTask(task.id)} className="text-red-600">Delete</button>
                  </div>
                </article>
              ))}
              {!groupedTasks[key].length ? <div className="rounded-xl border border-dashed border-fg/10 px-4 py-6 text-sm text-fg/45">Пусто</div> : null}
            </div>
          </section>
        ))}
      </div>

      {selectedTask ? (
        <div className="fixed inset-0 z-[92] flex justify-end bg-black/30">
          <button type="button" aria-label="Закрыть drawer" className="flex-1" onClick={() => setSelectedTaskId(null)} />
          <aside className="surface h-full w-full max-w-lg overflow-y-auto rounded-none p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-fg/50">Task</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em]">Редактирование без шума</h2>
              </div>
              <button type="button" onClick={() => setSelectedTaskId(null)} className="rounded-xl bg-muted p-2">
                <X size={16} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-fg/60">Title</label>
                <input
                  value={selectedTask.title}
                  onChange={(event) => updateTask(selectedTask.id, { title: event.target.value })}
                  className="h-11 w-full rounded-xl border border-fg/10 bg-transparent px-4 text-sm outline-none focus:ring-2 focus:ring-accent/25"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-fg/60">Due</label>
                  <input
                    value={selectedTask.due ?? ''}
                    onChange={(event) => updateTask(selectedTask.id, { due: event.target.value || undefined })}
                    className="h-11 w-full rounded-xl border border-fg/10 bg-transparent px-4 text-sm outline-none focus:ring-2 focus:ring-accent/25"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-fg/60">Priority</label>
                  <select
                    value={selectedTask.priority}
                    onChange={(event) => updateTask(selectedTask.id, { priority: event.target.value as 'low' | 'medium' | 'high' })}
                    className="h-11 w-full rounded-xl border border-fg/10 bg-transparent px-4 text-sm outline-none focus:ring-2 focus:ring-accent/25"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-fg/60">Status</label>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map(({ key, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => updateTask(selectedTask.id, { status: key })}
                      className={`h-10 rounded-xl px-4 text-sm ${selectedTask.status === key ? 'bg-fg text-white' : 'bg-muted text-fg/72'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-fg/60">Note</label>
                <textarea
                  value={selectedTask.note ?? ''}
                  onChange={(event) => updateTask(selectedTask.id, { note: event.target.value || undefined })}
                  className="min-h-40 w-full rounded-xl border border-fg/10 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-accent/25"
                />
              </div>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
