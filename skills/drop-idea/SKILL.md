---
name: drop-idea
description: >-
  Kill an idea: set lifecycle Dropped in priorities.json, append
  history/dropped-history.md, move lifecycle artifacts to repo archive/ when
  present, update wiki. Use when the user drops, kills, or abandons an idea,
  or says no-go.
---

# Drop Idea

Use this skill when the user wants to **kill** an idea: set `lifecycle` to **Dropped** in `priorities.json`, append `history/dropped-history.md`, and handle **archive** plus durable wiki notes when they matter.

Do not use Trello. Only use files in this repo.

Follow `SYSTEM_OVERVIEW.md` (idea statuses, archive rules), `IDEA_LIFECYCLE.md` (**Moving to On Hold or Dropped**), and [`docs/priorities-registry.md`](../../docs/priorities-registry.md).

## Inputs

Resolve from the user and files:

- **Idea** name (required).
- **Reason** (required). One to three sentences for the Dropped history row (why it stopped, decision basis).
- **Initiative** and **Project** if given. If the name is ambiguous, stop and ask once.
- **Date** (optional). Default **today** in `YYYY-MM-DD`.

## When no idea folder exists

If there is only a `priorities.json` entry and **no** `initiatives/[Initiative]/[Project]/[Idea]/` folder:

1. Set `lifecycle: "Dropped"`, `notes` with reason, `lastUpdated` to date. Remove any `reviewDocumentPath:` line.
2. Append a row to `initiatives/[Initiative]/history/dropped-history.md` with **Idea**, **Project**, **Date**, **Reason**.
3. Set initiative `lastWork` when this session reflects real progress on the initiative.
4. Skip filesystem archive steps unless the user asks to retain notes elsewhere.
5. Summarize what you changed.

## Full workflow (idea folder or artifacts exist)

Run in order.

### 1. Locate and verify

1. Locate the idea in `priorities.json`.
2. Confirm the user intends **Dropped**, not **Done** or **On Hold**. For a pause without killing, set `lifecycle` to **`On Hold`** with reason in `notes` instead of this skill.

### 2. Plan the archive bundle

1. **Inner folder name** matches the existing `initiatives/[Initiative]/[Project]/[Idea]/` folder and the idea key.
2. **Bundle path** at repo root: `archive/{Prefix} - {Idea} - {YYYY-MM-DD}/` with the same **Prefix** rules as **complete-idea** (match existing initiative bundles in `archive/` first).
3. Add `README.md` at the bundle root. State initiative, project, idea, archived date, that the **project** folder may remain for other ideas, and list **Contents**. Link any new wiki page that captures the durable narrative (for example a strategy one-pager). Follow the pattern of any existing bundles in `archive/` when they exist.

### 3. Move lifecycle artifacts and outputs

1. Move `initiatives/[Initiative]/[Project]/[Idea]/` into `archive/.../[Idea]/` with a git-aware move when possible. This includes the `outputs/` subfolder if one exists - finished deliverables move with the work that produced them.
2. If the user wants to keep a **lightweight pitch or lesson** in the wiki, add or update the right domain page **before** or **after** the move, and point the Dropped **Reason** and bundle **README** at that page.

### 4. Record Dropped

1. In `priorities.json`, set `lifecycle: "Dropped"`, `lastUpdated` to date, `notes` with reason + archive link. Remove any `reviewDocumentPath:` line.
2. Append a row to `history/dropped-history.md`:

| Column | Content |
| --- | --- |
| **Idea** | Exact name |
| **Project** | Exact project |
| **Date** | `YYYY-MM-DD` |
| **Reason** | Clear rationale, plus links to archive bundle and any wiki page |

Do **not** create or edit `ideas.md` or `DASHBOARD.md`. Long-form Dropped history lives only in `history/dropped-history.md`.

### 5. Links

Fix `priorities.json` notes and wiki links that still pointed at the old on-disk path. Point them at the archive bundle or new wiki pages.

### 6. Wiki

1. **log.md** - Append a dated **update** entry describing the drop, archive path, and any wiki page added for lessons or pitch material.
2. **Domain pages** - Update `market/`, `strategy/`, or other domains when the drop changes assumptions or adds a named decision. Never delete pages. Retire obsolete wiki pages via `wiki/.archive/` per `SYSTEM_OVERVIEW.md` if needed.
3. **index.md** - Add or adjust index rows when new pages or archive pointers should be discoverable.

### 7. Tracker date

Update initiative `lastWork` in `priorities.json` when appropriate.

## Completion summary (return to user)

- Idea and initiative.
- Short restatement of **Reason** as recorded.
- Archive bundle path, or that no folder was archived.
- Confirmation `lifecycle` is **Dropped** (left the Web UI approval queue if it was `In Review`).
- Notable wiki updates.

## Guardrails

- **Dropped** ideas stay on file for reference in `history/dropped-history.md` and as `lifecycle: "Dropped"` in `priorities.json`. Do not erase history without explicit user request beyond normal archive moves.
- Keep **Project** and **Idea** names aligned with folders and `priorities.json` keys.
- Do not use this skill for **Done** (use **complete-idea**) or for **On Hold** (keep the entry and set `lifecycle` to `On Hold` per `IDEA_LIFECYCLE.md`).
- Do **not** edit `ideas.md` or `DASHBOARD.md`.
