---
name: drop-idea
description: >-
  Kill an idea, record it under Dropped in ideas.md, move lifecycle artifacts to
  repo archive/ when present, update tracker and wiki. Use when the user drops,
  kills, or abandons an idea, or says no-go.
---

# Drop Idea

Use this skill when the user wants to **kill** an idea and record it under **Dropped**, including **archive** handling and durable wiki notes when they matter.

Do not use Trello. Only use files in this repo.

Follow `SYSTEM_OVERVIEW.md` (idea statuses, archive rules), `IDEA_LIFECYCLE.md` (**Moving to On Hold or Dropped**), and the target initiative’s `ideas.md`.

## Inputs

Resolve from the user and files:

- **Idea** name (required).
- **Reason** (required). One to three sentences for the **Dropped** table (why it stopped, decision basis).
- **Initiative** and **Project** if given. If the name is ambiguous, stop and ask once.
- **Date** (optional). Default **today** in `YYYY-MM-DD`.

## When no idea folder exists

If there is only an `ideas.md` row and **no** `projects/[Project]/[Idea]/` folder:

1. Remove the row from its **Project:** section.
2. Append a row to **## Dropped** with **Idea**, **Project**, **Date**, **Reason**.
3. Remove any matching row from **Awaiting your approval** in `DASHBOARD.md`.
4. Set **Last initiative work** when this session reflects real progress on the initiative.
5. Skip filesystem archive steps unless the user asks to retain notes elsewhere.
6. Summarize what you changed.

## Full workflow (idea folder or artifacts exist)

Run in order.

### 1. Locate and verify

1. Open `initiatives/[Initiative]/ideas.md`.
2. Find the idea under the correct **Project:** section.
3. Confirm the user intends **Dropped**, not **Done** or **On Hold**. For a pause without killing, use an **On Hold** note in the active row instead of this skill.

### 2. Plan the archive bundle

1. **Inner folder name** matches the existing `projects/[Project]/[Idea]/` folder and the **Idea** column.
2. **Bundle path** at repo root: `archive/{Prefix} - {Idea} - {YYYY-MM-DD}/` with the same **Prefix** rules as **complete-idea** (match existing initiative bundles in `archive/` first).
3. Add `README.md` at the bundle root. State initiative, project, idea, archived date, that the **project** folder may remain for other ideas, and list **Contents**. Link any new wiki page that captures the durable narrative (for example a strategy one-pager). Follow the pattern of any existing bundles in `archive/` when they exist.

### 3. Move lifecycle artifacts and outputs

1. Move `initiatives/[Initiative]/projects/[Project]/[Idea]/` into `archive/.../[Idea]/` with a git-aware move when possible. This includes the `outputs/` subfolder if one exists - finished deliverables move with the work that produced them.
2. Remove the idea row from the active **Project:** table.
3. If the user wants to keep a **lightweight pitch or lesson** in the wiki, add or update the right domain page **before** or **after** the move, and point the **Dropped** **Reason** and bundle **README** at that page.

### 4. Record Dropped

Add a row to **## Dropped**:

| Column | Content |
| --- | --- |
| **Idea** | Exact name |
| **Project** | Exact project |
| **Date** | `YYYY-MM-DD` |
| **Reason** | Clear rationale, plus links to archive bundle and any wiki page |

Replace empty placeholder rows in **## Dropped** if the file still uses them so the table stays valid.

### 5. Dashboard and links

1. **DASHBOARD.md** - Remove any **Awaiting your approval** row for this idea.
2. **Broken links** - Fix tracker links, `ideas.md` links, and wiki links that still pointed at the old `projects/.../[Idea]/` path. Point them at the archive bundle or new wiki pages.

### 6. Wiki

1. **log.md** - Append a dated **update** entry describing the drop, archive path, and any wiki page added for lessons or pitch material.
2. **Domain pages** - Update `market/`, `strategy/`, or other domains when the drop changes assumptions or adds a named decision. Never delete pages. Retire obsolete wiki pages via `wiki/.archive/` per `SYSTEM_OVERVIEW.md` if needed.
3. **index.md** - Add or adjust index rows when new pages or archive pointers should be discoverable.

### 7. Tracker date

Update **Last initiative work** for that initiative when appropriate.

## Completion summary (return to user)

- Idea and initiative.
- Short restatement of **Reason** as recorded.
- Archive bundle path, or that no folder was archived.
- Confirmation the approval queue row was cleared if it existed.
- Notable wiki updates.

## Guardrails

- **Dropped** ideas stay on file for reference. Do not erase history without explicit user request beyond normal archive moves.
- Keep **Project** and **Idea** names aligned with folders and tables.
- Do not use this skill for **Done** (use **complete-idea**) or for **On Hold** (keep the row and add a pause note per `IDEA_LIFECYCLE.md`).
