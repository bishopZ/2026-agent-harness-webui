---
name: add-idea
description: >-
  Captures a new idea under the correct initiative and project. Creates the
  project and folder layout when missing. Updates ideas.md and optional project
  brief documents. Use when the user wants to add, log, or capture an idea, a backlog
  item, or a new project bucket, or when they mention a new initiative idea.
---

# Add Initiative Idea

## Goal

Put a new idea in the right place with consistent tables and folders. Match patterns in `SYSTEM_OVERVIEW.md` and the target initiative’s `ideas.md`.

## Before Writing Files

Confirm or infer:

1. **Initiative** - which `initiatives/[Initiative Name]/` folder (must exist).
2. **Project** - named project or **General** for ungrouped ideas.
3. **Idea title** - short, noun-style name for the **Idea** column. It must match the eventual `projects/[Project]/[Idea]/` folder name when lifecycle artifacts exist.
4. **Idea priority** - `High`, `Medium`, `Low`, or `1` / `2` / `3` if the user gave one. Default **Medium** when unclear.
5. **Status** - default **Backlog** for new captures unless the user says otherwise.
6. **Richness** - one line only, or extra detail (paragraphs, lists, bullets). Rich content goes in `projects/[Project]/[Idea]/01_brief.md`, not only in the table.

**Lifecycle when you write `01_brief.md` in this skill.** The default order is in `IDEA_LIFECYCLE.md` at the repo root. **Brief** is followed by **Pressure Test**, then **Research**. Do **not** set **Status** to **Research** just because you drafted a brief. That skips Pressure Test unless the user asked for a **waiver** (see **Waiver - skip Pressure Test** in `IDEA_LIFECYCLE.md`). After you create `01_brief.md`, set **Status** to **In Review** and say in **Notes / next action** that the next stage is **Pressure Test** (`02_pressure_test.md`) and that you are waiting on approval (same pattern as **At every approval gate** in `IDEA_LIFECYCLE.md`). Optionally refresh **Awaiting your approval** in `DASHBOARD.md` when a dashboard row helps. If the user explicitly waives Pressure Test in the capture, put that waiver in **Notes** per `IDEA_LIFECYCLE.md` and set status to match what they asked (for example **Research** if they waive straight to desk research).

If initiative or idea title is ambiguous, ask once. Do not invent initiatives.

## Files To Touch (checklist)

Use this list every time. Skip steps that do not apply.

| Step | Action |
|---|---|
| 1 | Edit `initiatives/[Initiative]/ideas.md` (required). |
| 2 | If the **project is new**, add an **Active Projects** table row (include **Priority**, default **Medium** unless the user specifies) and a full **## Project: [Name]** section with the standard idea table. |
| 3 | If the **project is new**, ensure `initiatives/[Initiative]/projects/[Project Name]/` exists. Use `.gitkeep` when the folder would otherwise be empty. |
| 4 | If the **project is new** or `projects/[Project Name]/` is missing, create `initiatives/[Initiative]/projects/[Project Name]/` and add `00-how-to-use.md` there (see below). |
| 5 | Add one row to the correct **Project:** section for the new idea. Set **Last updated** to today (`YYYY-MM-DD`). |
| 6 | If there is **rich content**, create `projects/[Project Name]/[Idea Name]/01_brief.md` and put a short pointer in **Notes / next action** (and keep the table cell readable). Set **Status** to **In Review** and point the next step to **Pressure Test** unless the user asked for a lifecycle waiver (see **Lifecycle when you write `01_brief.md`** above). Never use **Research** as the status here by default. |
| 7 | Optionally update **Last initiative work** in `DASHBOARD.md` for that initiative to today when the user wants this session to count toward recency, or when the capture is large (new project, long idea doc). Skip for a tiny one-line backlog ping unless asked. |

Do **not** add rows to **Awaiting your approval** for a simple backlog capture. Create `projects/[Project]/[Idea]/` only when you need a brief or richer scoped notes.

## New Project Workflow

1. In **## Active Projects**, add a row: **Project**, **Purpose** (one line), **Priority** (`High` / `Medium` / `Low` or `1` / `2` / `3`; default **Medium**).
2. Add **## Project: [Exact Name]** with the same column headers as other project sections in that file.
3. Folder names must match the **Project** column **exactly** (spaces allowed, same spelling).

## Idea Row

Use the same columns as the existing project section: **Idea**, **Status**, **Priority**, **Last updated**, **Notes / next action**.

- **Notes / next action** - For a sentence-only idea, a single line is enough. For rich ideas, one line plus a link to the brief, e.g. `[brief](projects/Project/Idea/01_brief.md)`.

## Rich Content File

When the user provides more than a sentence:

- Path: `initiatives/[Initiative]/projects/[Project Name]/[Idea Name]/01_brief.md`
- Keep naming simple. Start at `01_brief.md` and add later stage files in the same folder when work progresses.
- Include at minimum: title (H1), **Captured** date, optional sections the user gave you (e.g. **Description**, **Open questions**, **Next steps** as bullet lists).
- End the brief body with a short **Next** line that matches the lifecycle. Default text should say the next artifact is **`02_pressure_test.md`** (Pressure Test), not market research, unless the user waived Pressure Test.

Keep table cells short. Put long text in the file.

## `00-how-to-use.md` For A New Project Folder

Create only when `projects/[Project Name]/` is new. Keep it short:

- State that all idea work for this project lives under `projects/[Project Name]/[Idea Name]/`.
- Link to the initiative’s `ideas.md`, `../../ideas.md`, and to `SYSTEM_OVERVIEW.md` / `IDEA_LIFECYCLE.md` at repo root as `../../../../SYSTEM_OVERVIEW.md` (adjust `../` count by depth - count segments from file to repo root).

Use the initiative’s existing `00-how-to-use.md` as a template when one exists (e.g. novel Pre-writing). If none exists, write a minimal version using the rules above.

## Initiative-Specific Layout Notes

- Some initiatives have custom project names (for example novel **Pre-writing**). Follow the layout block at the top of that initiative’s `ideas.md`.
- **General** project: use `projects/General/[Idea Name]/` for new briefs.

## Consistency

- Status and priority vocabularies: `SYSTEM_OVERVIEW.md` (**Idea Statuses**, **Project priority**, **Priority levels (ideas)**). After a new brief, the next lifecycle label in the row is **In Review** (waiting on you), not **Research**.
- After edits, reread the modified **Active Projects** table and **Project:** sections to ensure project names match folders and there are no duplicate idea titles in the same project unless the user asked for duplicates.
