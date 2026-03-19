import type { WorkspaceState } from '@/lib/types';

export const seedState: WorkspaceState = {
  tasks: [
    { id: 't1', title: 'Подготовить weekly review', due: 'Сегодня 18:00', priority: 'high', status: 'today', tags: ['work'] },
    { id: 't2', title: 'Позвонить Андрею завтра в 15:00', due: 'Завтра 15:00', priority: 'medium', status: 'upcoming', tags: ['calls'] },
    { id: 't3', title: 'Купить кофейные фильтры', priority: 'low', status: 'inbox', tags: ['home'] }
  ],
  notes: [
    { id: 'n1', title: 'Идеи для продукта', content: 'Новый onboarding: фокус на calm + control.', pinned: true, color: 'violet', tags: ['product'] },
    { id: 'n2', title: 'Ритуалы утра', content: 'Вода, 10 минут чтения, план дня.', pinned: false, color: 'emerald', tags: ['life'] }
  ],
  files: [
    { id: 'f1', name: 'Moodboard.pdf', folder: 'Design', size: '3.2 MB', type: 'pdf', updatedAt: '2ч назад' },
    { id: 'f2', name: 'Launch-assets.zip', folder: 'Marketing', size: '28 MB', type: 'archive', updatedAt: 'вчера' }
  ],
  tracks: [
    { id: 'm1', title: 'Northern Lights', artist: 'Ambery', album: 'Night Drive', duration: '3:42', favorite: true },
    { id: 'm2', title: 'Calm Focus', artist: 'Lumen', album: 'Deep Work', duration: '4:18', favorite: false }
  ],
  settings: {
    theme: 'system',
    language: 'ru',
    reducedMotion: false,
    focusTaskIds: ['t1']
  }
};
