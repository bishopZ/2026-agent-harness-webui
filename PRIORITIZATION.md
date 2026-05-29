# Prioritization and Next Work

Operational guide for choosing what to work on next. Lifecycle: [IDEA_LIFECYCLE.md](IDEA_LIFECYCLE.md). Status vocabulary: [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md). **Registry:** [priorities.json](priorities.json) and [docs/priorities-registry.md](docs/priorities-registry.md).

**Tier points** and **lastWork** per initiative, plus project and idea **priority**, all live in `priorities.json`. If anything disagrees with the filesystem, reconcile via `GET /api/discover` or fix keys manually.

---

## Project priority (within an initiative)

Each project entry has `"priority": "High" | "Medium" | "Low"`. It applies to every idea under that project in the combined score.

---

## Idea priority (within a project)

Each idea entry has `"priority"`. Ideas with `lifecycle` **Done** or **Dropped** are not eligible for next-work selection.

---

## Fairness and staleness

**Staleness days** = calendar days from initiative `lastWork` in `priorities.json` to today. Blank `lastWork` → treat as **90 days** (capped).

---

## Combined score (default next-work pick)

For each **eligible** idea:

| Input | Source |
|---|---|
| `staleness_days` | `min(days since initiative lastWork, 90)` |
| `tier_points` | `initiatives.[Name].tier` |
| `project_points` | `projects.[P].priority` — High/1→6, Medium/2→4, Low/3→2 |
| `idea_points` | `ideas.[I].priority` — same scale |

**Formula:** `score = staleness_days × 2 + tier_points + project_points + idea_points`

**Tie-breakers when score is equal:**

1. Explicit order in idea `notes`
2. Earlier lifecycle stage (Stage Map in IDEA_LIFECYCLE.md)
3. Higher tier_points
4. Higher project_points
5. Higher idea_points
6. Older `lastUpdated`
7. Idea name A–Z

---

## What counts as blocked

Not eligible if `lifecycle` is **In Review**, **On Hold**, **Done**, or **Dropped**.

---

## Selection procedure

1. Read `priorities.json` — tiers, lastWork, all ideas and lifecycles.
2. Exclude blocked lifecycles.
3. Compute score for each eligible idea.
4. Pick highest score; apply tie-breakers.
5. Load process (IDEA_LIFECYCLE or project `00-how-to-use.md`).

### After selection

- Execute next phase; on completion set `lifecycle: "In Review"` and update `notes` / `lastUpdated`.
- Set initiative `lastWork` to today when substantive progress finishes.

---

## Thin ideas

If an idea has only a registry line and no `01_brief.md` with acceptance criteria for the next step, run elaboration before later stages.
