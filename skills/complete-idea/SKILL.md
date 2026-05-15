---
name: complete-idea
description: >-
  Mark an idea as finished, move lifecycle artifacts and outputs/ to repo
  archive/, update ideas.md Done section with links to deliverables, tracker,
  and wiki. Use when the user says an idea is complete, done, shipped, or
  finished, or asks to close an idea successfully.
---

# Complete Idea

Use this skill when the user wants to **finish** an idea and record it under **Done**, including **archive** handling when a lifecycle folder exists.

Do not use Trello. Only use files in this repo.

Follow `SYSTEM_OVERVIEW.md` (archive rules, naming), `IDEA_LIFECYCLE.md`, and the target initiative’s `ideas.md` layout.

## Inputs

Resolve from the user and files:

- **Idea** name (required). Must match the **Idea** column and folder name under `projects/` when a folder exists.
- **Initiative** and **Project** if given. If the name is ambiguous across initiatives or projects, stop and ask once.
- **Outcome** (required). One to three sentences for the **Done** table. Mention finished deliverables in `outputs/` and link to them. Also mention anything else that **stays** in the live tree (for example ongoing files under `projects/.../sources/`).
- **Completed date** (optional). Default **today** in `YYYY-MM-DD`.

## When no idea folder exists

If the idea only has a row in `ideas.md` and **no** `projects/[Project]/[Idea]/` folder:

1. Remove the row from its **Project:** section.
2. Append a row to **## Done** with **Idea**, **Project**, **Completed**, **Outcome**.
3. Remove any matching row from **Awaiting your approval** in `DASHBOARD.md`.
4. Set **Last initiative work** to **Completed date** for that initiative when this session closed real work.
5. Skip archive directory steps. Summarize what you changed.

## Full workflow (idea folder or artifacts exist)

Run in order.

### 1. Locate and verify

1. Open the correct `initiatives/[Initiative]/ideas.md`.
2. Find the idea row under the right **Project:** section.
3. Confirm the user intends **Done** (success), not **Dropped**. If they want to kill the idea, use **drop-idea** instead.

### 2. Plan the archive bundle

1. **Inner folder name** must match the existing idea folder under `projects/[Project]/` exactly (same spelling and casing as the **Idea** column).
2. **Bundle path** at repo root: `archive/{Prefix} - {Idea} - {YYYY-MM-DD}/`
   - **Prefix** should match other `archive/` folders for this initiative when any exist (for example `My Company`, `My Personal Life`). If this is the first bundle for that initiative, use the concise prefix from `SYSTEM_OVERVIEW.md` **Archived items** or the same style as sibling bundles in `archive/`.
3. Create `archive/{Prefix} - {Idea} - {YYYY-MM-DD}/README.md` using the pattern in existing bundles when any exist. Include **Initiative**, **Project**, **Idea**, **Archived** date, what stayed in the live tree (with relative links), and a **Contents** list.

### 3. Move lifecycle artifacts and outputs

1. Move the entire directory `initiatives/[Initiative]/projects/[Project]/[Idea]/` into the bundle as `archive/.../[Idea]/`. This includes both the lifecycle stage files and the `outputs/` subfolder if one exists. Prefer a git-aware move so history is preserved (`git mv` when the repo is in good shape).
2. If **some** files must remain under `projects/` (for example ongoing **sources**), move only the lifecycle subtree (and the `outputs/` folder) and document which paths stayed in the bundle **README** and in the **Done** row **Outcome**.
3. Remove the idea row from the active **Project:** table.

### 4. Record Done

Add a row to **## Done**:

| Column | Content |
| --- | --- |
| **Idea** | Exact name |
| **Project** | Exact project |
| **Completed** | `YYYY-MM-DD` |
| **Outcome** | User-facing summary, links to finished deliverables in `outputs/` (relative paths from `ideas.md`), and a link to the archive bundle (URL-encoded paths as in existing `ideas.md` rows) |

If **## Done** still has an empty placeholder row, replace or remove placeholders so the table stays valid.

### 5. Dashboard and artifacts hygiene

1. **DASHBOARD.md** - Remove any **Awaiting your approval** row for this idea.
2. **Final stamps** - If key markdown files remain in the tree, you may add `Completed` or `Approved` notes near the top. For files inside the bundle only, the **README** is enough.
3. **Broken links** - Search the initiative (and repo root tracker) for links to the old `projects/.../[Idea]/` paths and update them to the archive path or to any replacement live path.

### 6. Wiki

1. Append a dated block to `initiatives/[Initiative]/wiki/log.md` using the house style (`## [YYYY-MM-DD] update | …`). Summarize completion, archive location, and anything that remains live.
2. Update `wiki/index.md` when new cross-references or “see also” rows are needed so the wiki still points at the right artifacts.

### 7. Tracker date

If this completion was substantive, set that initiative’s **Last initiative work** in `DASHBOARD.md` to **Completed date**.

## Completion summary (return to user)

- Idea and initiative.
- **Done** row outcome line.
- Archive bundle path, or state that no archive was needed.
- Confirmation the approval queue row was cleared if it existed.
- Any wiki or link fixes you made.

## Guardrails

- **Project** and **Idea** strings must stay aligned with folder names and tables.
- Do not delete wiki pages. Retire with `wiki/.archive/` only when a page is obsolete, per `SYSTEM_OVERVIEW.md`.
- Do not mark **Done** when the user meant **On Hold** or **Dropped**.
