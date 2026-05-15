---
name: add-initiative
description: >-
  Add a new initiative to the repo. Creates the initiative folder structure,
  registers it in DASHBOARD.md, creates ideas.md with the General project,
  and initializes the wiki. Use when the user wants to add a new top-level
  area of focus.
---

# Add Initiative

Use this skill when the user wants to create a **new initiative** - a top-level area of focus with its own ideas, projects, sources, outputs, and wiki.

Do not use Trello. Use only files in this repo.

Follow `SYSTEM_OVERVIEW.md` for folder layout, naming conventions, and wiki init rules.

## Inputs

Resolve from the user and files:

- **Initiative name** - the exact string that will become the folder name and appear in `DASHBOARD.md`. Must not duplicate an existing initiative folder.
- **Type** - one of: `business`, `personal brand`, or `creative project`. This determines the wiki domain structure.
- **Description** - one-line purpose for the `DASHBOARD.md` Initiatives table.
- **Tier points** - integer for the priority stack in `DASHBOARD.md`. Suggest a value that fits the existing stack (for example, between existing values or above/below all of them). Default to a value lower than all existing tiers if the user does not specify.

Do not create an initiative that already exists. If the name would conflict with an existing folder, stop and ask once.

## Folder structure to create

```
initiatives/[Initiative Name]/
  ideas.md
  sources/         (with .gitkeep)
  outputs/         (with .gitkeep)
  projects/
    General/
      .gitkeep
  wiki/
    index.md
    log.md
```

## Files to write

### `ideas.md`

Use this template (replace `[Initiative Name]` with the actual name):

```markdown
# [Initiative Name] - Ideas

Full idea list for this initiative. The root dashboard is [DASHBOARD.md](../../DASHBOARD.md). Lifecycle stages and gates are in `IDEA_LIFECYCLE.md`.

**In progress** means any idea that is not `Backlog`, moved to **Done**, or **Dropped**. Use the **Status** column for the full lifecycle label.

Artifact folders live at `projects/[Project Name]/[Idea Name]/` under this initiative. Ungrouped ideas use the **General** project.

---

## Projects

| Project | Purpose | Priority |
|---|---|---|
| General | Default bucket for ideas that do not belong to another project yet. | Medium |

Add rows here when you create named projects. **Project** names should match folder names under `projects/` exactly.

---

## Project: General

| Idea | Status | Priority | Last updated | Notes / next action |
|---|---|---|---|---|
| *(Add ideas here)* | | | | |

---

## Done

| Idea | Project | Completed | Outcome |
|---|---|---|---|
| | | | |

---

## Dropped

| Idea | Project | Date | Reason |
|---|---|---|---|
| | | | |

---

## Completed Projects

| Project | Completed | Outcome |
|---|---|---|
| | | |

---

## Dropped Projects

| Project | Date | Reason |
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

## DASHBOARD.md update

Add a row to the **Initiatives** table. Insert it at the position matching its tier points (highest at top). Set **Last initiative work** to today.

```
| [Tier points] | [Initiative Name](initiatives/[URL-encoded name]/ideas.md) | [Description] | [YYYY-MM-DD] |
```

URL-encode spaces as `%20` in the link path.

## Completion summary (return to user)

- Initiative name and type.
- Tier points assigned and position in the stack.
- Folders and files created (list them).
- Reminder to use **add-project** and **add-idea** to populate it, or **bootstrap** if this is the initial setup.
