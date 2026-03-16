'use client';

import { useEffect, useMemo, useState, type ChangeEvent } from 'react';

interface UploadedTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  favorite: boolean;
  fileUrl: string;
  uploadedAt: string;
}

export default function MusicPage() {
  const [tracks, setTracks] = useState<UploadedTrack[]>([]);
  const [activeId, setActiveId] = useState<string>();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTracks = async () => {
    try {
      setError(null);
      const response = await fetch('/perSpace/api/music', { cache: 'no-store' });
      if (!response.ok) throw new Error('tracks_load_failed');
      const data = (await response.json()) as { tracks: UploadedTrack[] };
      setTracks(data.tracks);
      setActiveId((prev) => prev ?? data.tracks[0]?.id);
    } catch {
      setError('Не удалось загрузить вашу библиотеку.');
    }
  };

  useEffect(() => {
    loadTracks();
  }, []);

  const active = useMemo(() => tracks.find((track) => track.id === activeId) ?? tracks[0], [activeId, tracks]);

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setError(null);
      setIsUploading(true);
      const response = await fetch('/perSpace/api/music', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        if (data?.error === 'unsupported_file_type') {
          throw new Error('Поддерживаются только аудиофайлы (mp3/wav/ogg/m4a/aac/flac/webm).');
        }
        throw new Error('Не удалось загрузить файл.');
      }

      await loadTracks();
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
    <div className="space-y-4">
      <div className="glass rounded-2xl p-6">
        <h1 className="text-2xl font-semibold">Music</h1>
        <p className="mt-2 text-fg/70">Здесь отображаются только треки, которые вы загрузили самостоятельно.</p>
        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-accent px-4 py-2 text-white">
          <span>{isUploading ? 'Загрузка…' : 'Загрузить музыку'}</span>
          <input type="file" accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac,.flac,.webm" className="hidden" onChange={handleUpload} disabled={isUploading} />
        </label>
        {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass rounded-2xl p-4">
          <h2 className="mb-2 font-medium">Your uploads</h2>
          {tracks.length === 0 ? (
            <p className="rounded-xl bg-muted/50 p-3 text-sm text-fg/70">Пока нет загруженных треков. Добавьте первый файл выше.</p>
          ) : (
            <ul className="space-y-2">
              {tracks.map((track) => (
                <li key={track.id}>
                  <button
                    onClick={() => setActiveId(track.id)}
                    className={`flex w-full items-center justify-between rounded-xl p-3 text-left ${active?.id === track.id ? 'bg-accent text-white' : 'bg-muted/50'}`}
                  >
                    <span>{track.title} — {track.artist}</span>
                    <span className="text-xs opacity-80">{track.duration}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/55">Now playing</p>
          <h3 className="mt-2 text-xl font-semibold">{active?.title ?? 'Нет трека'}</h3>
          <p className="text-fg/70">{active ? `${active.artist} · ${active.album}` : 'Загрузите музыку, чтобы начать воспроизведение'}</p>
          {active ? <audio className="mt-6 w-full" controls src={active.fileUrl} /> : null}
        </div>
      </div>
    </div>
  );
}
