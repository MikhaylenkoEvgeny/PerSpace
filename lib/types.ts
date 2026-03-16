export type TaskStatus = 'inbox' | 'today' | 'upcoming' | 'completed';

export interface TaskItem {
  id: string;
  title: string;
  note?: string;
  due?: string;
  priority: 'low' | 'medium' | 'high';
  status: TaskStatus;
  tags: string[];
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
  color: 'violet' | 'emerald' | 'amber' | 'slate';
  tags: string[];
}

export interface FileItem {
  id: string;
  name: string;
  folder: string;
  size: string;
  type: string;
  updatedAt: string;
}

export interface TrackItem {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  favorite: boolean;
}

export interface SettingsState {
  theme: 'light' | 'dark' | 'system';
  language: 'ru' | 'en';
  reducedMotion: boolean;
}

export interface WorkspaceState {
  tasks: TaskItem[];
  notes: NoteItem[];
  files: FileItem[];
  tracks: TrackItem[];
  settings: SettingsState;
}
