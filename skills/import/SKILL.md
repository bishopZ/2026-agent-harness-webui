---
name: import
description: >-
  Import one or more project folders from an older version of this system into
  a current initiative. Verifies folder structure, reconciles ideas.md,
  registers missing projects and ideas, repairs broken links, and updates the
  dashboard. Use when the user wants to bring in projects from a previous or
  external copy of the knowledge system.
---

# Import

Use this skill when the user has dropped one or more project folders from an older version of this knowledge system into the current repo and wants them fully registered and linked.

Do not use Trello. Use only files in this repo.

Follow `SYSTEM_OVERVIEW.md` for folder layout, naming rules, valid statuses, and the `outputs/` vs `sources/` distinction. Follow `IDEA_LIFECYCLE.md` for valid lifecycle stage labels.

---

## Required folder structure (reference this throughout)

Every imported project **must** end up matching this layout exactly. Use it as the authoritative checklist in every step below.

```
initiatives/[Initiative Name]/
  ideas.md
  sources/                        ← initiative-level (immutable after ingestion)
  outputs/                        ← initiative-level deliverables
  projects/
    [Project Name]/               ← one folder per project
      00-how-to-use.md
      sources/                    ← project-level sources (.gitkeep if empty)
      outputs/                    ← project-level deliverables (.gitkeep if empty)
      [Idea Name]/                ← one folder per idea
        01_brief.md
        02_pressure_test.md       ← present only if that stage was reached
        ...
        outputs/                  ← idea-level deliverables (.gitkeep if empty)
  wiki/
    index.md
    log.md
    .archive/
    [domain]/
    ...
```

**Key rules from `SYSTEM_OVERVIEW.md`:**
- `outputs/` is **required** at the project level and at every idea level — always create it if missing (with `.gitkeep`), regardless of whether deliverable files currently exist. Future work will deposit files here.
- `sources/` is **required** at the project level — always create it if missing (with `.gitkeep`).
- `sources/` is immutable. Never modify files inside it.
- Lifecycle artifact folders sit at `initiatives/[Initiative]/projects/[Project Name]/[Idea Name]/`, **not** directly under the initiative or grouped under a bare `projects/` parent that skips the named project folder.

---

## When to use

The user says they want to import projects, bring in old projects, migrate from an older system, or drop folders in and have them wired up.

---

## Step 1 - Locate the folders to import

Ask the user (or infer from context) which folders are being imported and into which initiative. Resolve:

- **Initiative** - the `initiatives/[Name]/` folder they are importing into. Must exist. Ask once if ambiguous.
- **Project folder paths** - where the imported folders are on disk right now. They may already be inside `initiatives/[Initiative]/projects/` (user dropped them there), or they may still be elsewhere (user will tell you). If they are not yet under `initiatives/[Initiative]/projects/`, move them there using a git-aware move (`git mv`) before continuing.

List all the project folders you found and confirm the initiative with the user before making any changes.

---

## Step 2 - Audit each project folder

For each imported project folder, work through the checklist below. Do not stop on the first problem; audit the whole folder first, then report all findings before fixing anything.

### 2a - Folder name

The folder name becomes the **Project** column value in `ideas.md`. Check that it:

- Contains no slashes or other characters that break Markdown links.
- Does not duplicate an existing active project name in the initiative's `ideas.md`.

If the name would collide with an existing project, flag it and ask the user whether to rename the incoming folder or merge its ideas into the existing project.

### 2b - Idea subfolders

List every subfolder inside the project folder. Each subfolder is an idea. For each idea subfolder, check:

