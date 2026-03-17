'use client';

import { SkipBack, SkipForward, Pause, Play } from 'lucide-react';
import { useMusicPlayer } from '@/components/music-player-provider';

export function GlobalMusicPlayer() {
  const { activeTrack, isPlaying, togglePlayback, playNext, playPrevious } = useMusicPlayer();

  if (!activeTrack) return null;

  return (
    <div className="glass fixed bottom-20 left-2 right-2 z-40 rounded-2xl p-3 md:bottom-4 md:left-6 md:right-6 md:max-w-3xl">
      <p className="text-xs uppercase tracking-[0.2em] text-fg/55">Now playing</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{activeTrack.title}</p>
          <p className="truncate text-xs text-fg/70">{activeTrack.artist} · {activeTrack.album}</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={playPrevious} className="rounded-lg p-2 hover:bg-muted/60" aria-label="Предыдущий трек">
            <SkipBack size={16} />
          </button>
          <button onClick={togglePlayback} className="rounded-lg bg-accent p-2 text-white" aria-label={isPlaying ? 'Пауза' : 'Воспроизвести'}>
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button onClick={playNext} className="rounded-lg p-2 hover:bg-muted/60" aria-label="Следующий трек">
            <SkipForward size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
