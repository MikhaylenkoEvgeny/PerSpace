'use client';

import { useMemo, useState } from 'react';
import { useWorkspace } from '@/components/workspace-provider';

export default function TasksPage() {
  const { state, addTask, toggleTask } = useWorkspace();
  const [draft, setDraft] = useState('');
  const [tab, setTab] = useState<'inbox' | 'today' | 'upcoming' | 'completed'>('today');

  const visible = useMemo(() => state.tasks.filter((task) => task.status === tab), [state.tasks, tab]);

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-6">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <p className="mt-2 text-fg/70">Natural input, быстрый inbox и фокусные today/upcoming потоки.</p>
        <div className="mt-4 flex gap-2">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Например: Позвонить Андрею завтра в 15:00" className="w-full rounded-xl border border-fg/15 bg-panel px-3 py-2 outline-none focus:ring-2 focus:ring-accent/50" />
          <button onClick={() => { addTask(draft); setDraft(''); }} className="rounded-xl bg-accent px-4 py-2 text-white">Добавить</button>
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="mb-4 flex flex-wrap gap-2">
          {(['inbox', 'today', 'upcoming', 'completed'] as const).map((item) => (
            <button key={item} onClick={() => setTab(item)} className={`rounded-xl px-3 py-1.5 text-sm ${tab === item ? 'bg-accent text-white' : 'bg-muted'}`}>
              {item}
            </button>
          ))}
        </div>
        <ul className="space-y-2">
          {visible.map((task) => (
            <li key={task.id} className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
              <div>
                <p className={task.status === 'completed' ? 'line-through opacity-60' : ''}>{task.title}</p>
                <p className="text-xs text-fg/60">{task.due ?? 'Без дедлайна'} · {task.priority}</p>
              </div>
              <button onClick={() => toggleTask(task.id)} className="rounded-lg bg-panel px-3 py-1 text-xs">
                {task.status === 'completed' ? 'Восстановить' : 'Завершить'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
