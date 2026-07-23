---
name: approve-idea
description: Mark a named idea as approved at an approval gate and move it to the next lifecycle phase. Use when the user approves an idea, says to mark an idea approved, asks to move an idea to the next stage, or asks to clear it from the approval queue.
---

# Approve Idea

Use this skill when the user gives an idea name and wants to approve it.

Do not use Trello. Only use files in this repo.

Follow `SYSTEM_OVERVIEW.md`, `IDEA_LIFECYCLE.md`, and [`docs/priorities-registry.md`](../../docs/priorities-registry.md).

## Inputs

Get these from the user request or by resolving from files:

- Idea name, required.
- Initiative and project, if provided.

If the idea name matches more than one entry in `priorities.json`, stop and ask the user to choose the correct one.

## Approval workflow

Run all steps in order.

1. Locate the idea in `priorities.json` under `initiatives.[Initiative].projects.[Project].ideas.[Idea]`.
2. Confirm `lifecycle` is `In Review`. If it is not `In Review`, report the current lifecycle and ask whether to continue anyway.
3. Identify the stage that was just finished.
   - Prefer `notes` (and any `reviewDocumentPath` line) in `priorities.json`.
   - If unclear, infer from the linked artifact or from the idea folder at `initiatives/[Initiative]/[Project]/[Idea]/`.
4. Determine the next `lifecycle` value.
   - **Elaboration** (thin idea) approved -> set lifecycle to **`Brief`** when brief drafting is next, or **`Backlog`** if `IDEA_LIFECYCLE.md` says the entry should stay there until Brief starts. Match what the notes say.
   - **Brief** approved -> default **`PressureTest`**. **Exception:** if that idea’s `notes` include an explicit **Pressure Test waiver** (see `IDEA_LIFECYCLE.md` **Waiver - skip Pressure Test**, e.g. a line starting with `Waiver: skip Pressure Test`), set lifecycle to **`Research`** instead.
   - **Pressure Test** approved (or notes say `02_pressure_test` / pressure test stage finished) -> **`Research`**.
   - **Research Part 1** approved -> keep lifecycle **`Research`** and set notes to continue `02b_customer_discovery.md`.
   - **Research** approved (full research, both parts done) -> **`PRD`**.
   - **PRD** approved -> **`Design`**.
   - **Design** approved -> **`Build`**.
   - **Build** approved -> **`Evaluation`**.
   - **Evaluation** approved -> **`Launch`**.
   - **Launch** approved -> **`Marketing`**.
   - **Marketing** approved -> **`Growth`**.
   - If stage text is custom, map it to the nearest lifecycle stage and explain the mapping in your summary.
5. Update the stage artifact document that was approved.
   - Change its top status line from `In Review` to `Approved`.
   - Add an approval stamp line near the top, `Approved on: YYYY-MM-DD`.
   - Add or refresh a one line `Next:` note that points to the next artifact or next action.
6. Update `priorities.json`:
   - Set `lifecycle` to the next stage from step 4 (**not** `In Review`).
   - Set `lastUpdated` to today, `YYYY-MM-DD`.
   - Refresh `notes` to reflect the approved state and the exact next step.
   - **Remove** the `reviewDocumentPath:` line from `notes` (the idea is leaving `In Review`).
7. If you made substantive progress on the initiative today, set that initiative `lastWork` to today.
8. Return a short completion summary that names:
   - The approved idea.
   - The new lifecycle.
   - The document updated.
   - Confirmation that the idea left the Web UI approval queue (`lifecycle` no longer `In Review`).

## Guardrails

- Keep names exact. Project and idea names must match folder names and `priorities.json` keys exactly.
- Do not modify unrelated ideas.
- Do not move to `Done` from approval flow unless the user explicitly says the work is complete.
- If required files are missing, stop and report what is missing before editing.
- Do **not** edit `ideas.md` or `DASHBOARD.md`.
