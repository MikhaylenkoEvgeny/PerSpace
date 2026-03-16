'use client';

import { useEffect, useMemo, useState, type ChangeEvent } from 'react';

interface UploadedFile {
  id: string;
  name: string;
  folder: string;
  size: string;
  type: string;
  updatedAt: string;
  fileUrl: string;
}

export default function FilesPage() {
  const [query, setQuery] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFiles = async () => {
    try {
      setError(null);
      const response = await fetch('/perSpace/api/files', { cache: 'no-store' });
      if (!response.ok) throw new Error('files_load_failed');
      const data = (await response.json()) as { files: UploadedFile[] };
      setFiles(data.files);
    } catch {
      setError('Не удалось загрузить файлы.');
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const visibleFiles = useMemo(
    () => files.filter((file) => file.name.toLowerCase().includes(query.toLowerCase())),
    [query, files]
  );

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setError(null);
      setIsUploading(true);
      const response = await fetch('/perSpace/api/files', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Не удалось загрузить файл.');
      }

      await loadFiles();
      event.target.value = '';
    } catch (uploadError) {
      if (uploadError instanceof Error) {
        setError(uploadError.message);
      } else {
        setError('Не удалось загрузить файл.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-6">
      <h1 className="text-2xl font-semibold">Files</h1>
      <p className="mt-2 text-fg/70">Отображаются только файлы, которые вы загрузили самостоятельно.</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-4 py-2 text-white">
          <span>{isUploading ? 'Загрузка…' : 'Загрузить файл'}</span>
          <input type="file" className="hidden" onChange={handleUpload} disabled={isUploading} />
        </label>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск по файлам" className="w-full max-w-md rounded-xl border border-fg/15 bg-panel px-3 py-2 outline-none focus:ring-2 focus:ring-accent/50" />
      </div>
      {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-fg/60">
            <tr><th className="pb-2">Name</th><th className="pb-2">Folder</th><th className="pb-2">Type</th><th className="pb-2">Size</th><th className="pb-2">Updated</th></tr>
          </thead>
          <tbody>
            {visibleFiles.map((file) => (
              <tr key={file.id} className="border-t border-fg/10">
                <td className="py-3"><a href={file.fileUrl} target="_blank" rel="noreferrer" className="hover:underline">{file.name}</a></td><td>{file.folder}</td><td>{file.type}</td><td>{file.size}</td><td>{file.updatedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {visibleFiles.length === 0 ? <p className="mt-3 text-sm text-fg/70">Пока нет загруженных файлов.</p> : null}
      </div>
    </div>
  );
}
