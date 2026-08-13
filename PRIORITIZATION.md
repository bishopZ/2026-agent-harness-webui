# Prioritization and Next Work

This document is the **operational guide** for choosing what to work on next across initiatives. For lifecycle stages and templates, use [IDEA_LIFECYCLE.md](IDEA_LIFECYCLE.md). For status labels and priority vocabulary, use [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md). For initiative tier, `lastWork`, project priority, idea priority, `lifecycle`, and the approval queue, use [`priorities.json`](priorities.json) and [`docs/priorities-registry.md`](docs/priorities-registry.md). `priorities.json` is the only canonical registry. If anything on disk disagrees with it, reconcile via `GET /api/discover` or fix keys manually — `priorities.json` wins.

**Tier points** and `lastWork` per initiative, plus **project** and **idea** priority, all live in `priorities.json`. Edit those fields when tradeoffs change.

---

## Project priority (within an initiative)

Each project entry under an initiative in `priorities.json` (`initiatives.[Name].projects.[Project]`) carries a `priority` for the whole project. Use it to lift or lower every idea under that project in one place.

Canonical labels and numeric mapping live in [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) under **Project priority**.

Every **active** project entry should have `priority` set. If it is missing, treat it as **Medium** for scoring until you edit the field.

---

## Idea priority (within a project)

Canonical **Priority** values and meanings for idea entries live in [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) under **Priority levels**.

Every idea that competes for attention should have a `priority` value on its entry in `priorities.json`. Ideas with `lifecycle` `Done` or `Dropped` do not need one.

---

## Fairness and staleness

The idea list can grow past what you or the agent can finish in order. A **pure** sort by initiative tier, project pull, and idea priority would let the top initiative consume every session. To avoid that, the default pick uses a **combined score** that adds a **staleness** bonus. Initiatives with an older `lastWork` date rise in the ranking until they get a session.

**Staleness days** for an initiative = calendar days from that initiative's `lastWork` in `priorities.json` to **today**. If `lastWork` is **blank**, treat staleness as **90 days** for scoring (same as the cap below). That makes unknown or never-logged initiatives compete for attention until dates exist.

---

## Combined score (default next-work pick)

For each **eligible** idea (see **What counts as blocked**), compute:

| Input | How to get it |
|---|---|
| `staleness_days` | `min(` calendar days since `lastWork` for that idea's initiative, `90` `)` |
| `tier_points` | `initiatives.[Name].tier` in `priorities.json` |
| `project_points` | `initiatives.[Name].projects.[Project].priority` in `priorities.json`, for the **Project** that owns the idea. Same scale as idea priority. `High` or `1` → 6 · `Medium` or `2` → 4 · `Low` or `3` → 2. Missing project `priority` → treat as **Medium** (4). |
| `idea_points` | `initiatives.[Name].projects.[Project].ideas.[Idea].priority`. Same mapping. `High` or `1` → 6 · `Medium` or `2` → 4 · `Low` or `3` → 2 |

**Formula**

`score = staleness_days × 2 + tier_points + project_points + idea_points`

Higher **score** wins. **Total pull** for an idea is the sum of initiative tier, project points, and idea points, plus the staleness bonus. This pulls in lower-tier initiatives after they have been idle longer, while still favoring higher projects and ideas and higher **tier points** when staleness is similar.

**Tuning.** To change how fast idle initiatives catch up, adjust the multiplier on `staleness_days` (here `2`) or the **tier points** spread. Document any change in this section.

**Tie-breakers when `score` is equal**

1. **Explicit dependency or order in `notes`** on the idea entry.
2. **Earlier lifecycle stage (farther behind).** Use the **Stage Map** order in [IDEA_LIFECYCLE.md](IDEA_LIFECYCLE.md) (`Backlog` → `Brief` → `PressureTest` → `Research` → `PRD` → `Design` → `Build` → `Evaluation` → `Launch` → `Marketing` → `Growth`). When two ideas tie on **score**, pick the one whose `lifecycle` appears **earlier** in that list. For example, when one entry is **`Backlog`** and another is **`Design`** at the same score, choose **`Backlog`**. Ideas that have moved forward already get more natural pull as they progress. This rule keeps older pipeline stages from starving when the numbers tie.
3. Higher **tier_points** (initiative `tier` in `priorities.json`).
4. Higher **project_points** (project `priority` in `priorities.json`).
5. Higher **idea_points** (idea `priority` in `priorities.json`).
6. Older `lastUpdated` on the idea entry (longer wait).
7. **Idea name (A–Z)**.

---

## Tie-breakers (same initiative, no combined score)

When you are not using the combined score (for example you already picked an initiative by name), use this order within that initiative:

