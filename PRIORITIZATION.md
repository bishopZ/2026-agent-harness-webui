# Prioritization and Next Work

This document is the **operational guide** for choosing what to work on next across initiatives. For lifecycle stages and templates, use [IDEA_LIFECYCLE.md](IDEA_LIFECYCLE.md). For status labels and priority vocabulary, use [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md). For the dashboard, **initiative priority stack**, approval queue, and **Last initiative work**, use [DASHBOARD.md](DASHBOARD.md). The **Initiative priority** table there is the only canonical stack. If anything disagrees with it, **DASHBOARD.md** wins.

**Tier points** and **last initiative work** from the **Initiatives** table in [DASHBOARD.md](DASHBOARD.md) feed the default combined score. Edit that table when tradeoffs change - rows are listed high to low tier, and higher tier means more pull when staleness is equal. **Project** and **idea** priority points come from that initiative's `ideas.md` (see **Project priority** and **Idea priority** below).

---

## Project priority (within an initiative)

Each row in the **Active Projects** table at the top of that initiative's `ideas.md` carries a **Priority** for the whole project. Use it to lift or lower every idea under that project in one place.

Canonical labels and numeric mapping live in [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) under **Project priority**.

Every **active** project row should have **Priority** set. If it is missing, treat it as **Medium** for scoring until you edit the row.

---

## Idea priority (within a project)

Canonical **Priority** values and meanings for idea rows live in [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) under **Priority levels**.

Every idea that competes for attention should have a **Priority** value on its row in that initiative's `ideas.md`. Ideas in **Done** or **Dropped** do not need one.

---

## Fairness and staleness

The idea list can grow past what you or the agent can finish in order. A **pure** sort by initiative tier, project pull, and idea priority would let the top initiative consume every session. To avoid that, the default pick uses a **combined score** that adds a **staleness** bonus. Initiatives with an older **Last initiative work** date rise in the ranking until they get a session.

**Staleness days** for an initiative = calendar days from **Last initiative work** in [DASHBOARD.md](DASHBOARD.md) to **today**. If the date is **blank**, treat staleness as **90 days** for scoring (same as the cap below). That makes unknown or never-logged initiatives compete for attention until dates exist.

---

## Combined score (default next-work pick)

For each **eligible** idea (see **What counts as blocked**), compute:

| Input | How to get it |
|---|---|
| `staleness_days` | `min(` calendar days since **Last initiative work** for that idea's initiative, `90` `)` |
| `tier_points` | From the **Initiatives** table in [DASHBOARD.md](DASHBOARD.md) for that initiative |
| `project_points` | From the **Active Projects** table in that initiative's `ideas.md`, for the **Project** that owns the idea. Same scale as idea priority. `High` or `1` → 6 · `Medium` or `2` → 4 · `Low` or `3` → 2. Missing project **Priority** → treat as **Medium** (4). |
| `idea_points` | Same mapping on the idea row. `High` or `1` → 6 · `Medium` or `2` → 4 · `Low` or `3` → 2 |

**Formula**

`score = staleness_days × 2 + tier_points + project_points + idea_points`

Higher **score** wins. **Total pull** for an idea is the sum of initiative tier, project points, and idea points, plus the staleness bonus. This pulls in lower-tier initiatives after they have been idle longer, while still favoring higher projects and ideas and higher **tier points** when staleness is similar.

**Tuning.** To change how fast idle initiatives catch up, adjust the multiplier on `staleness_days` (here `2`) or the **tier points** spread. Document any change in this section.

**Tie-breakers when `score` is equal**

