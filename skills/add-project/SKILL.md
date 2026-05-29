---
name: add-project
description: >-
  Add a named project bucket to an initiative. Registers the project in
  priorities.json, creates the folder under projects/, and a 00-how-to-use.md
  orientation file. Use when the user wants to create a new project bucket.
---

# Add Project

Creates a **named project** inside an initiative. Register in `priorities.json` and on disk under `projects/`.

Follow `SYSTEM_OVERVIEW.md` and [`docs/priorities-registry.md`](../../docs/priorities-registry.md).

## Inputs

- **Initiative** — must exist under `initiatives/`.
- **Project name** — exact folder and JSON key; must not duplicate an existing project in that initiative's `priorities.json`.
- **Purpose** — one line (stored as `purpose` on the project entry).
- **Priority** — `High`, `Medium`, or `Low`. Default **Medium**.

## Files to touch

| Step | Action |
|---|---|
| 1 | Add project to `priorities.json` under the initiative: `{ "priority": "Medium", "purpose": "...", "ideas": {} }`. |
| 2 | Create `initiatives/[Initiative]/projects/[Project Name]/` (`.gitkeep` if empty). |
| 3 | Create `00-how-to-use.md` (links to `docs/priorities-registry.md`, `SYSTEM_OVERVIEW.md`, `IDEA_LIFECYCLE.md`). |
| 4 | Optionally set initiative `lastWork` to today. |

Do **not** edit `ideas.md` or `DASHBOARD.md`.

## Completion summary

- Initiative, project name, priority.
- Files created.
- Reminder to use **add-idea** for the first idea.
