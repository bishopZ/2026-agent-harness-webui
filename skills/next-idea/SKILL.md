---
name: next-idea
description: >-
  Select the next highest priority idea from repo files, execute the next
  lifecycle phase for that idea, and put the result in review.
---

Select the next highest priority idea and execute the next lifecycle phase.

Follow `SYSTEM_OVERVIEW.md`, `PRIORITIZATION.md`, `IDEA_LIFECYCLE.md`, and `priorities.json`.

## Selection

- Read `priorities.json` for initiative `tier`, `lastWork`, project `priority`, and idea `priority` / `lifecycle`.
- Apply `PRIORITIZATION.md` scoring.
- **Do not select** ideas with `lifecycle` of `In Review`, `On Hold`, `Done`, or `Dropped`.
- To **resume** after rollback: set `lifecycle` to the working stage (e.g. `Brief`), not `In Review`, and ensure no stale `In Review` state.

## Phase execution (artifact-first)

Under `projects/[Project]/[Idea]/`, walk stages in `IDEA_LIFECYCLE.md` order. Honor `00-how-to-use.md` / `PROCESS.md` overrides. Honor **Waiver: skip Pressure Test** in idea `notes`.

Do **not** infer phase only from `lifecycle` in `priorities.json` or the newest file — scan artifacts in order.

For each required stage: if missing or `**Status:** Draft`, execute that stage now.

If `priorities.json` and artifacts disagree, **follow the artifact scan** and note the mismatch for sync.

## When phase output is complete

- Set `lifecycle` to **`In Review`** in `priorities.json`.
- Update `lastUpdated`, `notes` (stage finished + next step + artifact links).
- Set initiative `lastWork` to today.
- Set artifact `**Status:** In Review`.

Do not create `ideas.md` or `DASHBOARD.md` rows.

## Definition of done

1. Next idea selected (or none eligible, stated in chat).
2. Phase completed in the correct artifact path, or blocker explained.
3. Idea in `In Review` in `priorities.json` when work is ready for approval.
4. Short chat summary of outputs and file changes.