1. **Explicit dependency or order in Notes** on the idea row.
2. **Earlier lifecycle stage (farther behind).** Use the **Stage Map** order in [IDEA_LIFECYCLE.md](IDEA_LIFECYCLE.md) (`Backlog` → `Brief` → `PressureTest` → `Research` → `PRD` → `Design` → `Build` → `Evaluation` → `Launch` → `Marketing` → `Growth`). When two ideas tie on **score**, pick the one whose **Status** appears **earlier** in that list. For example, when one row is **`Backlog`** and another is **`Design`** at the same score, choose **`Backlog`**. Ideas that have moved forward already get more natural pull as they progress. This rule keeps older pipeline stages from starving when the numbers tie.
3. Higher **tier points** (initiative priority in [DASHBOARD.md](DASHBOARD.md)).
4. Higher **project_points** (project **Priority** in **Active Projects** on that initiative's `ideas.md`).
5. Higher **idea_points** (idea row **Priority**).
6. Older **`Last updated`** on the idea row (longer wait).
7. **Idea name (A–Z)**.

---

## Tie-breakers (same initiative, no combined score)

When you are not using the combined score (for example you already picked an initiative by name), use this order within that initiative:

1. **Explicit dependency or order in Notes** - if Notes say an idea must wait on another, respect that.
2. **Earlier lifecycle stage (farther behind)** - same rule as tie-breaker 2 under **Tie-breakers when `score` is equal** (Stage Map in [IDEA_LIFECYCLE.md](IDEA_LIFECYCLE.md); earlier status wins).
3. **Higher project priority** - **High** or **1** before **Medium** or **2** before **Low** or **3** (see [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) **Project priority**).
4. **Higher idea priority** - same ordering on the idea row.
5. **Older `Last updated`** - prefer the idea that has waited longer without a touch (smaller date wins, or empty last).
6. **Idea name (A–Z)** - stable tie-break only when nothing else differs.

You can override the default anytime by editing **Notes** or **Last updated** after a real review.

---

## What counts as "blocked" (do not select for work)

An idea is **not eligible** for the next-work pick if any of these apply:

- Status is **`In Review`** (waiting on you after a stage or elaboration draft).
- Status is **`On Hold`** or **`Dropped`**, or the idea sits in **Done**.
- The same idea appears in **Awaiting your approval** in [DASHBOARD.md](DASHBOARD.md) (queue and idea status should stay aligned).

Do not start new execution on that idea until approval clears it or you redirect.

---

## Selection procedure (deterministic)

Use this when the task is "take the next most important idea forward" or similar.

### Default (fair ordering)

1. Read [DASHBOARD.md](DASHBOARD.md). Note **Initiatives** (tier points). Note any ideas in **Awaiting your approval** (they are out of scope for new work). Read **Last initiative work** for each initiative.
2. For each initiative, open `ideas.md`. Read the **Active Projects** table so you can map each idea's **Project** to **project_points**. Collect rows in project idea tables that are **not** Done, **not** Dropped, **not** On Hold, **not** In Review, and **not** in the approval queue from step 1.
3. For **each** eligible idea, compute **combined score** (see **Combined score** above), using that idea's initiative **tier_points**, its project's **project_points**, and its row's **idea_points**.
4. Choose the idea with the **highest** score. Apply **tie-breakers when score is equal**.
5. After you pick the idea, **load the process** for its work (next section) before planning execution.

### No eligible ideas

If no row passes the filters in **What counts as blocked**, say so and stop. Do not invent work.

---

## Default process vs project override

- **Default (product-style ideas)** - Follow [IDEA_LIFECYCLE.md](IDEA_LIFECYCLE.md) from the idea's current status. Use `projects/[Project]/[Idea]/` and stage artifacts as described there.
- **Override** - If the project has a guide such as `projects/[Project]/00-how-to-use.md` or a `PROCESS.md` in that project folder, **that guide wins** for stage order, artifacts, and naming for ideas under that **Project** row.

**Finding the pointer.** Check **Notes** in `ideas.md` for a link to a project guide. If there is no pointer and the project folder has `00-how-to-use.md`, use it. If there is no guide, use IDEA_LIFECYCLE.

---

## Thin ideas and elaboration

If an idea is only a title or one line in `ideas.md` and has **no** project brief under `projects/[Project]/[Idea]/01_brief.md` that states acceptance criteria, requirements, and open questions for the immediate next step, do not jump ahead. Follow the elaboration path in [IDEA_LIFECYCLE.md](IDEA_LIFECYCLE.md).

---

## After you select an idea

1. Confirm the idea is eligible (not blocked).
2. Load **process** (default or override).
3. Run the execution protocol in [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) (summarize, plan, wait for approval, execute, summarize).
4. On stage completion, set **`In Review`**, update **Notes** and **Last updated** on the idea row, add **Awaiting your approval** when appropriate, and ask for approval before the next stage.
5. When a session finishes with **substantive progress** on that initiative (including delivering work now **`In Review`**), set **Last initiative work** for that initiative in [DASHBOARD.md](DASHBOARD.md) to **today's date** (YYYY-MM-DD). That resets staleness for fairness on the next pick. If you only discussed plans with no file or registry change, you may leave the date unchanged.
