---
name: complete-idea
description: >-
  Mark an idea as finished, move lifecycle artifacts to archive/, set lifecycle
  Done in priorities.json, and update wiki. Use when the user says an idea is
  complete, done, shipped, or finished.
---

# Complete Idea

Mark an idea **Done** in `priorities.json`. Archive `projects/[Project]/[Idea]/` when it exists.

Follow `SYSTEM_OVERVIEW.md`, `IDEA_LIFECYCLE.md`, and [`docs/priorities-registry.md`](../../docs/priorities-registry.md).

## Inputs

- **Idea** (required), **Initiative**, **Project** if needed.
- **Outcome** for `notes` and archive README.
- **Completed date** — default today.

## No folder case

If there is no `projects/[Project]/[Idea]/` folder:

1. Set `lifecycle: "Done"` in `priorities.json`, update `notes` with outcome, `lastUpdated` to completed date.
2. Set initiative `lastWork` if appropriate.

## Full workflow

1. Locate idea in `priorities.json`.
2. Move `initiatives/.../projects/[Project]/[Idea]/` to `archive/{Prefix} - {Idea} - {YYYY-MM-DD}/` per `SYSTEM_OVERVIEW.md`.
3. Set `lifecycle: "Done"`, update `notes` (outcome + archive link), `lastUpdated`.
4. Clear `In Review` if still set.
5. Update `wiki/log.md` and `wiki/index.md` when relevant.
6. Fix broken links in wiki and artifacts.

Do not edit `ideas.md` or `DASHBOARD.md`.
