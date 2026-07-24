---
name: import
description: >-
  Import one or more project folders from an older version of this system into
  a current initiative. Verifies folder structure, reconciles priorities.json,
  registers missing projects and ideas, repairs broken links, and updates
  lastWork. Use when the user wants to bring in projects from a previous or
  external copy of the knowledge system.
---

# Import

Use this skill when the user has dropped one or more project folders from an older version of this knowledge system into the current repo and wants them fully registered and linked.

Do not use Trello. Use only files in this repo.

Follow `SYSTEM_OVERVIEW.md` for folder layout, naming rules, valid statuses, and the `outputs/` vs `sources/` distinction. Follow `IDEA_LIFECYCLE.md` for valid lifecycle stage labels. Follow [`docs/priorities-registry.md`](../../docs/priorities-registry.md) for the registry.

Do **not** create or edit `ideas.md` or `DASHBOARD.md`.

---

## Required folder structure (reference this throughout)

Every imported project **must** end up matching this layout exactly. Use it as the authoritative checklist in every step below.

```
initiatives/[Initiative Name]/
  history/
    done-history.md
    dropped-history.md
  project-history.md
  sources/                        ← initiative-level (immutable after ingestion)
  outputs/                        ← initiative-level deliverables
  [Project Name]/                 ← one folder per project (direct child of initiative)
    00-how-to-use.md
    repo/                         ← optional git submodule for this project’s codebase
    sources/                      ← project-level sources (.gitkeep if empty)
    outputs/                      ← project-level deliverables (.gitkeep if empty)
    [Idea Name]/                  ← one folder per idea
      01_brief.md
      02_pressure_test.md       ← present only if that stage was reached
      ...
      outputs/                    ← idea-level deliverables (.gitkeep if empty)
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
- Lifecycle artifact folders sit at `initiatives/[Initiative]/[Project Name]/[Idea Name]/`. Project folders are **not** under a `projects/` wrapper — they sit alongside `wiki/`, `sources/`, `outputs/`, and `history/` for that initiative.

---

## When to use

The user says they want to import projects, bring in old projects, migrate from an older system, or drop folders in and have them wired up.

---

## Step 1 - Locate the folders to import

Ask the user (or infer from context) which folders are being imported and into which initiative. Resolve:

- **Initiative** - the `initiatives/[Name]/` folder they are importing into. Must exist. Ask once if ambiguous.
- **Project folder paths** - where the imported folders are on disk right now. They may already be at `initiatives/[Initiative]/[Project Name]/` (user dropped them there), or they may still be elsewhere (user will tell you). If they are not yet in the right place, move them to `initiatives/[Initiative]/[Project Name]/` using a git-aware move (`git mv`) before continuing. If you are upgrading imports from a **v1.x** tree that used `initiatives/.../projects/[Project Name]/`, move up one level to the flat layout first.

List all the project folders you found and confirm the initiative with the user before making any changes.

---

## Step 2 - Audit each project folder

For each imported project folder, work through the checklist below. Do not stop on the first problem; audit the whole folder first, then report all findings before fixing anything.

### 2a - Folder name

The folder name becomes the project key in `priorities.json`. Check that it:

- Contains no slashes or other characters that break paths or JSON keys.
- Does not duplicate an existing active project name under that initiative in `priorities.json`.

If the name would collide with an existing project, flag it and ask the user whether to rename the incoming folder or merge its ideas into the existing project.

### 2b - Idea subfolders

List every subfolder inside the project folder (skip `sources/`, `outputs/`, `repo/`). Each remaining subfolder is an idea. For each idea subfolder, check:

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

### 2d - Existing `priorities.json` entries

Read root `priorities.json` and check whether the project is already listed under the initiative and whether each idea already has an entry.

Record the result for each project and idea: **already registered**, **missing from `priorities.json`**, or **conflicting** (an entry exists but points to a different folder path or has a mismatched name).

---

## Step 3 - Report findings before changing anything

Before writing any files, show the user a summary table. Use this format:

```
Project: [Name]
  Folder:          initiatives/[Initiative]/[Name]/
  priorities.json: not registered / already registered / conflict
  Issues found:
    - [list each issue from Step 2]
  Ideas found: [count]
    - [Idea Name] - [01_brief.md present? yes/no] - [inferred lifecycle]
    - ...
