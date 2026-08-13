---
name: health-check
description: >-
  Weekly initiative health check: sync priorities.json with filesystem,
  approval queue, and links; flag row vs artifact drift; verify rules/
  and agents/ references; check outputs/ placement; optional one-line
  wiki summary on the top-tier initiative log.
---

Run the **weekly initiative health check** from this repo's process docs.

Do not use Trello. Use only files in this repo.
Treat [SYSTEM_OVERVIEW.md](../../SYSTEM_OVERVIEW.md) as the source of truth for process.
Use valid idea **lifecycle** and **priority** labels from SYSTEM_OVERVIEW.md and [`docs/priorities-registry.md`](../../docs/priorities-registry.md).

Registry source: **`priorities.json`**. Approval queue: ideas with `lifecycle: "In Review"` (Web UI). Do **not** edit `ideas.md` or `DASHBOARD.md`.

## When to use

User asks for a weekly health check, initiative health pass, tracker sync review, or "run health-check."

## Steps

1. Read `priorities.json` in full — all initiatives, tiers, `lastWork`, projects, ideas, and root `updated`.

2. **Initiatives:** Check tier order, project `purpose` blurbs, and `lastWork` dates against recent work. Update when clearly stale.

3. **Approval queue:** For each idea with `lifecycle: "In Review"`, confirm the idea key matches the folder, notes align, and a valid `reviewDocumentPath:` line exists (see `AGENTS.md`). Verify the path file exists on disk under `HARNESS_ROOT` (harness-root form includes `initiatives/`). **Lifecycle** is usually **`In Review`** for a “stage done — approve to advance” gate; it can be **`On Hold`** if the entry is for visibility (dependency block after a draft artifact) and **notes** say so — those ideas will **not** appear in the Web UI approval table unless `lifecycle` is still `In Review`.

   **Waiting-state scan (normalized detector — not exact ``**Status:** In Review`` only):** For each active idea whose registry lifecycle is not `In Review`, inspect the **latest stage artifact**. Flag (and usually fix to `In Review` + `reviewDocumentPath`) when status matches `/in\s*review/i`, or `/draft/i` plus `/awaiting (approval|owner|review)/i`, or YAML/`**Status:**` is `Draft`/`Drafted` without superseded/blocked language. This catches `Draft (In Review)` and `Draft — awaiting approval`. **Gap:** that scan does **not** find **`On Hold`** (or other non–**In Review**) ideas with a written brief and no approval-queue presence — set those to `In Review` by hand when you want them on the Web UI queue, or add a one-line **notes** reminder.

4. **Which initiatives to deep-read:** Open every initiative that has an `In Review` idea **or** any idea whose lifecycle is not **`Backlog`**, **`Done`**, or **`Dropped`**.

5. **Links and file structure:** Follow artifact links from `notes` and wiki. Fix broken paths (for example after folder renames). Check:
   - **Idea folder paths:** Lifecycle artifact folders live at `initiatives/[Initiative Name]/[Project Name]/[Idea Name]/` (flat — no `projects/` container). Confirm folder names under `[Project Name]/` match the idea keys in `priorities.json` exactly (see SYSTEM_OVERVIEW.md **Naming Conventions**).
   - **Project folder paths:** Folder names under `initiatives/[Initiative Name]/` match the project keys in `priorities.json` exactly (exclude `wiki/`, `sources/`, `outputs/`, `history/`, and `project-history.md`).
   - **Project priority:** Confirm each project has `priority` set (default missing values to **Medium** in scoring per PRIORITIZATION.md, but the field should be explicit).
   - **Build artifacts:** For any idea in `Build`, `Evaluation`, `Launch`, `Marketing`, or `Growth`, verify the expected artifacts exist under the idea folder: `05_build_plan.md`, `05_build/README.md`, `05_build/decisions.md`, `05_build/verification_log.md`. Flag if the lifecycle implies completion but artifacts are missing.
   - **`outputs/` placement:** Finished deliverables (documents, reports, assets) for a completed idea belong in that idea's `outputs/` folder or the initiative's `outputs/` folder — not in `sources/`. Flag anything placed in `sources/` that appears to be an Agent-produced artifact rather than a user-supplied input.
   - **History files:** Confirm `history/done-history.md`, `history/dropped-history.md`, and `project-history.md` exist when the initiative has Done/Dropped ideas or closed projects recorded.

