---
name: health-check
description: >-
  Weekly initiative health check: sync DASHBOARD.md with ideas.md,
  approval queue, and links; flag row vs artifact drift; verify rules/
  and agents/ references; check outputs/ placement; optional one-line
  wiki summary on the top-tier initiative log.
---

Run the **weekly initiative health check** from this repo's process docs.

Do not use Trello. Use only files in this repo.
Treat [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) as the source of truth for process.
Use valid idea **statuses** and **priority** labels from SYSTEM_OVERVIEW.md.

## When to use

User asks for a weekly health check, initiative health pass, tracker sync review, or "run health-check."

## Steps

1. Read [DASHBOARD.md](DASHBOARD.md) in full, especially **Initiatives** and **Awaiting your approval**.

2. **Initiatives table:** Check tier order, **What** blurbs, and **Last initiative work** dates against recent work. Update when clearly stale.

3. **Approval queue:** For each row, open that initiative's `ideas.md` and confirm the **Idea** name matches and **Notes / next action** aligns. **Status** is usually **`In Review`** for a “stage done — approve to advance” gate; it can be **`On Hold`** if the row is for visibility (dependency block after a draft artifact) and **Notes** + **Blocking** say so. Scan for **`In Review`** ideas missing a queue row (or document an exception in **Notes**). **Gap:** that scan does **not** find **`On Hold`** (or other non–**In Review**) ideas with a written brief and no row — add those to the queue by hand when you want them on the dashboard, or add a one-line **Notes** reminder.

4. **Which `ideas.md` to read:** Use the tracker's rule. Open `ideas.md` for an initiative if it has a queue row **or** any idea whose status is not **`Backlog`**, **`Done`**, or **`Dropped`**.

5. **Links and file structure:** Follow artifact links from the tracker and `ideas.md`. Fix broken paths (for example after folder renames). Check:
   - **Idea folder paths:** Lifecycle artifact folders live at `initiatives/[Initiative Name]/[Project Name]/[Idea Name]/`. Confirm folder names under `[Project Name]/` match the **Idea** names in that initiative's `ideas.md` exactly (see SYSTEM_OVERVIEW.md **Naming Conventions**).
   - **Project folder paths:** Folder names under `initiatives/[Initiative Name]/` match the **Project** column in `ideas.md` exactly.
   - **Active Projects table:** Confirm each row in **Active Projects** has **Priority** set (default missing rows to **Medium** in scoring per PRIORITIZATION.md, but the column should be explicit).
   - **Build artifacts:** For any idea in `Build`, `Evaluation`, `Launch`, `Marketing`, or `Growth`, verify the expected artifacts exist under the idea folder: `05_build_plan.md`, `05_build/README.md`, `05_build/decisions.md`, `05_build/verification_log.md`. Flag if the status implies completion but artifacts are missing.
   - **`outputs/` placement:** Finished deliverables (documents, reports, assets) for a completed idea belong in that idea's `outputs/` folder or the initiative's `outputs/` folder — not in `sources/`. Flag anything placed in `sources/` that appears to be an Agent-produced artifact rather than a user-supplied input.

6. **Row vs artifacts:** If **Status** and files disagree (late stage in the row but an earlier artifact missing or `status: Draft` in front matter), either fix **metadata** after you are sure, or flag it in chat. For artifact order and phase rules, see [../next-idea/SKILL.md](../next-idea/SKILL.md). Do not substitute this pass for completing a lifecycle stage.

7. **Rules and agent profiles check (spot check, not deep audit):** For any idea that passed through Build, Evaluation, Launch, or Marketing since the last health check, confirm that the expected specialist profiles were run:
   - **Build Review (6c):** `quality-reviewer` and `evaluator` should be present in `05_build/README.md`. `risk-auditor` should appear if the idea is user-facing or involves sensitive data.
   - **Evaluation:** All three profiles (`quality-reviewer`, `evaluator`, `risk-auditor` where applicable) should be referenced in `06_evaluation.md`.
   - **Launch:** `risk-auditor` should appear in `07_launch_plan.md`.
   - **Marketing:** `quality-reviewer` should appear in `08_marketing_pack.md`.
   Flag missing reviews in chat — don't block the pass, but note the gap as follow-up.

8. **Wiki health (lightweight pass):** For each initiative with active ideas:
   - Confirm `wiki/index.md` and `wiki/log.md` exist.
   - Check that `wiki/log.md` has an entry since the last health check (at minimum an **update** or **lint** entry if wiki-intensive stages ran).
   - Flag initiatives with active Build or later-stage ideas where the wiki has had no entries in the past two weeks.
   - Flag any wiki page found in `sources/` (user input) or `outputs/` (deliverables) instead of the `wiki/` tree.

9. **VERSION and CHANGELOG.md (one-time or on change):** If you see evidence that system documents were modified (new rules, new skills, updated lifecycle stages), check that `VERSION` and `CHANGELOG.md` were updated accordingly. If not, flag the discrepancy — do not update them yourself during a health pass unless you are explicitly asked to release.

10. **Deliverables**
    - Apply obvious fixes (broken links, misaligned queue vs **In Review**, stale **Last initiative work** when you can justify the date).
    - Give a short summary in chat: what you checked, what you changed, what still needs your attention.

11. **No standalone health report file.** Do not create a new markdown file whose only job is to summarize this pass. Updates belong in existing tracker, `ideas.md`, and wiki files.

12. **Wiki log (optional, one entry max):** If there is a durable process lesson, append **at most one** dated block to **`wiki/log.md` of the initiative in the first row of the Initiatives table** (highest tier). Use `## [YYYY-MM-DD] lint | health check summary` and keep the body to about three to six lines. You may mention other initiatives in that blurb. If nothing worth keeping, skip the log.

## Definition of done

1. Tracker and touched `ideas.md` rows reflect the same approval and link reality you verified.
2. Chat includes a concise summary of changes and any follow-ups for you.
3. Build-stage and later ideas have their specialist-profile gap noted if reviews are missing.
4. Wiki log entries are present for initiatives with recent activity, or absence is acknowledged.
5. At most one short **lint | health check summary** on the top-tier initiative's `wiki/log.md`, or none.