| What to check | Pass condition | Fail action |
|---|---|---|
| Folder name matches a valid idea name (noun-style, no slashes) | Name is usable as-is | Flag; ask user if rename is needed |
| `01_brief.md` exists | File present | Note as missing - idea will be registered at `Backlog` |
| Lifecycle artifacts are in order (`02_*`, `03_*`, etc.) | Files consistent with `IDEA_LIFECYCLE.md` stage order | Note any gaps; do not repair stage content |
| `outputs/` subfolder is present | Folder present | **Required repair** - create `outputs/` with `.gitkeep` in Step 4 regardless of whether deliverable files currently exist |
| No source documents are sitting loose at the idea root | Loose docs belong in `sources/` or `outputs/` | Flag; ask user where they belong |

### 2c - Project-level files

Check each of the following. All three are **required** regardless of whether any work has been done in the project yet. Mark any missing item as a required repair.

- `sources/` subfolder exists. If missing: **required repair** — create with `.gitkeep`.
- `outputs/` subfolder exists. If missing: **required repair** — create with `.gitkeep`. Do not defer this on the assumption that no deliverables exist yet; the folder must be present so future work has a home.
- `00-how-to-use.md` exists. If missing: **required repair** — create it (see **`00-how-to-use.md`** section below).

### 2d - Existing `ideas.md` entries

Read the initiative's `ideas.md` and check whether the project is already listed under **## Projects** and whether each idea already has a row under **## Project: [Name]**.

Record the result for each project and idea: **already registered**, **missing from `ideas.md`**, or **conflicting** (a row exists but points to a different folder path or has a mismatched name).

---

## Step 3 - Report findings before changing anything

Before writing any files, show the user a summary table. Use this format:

```
Project: [Name]
  Folder:          initiatives/[Initiative]/projects/[Name]/
  ideas.md status: not registered / already registered / conflict
  Issues found:
    - [list each issue from Step 2]
  Ideas found: [count]
    - [Idea Name] - [01_brief.md present? yes/no] - [inferred status]
    - ...
```

Then state what actions you plan to take. Wait for the user to confirm before writing any files.

---

## Step 4 - Execute repairs and registration

Run in order for each project.

### 4a - Register the project in `ideas.md` (if not already present)

1. Add a row to **## Projects**:

   ```
   | [Project Name] | [Purpose - infer from 00-how-to-use.md or ask] | active |
   ```

   If a **Priority** column exists in the table, default to `Medium` and note it in your summary.

2. Add **## Project: [Exact Name]** section with the standard idea table. Place it after the last existing **## Project:** section and before **## Done**.

### 4b - Register ideas in the project section

For each idea subfolder:

- **If already in `ideas.md`:** verify the row's **Status**, **Priority**, and **Notes / next action** are plausible given the artifacts on disk. If the row says `Backlog` but `05_build/` exists, flag the drift - do not silently change the status. Report it and let the user decide.
- **If not in `ideas.md`:** add a row. Use this logic to set **Status**:

  | Highest artifact present | Default status to assign |
  |---|---|
  | None / only `01_brief.md` missing | `Backlog` |
  | `01_brief.md` | `Brief` |
  | `02_pressure_test.md` | `PressureTest` |
  | `02_market_research.md` or `02b_customer_discovery.md` | `Research` |
  | `03_prd.md` | `PRD` |
  | `04_design.md` | `Design` |
  | `05_build/` folder (non-empty) | `Build` |
  | `06_evaluation.md` | `Evaluation` |
  | `07_launch_plan.md` | `Launch` |
  | `08_marketing_pack.md` | `Marketing` |
  | `09_growth_log.md` | `Growth` |

  Set **Priority** to `Medium` unless the user specified otherwise. Set **Last updated** to today. Set **Notes / next action** to `Imported [YYYY-MM-DD] - verify status and next step.`

- **If the idea row exists but the folder was missing** (the reverse gap): note it in your summary. Do not delete the row; add a note in **Notes / next action** that the artifact folder was not found.

### 4c - Handle Done and Dropped ideas

If the imported `ideas.md` (from the old system) has rows in **## Done** or **## Dropped** sections, copy those rows into the current initiative's `ideas.md` **## Done** and **## Dropped** tables. Do not duplicate rows that already exist.

