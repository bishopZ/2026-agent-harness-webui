---
name: add-idea
description: >-
  Captures a new idea under the correct initiative and project. Creates the
  project and folder layout when missing. Updates priorities.json and optional
  brief documents. Use when the user wants to add, log, or capture an idea, a backlog
  item, or a new project bucket, or when they mention a new initiative idea.
---

# Add Initiative Idea

## Goal

Put a new idea in the right place with consistent folders and a `priorities.json` entry. Match patterns in `SYSTEM_OVERVIEW.md` and [`docs/priorities-registry.md`](../../docs/priorities-registry.md).

## Before Writing Files

Confirm or infer:

1. **Initiative** - which `initiatives/[Initiative Name]/` folder (must exist).
2. **Project** - named project or **General** for ungrouped ideas.
3. **Idea title** - short, noun-style name. It must match the `initiatives/[Initiative]/[Project Name]/[Idea Name]/` folder name when lifecycle artifacts exist.
4. **Idea priority** - `High`, `Medium`, `Low`, or `1` / `2` / `3`. Default **Medium** when unclear.
5. **Lifecycle** - default **Backlog** for one-line captures unless the user says otherwise.
6. **Richness** - one line only, or extra detail. Rich content goes in `initiatives/[Initiative]/[Project Name]/[Idea Name]/01_brief.md`.

**Lifecycle when you write `01_brief.md` in this skill.** Follow `IDEA_LIFECYCLE.md`. After `01_brief.md`, set `lifecycle` to **In Review** in `priorities.json` and `**Status:** In Review` in the brief. Notes should say the next stage is **Pressure Test** (`02_pressure_test.md`) unless the user waived Pressure Test (see `IDEA_LIFECYCLE.md`). Do **not** set **Research** by default after a brief.

When `lifecycle` is **In Review**, include a `reviewDocumentPath:` line in `notes` (see `AGENTS.md` **reviewDocumentPath convention**). Example:

```
reviewDocumentPath: initiatives/[Initiative]/[Project]/[Idea]/01_brief.md
```

If initiative or idea title is ambiguous, ask once. Do not invent initiatives.

## Files To Touch (checklist)

| Step | Action |
|---|---|
| 1 | Edit `priorities.json` at repo root (required). Add or update the idea under `initiatives.[Initiative].projects.[Project].ideas.[Idea]`. |
| 2 | If the **project is new**, add the project in `priorities.json` (`priority`, `purpose`, empty `ideas`) and create `initiatives/[Initiative]/[Project Name]/` with `00-how-to-use.md`. |
| 3 | Create `initiatives/[Initiative]/[Project Name]/[Idea Name]/` when adding artifacts or a brief. |
| 4 | If there is **rich content**, create `01_brief.md` with `**Status:** In Review` when awaiting approval. Set `lifecycle: "In Review"`, `lastUpdated` to today, and `notes` with next step + brief link + `reviewDocumentPath`. |
| 5 | For backlog-only captures, set `lifecycle: "Backlog"` and a one-line `notes`. |
| 6 | Optionally set initiative `lastWork` to today in `priorities.json` when this session counts toward recency. |

Do **not** create or edit `ideas.md` or `DASHBOARD.md` (removed; registry is `priorities.json` only).

## priorities.json idea entry

```json
"Idea Name": {
  "priority": "Medium",
  "lifecycle": "In Review",
  "lastUpdated": "YYYY-MM-DD",
  "notes": "Brief drafted — awaiting approval → Pressure Test (`02_pressure_test.md`).\nreviewDocumentPath: initiatives/[Initiative]/[Project]/[Idea]/01_brief.md"
}
```

## Rich Content File

- Path: `initiatives/[Initiative]/[Project Name]/[Idea Name]/01_brief.md`
- Include title (H1), **Captured** date, **Status** line, and lifecycle sections per `IDEA_LIFECYCLE.md`.
- End with **Next** pointing at `02_pressure_test.md` unless Pressure Test is waived.

## `00-how-to-use.md` For A New Project Folder

Create only when `initiatives/[Initiative]/[Project Name]/` is new:

- State that idea work lives under `initiatives/[Initiative]/[Project Name]/[Idea Name]/` (flat — no `projects/` container).
- Link to [`docs/priorities-registry.md`](../../docs/priorities-registry.md), `SYSTEM_OVERVIEW.md`, and `IDEA_LIFECYCLE.md` (three levels up from the project folder: `../../../SYSTEM_OVERVIEW.md`).

## Consistency

- Lifecycle vocabulary: `SYSTEM_OVERVIEW.md` (**Idea Statuses**).
- After a new brief, `lifecycle` must be **In Review** so the Web UI approval queue shows the idea.
- Folder names must match `priorities.json` keys exactly.
