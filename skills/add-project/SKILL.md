---
name: add-project
description: >-
  Add a named project bucket to an initiative. Creates the Active Projects row,
  the Project section in ideas.md, the folder under projects/, and a
  00-how-to-use.md orientation file. Use when the user wants to create a new
  project, add a project bucket, or group ideas under a named project.
---

# Add Project

Use this skill when the user wants to create a **named project** inside an initiative. A project is a bucket that groups related ideas. All it needs to exist is a row in **Active Projects**, a section in `ideas.md`, and a folder under `projects/`.

Do not use Trello. Use only files in this repo.

Follow `SYSTEM_OVERVIEW.md` (project priority, naming conventions) and the target initiative's `ideas.md` layout.

## Inputs

Resolve from the user and files:

- **Initiative** - which `initiatives/[Initiative Name]/` folder (must exist). Ask once if ambiguous.
- **Project name** - the exact string that will appear in the **Project** column and as the folder name. Must not duplicate an existing active project in that initiative.
- **Purpose** - one-line description for the **Active Projects** table.
- **Priority** - `High`, `Medium`, or `Low` (or `1` / `2` / `3`). Default **Medium** when not specified.

Do not invent initiatives. Do not create a project that already exists in **Active Projects** for that initiative.

## Files to touch (checklist)

| Step | Action |
|---|---|
| 1 | Edit `initiatives/[Initiative]/ideas.md`. |
| 2 | Add a row to the **## Projects** table: **Project**, **Purpose**, **Priority**. |
| 3 | Add a **## Project: [Exact Name]** section below the existing project sections, with the standard idea table header and a placeholder row. |
| 4 | Create `initiatives/[Initiative]/projects/[Project Name]/` on disk. Add `.gitkeep` if no other files will be placed there immediately. |
| 5 | Create `initiatives/[Initiative]/projects/[Project Name]/00-how-to-use.md` (see below). |
| 6 | Optionally update **Last initiative work** in `DASHBOARD.md` to today when this is a significant structural addition the user wants to count toward recency. |

## Active Projects row format

The standard columns are **Project**, **Purpose**, **Priority**. Set **Priority** to the value the user specified, or default to `Medium`.

```
| [Project Name] | [Purpose one line] | Medium |
```

## Project section format

Place the new section after the last existing **## Project:** section, before **## Done**. Use this structure:

```markdown
## Project: [Exact Name]

| Idea | Status | Priority | Last updated | Notes / next action |
|---|---|---|---|---|
| *(Add ideas here)* | | | | |
```

The **Project** column header and the section heading must match the **Project** column in **## Projects** exactly, including spacing and casing.

## `00-how-to-use.md`

Keep it short. Include:

- A one-line statement that all idea work for this project lives under `projects/[Project Name]/[Idea Name]/`.
- A link to the initiative's `ideas.md` at `../../ideas.md`.
- Links to `SYSTEM_OVERVIEW.md` and `IDEA_LIFECYCLE.md` at repo root. Adjust `../` depth by counting path segments from this file to the repo root (the file lives at `initiatives/[Initiative]/projects/[Project Name]/00-how-to-use.md`, so four levels up: `../../../../SYSTEM_OVERVIEW.md`).

Use an existing `00-how-to-use.md` in the same initiative as a template when one exists. If none exists, write a minimal version using the rules above.

## Naming rules

- Folder name must match the **Project** column **exactly** (spaces allowed, same casing).
- Do not use special characters or slashes in project names.
- The section heading **## Project: [Name]** must use the identical string.

## Completion summary (return to user)

- Initiative and project name created.
- Priority set.
- Files and folders touched (list them).
- Reminder to use the **add-idea** skill to populate the project with its first idea.
