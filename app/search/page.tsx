'use client';

import { useMemo, useState } from 'react';
import { useWorkspace } from '@/components/workspace-provider';

export default function SearchPage() {
  const { queryAll } = useWorkspace();
  const [query, setQuery] = useState('');
  const results = useMemo(() => queryAll(query), [query, queryAll]);

  return (
    <div className="glass rounded-2xl p-6">
      <h1 className="text-2xl font-semibold">Global Search</h1>
      <p className="mt-2 text-fg/70">Universal command space по всем сущностям продукта.</p>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Искать задачи, заметки, файлы, треки..." className="mt-4 w-full rounded-xl border border-fg/15 bg-panel px-3 py-2 outline-none focus:ring-2 focus:ring-accent/50" />
      <ul className="mt-4 space-y-2">
        {results.map((result) => (
          <li key={`${result.type}-${result.id}`} className="flex items-center justify-between rounded-xl bg-muted/50 p-3 text-sm">
            <span>{result.title}</span>
            <span className="rounded-md bg-panel px-2 py-0.5 text-xs text-fg/60">{result.type}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
