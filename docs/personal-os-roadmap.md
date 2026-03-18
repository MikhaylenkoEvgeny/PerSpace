# PerSpace execution roadmap for ideas 1–40

## Goal
This document converts the selected ideas from `docs/personal-os-strategy.md` into a concrete execution plan: phases, sprints, architecture, data model changes, API surface, frontend structure, and implementation order.

## North-star outcome by the end of the roadmap
By the end of this roadmap, PerSpace should behave as a true personal operating system:
- fast capture from anywhere;
- structured execution across inbox, today, projects, routines, and goals;
- durable notes and file knowledge graph;
- trusted sync and account model;
- AI assistance layered on top of clean domain objects, not on top of a blob.

## Product sequencing principle
Ideas 1–40 should **not** be built as 40 parallel tracks. They should be grouped into six product waves:
1. trust + core execution;
2. structure + rituals;
3. knowledge graph + search;
4. platform + sync + storage;
5. growth + retention + analytics;
6. AI differentiation.

---

## Phase 0 — Re-platform the foundation (2 sprints)

### Objective
Stop building on the current snapshot/blob architecture and create a base that can support all 40 ideas.

### Scope
- 29. Normalized domain backend
- 30. Real authentication stack
- partial 31. Object-level offline sync foundation
- partial 32. Cloud file storage abstraction
- 28. Usage analytics foundation (minimum viable)

### Sprint 0.1 — Domain and auth reset
**Ship:**
- replace hardcoded auth with a real auth provider and user/session model;
- replace `WorkspaceSnapshot` as the primary runtime model with entity tables and CRUD endpoints;
- introduce repositories/services for tasks, notes, files, tracks, settings;
- add event logging for key product actions.

**Key backend tasks**
- add tables for project, area, tag, task link, note link, daily plan, review, reminder, sync device, audit event;
- create `/api/auth/session`, `/api/tasks`, `/api/notes`, `/api/settings`, `/api/search` v2;
- migrate reads from `seedState`/snapshot to DB-backed queries;
- add password hashing, session cookies, logout everywhere, unauthorized response standardization.

**Key frontend tasks**
- split `WorkspaceProvider` into feature-specific hooks;
- create typed data hooks for tasks, notes, files, settings;
- add optimistic mutation layer;
- add a global event tracker helper.

**Definition of done**
- no production path depends on hardcoded credentials;
- search, tasks, notes, settings all read real persisted user data;
- app state no longer requires whole-workspace POST on every edit.

### Sprint 0.2 — Offline-ready architecture and storage abstraction
**Ship:**
- local mutation queue;
- sync status model;
- storage adapter interface for local disk vs S3-compatible storage;
- telemetry for save failures, hydration failures, auth failures.

**Definition of done**
- every write operation creates an idempotent mutation event;
- UI can show pending/synced/failed state;
- files and music metadata live in DB, with a pluggable storage backend.

---

## Phase 1 — Make daily use genuinely good (3 sprints)

### Objective
Fix the most obvious gaps in the product promise so the app is usable every day.

### Scope
- 1. Inbox-to-Today triage view
- 2. Task detail drawer
- 3. Editable notes
- 4. Command palette
- 5. Quick capture everywhere
- 7. Real empty states
- 8. Today dashboard
- 9. Natural-language parsing v1
- 10. Undo for destructive actions
- 11. Settings that actually work
- 12. Weekly review surface

### Sprint 1.1 — Capture and command speed
**Ship:**
- command palette with keyboard shortcut;
- global quick capture modal;
- basic natural-language parser for date/priority/tag;
- undo/toast system.

**Why now**
This is the fastest visible step toward a premium product feeling. It upgrades the app from page-navigation software into command-driven software.

**Concrete UI changes**
- top-level `CommandMenu` component mounted in `AppShell`;
- floating `QuickCaptureButton` on mobile and desktop;
- result items that can both open and mutate entities.

### Sprint 1.2 — Better task and note depth
**Ship:**
- task detail drawer with editable fields;
- note editing with autosave;
- real settings panel for theme/language/motion/music autoplay;
- empty states for every major module.

**Concrete UX rule**
The user should be able to open any task or note and understand: what it is, what it relates to, what happens next, and whether it is safely saved.

### Sprint 1.3 — Daily/weekly rituals
**Ship:**
- today dashboard;
- inbox triage flow;
- weekly review screen;
- review completion metrics in analytics.