```

**In Review checklist (required):** Also list every idea that will land in the Web UI approval queue:

```
In Review (approval queue): [count]
  - [Idea] — source: ideas.md | artifact detector — reviewDocumentPath: initiatives/.../0N_....md
```

State the expected approval-queue count. Wait for the user to confirm before writing any files — treat the In Review list as an explicit checklist item, not an afterthought.

---

## Step 4 - Execute repairs and registration

Run in order for each project.

### 4a - Register the project in `priorities.json` (if not already present)

Add under the initiative’s `projects`:

```json
"[Project Name]": {
  "priority": "Medium",
  "purpose": "[Purpose - infer from 00-how-to-use.md or ask]",
  "ideas": {}
}
```

Default `priority` to `Medium` and note it in your summary.

### 4b - Register ideas under the project

For each idea subfolder:

- **If already in `priorities.json`:** verify `lifecycle`, `priority`, and `notes` are plausible given the artifacts on disk. If the entry says `Backlog` but `05_build/` exists, flag the drift - do not silently change the lifecycle. Report it and let the user decide.
- **If not in `priorities.json`:** add an entry. Use this logic to set **lifecycle**:

  | Highest artifact present | Default lifecycle to assign |
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

  **Waiting-state override (do this before accepting the stage default):**

  1. Prefer an **`ideas.md` In Review row** for this idea when step 4c found one — that wins over filename mapping.
  2. Otherwise inspect the **latest stage artifact** (same order as the table above; for Build prefer `05_build_plan.md` or `06_evaluation.md` over nested verification-log noise). Treat as awaiting approval when body or YAML status matches any of:
     - `/in\s*review/i` (covers `**Status:** In Review`, `Draft (In Review)`, YAML `status: In Review`, etc.)
     - `/draft/i` **and** `/awaiting (approval|owner|review)/i`
     - YAML or `**Status:**` is `Draft` / `Drafted`, and the artifact is **not** marked superseded, blocked, or “do not approve”
  3. If awaiting: set `lifecycle` to **`In Review`** and add `reviewDocumentPath:` to that latest stage file (harness-root path — see below).
  4. Only if not awaiting: use the highest-artifact stage mapping from the table.

  Do **not** rely on an exact ``**Status:** In Review`` string alone — that missed most queue rows on real imports.

  Set **priority** to `Medium` unless the user specified otherwise. Set **lastUpdated** to today. Set **notes** to `Imported [YYYY-MM-DD] - verify status and next step.` (plus `reviewDocumentPath` when `In Review`).

  **`reviewDocumentPath` convention:** harness-root relative, always including the `initiatives/` prefix (see `AGENTS.md`). Example: `reviewDocumentPath: initiatives/Time2Magic/Cloudscape Addons/Merge articles and docs/02_pressure_test.md`. The Web UI `/api/render` accepts both this form and initiatives-relative sidebar paths — do **not** invent a second convention by stripping `initiatives/`.

- **If the idea entry exists but the folder was missing** (the reverse gap): note it in your summary. Do not delete the entry; add a note in **notes** that the artifact folder was not found.

### 4c - Handle legacy `ideas.md` (In Review, Done, Dropped)

If the imported material still has an initiative `ideas.md` (or equivalent), treat it as a **temporary source of truth** for queue and history — apply it **before** deleting or ignoring the file.

1. **In Review (approval queue):** Parse Active idea tables. For every row with Status **In Review**:
   - Ensure the idea is registered under the correct project.
   - Set `lifecycle: "In Review"`.
   - Set `reviewDocumentPath:` from the row’s primary stage-artifact link (resolve relative to the initiative folder; after any folder remaps such as flattening nested idea folders, rewrite the path to the current disk location).
   - Prefer this over filename→stage mapping in 4b.
2. **Done / Dropped:** Append those rows into the current initiative’s `history/done-history.md` and `history/dropped-history.md` tables. Also set matching `lifecycle` values in `priorities.json` when the ideas are registered. Do not duplicate history rows that already exist.
3. **Do not delete `ideas.md` until** In Review, Done, and Dropped rows have been applied to `priorities.json` (or the user explicitly confirms skipping specific rows). Leave deletion to a later cleanup or health-check pass after registry verification — never delete the queue source mid-import.

If the import still has legacy markdown registries at the harness root, mention `npm run migrate-registry` once after structural import (see [`docs/priorities-registry.md`](../../docs/priorities-registry.md)).

### 4d - Create missing folder structure

Apply every repair flagged in Steps 2b and 2c. Work through this checklist for every imported project:

**Project level** (`initiatives/[Initiative]/[Project Name]/`):
- If `sources/` is missing: create it with `.gitkeep`.
- If `outputs/` is missing: create it with `.gitkeep`. This is **always required** — do not skip it because no deliverable files exist yet.
- If `00-how-to-use.md` is missing: create it now (see **`00-how-to-use.md`** section below).

**Idea level** (`initiatives/[Initiative]/[Project Name]/[Idea Name]/`):
- If `outputs/` is missing inside any idea folder: create it with `.gitkeep`. This is **always required** for every idea folder, not only for ideas with existing deliverables.

**Initiative level:** ensure `history/done-history.md`, `history/dropped-history.md`, and `project-history.md` exist (create empty templates if missing).

List every folder and file created in your completion summary.

### 4e - Fix broken links

Search `priorities.json` notes and the initiative's `wiki/index.md` for links that point at old paths (for example the old initiative name, a legacy `projects/` path, or an old project folder path). Update them to the correct current paths. List every link you changed in your summary.

---

## Step 5 - Update the registry timestamps

1. Set initiative `lastWork` to today in `priorities.json` for the initiative you imported into. Set root `updated` to today.
2. If any imported idea has lifecycle `In Review`, confirm with the user before leaving them in the Web UI approval queue — they may no longer apply.

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

- One line stating all idea work for this project lives under `initiatives/[Initiative]/[Project Name]/[Idea Name]/` (or relative: `[Project Name]/[Idea Name]/` from the initiative root).
- A link to [`docs/priorities-registry.md`](../../../docs/priorities-registry.md) and mention root `priorities.json`.
- Links to `SYSTEM_OVERVIEW.md` and `IDEA_LIFECYCLE.md` at the repo root. The file lives at `initiatives/[Initiative]/[Project Name]/00-how-to-use.md`, so the repo root is three levels up: `../../../SYSTEM_OVERVIEW.md`.

---

## Completion summary (return to user)

After all changes are written:

- Initiatives and projects imported (list them).
- Ideas registered: new entries added, entries already present, entries flagged for drift.
- Folders created (list every new `sources/`, `outputs/`, and idea folder, noting whether it required creation).
- Files created or modified (list them).
- Any issues that still need your decision (name collisions, status drift, `In Review` carryovers, misplaced files).
- Folder structure verification: confirm that every imported project now matches the canonical layout in the **Required folder structure** section at the top of this skill. If any folder is still missing, explain why and what the user needs to do.
- Reminder to run the **health-check** skill if multiple projects were imported, to verify the full registry is consistent.

---

## Guardrails

- Never modify files inside any `sources/` folder. They are immutable after ingestion.
- Do not silently resolve name collisions. Always ask when an imported project name matches an existing one.
- Do not silently upgrade or downgrade idea lifecycles based on artifacts alone. Flag drift and ask; the user decides.
- Do not delete rows from `history/done-history.md` or `history/dropped-history.md` even if they look stale.
- Do not import into an initiative that does not exist. Ask the user which initiative to use.
- **Always create `outputs/`** at both the project level and every idea level. Never skip `outputs/` creation because no deliverable files exist yet — the folder is required by the system regardless.
- **Always create `sources/`** at the project level even if no source documents exist yet.
- Project folders must live at `initiatives/[Initiative]/[Project Name]/`, not under a legacy `projects/` subfolder. If imports still use the old `.../projects/<Project>/` path from v1.x, re-home them to the flat layout before registering.
- If the imported folder contains a `wiki/` subfolder, do not merge it automatically into the current initiative wiki. Flag it and ask the user whether to merge, ingest as sources, or leave it in place.
- Do **not** edit `ideas.md` or `DASHBOARD.md` as living registries — migrate their In Review / Done / Dropped rows into `priorities.json` and history files first (step 4c), then leave deletion to a verified cleanup pass.
- Never delete `ideas.md` mid-import before In Review rows are applied to `priorities.json`.
