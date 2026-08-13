---
name: complete-idea
description: >-
  Mark an idea as finished, move lifecycle artifacts and outputs/ to repo
  archive/, set lifecycle Done in priorities.json, append history/done-history.md,
  and update wiki. Use when the user says an idea is complete, done, shipped, or
  finished, or asks to close an idea successfully.
---

# Complete Idea

Use this skill when the user wants to **finish** an idea: set `lifecycle` to **Done** in `priorities.json`, append `history/done-history.md`, and handle **archive** when a lifecycle folder exists.

Do not use Trello. Only use files in this repo.

Follow `SYSTEM_OVERVIEW.md` (archive rules, naming), `IDEA_LIFECYCLE.md`, and [`docs/priorities-registry.md`](../../docs/priorities-registry.md).

## Inputs

Resolve from the user and files:

- **Idea** name (required). Must match the `priorities.json` key and folder name under `initiatives/[Initiative]/[Project]/` when a folder exists.
- **Initiative** and **Project** if given. If the name is ambiguous across initiatives or projects, stop and ask once.
- **Outcome** (required). One to three sentences for the Done history row. Mention finished deliverables in `outputs/` and link to them. Also mention anything else that **stays** in the live tree (for example ongoing files under `[Project]/sources/` in that initiative).
- **Completed date** (optional). Default **today** in `YYYY-MM-DD`.

## When no idea folder exists

If the idea only has a `priorities.json` entry and **no** `initiatives/[Initiative]/[Project]/[Idea]/` folder:

1. Set `lifecycle: "Done"` in `priorities.json`, update `notes` with outcome, `lastUpdated` to completed date. Remove any `reviewDocumentPath:` line.
2. Append a row to `initiatives/[Initiative]/history/done-history.md` with **Idea**, **Project**, **Completed**, **Outcome**.
3. Set initiative `lastWork` to **Completed date** when this session closed real work.
4. Skip archive directory steps. Summarize what you changed.

## Full workflow (idea folder or artifacts exist)

Run in order.

### 1. Locate and verify

1. Locate the idea in `priorities.json`.
2. Confirm the user intends **Done** (success), not **Dropped**. If they want to kill the idea, use **drop-idea** instead.

### 2. Plan the archive bundle

1. **Inner folder name** must match the existing idea folder under `initiatives/[Initiative]/[Project]/` exactly (same spelling and casing as the idea key).
2. **Bundle path** at repo root: `archive/{Prefix} - {Idea} - {YYYY-MM-DD}/`
   - **Prefix** should match other `archive/` folders for this initiative when any exist (for example `My Company`, `My Personal Life`). If this is the first bundle for that initiative, use the concise prefix from `SYSTEM_OVERVIEW.md` **Archived items** or the same style as sibling bundles in `archive/`.
3. Create `archive/{Prefix} - {Idea} - {YYYY-MM-DD}/README.md` using the pattern in existing bundles when any exist. Include **Initiative**, **Project**, **Idea**, **Archived** date, what stayed in the live tree (with relative links), and a **Contents** list.

### 3. Move lifecycle artifacts and outputs

1. Move the entire directory `initiatives/[Initiative]/[Project]/[Idea]/` into the bundle as `archive/.../[Idea]/`. This includes both the lifecycle stage files and the `outputs/` subfolder if one exists. Prefer a git-aware move so history is preserved (`git mv` when the repo is in good shape).
2. If **some** files must remain in the project folder (for example ongoing **sources** at project scope), move only the lifecycle subtree (and the `outputs/` folder) and document which paths stayed in the bundle **README** and in the Done history **Outcome**.

### 4. Record Done

1. In `priorities.json`, set `lifecycle: "Done"`, `lastUpdated` to completed date, `notes` with outcome + archive link. Remove any `reviewDocumentPath:` line.
2. Append a row to `history/done-history.md`:

| Column | Content |
| --- | --- |
| **Idea** | Exact name |
| **Project** | Exact project |
| **Completed** | `YYYY-MM-DD` |
| **Outcome** | User-facing summary, links to finished deliverables in `outputs/`, and a link to the archive bundle |

Long-form Done history lives only in `history/done-history.md`.

### 5. Artifacts hygiene

1. **Final stamps** - If key markdown files remain in the tree, you may add `Completed` or `Approved` notes near the top. For files inside the bundle only, the **README** is enough.
2. **Broken links** - Search the initiative (and `priorities.json` notes) for links to the old on-disk idea paths and update them to the archive path or to any replacement live path.

### 6. Wiki

1. Append a dated block to `initiatives/[Initiative]/wiki/log.md` using the house style (`## [YYYY-MM-DD] update | …`). Summarize completion, archive location, and anything that remains live.
2. Update `wiki/index.md` when new cross-references or “see also” rows are needed so the wiki still points at the right artifacts.

### 7. Tracker date

If this completion was substantive, set that initiative’s `lastWork` in `priorities.json` to **Completed date**.

## Completion summary (return to user)

- Idea and initiative.
- **Done** outcome line.
- Archive bundle path, or state that no archive was needed.
- Confirmation `lifecycle` is **Done** (left the Web UI approval queue if it was `In Review`).
- Any wiki or link fixes you made.

## Guardrails

- **Project** and **Idea** strings must stay aligned with folder names and `priorities.json` keys.
- Do not delete wiki pages. Retire with `wiki/.archive/` only when a page is obsolete, per `SYSTEM_OVERVIEW.md`.
- Do not mark **Done** when the user meant **On Hold** or **Dropped**.