**Success metrics**
- time to first captured item < 30 seconds;
- % of users who move at least one inbox item to today;
- weekly review completion rate;
- 7-day retention lift.

---

## Phase 2 — Turn the app into a system, not a list (4 sprints)

### Objective
Introduce structure that makes PerSpace viable for real life complexity.

### Scope
- 13. Projects and life areas
- 14. Task recurrence engine
- 15. Rich notes model
- 18. Saved views
- 21. Smart reminders
- 22. Onboarding by intent
- 23. Daily shutdown ritual
- 25. Calendar integration
- 26. Goal and horizon system
- 27. Template gallery

### Sprint 2.1 — Projects, areas, saved views
**Ship:**
- projects;
- areas;
- task assignment to project/area;
- saved filters/views.

**Product effect**
This is the moment PerSpace stops being an inbox with tabs and becomes a real personal planning system.

### Sprint 2.2 — Recurrence, reminders, shutdown ritual
**Ship:**
- recurrence rules;
- snooze/skip/history;
- reminder scheduling engine;
- evening shutdown flow.

**Important design rule**
Reminders must be explainable. Every notification should say why it appeared: due soon, overdue, recurring, neglected, or calendar conflict.

### Sprint 2.3 — Rich notes and templates
**Ship:**
- block-based notes model;
- markdown shortcuts;
- note templates;
- starter templates in onboarding.

### Sprint 2.4 — Calendar and horizons
**Ship:**
- calendar import;
- time-blocking suggestions;
- weekly goals, monthly goals, area-level objectives;
- dashboard cards tied to current horizon.

**Success metrics**
- number of users with at least one project and one area;
- recurrence adoption;
- reminder CTR / completion impact;
- template-based activation;
- calendar-connected users.

---

## Phase 3 — Build the knowledge graph layer (3 sprints)

### Objective
Create connected context across tasks, notes, files, and search.

### Scope
- 6. Linked items
- 16. Unified object timeline
- 17. Search ranking + filters
- 19. File intelligence layer
- 20. Audio-to-note capture
- 24. Cross-device sync confidence center
- part of 31. sync UX
- part of 32. storage UX

### Sprint 3.1 — Linked objects and timeline
**Ship:**
- entity links: task ↔ note, task ↔ file, note ↔ file, note ↔ note;
- recent activity timeline;
- linked object chips in drawers and cards.

### Sprint 3.2 — Search becomes command intelligence
**Ship:**
- indexed search over real entities;
- ranking by recency, pinning, completion state, interaction history;
- keyboard-first filters;
- open, edit, move, link, schedule actions directly from search.

### Sprint 3.3 — File/audio intelligence and sync confidence
**Ship:**
- file previews;
- OCR pipeline for PDFs/images;
- voice note capture and transcription;
- sync center with pending items, last backup, conflicts, and export.

**Success metrics**
- search-to-action rate;
- percentage of tasks with linked context;
- OCR/transcription usage;
- sync failure visibility and recovery rate.

---

## Phase 4 — Growth, retention, and monetization rails (2 sprints)

### Objective
Add the product loops that support long-term growth and future business model options.

### Scope
- deepen 21. Smart reminders
- deepen 22. Onboarding by intent
- deepen 23. Daily shutdown ritual
- 24. Sync confidence center completion
- 27. Template gallery expansion
- 28. Usage analytics foundation full rollout
- monetization packaging for premium AI, sync, storage, templates

### Sprint 4.1 — Lifecycle engine
**Ship:**
- lifecycle messaging rules;
- reminder fatigue protection;
- onboarding personalization based on chosen intent;
- activation reports and cohort dashboards.

### Sprint 4.2 — Packaging and premium surfaces
**Ship:**
- premium-ready account page;
- limits/quotas abstraction for storage, AI usage, advanced templates, historical insights;
- subscription-ready feature flags.

**Monetization recommendation**
PerSpace should likely be monetized as freemium:
- free: tasks, notes, basic files, offline-first single-device baseline;
- pro: sync, advanced search, calendar, recurring systems, templates, OCR/transcription;
- AI+: planner, decomposition, reflection, memory, simulator.

---

## Phase 5 — AI as chief of staff (4 sprints)

### Objective
Launch AI only after trustworthy objects, rituals, and search exist.

### Scope
- 33. AI daily planner
- 34. AI task decomposition
- 35. AI reflection companion
- 36. Contextual focus soundtrack
- 37. Attention radar
- 38. Life OS map
- 39. Assistant memory layer
- 40. Outcome simulator

