---
name: next-idea
description: >-
  Select the next highest priority idea from repo files, execute the next
  lifecycle phase for that idea, and put the result in review.
---

Select the next highest priority idea and execute the next lifecycle phase for that idea.

Do not use Trello. Use only files in this repo.
Follow the initiative and idea system in this repo.
Treat SYSTEM_OVERVIEW.md as the source of truth for process.
Use IDEA_LIFECYCLE.md for lifecycle stages, gates, and templates.
Use [`docs/priorities-registry.md`](../../docs/priorities-registry.md) and root `priorities.json` as the registry (not `ideas.md` / `DASHBOARD.md`).

If the task is to take the next idea, prioritize, or choose what to work on without a named idea:
- Read `priorities.json` for initiative `tier`, `lastWork`, project `priority`, and idea `priority` / `lifecycle` / `notes`.
- Read PRIORITIZATION.md and apply its selection method.
- Do **not** select ideas whose `lifecycle` is `In Review`, `On Hold`, `Done`, or `Dropped`.
- To **resume** an idea after rolling back (earlier artifacts set to **Draft** again), set `lifecycle` to a non-blocked working stage (for example **Brief**), not **In Review**, and remove any stale `reviewDocumentPath:` line. Otherwise the idea stays blocked for next-work selection even though files look unfinished.

After selection, complete work. Do not stop at selection.
- **Determine which phase to execute (mandatory).** Do **not** infer this only from `lifecycle` in `priorities.json`, from the newest file in the idea folder, or from which stage sounds “furthest along.” Those shortcuts skip stages when files were created out of order.
- **Artifact-first gate (default product lifecycle).** Under `initiatives/[Initiative]/[Project]/[Idea]/` (flat — no `projects/` container), walk stages in the order defined in `IDEA_LIFECYCLE.md` at the repo root. Honor project overrides from that idea’s `00-how-to-use.md` or `PROCESS.md` when present. Honor a **Waiver: skip Pressure Test** line in that idea’s `notes` in `priorities.json` (see IDEA_LIFECYCLE.md).
  - **Brief:** `01_brief.md`
  - **Pressure Test:** `02_pressure_test.md` (skip if waiver applies)
  - **Research:** `02_market_research.md` (and `02b_customer_discovery.md` when IDEA_LIFECYCLE.md expects Part 2 before PRD; if unsure, follow IDEA_LIFECYCLE.md for that initiative type)
  - **PRD:** `03_prd.md`
  - **Design:** `04_design.md`
  - **Build / later stages:** follow IDEA_LIFECYCLE.md naming for that idea. When the build produces a finished deliverable (a document, report, or asset), place it in that idea’s `outputs/` folder under the project path - not in `sources/`. Working files and drafts stay in `05_build/`. For software work, use the project’s optional `repo/` submodule when present (see `SYSTEM_OVERVIEW.md`). Link the output from `history/done-history.md` when the idea completes.
  - For **each required stage in order:** if the artifact file is **missing**, or its YAML front matter has **`status: Draft`** (case-insensitive), **stop** and execute **that** phase now (create or revise the artifact and move **that** stage to review when done). **Do not** create or extend a **later** stage while an **earlier** required stage is missing or still Draft.
  - If front matter has no `status` field, treat the file as **not Draft** for this gate only when you have no signal it is unfinished; if `notes` clearly say earlier work is not approved, prefer the artifact scan and the explicit notes over a vague lifecycle.
- **Invalid lifecycle.** `Draft` is **not** a valid **idea** lifecycle in `SYSTEM_OVERVIEW.md`. If somehow present, treat it as **undefined for phase choice** and rely on the artifact scan above. Ask in chat if you cannot reconcile registry vs files.
- If artifact scan and `priorities.json` disagree (for example the entry says Design but Brief is still Draft), **follow the artifact scan** for what to do this session. Say briefly in chat that the registry may need a manual sync after approval.
- If the idea is thin, do Elaboration before Brief as required by IDEA_LIFECYCLE.md.
- Produce concrete output in repo files, not only chat text.

Do not substitute a narrative report for phase work.
- Never create a standalone file whose purpose is to document selection, scoring, tie-breakers, or a "next idea report" (for example `next-idea-report-*.md` or any similar summary-only artifact).
- A scoring table or "winner" write-up is not deliverable output. Put a short outcome summary in the chat message only after files and registry updates are done.
- If phase work is blocked (missing inputs, approval needed, or nothing eligible to select), say so in chat. Do not write a repo markdown file to explain that. Only update `priorities.json` or other existing process files when the system actually calls for it.

When the phase output is complete, move it into review:
- Set `lifecycle` to **`In Review`** in `priorities.json`.
- Update `lastUpdated` and `notes` (stage finished + next step + artifact links).
- Include a `reviewDocumentPath:` line in `notes` pointing at the document to review (see `AGENTS.md` **reviewDocumentPath convention**). Path is relative to harness root, e.g. `initiatives/[Initiative]/[Project]/[Idea]/03_prd.md`.
- Set initiative `lastWork` to today (`YYYY-MM-DD`).
- Set the artifact `**Status:** In Review`.

Do **not** create or edit `ideas.md` or `DASHBOARD.md`.

Use valid lifecycles and priorities from SYSTEM_OVERVIEW.md.
Read USER.md for preferences and context.

Wiki rules still apply. If this work touches an initiative wiki, follow SYSTEM_OVERVIEW.md wiki rules.

Operating principles:
- Offer constructive challenge when something is unclear or risky.
- Ask focused questions before drafting generic content when key inputs are missing.
- Put durable learning in the wiki when appropriate, not only in chat.
- Do not take actions outside the workspace without explicit permission.

Definition of done for this skill:
1) Next idea selected from repo files (or none eligible, stated clearly in chat with no new report file).
2) Next lifecycle phase actually completed in the correct artifact path for that idea, or a clear blocker explained in chat without inventing a substitute document.
3) When work completed, idea moved to `In Review` in `priorities.json` with `reviewDocumentPath` set.
4) User receives a short summary in chat of what was produced and what changed.

Creating only a selection or scoring write-up in a new markdown file does not satisfy this skill.
