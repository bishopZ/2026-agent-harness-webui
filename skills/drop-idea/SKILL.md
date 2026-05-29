---
name: drop-idea
description: >-
  Kill an idea: set lifecycle Dropped in priorities.json, archive artifacts
  when present, update wiki. Use when the user drops, kills, or abandons an idea.
---

# Drop Idea

Set `lifecycle: "Dropped"` in `priorities.json`. Archive folder when present.

Follow `SYSTEM_OVERVIEW.md`, `IDEA_LIFECYCLE.md`, and [`docs/priorities-registry.md`](../../docs/priorities-registry.md).

## Inputs

- **Idea** (required), **Reason** (required), **Initiative**, **Project**, **Date** (default today).

## No folder case

Set `lifecycle: "Dropped"`, `notes` with reason, `lastUpdated` to date. Update `lastWork` if appropriate.

## Full workflow

1. Locate in `priorities.json`.
2. Archive `projects/[Project]/[Idea]/` to `archive/...` (same rules as **complete-idea**).
3. Set `lifecycle: "Dropped"`, `notes` with reason and archive link.
4. Wiki `log.md` / domain pages when lessons matter.

For **On Hold**, keep the idea active and set `lifecycle: "On Hold"` with reason in `notes` — do not use this skill.

Do not edit `ideas.md` or `DASHBOARD.md`.