6. **Build checkpoint reconcile (three-way):** For every idea that has a `05_build_plan.md`, reconcile these three sources and make them agree:

   | Source | What it holds |
   |---|---|
   | `05_build_plan.md` front matter | `checkpoint`, `checkpoint_status`, `modified` |
   | `05_build_plan.md` `**Next:**` line | prose statement of the next unit of work |
   | `05_build/verification_log.md` | the actual evidence — last task logged, last gate closed |
   | `priorities.json` → idea → `checkpoint` | `{ current, index, total, status, label, asOf, evidence }` |

   **The verification log wins.** It is append-only evidence; the other three are summaries that go stale. Read it last-entry-first and derive the truth, then fix the summaries.

   Derivation rules:
   - `total` = count of `## Checkpoint …` headings in the build plan.
   - `current` = the checkpoint whose gate has **not** cleared — the one the build is sitting at, not the last one approved.
   - `index` = how many checkpoints have fully cleared (approved or waived). `index === total` only when the build is finished.
   - `asOf` = date of the verification-log entry the derivation came from.
   - `reason` = one line naming the next concrete action, so the panel says what to do and not just where the build is.
   - `status` answers **one** question: can the agent loop take the next unit of work, or does the owner have to act first?

     | Status | Means | Test |
     |---|---|---|
     | `In Review` | Hard stop — owner must act | A gate is open. Covers a Build Plan awaiting approval at 6a **and** a mid-build checkpoint hard stop; from the loop's side they are the same wall. Should match `lifecycle: "In Review"`. |
     | `Ready` | Agent may proceed | A gate has cleared and tasks remain. Applies whether the current checkpoint group has tasks logged yet or the previous gate just closed. |

     There is no third status. **When a build finishes its last checkpoint, or its
     plan is superseded, delete the whole `checkpoint` object from that idea.**
     Finished builds are ignored, not archived in place — the panel lists in-flight
     work only, and it does that by absence rather than by filtering.

     Do **not** reintroduce statuses that describe how the build arrived at this
     state (`In progress`, `Approved`, `Not started`, `Awaiting owner`, `Complete`,
     `Superseded`). Those are narrative — they read as different states but imply
     the same next action (or no action at all). Put that detail in `reason`, or in
     the idea's `notes` once the checkpoint object is gone.

   **Cross-check `status` against `lifecycle`.** They answer the same question from two directions, so a mismatch is drift in one of them:
   - `status: In Review` but `lifecycle` is not `In Review` → the idea is blocked on you but missing from the approval queue.
   - `status: Ready` but `lifecycle: In Review` → the queue is showing an idea that actually has agent work available.

   Flag, don't silently fix, when:
   - Task entries exist past the last gate entry — a checkpoint group finished but **its gate was never written**. This is the most common failure and it makes the build look less far along than it is.
   - The plan's `**Next:**` names a task that the verification log already records as complete.
   - `lifecycle` implies the build is over but the final checkpoint summary has unchecked ACs or no approval date.
   - Front matter is not parseable YAML (a `---` opener with no closing `---`, or a `## ` heading inside the block). The whole block silently becomes body text and every field in it stops counting.

7. **Row vs artifacts:** If `lifecycle` and files disagree (late stage in priorities but an earlier artifact missing or `status: Draft` in front matter), either fix **metadata** after you are sure, or flag it in chat. For artifact order and phase rules, see [../next-idea/SKILL.md](../next-idea/SKILL.md). Do not substitute this pass for completing a lifecycle stage.

8. **Rules and agent profiles check (spot check, not deep audit):** For any idea that passed through Build, Evaluation, Launch, or Marketing since the last health check, confirm that the expected specialist profiles were run:
   - **Build Review (6c):** `quality-reviewer` and `evaluator` should be present in `05_build/README.md`. `risk-auditor` should appear if the idea is user-facing or involves sensitive data.
   - **Evaluation:** All three profiles (`quality-reviewer`, `evaluator`, `risk-auditor` where applicable) should be referenced in `06_evaluation.md`.
   - **Launch:** `risk-auditor` should appear in `07_launch_plan.md`.
   - **Marketing:** `quality-reviewer` should appear in `08_marketing_pack.md`.
   Flag missing reviews in chat — don't block the pass, but note the gap as follow-up.

9. **Wiki health (lightweight pass):** For each initiative with active ideas:
   - Confirm `wiki/index.md` and `wiki/log.md` exist.
   - Check that `wiki/log.md` has an entry since the last health check (at minimum an **update** or **lint** entry if wiki-intensive stages ran).
   - Flag initiatives with active Build or later-stage ideas where the wiki has had no entries in the past two weeks.
   - Flag any wiki page found in `sources/` (user input) or `outputs/` (deliverables) instead of the `wiki/` tree.

10. **VERSION and CHANGELOG.md (one-time or on change):** If you see evidence that system documents were modified (new rules, new skills, updated lifecycle stages), check that `VERSION` and `CHANGELOG.md` were updated accordingly. If not, flag the discrepancy — do not update them yourself during a health pass unless you are explicitly asked to release.

11. **Deliverables**
    - Apply obvious fixes (broken links, misaligned `In Review` vs artifacts, stale `lastWork` when you can justify the date, missing `reviewDocumentPath` on `In Review` ideas).
    - Give a short summary in chat: what you checked, what you changed, what still needs your attention.

12. **No standalone health report file.** Do not create a new markdown file whose only job is to summarize this pass. Updates belong in `priorities.json`, wiki files, and chat.

13. **Wiki log (optional, one entry max):** If there is a durable process lesson, append **at most one** dated block to **`wiki/log.md` of the highest-tier initiative** in `priorities.json`. Use `## [YYYY-MM-DD] lint | health check summary` and keep the body to about three to six lines. You may mention other initiatives in that blurb. If nothing worth keeping, skip the log.

14. **Legacy markdown registries:** If `DASHBOARD.md` or `initiatives/*/ideas.md` still exist, flag them and point at `npm run migrate-registry` + [`docs/priorities-registry.md`](../../docs/priorities-registry.md). Do not restore them as required registries.

## Definition of done

1. `priorities.json`, folders, and artifacts agree on names, lifecycle, and approval state.
2. Chat includes a concise summary of changes and any follow-ups for you.
3. Build-stage and later ideas have their specialist-profile gap noted if reviews are missing.
4. Wiki log entries are present for initiatives with recent activity, or absence is acknowledged.
5. At most one short **lint | health check summary** on the top-tier initiative's `wiki/log.md`, or none.
