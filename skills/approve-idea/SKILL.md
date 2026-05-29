---
name: approve-idea
description: Mark a named idea as approved at an approval gate and move it to the next lifecycle phase. Use when the user approves an idea, says to mark an idea approved, asks to move an idea to the next stage, or asks to clear it from the approval queue.
---

# Approve Idea

Use this skill when the user gives an idea name and wants to approve it.

Follow `SYSTEM_OVERVIEW.md`, `IDEA_LIFECYCLE.md`, and [`docs/priorities-registry.md`](../../docs/priorities-registry.md).

## Inputs

- Idea name (required).
- Initiative and project, if provided.

If the idea name matches more than one entry in `priorities.json`, stop and ask the user to choose.

## Approval workflow

1. Locate the idea in `priorities.json` under `initiatives.[Initiative].projects.[Project].ideas.[Idea]`.
2. Confirm `lifecycle` is `In Review`. If not, report current lifecycle and ask whether to continue.
3. Identify the stage just finished from `notes`, artifact files, or user context.
4. Determine the next `lifecycle` value:
   - **Brief** approved → **`PressureTest`** (or **`Research`** if **Pressure Test waiver** in `notes`).
   - **Pressure Test** approved → **`Research`**.
   - **Research Part 1** approved → stay **`Research`**, update `notes` for `02b_customer_discovery.md`.
   - **Research** approved → **`PRD`**.
   - **PRD** → **`Design`** → **`Build`** → **`Evaluation`** → **`Launch`** → **`Marketing`** → **`Growth`** (each approval advances one step).
5. Update the approved artifact: `**Status:** Approved`, `Approved on: YYYY-MM-DD`, `Next:` line.
6. Update `priorities.json`: set `lifecycle` to the next stage (not `In Review`), `lastUpdated` to today, refresh `notes`.
7. Optionally set initiative `lastWork` to today.
8. Summarize: idea name, new lifecycle, artifact updated, removed from approval queue.

## Guardrails

- Names must match folder and `priorities.json` keys exactly.
- Do not move to `Done` unless the user explicitly completes the idea.
- Do not edit `ideas.md` or `DASHBOARD.md`.
