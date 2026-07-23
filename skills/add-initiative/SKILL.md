---
name: add-initiative
description: >-
  Add a new initiative to the repo. Creates the initiative folder structure,
  registers it in priorities.json with a General project, creates history/
  templates and project-history.md, and initializes the wiki. Use when the user
  wants to add a new top-level area of focus.
---

# Add Initiative

Use this skill when the user wants to create a **new initiative** - a top-level area of focus with its own ideas, projects, sources, outputs, and wiki.

Do not use Trello. Use only files in this repo.

Follow `SYSTEM_OVERVIEW.md` for folder layout, naming conventions, and wiki init rules. Follow [`docs/priorities-registry.md`](../../docs/priorities-registry.md) for the registry.

Register in **`priorities.json`**; do **not** create `ideas.md` or `DASHBOARD.md`.

## Inputs

Resolve from the user and files:

- **Initiative name** - the exact string that will become the folder name and the `priorities.json` key. Must not duplicate an existing initiative folder.
- **Type** - one of: `business`, `personal brand`, or `creative project`. This determines the wiki domain structure.
- **Description** - one-line purpose (stored as General project `purpose` and for chat summary).
- **Tier points** - integer in `priorities.json`. Suggest a value that fits the existing stack (for example, between existing values or above/below all of them). Default to a value lower than all existing tiers if the user does not specify.

Do not create an initiative that already exists. If the name would conflict with an existing folder, stop and ask once.

## Folder structure to create

```
initiatives/[Initiative Name]/
  history/
    done-history.md
    dropped-history.md
  project-history.md
  sources/         (with .gitkeep)
  outputs/         (with .gitkeep)
  General/         (default project; flat — direct child; .gitkeep if empty)
  wiki/
    index.md
    log.md
```

Do **not** create a `projects/` container or `ideas.md`.

## Files to write

### `history/done-history.md`

```markdown
# [Initiative Name] Done History

Long-form records for completed ideas.

| Idea | Project | Completed | Outcome |
|---|---|---|---|
```

### `history/dropped-history.md`

```markdown
# [Initiative Name] Dropped History

Long-form records for dropped ideas.

| Idea | Project | Date | Reason |
|---|---|---|---|
```

### `project-history.md`

```markdown
# Project History

_Projects are closed — not completed or dropped._

## Closed Projects

| Project | Date | Notes |
|---|---|---|
| | | |
```

### `wiki/index.md`

Use the domain structure from `SYSTEM_OVERVIEW.md` that matches the initiative **type**. The page title should be `# [Initiative Name] Wiki Index`. Include all six domain sections with `*(no pages yet)*` placeholder rows and the standard footer: `*Last updated: [YYYY-MM-DD] - Wiki initialized with domain structure*`.

### `wiki/log.md`

```markdown
# [Initiative Name] Wiki Log

Append-only record of all wiki activity. Each entry starts with a consistent prefix for easy scanning.

Format: `## [YYYY-MM-DD] operation | description`

Operations: `ingest`, `query`, `update`, `lint`, `init`

---

## [YYYY-MM-DD] init | Wiki created

Wiki initialized as part of system setup. No sources ingested yet.
```

## priorities.json entry

Add under `initiatives` (set `updated` at the root to today):

```json
"[Initiative Name]": {
  "tier": 5,
  "lastWork": "YYYY-MM-DD",
  "projects": {
    "General": {
      "priority": "Medium",
      "purpose": "[Description]",
      "ideas": {}
    }
  }
}
```

Insert the initiative so its `tier` fits the intended stack position (higher tier = more pull).

## Completion summary (return to user)

- Initiative name and type.
- Tier points assigned and position in the stack.
- Folders and files created (list them).
- Reminder to use **add-project** and **add-idea** to populate it, or **bootstrap** if this is the initial setup.

## Guardrails

- Do **not** create or edit `ideas.md` or `DASHBOARD.md`.
- Do **not** nest projects under `projects/` — use flat `initiatives/[Name]/[Project]/`.
