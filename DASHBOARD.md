# Dashboard

This file is the **dashboard** for all initiatives. It is the **source of truth for initiative-level priority** (**tier points** in the table below). It shows high-level status and what is waiting for your approval. It does not list every idea. For the full idea list per initiative, open that initiative’s `ideas.md`. **Project** and **per-idea** priority and status still live there, while all working files now live under each initiative `projects/` tree. For workflow and stages, see `SYSTEM_OVERVIEW.md` and `IDEA_LIFECYCLE.md`. For how tier points, project priority, idea priority, and staleness combine to pick the next idea, see [PRIORITIZATION.md](PRIORITIZATION.md).

---

## How to use this document

- Keep the **Initiatives** table current. **Tier points**, **What** (purpose), and **last initiative work** all live in that one place. Do not duplicate the tier stack elsewhere.
- Keep **Awaiting your approval** accurate. Add a row when a stage or elaboration draft is done and the Agent is blocked on you. Remove or clear rows after you approve or redirect.
- Keep this queue aligned with each affected idea’s status in `ideas.md`. When work is waiting on you, that idea should be `**In Review`** there. When you approve, update `ideas.md` and clear or refresh the row here.

**Valid statuses** for idea rows and **priority** labels for idea rows are defined in `SYSTEM_OVERVIEW.md` (Idea Statuses and **Priority levels (ideas)**). **Project priority** labels are defined there under **Project priority**.

---

## Initiatives

Rank initiatives here when tradeoffs matter. **Tier points** are the only number the combined score uses for initiative pull. Higher tier means more pull when staleness is equal. List rows with **highest tier points at the top** so the stack reads like a leaderboard. See [PRIORITIZATION.md](PRIORITIZATION.md) for the formula and strict stack mode.

Give each initiative a **distinct** tier value when you can (for example 9, 6, 3, 0) so the math and strict ordering stay obvious. If two rows ever share the same **Tier points**, **table order** top to bottom breaks the tie for strict stack mode.

**Last initiative work** is the calendar date of the last session that produced substantive progress on any idea in that initiative (drafts, stage output, wiki or file updates tied to moving work forward). Update it when that work finishes. It powers **fairness** in [PRIORITIZATION.md](PRIORITIZATION.md) so lower-tier initiatives do not starve.


| Tier points | Initiative                                                    | What                                                 | Last initiative work |
| ----------- | ------------------------------------------------------------- | ---------------------------------------------------- | -------------------- |
| 8           | [My Company](initiatives/My%20Company/ideas.md)               | Initiatives, products, and growth for your business. | 2026-04-14           |
| 6           | [My Personal Life](initiatives/My%20Personal%20Life/ideas.md) | Personal brand, habits, goals, and growth.           | 2026-04-14           |
| 1           | [My Hobby](initiatives/My%20Hobby/ideas.md)                   | Developing and creating your hobby project.          | 2026-04-14           |


---

## Awaiting your approval


| Initiative | Project | Idea | Stage just finished | Blocking next step | Since | Links |
| ---------- | ------- | ---- | ------------------- | ------------------ | ----- | ----- |
|            |         |      |                     |                    |       |       |


