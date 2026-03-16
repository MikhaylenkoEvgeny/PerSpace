'use client';

import { useMemo, useState } from 'react';
import { useWorkspace } from '@/components/workspace-provider';

export default function MusicPage() {
  const { state } = useWorkspace();
  const [activeId, setActiveId] = useState(state.tracks[0]?.id);

  const active = useMemo(() => state.tracks.find((track) => track.id === activeId) ?? state.tracks[0], [activeId, state.tracks]);

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-6">
        <h1 className="text-2xl font-semibold">Music</h1>
        <p className="mt-2 text-fg/70">Личная медиатека и плеер: queue-ready UX для iPhone PWA и desktop.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass rounded-2xl p-4">
          <h2 className="mb-2 font-medium">Library</h2>
          <ul className="space-y-2">
            {state.tracks.map((track) => (
              <li key={track.id}>
                <button onClick={() => setActiveId(track.id)} className={`flex w-full items-center justify-between rounded-xl p-3 text-left ${active?.id === track.id ? 'bg-accent text-white' : 'bg-muted/50'}`}>
                  <span>{track.title} — {track.artist}</span>
                  <span className="text-xs opacity-80">{track.duration}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="glass rounded-2xl p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-fg/55">Now playing</p>
          <h3 className="mt-2 text-xl font-semibold">{active?.title}</h3>
          <p className="text-fg/70">{active?.artist} · {active?.album}</p>
          <div className="mt-6 h-2 rounded-full bg-muted">
            <div className="h-2 w-1/3 rounded-full bg-accent" />
          </div>
          <div className="mt-5 grid grid-cols-5 gap-2 text-sm">
            <button className="rounded-lg bg-muted py-2">↺</button>
            <button className="rounded-lg bg-muted py-2">⏮</button>
            <button className="rounded-lg bg-accent py-2 text-white">⏯</button>
            <button className="rounded-lg bg-muted py-2">⏭</button>
            <button className="rounded-lg bg-muted py-2">🔀</button>
          </div>
        </div>
      </div>
    </div>
  );
}