### Sprint 5.1 — AI decomposition and planner
**Ship:**
- task decomposition suggestions in task drawer;
- morning AI planner using tasks + calendar + priorities + time budget.

### Sprint 5.2 — Reflection and attention systems
**Ship:**
- weekly review insight cards;
- attention radar for neglected objects;
- summary explanations with evidence references.

### Sprint 5.3 — Memory and simulation
**Ship:**
- assistant memory with explicit user controls;
- overload simulator before accepting a daily or weekly plan.

### Sprint 5.4 — Differentiated emotional layer
**Ship:**
- contextual focus soundtrack;
- life OS map visualization;
- AI-generated focus sessions tied to goals and task type.

**AI trust rules**
- every AI recommendation must cite source objects;
- every AI memory item must be editable/deletable;
- every AI plan must be overridable in one click;
- never auto-commit or auto-reschedule critical tasks without confirmation.

---

## Architecture changes required

## 1. Target domain model
Add these core entities beyond the current schema:
- `Area`
- `Project`
- `Goal`
- `TaskRecurrence`
- `TaskReminder`
- `TaskLink`
- `NoteBlock`
- `EntityLink`
- `DailyPlan`
- `WeeklyReview`
- `Template`
- `UserIntentProfile`
- `Device`
- `SyncMutation`
- `NotificationEvent`
- `AuditEvent`
- `VoiceCapture`
- `SearchDocument`
- `AiSuggestion`
- `AiMemory`

### Relationship model
- task belongs to optional project, area, goal, day plan;
- note contains blocks and may link to tasks/files/notes/projects/goals;
- file can attach to notes/tasks and produce OCR text;
- review references completed/stuck/neglected objects;
- AI suggestions reference source entity IDs.

## 2. Backend architecture
Use a layered backend:
- **route handlers** for transport;
- **services** for domain logic;
- **repositories** for DB operations;
- **adapters** for storage, search, calendar, notifications, AI;
- **event bus** for analytics, search indexing, reminders, OCR/transcription, sync updates.

### Suggested folder structure
```text
app/
  api/
    auth/
    tasks/
    notes/
    projects/
    areas/
    goals/
    search/
    reviews/
    planner/
    reminders/
    files/
    voice/
    sync/
components/
  command-menu/
  capture/
  tasks/
  notes/
  dashboard/
  reviews/
  sync/
  planner/
lib/
  auth/
  db/
  repositories/
  services/
  search/
  sync/
  analytics/
  ai/
  calendar/
  notifications/
  storage/
```

## 3. Frontend state strategy
Replace the current monolithic workspace context with:
- per-domain query hooks;
- optimistic mutation hooks;
- local mutation queue store;
- UI-only state for drawers, command palette, rituals, and toasts.

### Frontend principle
Persist **entities**, not page-shaped snapshots.

## 4. Search architecture
Search should be upgraded from filtering to indexed retrieval:
- canonical search documents for tasks, notes, files, goals, projects;
- weighted ranking for title, pin state, due proximity, recency, interaction frequency;
- action dispatch from results;
- later: vector/semantic recall for AI and deep search.

## 5. Sync architecture
Each local change should generate:
- mutation ID;
- entity type;
- entity ID;
- operation type;
- payload delta;
- client timestamp;
- sync status.

Conflict resolution rules:
- simple fields: last-write-wins with activity log;
- structured text: block-level merge where possible;
- destructive operations: require restore from trash/audit trail.

---

## API plan

