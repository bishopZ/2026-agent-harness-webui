---
name: remove-initiative
description: >-
  Remove an initiative from the repo. If it has active ideas or projects,
  offers options before proceeding. Removes the initiative folder, its
  DASHBOARD.md row, and cleans up any approval queue entries. Use when the
  user wants to retire or delete a top-level area of focus.
---

# Remove Initiative

Use this skill when the user wants to **remove an initiative** entirely from the repo.

Do not use Trello. Use only files in this repo.

Follow `SYSTEM_OVERVIEW.md` (archive rules, naming conventions) and `DASHBOARD.md` for the current initiative stack.

## Inputs

Resolve from the user and files:

- **Initiative name** - must match an existing folder under `initiatives/` exactly. Ask once if ambiguous.

Do not proceed if the name does not match an existing initiative.

## Step 1 - Read and report

Before making any changes:

1. Open `initiatives/[Initiative Name]/ideas.md`.
2. Count all active ideas across all projects (Status is not `Done`, `Dropped`, or blank).
3. List all projects found in the **## Projects** table.
4. Check whether any rows exist in **Awaiting your approval** in `DASHBOARD.md` for this initiative.
5. Note whether a `wiki/` folder exists with pages beyond the initial `index.md` and `log.md`.

Report this summary to the user before touching anything.

## Step 2 - Handle active ideas (stop and ask if any exist)

If there are **no active ideas**, skip to Step 3.

If there are **active ideas**, stop and ask the user to choose one of two options for the entire initiative:

---

**Option A - Archive everything**
Move the entire `initiatives/[Initiative Name]/` folder to `archive/[Initiative Name] - [YYYY-MM-DD]/` using a git-aware move. The initiative's history, wiki, sources, outputs, and all project artifacts are preserved in the archive bundle. Add a `README.md` at the archive root noting the initiative name, removal date, and reason.

**Option B - Handle projects individually first**
Use the **remove-project** skill on each named project to resolve active ideas (archive, move, or delete) before removing the initiative shell. This is the right choice when some ideas should move to a different initiative rather than disappear.

---

Wait for the user's choice before proceeding.

## Step 3 - Execute removal

### If Option A (archive everything):

1. Move `initiatives/[Initiative Name]/` to `archive/[Initiative Name] - [YYYY-MM-DD]/` using `git mv`.
2. Create `archive/[Initiative Name] - [YYYY-MM-DD]/README.md`:
   ```
   # Archived Initiative: [Name]
   **Removed:** [YYYY-MM-DD]
   **Reason:** [user-supplied reason or "retired"]
   **Contents:** Full initiative folder including wiki, sources, outputs, and all project artifacts.
   ```

### If Option B (projects already cleared):

1. Confirm all projects are now empty or resolved.
2. If the `initiatives/[Initiative Name]/` folder still contains anything other than empty scaffold files (`.gitkeep`, empty `wiki/`, empty `sources/`, empty `outputs/`), ask the user what to do with the remaining files.
3. Remove the folder entirely (`git rm -r`).

### In both cases:

1. Remove the initiative row from the **Initiatives** table in `DASHBOARD.md`.
2. Remove any rows in **Awaiting your approval** in `DASHBOARD.md` that reference this initiative.
3. If `AGENTS.md` lists this initiative in the **Three active initiatives** table, remove that row.

## Completion summary (return to user)

- Initiative name removed.
- Option taken (archived to path / folder deleted).
- Rows removed from `DASHBOARD.md` (initiative row, approval queue rows).
- Any other files touched.
- Reminder to update `USER.md` if the initiative was listed there.

## Guardrails

- Never silently delete an initiative with active ideas. Always present Option A or B and wait.
- Never remove the last remaining initiative. At least one must exist.
- Do not modify files inside `sources/` during the removal.
- If the user asks to move ideas to another initiative, use **remove-project** (which handles moves) on each project first, then remove the empty initiative shell.
