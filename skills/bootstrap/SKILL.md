---
name: bootstrap
description: >-
  First-run setup for a new instance of this system. Interviews the user to
  populate USER.md, configures initiatives (replacing or keeping the defaults),
  and configures priorities.json tier stack. Use when a user is setting up
  the repo for the first time.
---

# Bootstrap

Use this skill when a user is setting up a fresh copy of this repo. It replaces the placeholder defaults with real information through a short interview, then configures the system so the next-idea loop can begin.

Do not assume anything about the user. Ask every question. Do not fill in placeholders with invented content.

---

## Phase 1 - Interview

Ask these questions one group at a time. Wait for the answers before moving to the next group. Do not ask all questions at once.

### Group 1 - Identity

Ask:

1. What is your name (or the name you want the AI to use for you)?
2. Do you have a short handle or shorthand you prefer (for example initials or a nickname)? This is optional.

### Group 2 - Working style

Ask:

3. How do you prefer to work with the AI? For example: do you want it to plan before acting and wait for your go-ahead, or do you prefer it to move faster and ask forgiveness?
4. Are there any strong preferences or constraints the AI should always keep in mind - things like communication style, tone, topics to avoid, or how you like feedback?

### Group 3 - Initiatives

Explain briefly: "This system organizes your work into initiatives - each one is a top-level area of focus. The repo comes with three defaults: **My Company** (a business), **My Personal Life** (personal brand and goals), and **My Hobby** (a creative project). You can keep them, rename them, replace them, or add your own."

Ask:

5. Do you want to keep the three default initiatives, rename them, or replace them with your own? List them out with names and a one-line description of each.
6. Which initiative is most important right now? Which is least?

### Group 4 - Context

Ask:

7. Is there anything else the AI should know about you upfront - your background, what you are trying to accomplish this year, constraints on your time or resources, or anything that would help it give better advice?

---

## Phase 2 - Write USER.md

Using the answers from Phase 1, write `USER.md` in full. Do not leave placeholder text. Use the standard structure:

```markdown
# USER.md - About [Name]

_This file helps the AI stay oriented across sessions. Update it as context builds._

---

## Identity

- **Name:** [Name]
- **Handle / Shorthand:** [Handle, or omit line if none]

---

## Active Initiatives

| Initiative | Description |
|---|---|
| **[Initiative 1]** | [Description] |
| **[Initiative 2]** | [Description] |
| **[Initiative 3]** | [Description] |

---

## Working Style & Preferences

[Write 2–4 bullet points based on their answers. Capture actual preferences, not generic placeholders.]

---

## Context & Background

[Write 1–3 sentences based on their answer to question 7. If they gave nothing, write: "No background context provided yet. Add notes here as they become relevant."]

---

## Things to Remember

_(One-off facts, preferences, or decisions that don't fit neatly elsewhere.)_

---

_The more context here, the less you have to re-explain each session. Update freely._
```

Show the draft to the user and ask them to confirm or correct it before writing the file.

---

## Phase 3 - Configure initiatives

Based on the user's answers to Group 3:

### If they want to keep the three defaults unchanged:

No folder changes needed. Skip to Phase 4.

### If they want to rename one or more defaults:

For each rename, move the existing initiative folder using a git-aware move:

```
git mv "initiatives/[Old Name]" "initiatives/[New Name]"
```

Then update the following in the new folder:
- `wiki/index.md` - H1 title and self-references
- `wiki/log.md` - H1 title
- `history/done-history.md` / `history/dropped-history.md` - H1 titles if present
- `project-history.md` - leave structure; no initiative name required in the default template

Update `priorities.json` - rename the initiative key; keep `tier`, `lastWork`, and nested projects.
Update `AGENTS.md` - the initiative row if it appears there.
Update `USER.md` (just written) - the initiative name in the Active Initiatives table.

Do **not** create or edit `ideas.md` or `DASHBOARD.md`.

### If they want to replace one or more defaults with entirely new initiatives:

For each initiative to remove, use the **remove-initiative** skill (empty defaults can be removed without the Option A / B prompt since they have no active ideas).

For each new initiative, use the **add-initiative** skill.

### If they want to add initiatives beyond three:

Use the **add-initiative** skill for each additional one.

---

## Phase 4 - Set the priority stack

Show the user the initiative list from `priorities.json` with tiers configured. Ask:

"Here is your initiative priority stack. The tier points control how the AI prioritizes work across initiatives - higher means more pull. Does this order look right, or do you want to adjust the tier values?"

If they want changes, update `tier` values in `priorities.json`. Keep tiers as distinct integers (for example 9, 6, 3) so ordering is unambiguous.

If legacy `DASHBOARD.md` / `ideas.md` still exist from an older copy, mention `npm run migrate-registry` once (see [`docs/priorities-registry.md`](../../docs/priorities-registry.md)), then delete those markdown registry files after a successful migrate.

---

## Phase 5 - Confirm and summarize

Tell the user:

1. `USER.md` has been written with their information.
2. The initiative stack is configured with [N] initiatives: [list names and tiers].
3. What to do next: add projects and ideas to each initiative using the **add-project** and **add-idea** skills, then drop any background documents into `/raw/` and run the **update** skill to build the wiki.

Do not create any projects or ideas during bootstrap. That is for the user to do next.

---

## Guardrails

- Do not invent any personal details, preferences, or initiative descriptions. Every word in `USER.md` must come from the user's answers.
- Do not write `USER.md` until the user confirms the draft.
- Do not remove the last initiative. At least one must remain.
- If the user skips a question, leave that field with a clear empty placeholder rather than making something up.
- Do **not** edit `ideas.md` or `DASHBOARD.md` — registry is `priorities.json` only.