### Core entity APIs
- `GET /api/tasks`
- `POST /api/tasks`
- `PATCH /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `POST /api/tasks/:id/complete`
- `POST /api/tasks/:id/snooze`
- `POST /api/tasks/:id/link`

- `GET /api/notes`
- `POST /api/notes`
- `PATCH /api/notes/:id`
- `POST /api/notes/:id/blocks`
- `POST /api/notes/:id/link`

- `GET /api/projects`
- `GET /api/areas`
- `GET /api/goals`
- `GET /api/reviews/current`
- `POST /api/reviews/weekly`
- `GET /api/planner/today`
- `POST /api/planner/generate`

### Platform APIs
- `GET /api/search?q=`
- `GET /api/sync/status`
- `POST /api/sync/push`
- `GET /api/export`
- `POST /api/voice/transcribe`
- `POST /api/files/presign`
- `POST /api/calendar/connect`
- `POST /api/reminders/test`

### AI APIs
- `POST /api/ai/plan-day`
- `POST /api/ai/decompose-task`
- `POST /api/ai/review-insights`
- `POST /api/ai/simulate-load`
- `GET /api/ai/memory`
- `PATCH /api/ai/memory/:id`

---

## Concrete implementation order inside the current repository

## Step 1 — Replace the current global workspace model
1. Keep `WorkspaceSnapshot` only as a migration/import fallback.
2. Create normalized Prisma models and migration files.
3. Build repositories for tasks, notes, files, tracks, settings.
4. Replace `useWorkspace()` reads on home/tasks/notes/search/settings with server-backed hooks.

## Step 2 — Create UI primitives that multiple ideas need
1. `CommandMenu`
2. `QuickCaptureModal`
3. `EntityDrawer`
4. `ToastProvider`
5. `SyncStatusBadge`
6. `EmptyStateCard`
7. `ReviewShell`
8. `TemplatePicker`

## Step 3 — Land the rituals before deep AI
1. Today dashboard
2. Inbox triage
3. Weekly review
4. Daily shutdown

These four screens create the behavioral engine of the product.

## Step 4 — Add graph edges
1. entity link table
2. UI chips for linked objects
3. object timeline
4. search actions

## Step 5 — Add trust surfaces
1. auth settings
2. backup/export
3. sync confidence center
4. audit trail / trash / restore

## Step 6 — Launch AI only on top of evidence-rich objects
1. decomposition
2. planner
3. reflection
4. memory
5. simulator
6. map/focus soundtrack

---

## Suggested file plan for the first implementation wave

### New backend files
- `app/api/tasks/route.ts`
- `app/api/tasks/[id]/route.ts`
- `app/api/notes/route.ts`
- `app/api/notes/[id]/route.ts`
- `app/api/search/route.ts` (rewrite)
- `app/api/sync/status/route.ts`
- `lib/services/task-service.ts`
- `lib/services/note-service.ts`
- `lib/services/search-service.ts`
- `lib/services/sync-service.ts`
- `lib/repositories/task-repository.ts`
- `lib/repositories/note-repository.ts`
- `lib/repositories/search-repository.ts`

### New frontend files
- `components/command-menu.tsx`
- `components/quick-capture.tsx`
- `components/toast-provider.tsx`
- `components/sync-status-badge.tsx`
- `components/tasks/task-detail-drawer.tsx`
- `components/dashboard/today-dashboard.tsx`
- `components/reviews/weekly-review.tsx`
- `hooks/use-tasks.ts`
- `hooks/use-notes.ts`
- `hooks/use-search.ts`
- `hooks/use-sync-status.ts`

### Data contracts to define first
- `TaskDto`
- `NoteDto`
- `SearchResultDto`
- `MutationEnvelope`
- `SyncStatusDto`
- `WeeklyReviewDto`
- `TodayPlanDto`
- `AiSuggestionDto`

---

## Product risks and how to manage them

### Risk 1 — Building too much at once
Mitigation:
- one visible user problem per sprint;
- never run AI, sync, and editor rewrites at the same time without a stable core branch.

### Risk 2 — AI feels magical but untrustworthy
Mitigation:
- show evidence, source links, explainability, and editability.

### Risk 3 — Complexity kills the calm UX
Mitigation:
- progressive disclosure;
- default opinions;
- hide advanced settings until behavior proves demand.

### Risk 4 — Search and sync become invisible infrastructure work
Mitigation:
- productize them with visible command power and sync confidence screens.

---

## Recommended top-10 launch order across all 40 ideas
If the roadmap must be compressed, build in this exact order:
1. 29 — normalized backend
2. 30 — real auth
3. 4 — command palette
4. 5 — quick capture
5. 3 — editable notes
6. 2 — task detail drawer
7. 8 — today dashboard
8. 1 — inbox-to-today triage
9. 12 — weekly review
10. 6 — linked items

This sequence gives PerSpace:
- stronger trust;
- stronger daily habit loop;
- stronger product differentiation;
- a clean base for all later AI work.

## Final recommendation
Treat ideas 1–40 as one coherent system, not a backlog buffet. The correct build order is:
- **foundation first**,
- **rituals second**,
- **graph/search third**,
- **AI fourth**.

That is the shortest path from the current MVP to a true best-in-class personal operating system.
