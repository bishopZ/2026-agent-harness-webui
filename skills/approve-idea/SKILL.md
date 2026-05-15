---
name: approve-idea
description: Mark a named idea as approved at an approval gate and move it to the next lifecycle phase. Use when the user approves an idea, says to mark an idea approved, asks to move an idea to the next stage, or asks to clear it from the approval queue in DASHBOARD.md.
---

# Approve Idea

Use this skill when the user gives an idea name and wants to approve it.

Do not use Trello. Only use files in this repo.

Follow `SYSTEM_OVERVIEW.md` and `IDEA_LIFECYCLE.md` for lifecycle rules and valid statuses.

## Inputs

Get these from the user request or by resolving from files:

- Idea name, required.
- Initiative and project, if provided.

If the idea name matches more than one row across initiatives or projects, stop and ask the user to choose the correct one.

## Approval workflow

Run all steps in order.

1. Locate the idea row in the correct initiative `ideas.md` file.
2. Confirm current status is `In Review`. If it is not `In Review`, report the current status and ask whether to continue anyway.
3. Identify the stage that was just finished.
   - Prefer the `Awaiting your approval` row in `DASHBOARD.md`.
   - If no tracker row exists, infer from the linked artifact in `Notes / next action` or from the idea folder.
4. Determine the next lifecycle status.
   - **Elaboration** (thin idea) approved -> set status to **`Brief`** when brief drafting is next, or **`Backlog`** if `IDEA_LIFECYCLE.md` says the row should stay there until Brief starts. Match what the approval row says.
   - **Brief** approved -> default **`PressureTest`**. **Exception:** if that idea’s `ideas.md` **Notes** include an explicit **Pressure Test waiver** (see `IDEA_LIFECYCLE.md` **Waiver - skip Pressure Test**, e.g. a line starting with `Waiver: skip Pressure Test`), set status to **`Research`** instead.
   - **Pressure Test** approved (or tracker says `02_pressure_test` / pressure test stage finished) -> **`Research`**.
   - **Research Part 1** approved -> keep status **`Research`** and set notes to continue `02b_customer_discovery.md`.
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
6. Update the idea row in initiative `ideas.md`.
   - Set `Status` to the next lifecycle status from step 4.
   - Set `Last updated` to today, `YYYY-MM-DD`.
   - Update `Notes / next action` to reflect the approved state and the exact next step.
7. Update `DASHBOARD.md`.
   - Remove the matching row from `Awaiting your approval`.
   - If approval included a revision request instead of true approval, keep the row and refresh `Notes`.
8. If you made substantive progress on the initiative today, set that initiative `Last initiative work` to today in the `Initiatives` table.
9. Return a short completion summary that names:
   - The approved idea.
   - The new status.
   - The document updated.
   - Confirmation that the approval queue row was removed.

## Guardrails

- Keep names exact. `Project` and `Idea` names must match folder names and rows exactly.
- Do not modify unrelated approval rows.
- Do not move to `Done` from approval flow unless the user explicitly says the work is complete.
- If required files are missing, stop and report what is missing before editing.