1. **Explicit dependency or order in `notes`** - if `notes` say an idea must wait on another, respect that.
2. **Earlier lifecycle stage (farther behind)** - same rule as tie-breaker 2 under **Tie-breakers when `score` is equal** (Stage Map in [IDEA_LIFECYCLE.md](IDEA_LIFECYCLE.md); earlier `lifecycle` wins).
3. **Higher project priority** - **High** or **1** before **Medium** or **2** before **Low** or **3** (see [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) **Project priority**).
4. **Higher idea priority** - same ordering on the idea entry.
5. **Older `lastUpdated`** - prefer the idea that has waited longer without a touch (smaller date wins, or empty last).
6. **Idea name (A–Z)** - stable tie-break only when nothing else differs.

You can override the default anytime by editing `notes` or `lastUpdated` after a real review.

---

## What counts as "blocked" (do not select for work)

An idea is **not eligible** for the next-work pick if any of these apply:

- `lifecycle` is **`In Review`** (waiting on you after a stage or elaboration draft). These ideas already surface automatically in the Web UI approval queue (`GET /api/approval-queue`).
- `lifecycle` is **`On Hold`**, **`Dropped`**, or **`Done`**.
- The idea is at **Build** and its `checkpoint.status` is **`"In Review"`** — it is owner-gated at a checkpoint (same standing as `lifecycle: "In Review"`). See [`docs/priorities-registry.md`](docs/priorities-registry.md) **checkpoint.status is the eligibility signal**.

A Build idea whose `checkpoint.status` is **`"Ready"`** **is** eligible: `Ready` means the next action is an agent-executable slice, so take that slice. An *upcoming* owner checkpoint later in the plan does **not** block the slices that come before it — do those, then stop at the checkpoint. If a slice needs a capability the environment lacks, do not skip the idea: author what you can in `repo/`, hand the run to the owner in the checkpoint, and move the idea to `In Review` (see [`rules/execution-environment.md`](rules/execution-environment.md)).

Do not start new execution on a blocked idea until approval clears it or you redirect.

---

## Selection procedure (deterministic)

Use this when the task is "take the next most important idea forward" or similar.

### Default (fair ordering)

1. Read `priorities.json`. Note each initiative's `tier` and `lastWork`. Note any ideas with `lifecycle: "In Review"` (they are out of scope for new work — check the approval queue).
2. For each initiative, read its `projects` map so you can map each idea's project to `project_points`. Collect ideas that are **not** `Done`, **not** `Dropped`, **not** `On Hold`, and **not** `In Review`.
3. For **each** eligible idea, compute **combined score** (see **Combined score** above), using that idea's initiative `tier_points`, its project's `project_points`, and its own `idea_points`.
4. Choose the idea with the **highest** score. Apply **tie-breakers when score is equal**.
5. After you pick the idea, **load the process** for its work (next section) before planning execution.

### No eligible ideas

If no entry passes the filters in **What counts as blocked**, say so and stop. Do not invent work.

---

## Default process vs project override

- **Default (product-style ideas)** - Follow [IDEA_LIFECYCLE.md](IDEA_LIFECYCLE.md) from the idea's current `lifecycle`. Use `initiatives/[Initiative]/[Project]/[Idea]/` and stage artifacts as described there.
- **Override** - If the project has a guide such as `initiatives/[Initiative]/[Project]/00-how-to-use.md` or a `PROCESS.md` in that project folder, **that guide wins** for stage order, artifacts, and naming for ideas under that project.

**Finding the pointer.** Check `notes` on the idea's entry in `priorities.json` for a link to a project guide. If there is no pointer and the project folder has `00-how-to-use.md`, use it. If there is no guide, use IDEA_LIFECYCLE.

---

## Thin ideas and elaboration

If an idea is only a name or one line in `priorities.json` and has **no** project brief under `initiatives/[Initiative]/[Project]/[Idea]/01_brief.md` that states acceptance criteria, requirements, and open questions for the immediate next step, do not jump ahead. Follow the elaboration path in [IDEA_LIFECYCLE.md](IDEA_LIFECYCLE.md).

---

## After you select an idea

1. Confirm the idea is eligible (not blocked).
2. Load **process** (default or override).
3. Run the execution protocol in [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md) (summarize, plan, wait for approval, execute, summarize).
4. On stage completion, set `lifecycle` to **`In Review`**, update `notes` and `lastUpdated` on the idea's entry in `priorities.json`, and ask for approval before the next stage. The Web UI approval queue reflects this automatically — no separate dashboard row to add.
5. When a session finishes with **substantive progress** on that initiative (including delivering work now `In Review`), set that initiative's `lastWork` in `priorities.json` to **today's date** (YYYY-MM-DD). That resets staleness for fairness on the next pick. If you only discussed plans with no file or registry change, you may leave the date unchanged.
