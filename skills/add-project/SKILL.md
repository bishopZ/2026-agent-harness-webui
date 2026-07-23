---
name: add-project
description: >-
  Add a named project bucket to an initiative. Registers the project in
  priorities.json, creates the flat folder under the initiative root, optional
  repo/ submodule placeholder, and a 00-how-to-use.md orientation file. Use when
  the user wants to create a new project, add a project bucket, or group ideas
  under a named project.
---

# Add Project

Use this skill when the user wants to create a **named project** inside an initiative. A project is a bucket that groups related ideas. All it needs to exist is an entry in `priorities.json` and a folder under the initiative root (flat layout).

Do not use Trello. Use only files in this repo.

Follow `SYSTEM_OVERVIEW.md` (project priority, naming conventions) and [`docs/priorities-registry.md`](../../docs/priorities-registry.md).

## Inputs

Resolve from the user and files:

- **Initiative** - which `initiatives/[Initiative Name]/` folder (must exist). Ask once if ambiguous.
- **Project name** - the exact string for the folder name and `priorities.json` key. Must not duplicate an existing project under that initiative.
- **Purpose** - one-line description (stored as `purpose` on the project entry).
- **Priority** - `High`, `Medium`, or `Low` (or `1` / `2` / `3`). Default **Medium** when not specified.

Do not invent initiatives. Do not create a project that already exists in `priorities.json` for that initiative.

## Files to touch (checklist)

| Step | Action |
|---|---|
| 1 | Add project to `priorities.json` under the initiative: `{ "priority": "Medium", "purpose": "...", "ideas": {} }`. |
| 2 | Create `initiatives/[Initiative]/[Project Name]/` on disk (flat — no `projects/` container). Add `.gitkeep` if no other files will be placed there immediately. |
| 3 | Create `initiatives/[Initiative]/[Project Name]/00-how-to-use.md` (see below). |
| 4 | **If the project has an associated GitHub repo:** create an empty `repo/` subfolder with a `.gitkeep` inside. Add the **Repo** section to `00-how-to-use.md` (see below). Do not attempt to configure the submodule — tell the user to run `git submodule add <repo-url> "initiatives/[Initiative]/[Project Name]/repo"` from the repo root. |
| 5 | Optionally set initiative `lastWork` to today in `priorities.json` when this is a significant structural addition. |

Do **not** edit `ideas.md` or `DASHBOARD.md`.

## priorities.json project entry

```json
"Project Name": {
  "priority": "Medium",
  "purpose": "One-line purpose",
  "ideas": {}
}
```

## `00-how-to-use.md`

Keep it short. Include:

- A one-line statement that all idea work for this project lives under `initiatives/[Initiative]/[Project Name]/[Idea Name]/` (or relative: `[Project Name]/[Idea Name]/` from the initiative root).
- A link to [`docs/priorities-registry.md`](../../../docs/priorities-registry.md) (and mention root `priorities.json`).
- Links to `SYSTEM_OVERVIEW.md` and `IDEA_LIFECYCLE.md` at repo root. The file lives at `initiatives/[Initiative]/[Project Name]/00-how-to-use.md`, so three levels up: `../../../SYSTEM_OVERVIEW.md`.

Use an existing `00-how-to-use.md` in the same initiative as a template when one exists. If none exists, write a minimal version using the rules above.

If the project has an associated GitHub repo, append a **## Repo** section explaining that `repo/` is a git submodule placeholder and providing the exact `git submodule add` command the user needs to run (with the correct path, leaving `<repo-url>` for the user to fill in).

## Naming rules

- Folder name must match the `priorities.json` project key **exactly** (spaces allowed, same casing).
- Do not use special characters or slashes in project names.
- Project folders are **direct children** of the initiative — never under `projects/`.

## Completion summary (return to user)

- Initiative and project name created.
- Priority set.
- Files and folders touched (list them).
- Reminder to use the **add-idea** skill to populate the project with its first idea.
