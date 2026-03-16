# PerSpace — personal digital sanctuary

PerSpace — единое личное пространство для задач, заметок, файлов и музыки с premium UI и PWA-first подходом.

## Что уже реализовано (MVP foundation + interactive flows)
- Next.js App Router + TypeScript + Tailwind + Framer Motion.
- Единый app shell: desktop sidebar + mobile bottom nav + плавные переходы.
- Dashboard с живыми данными из локального workspace-store.
- Tasks: быстрый ввод, фильтры по статусам, завершение/восстановление.
- Notes: создание карточек и pin/unpin.
- Files: таблица + поиск.
- Music: библиотека + активный трек + mini controls.
- Search: глобальный поиск по задачам/заметкам/файлам/музыке.
- Settings: отображение пользовательских параметров.
- PWA: `manifest.webmanifest`, service worker, standalone режим.
- Prisma schema для production backend этапа.

## Архитектурные решения
### Frontend
- `components/workspace-provider.tsx` — единый client-side store с localStorage persistence.
- `components/app-shell.tsx` — общая навигация и motion-переходы.
- `app/*/page.tsx` — модульные страницы продукта.

### Backend roadmap
- Перевести store на серверные actions + Prisma.
- Добавить auth/session слой и защищённые API.
- Подключить S3-compatible storage и presigned uploads.

## Запуск
```bash
npm install
npm run dev
```

> В текущей среде `npm install` может блокироваться политикой доступа к registry.
