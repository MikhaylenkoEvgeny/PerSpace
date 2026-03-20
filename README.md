# PerSpace — personal digital sanctuary

PerSpace — единое личное пространство для задач, заметок, файлов и музыки с premium UI и PWA-first подходом.

## Что уже реализовано
- Next.js App Router + TypeScript + Tailwind + Framer Motion.
- Единый app shell: desktop sidebar + mobile bottom nav + плавные переходы.
- Интерактивные модули: Dashboard, Tasks, Notes, Files, Music, Search, Settings.
- Серверное сохранение состояния workspace в MySQL через Prisma (`WorkspaceSnapshot`) с fallback в localStorage при недоступности сервера.
- PWA foundation: manifest, service worker, safe-area UX.

## Подключение к MySQL
Приложение настроено на внешнюю MySQL базу данных со следующими параметрами:

- Host: `158.160.71.85`
- Port: `3306`
- Database: `perspace`
- User: `evgeny`
- External access: enabled

Строка подключения в `.env` / `.env.example`:

```env
DATABASE_URL="mysql://evgeny:P%40ssw0rd@158.160.71.85:3306/perspace"
```

## Что нужно сделать на сервере
1. Создать `.env` на сервере на основе примера:
   ```bash
   cp .env.example .env
   ```
2. Установить зависимости:
   ```bash
   npm install
   ```
3. Сгенерировать Prisma Client под MySQL:
   ```bash
   npm run db:generate
   ```
4. Синхронизировать схему БД с MySQL:
   ```bash
   npm run db:push
   ```
   или с dev-миграцией:
   ```bash
   npm run db:migrate
   ```
5. Запустить приложение:
   ```bash
   npm run dev
   ```
6. (Опционально) Открыть Prisma Studio:
   ```bash
   npm run db:studio
   ```

## Как это работает сейчас
- Клиент при старте читает состояние с `GET /api/workspace`.
- Любые изменения в задачах/заметках и др. отправляются на `POST /api/workspace` (debounced autosave).
- `GET /api/search` ищет по актуальному workspace, загруженному из MySQL.
- Если MySQL/сеть недоступны, клиент временно использует fallback в `localStorage`, а API возвращает `503 database_unavailable`.

## Важные файлы
- `prisma/schema.prisma` — MySQL datasource и модель `WorkspaceSnapshot`.
- `lib/prisma.ts` — singleton PrismaClient.
- `lib/workspace-storage.ts` — загрузка и сохранение workspace в MySQL.
- `app/api/workspace/route.ts` — API сохранения/чтения workspace.
- `app/api/search/route.ts` — поиск по данным из MySQL.
- `components/workspace-provider.tsx` — hydration + autosave.

## Что уже реализовано (MVP foundation + interactive flows)
- Next.js App Router + TypeScript + Tailwind + Framer Motion.
- Единый app shell: desktop sidebar + mobile bottom nav + плавные переходы.
- Dashboard с живыми данными из workspace-store.
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
- `components/workspace-provider.tsx` — единый client-side store с localStorage persistence и server sync.
- `components/app-shell.tsx` — общая навигация и motion-переходы.
- `app/*/page.tsx` — модульные страницы продукта.

### Backend roadmap
- Перевести store на полноценные серверные actions + нормализованные Prisma модели.
- Добавить auth/session слой и защищённые API.
- Подключить S3-compatible storage и presigned uploads.

## Запуск
```bash
npm install
npm run dev
```
