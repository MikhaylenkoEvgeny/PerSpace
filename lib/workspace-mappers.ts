import type { FileAsset, MusicTrack, Note, Task } from '@prisma/client';
import type { FileItem, NoteItem, SettingsState, TaskItem, TrackItem, WorkspaceState } from '@/lib/types';

function parseJsonArray(value: string | null | undefined) {
  if (!value) return [] as string[];

  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function serializeJsonArray(value: string[] | undefined) {
  return JSON.stringify(value ?? []);
}

function parsePriority(priority: number): TaskItem['priority'] {
  if (priority >= 3) return 'high';
  if (priority <= 1) return 'low';
  return 'medium';
}

function serializePriority(priority: TaskItem['priority']) {
  if (priority === 'high') return 3;
  if (priority === 'low') return 1;
  return 2;
}

export function mapTaskRecord(task: Pick<Task, 'id' | 'title' | 'description' | 'status' | 'priority' | 'tags' | 'repeatRule'>): TaskItem {
  return {
    id: task.id,
    title: task.title,
    note: task.description ?? undefined,
    due: task.repeatRule ?? undefined,
    priority: parsePriority(task.priority),
    status: task.status as TaskItem['status'],
    tags: parseJsonArray(task.tags)
  };
}

export function mapTaskInput(userId: string, task: TaskItem) {
  return {
    id: task.id,
    userId,
    title: task.title,
    description: task.note ?? null,
    repeatRule: task.due ?? null,
    priority: serializePriority(task.priority),
    status: task.status,
    tags: serializeJsonArray(task.tags)
  };
}

export function mapNoteRecord(note: Pick<Note, 'id' | 'title' | 'content' | 'pinned' | 'color' | 'tags'>): NoteItem {
  const color = note.color;
  return {
    id: note.id,
    title: note.title ?? 'Без названия',
    content: note.content,
    pinned: note.pinned,
    color: color === 'violet' || color === 'emerald' || color === 'amber' || color === 'slate' ? color : 'slate',
    tags: parseJsonArray(note.tags)
  };
}

export function mapNoteInput(userId: string, note: NoteItem) {
  return {
    id: note.id,
    userId,
    title: note.title,
    content: note.content,
    pinned: note.pinned,
    color: note.color,
    tags: serializeJsonArray(note.tags),
    type: 'text',
    archived: false,
    deletedAt: null
  };
}

type PersistedSettings = {
  theme?: string | null;
  language?: string | null;
  reducedMotion?: boolean | null;
  focusTaskIds?: string | null;
};

export function mapSettingsRecord(settings: PersistedSettings | null | undefined): SettingsState {
  return {
    theme: settings?.theme === 'light' || settings?.theme === 'dark' || settings?.theme === 'system' ? settings.theme : 'system',
    language: settings?.language === 'en' || settings?.language === 'ru' ? settings.language : 'ru',
    reducedMotion: settings?.reducedMotion ?? false,
    focusTaskIds: parseJsonArray(settings?.focusTaskIds)
  };
}

export function mapSettingsInput(userId: string, settings: SettingsState) {
  return {
    userId,
    theme: settings.theme,
    language: settings.language,
    reducedMotion: settings.reducedMotion,
    focusTaskIds: serializeJsonArray(settings.focusTaskIds)
  };
}

export function mapFileRecord(file: Pick<FileAsset, 'id' | 'name' | 'mimeType' | 'sizeBytes' | 'uploadedAt'>): FileItem {
  const size = Number(file.sizeBytes);
  return {
    id: file.id,
    name: file.name,
    folder: 'Uploads',
    size: size < 1024 ? `${size} B` : size < 1024 * 1024 ? `${(size / 1024).toFixed(1)} KB` : `${(size / (1024 * 1024)).toFixed(1)} MB`,
    type: file.mimeType,
    updatedAt: new Intl.DateTimeFormat('ru-RU', { dateStyle: 'short', timeStyle: 'short' }).format(file.uploadedAt)
  };
}

export function mapTrackRecord(track: Pick<MusicTrack, 'id' | 'title' | 'liked' | 'durationSec'> & { artist?: { name: string } | null; album?: { title: string } | null }): TrackItem {
  const minutes = Math.floor(track.durationSec / 60);
  const seconds = track.durationSec % 60;
  return {
    id: track.id,
    title: track.title,
    artist: track.artist?.name ?? 'Вы',
    album: track.album?.title ?? 'Uploaded',
    duration: track.durationSec > 0 ? `${minutes}:${String(seconds).padStart(2, '0')}` : '—',
    favorite: track.liked
  };
}

export function buildWorkspaceState(input: {
  tasks: TaskItem[];
  notes: NoteItem[];
  files: FileItem[];
  tracks: TrackItem[];
  settings: SettingsState;
}): WorkspaceState {
  return {
    tasks: input.tasks,
    notes: input.notes,
    files: input.files,
    tracks: input.tracks,
    settings: input.settings
  };
}
