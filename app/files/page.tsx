'use client';

import { useMemo, useState } from 'react';
import { useWorkspace } from '@/components/workspace-provider';

export default function FilesPage() {
  const { state } = useWorkspace();
  const [query, setQuery] = useState('');

  const files = useMemo(
    () => state.files.filter((file) => file.name.toLowerCase().includes(query.toLowerCase())),
    [query, state.files]
  );

  return (
    <div className="glass rounded-2xl p-6">
      <h1 className="text-2xl font-semibold">Files</h1>
      <p className="mt-2 text-fg/70">Dropbox-style структура: папки, поиск, превью и контроль загрузок.</p>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по файлам" className="mt-4 w-full rounded-xl border border-fg/15 bg-panel px-3 py-2 outline-none focus:ring-2 focus:ring-accent/50" />
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-fg/60">
            <tr><th className="pb-2">Name</th><th className="pb-2">Folder</th><th className="pb-2">Type</th><th className="pb-2">Size</th><th className="pb-2">Updated</th></tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id} className="border-t border-fg/10">
                <td className="py-3">{file.name}</td><td>{file.folder}</td><td>{file.type}</td><td>{file.size}</td><td>{file.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
