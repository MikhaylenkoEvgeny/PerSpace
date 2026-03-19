# PerSpace Phase 0–1 engineering backlog

## What this backlog covers
This backlog translates the immediate roadmap into the first implementation slices that should now be built in the repository.

## Epic A — Foundation reset
### A1. Replace snapshot-first state
- migrate reads away from whole-workspace POST persistence;
- add entity-level APIs for tasks and notes;
- keep snapshot only as import fallback.

### A2. Real authentication
- replace hardcoded credentials;
- add session endpoint and user-aware data access;
- add password hashing and account lifecycle.

### A3. Sync groundwork
- mutation envelope model;
- pending/synced/failed states;
- sync status badge in shell.

## Epic B — Speed to capture
### B1. Command palette
- global `Cmd/Ctrl+K` open;
- quick navigation;
- create-task and create-note actions;
- result ranking for quick actions before entity results.

### B2. Quick capture
- floating action entry point;
- mobile-safe modal;
- task/note creation without page switching.

## Epic C — Daily usability
### C1. Task detail drawer
- editable metadata;
- linked entities placeholder slots;
- completion and scheduling quick actions.

### C2. Editable notes
- in-place editing;
- autosave indicator;
- last-edited timestamp.

### C3. Today dashboard
- today focus list;
- overdue count;
- pinned note highlight;
- one suggested next action.

### C4. Weekly review v1
- completed this week;
- stuck items;
- neglected items;
- choose next-week candidates.

## Recommended delivery order
1. entity-level tasks/notes API foundation
2. command palette
3. quick capture
4. task detail drawer
5. editable notes
6. today dashboard
7. weekly review