### 4d - Create missing folder structure

Apply every repair flagged in Steps 2b and 2c. Work through this checklist for every imported project:

**Project level** (`initiatives/[Initiative]/projects/[Project Name]/`):
- If `sources/` is missing: create it with `.gitkeep`.
- If `outputs/` is missing: create it with `.gitkeep`. This is **always required** — do not skip it because no deliverable files exist yet.
- If `00-how-to-use.md` is missing: create it now (see **`00-how-to-use.md`** section below).

**Idea level** (`initiatives/[Initiative]/projects/[Project Name]/[Idea Name]/`):
- If `outputs/` is missing inside any idea folder: create it with `.gitkeep`. This is **always required** for every idea folder, not only for ideas with existing deliverables.

List every folder and file created in your completion summary.

### 4e - Fix broken links

Search `ideas.md`, `DASHBOARD.md`, and the initiative's `wiki/index.md` for links that point at old paths (for example the old initiative name or an old project folder path). Update them to the correct current paths. List every link you changed in your summary.

---

## Step 5 - Update the dashboard

1. **`DASHBOARD.md`** - update **Last initiative work** to today for the initiative you imported into.
2. If any imported idea has status `In Review` (it was awaiting approval in the old system), add a matching row to **Awaiting your approval** in the tracker. Ask the user to confirm these before adding them, because they may no longer apply.

---

## Step 6 - Wiki log

Append a dated entry to `initiatives/[Initiative]/wiki/log.md`:

```
## [YYYY-MM-DD] update | Import - [N] project(s) imported

Projects imported: [list names]
Ideas registered: [count] new, [count] already present, [count] flagged for drift
Issues requiring user review: [list or "none"]
```

---

## `00-how-to-use.md`

Create this only when the project folder lacks one. Keep it short:

- One line stating all idea work for this project lives under `projects/[Project Name]/[Idea Name]/`.
- A link to the initiative's `ideas.md` at `../../ideas.md`.
- Links to `SYSTEM_OVERVIEW.md` and `IDEA_LIFECYCLE.md` at the repo root. The file lives at `initiatives/[Initiative]/projects/[Project Name]/00-how-to-use.md`, so the repo root is four levels up: `../../../../SYSTEM_OVERVIEW.md`.

---

## Completion summary (return to user)

After all changes are written:

- Initiatives and projects imported (list them).
- Ideas registered: new rows added, rows already present, rows flagged for drift.
- Folders created (list every new `sources/`, `outputs/`, and idea folder, noting whether it required creation).
- Files created or modified (list them).
- Any issues that still need your decision (name collisions, status drift, `In Review` carryovers, misplaced files).
- Folder structure verification: confirm that every imported project now matches the canonical layout in the **Required folder structure** section at the top of this skill. If any folder is still missing, explain why and what the user needs to do.
- Reminder to run the **health-check** skill if multiple projects were imported, to verify the full tracker is consistent.

---

## Guardrails

- Never modify files inside any `sources/` folder. They are immutable after ingestion.
- Do not silently resolve name collisions. Always ask when an imported project name matches an existing one.
- Do not silently upgrade or downgrade idea statuses based on artifacts alone. Flag drift and ask; the user decides.
- Do not delete rows from **## Done** or **## Dropped** even if they look stale.
- Do not import into an initiative that does not exist. Ask the user which initiative to use.
- **Always create `outputs/`** at both the project level and every idea level. Never skip `outputs/` creation because no deliverable files exist yet — the folder is required by the system regardless.
- **Always create `sources/`** at the project level even if no source documents exist yet.
- Project folders must live under `initiatives/[Initiative]/projects/[Project Name]/`, not directly under the initiative root or nested inside a bare `projects/` folder that lacks the named project subfolder.
- If the imported folder contains a `wiki/` subfolder, do not merge it automatically into the current initiative wiki. Flag it and ask the user whether to merge, ingest as sources, or leave it in place.
