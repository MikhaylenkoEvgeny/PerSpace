'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

export interface PlayerTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  fileUrl: string;
}

interface MusicPlayerContextValue {
  tracks: PlayerTrack[];
  activeTrack?: PlayerTrack;
  isPlaying: boolean;
  setTracks: (tracks: PlayerTrack[]) => void;
  playTrack: (trackId: string) => Promise<void>;
  togglePlayback: () => Promise<void>;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
}

const MusicPlayerContext = createContext<MusicPlayerContextValue | null>(null);

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const [tracks, setTracksState] = useState<PlayerTrack[]>([]);
  const [activeId, setActiveId] = useState<string>();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const activeIndex = useMemo(() => tracks.findIndex((track) => track.id === activeId), [tracks, activeId]);
  const activeTrack = activeIndex >= 0 ? tracks[activeIndex] : undefined;

  const setTracks = useCallback((nextTracks: PlayerTrack[]) => {
    setTracksState(nextTracks);
    if (!nextTracks.length) {
      setActiveId(undefined);
      setIsPlaying(false);
      return;
    }

    if (!activeId || !nextTracks.some((track) => track.id === activeId)) {
      setActiveId(nextTracks[0].id);
    }
  }, [activeId]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!activeTrack) {
      audio.removeAttribute('src');
      audio.load();
      return;
    }

    if (audio.src !== new URL(activeTrack.fileUrl, window.location.origin).toString()) {
      audio.src = activeTrack.fileUrl;
      audio.load();
      if (isPlaying) {
        audio.play().catch(() => setIsPlaying(false));
      }
    }
  }, [activeTrack, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      const hasNext = activeIndex >= 0 && activeIndex < tracks.length - 1;
      if (hasNext) {
        setActiveId(tracks[activeIndex + 1].id);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, [activeIndex, tracks]);

  const playTrack = useCallback(async (trackId: string) => {
    const audio = audioRef.current;
    if (!audio) return;
    setActiveId(trackId);
    setIsPlaying(true);

    if (activeId === trackId) {
      await audio.play().catch(() => setIsPlaying(false));
    }
  }, [activeId]);

  const togglePlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !activeTrack) return;

    if (audio.paused) {
      setIsPlaying(true);
      await audio.play().catch(() => setIsPlaying(false));
      return;
    }

    audio.pause();
  }, [activeTrack]);

  const playNext = useCallback(async () => {
    if (!tracks.length || activeIndex >= tracks.length - 1) return;
    const nextTrack = tracks[activeIndex + 1];
    await playTrack(nextTrack.id);
  }, [tracks, activeIndex, playTrack]);

  const playPrevious = useCallback(async () => {
    if (!tracks.length) return;
    const targetIndex = activeIndex <= 0 ? 0 : activeIndex - 1;
    await playTrack(tracks[targetIndex].id);
  }, [tracks, activeIndex, playTrack]);

  const value = useMemo(
    () => ({ tracks, activeTrack, isPlaying, setTracks, playTrack, togglePlayback, playNext, playPrevious }),
    [tracks, activeTrack, isPlaying, setTracks, playTrack, togglePlayback, playNext, playPrevious]
  );

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="metadata" />
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (!context) throw new Error('useMusicPlayer must be used inside MusicPlayerProvider');
  return context;
}
