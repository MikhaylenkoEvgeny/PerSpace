# PerSpace — personal digital sanctuary

PerSpace — единое личное пространство для задач, заметок, файлов и музыки с premium UI и PWA-first подходом.

## Что уже реализовано
- Next.js App Router + TypeScript + Tailwind + Framer Motion.
- Единый app shell: desktop sidebar + mobile bottom nav + плавные переходы.
- Интерактивные модули: Dashboard, Tasks, Notes, Files, Music, Search, Settings.
- Серверное сохранение состояния workspace в SQLite через Prisma (`WorkspaceSnapshot`) с fallback в localStorage.
- PWA foundation: manifest, service worker, safe-area UX.

## Что нужно сделать на сервере, чтобы включить локальное хранение в SQLite
1. Создать `.env` на сервере на основе примера:
   ```bash
   cp .env.example .env
   ```
2. Убедиться, что `DATABASE_URL` указывает на локальный файл SQLite:
   ```env
   DATABASE_URL="file:./prisma/data/perspace.db"
   ```
3. Установить зависимости:
   ```bash
   npm install
   ```
4. Сгенерировать Prisma Client:
   ```bash
   npm run db:generate
   ```
5. Создать/синхронизировать схему БД:
   ```bash
   npm run db:push
   ```
   или с миграцией:
   ```bash
   npm run db:migrate
   ```
6. Запустить приложение:
   ```bash
   npm run dev
   ```
7. (Опционально) Открыть Prisma Studio:
   ```bash
   npm run db:studio
   ```

## Как это работает сейчас
- Клиент при старте читает состояние с `GET /api/workspace`.
- Любые изменения в задачах/заметках и др. отправляются на `POST /api/workspace` (debounced autosave).
- Если сеть/сервер недоступны, используется fallback в `localStorage`.

## Важные файлы
- `prisma/schema.prisma` — SQLite datasource и модель `WorkspaceSnapshot`.
- `lib/prisma.ts` — singleton PrismaClient.
- `app/api/workspace/route.ts` — API сохранения/чтения workspace.
- `components/workspace-provider.tsx` — hydration + autosave.
