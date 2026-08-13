# priorities.json — agent registry guide

`priorities.json` at the harness root is the **single source of truth** for initiative tier, project priority, and idea lifecycle metadata. The Web UI reads and writes **tier** and **priority** fields only; agents maintain **lifecycle**, **lastWork**, **lastUpdated**, and **notes**.

Artifact folders use the **flat** layout: `initiatives/[Initiative]/[Project]/[Idea]/` (no `projects/` container). See [`SYSTEM_OVERVIEW.md`](../SYSTEM_OVERVIEW.md).

## Schema

```json
{
  "version": 3,
  "updated": "YYYY-MM-DD",
  "initiatives": {
    "Initiative Name": {
      "tier": 8,
      "lastWork": "YYYY-MM-DD",
      "projects": {
        "Project Name": {
          "priority": "Medium",
          "purpose": "One-line project description",
          "ideas": {
            "Idea Name": {
              "priority": "Medium",
              "lifecycle": "In Review",
              "lastUpdated": "YYYY-MM-DD",
              "notes": "Next step and links",
              "checkpoint": {
                "current": "A",
                "index": 0,
                "total": 6,
                "status": "In Review",
                "label": "Short milestone name",
                "asOf": "YYYY-MM-DD",
                "evidence": "initiatives/Initiative/Project/Idea/05_build_plan.md",
                "reason": "What the gate is waiting on / what is next"
              }
            }
          }
        }
      }
    }
  }
}
```

The JSON key `projects` is the registry nest — it does **not** mean a `projects/` folder on disk.

## Lifecycle values

`Backlog`, `Brief`, `PressureTest`, `Research`, `PRD`, `Design`, `Build`, `Evaluation`, `Launch`, `Marketing`, `Growth`, `In Review`, `On Hold`, `Dropped`, `Done`

**Approval queue:** any idea with `lifecycle: "In Review"` appears in the Web UI approval table (`GET /api/approval-queue`).

## Build checkpoint object

The optional `checkpoint` object on an idea entry is the **only** data source for the Web UI **Build Checkpoints** table (`PriorityWorkspace` → `BuildCheckpoints`). An in-flight Build idea **without** this object does not appear in that table, even though it shows in the initiative tree — so any idea that has a `05_build_plan.md` (drafted or approved) or has reached a Build checkpoint must carry one.

**When to write it:** create the object when the Build Plan (gate 6a) is drafted or approved, and update it at every checkpoint stop (`current`, `index`, `status`, `label`, `asOf`, `reason`). This belongs in the same closure checklist that updates `lifecycle` / `lastUpdated` / `notes` (see `AGENTS.md` item 4 and `SYSTEM_OVERVIEW.md` **Build checkpoint discipline**).

**When to remove it:** delete the object when the build completes or its plan is superseded. Absence is the table's filter — finished and abandoned builds simply drop out, so there is nothing to hide and no toggle to maintain.

**Fields:**

| Field | Required | Meaning |
|---|---|---|
| `current` | yes | Label of the checkpoint the build is at or heading toward (e.g. `"A"`, `"C"`). |
| `index` | yes | Zero-based position of `current` among the plan's checkpoints. |
| `total` | yes | Number of checkpoints in the Build Plan. |
| `status` | yes | `"In Review"` (amber — owner-blocked, needs you) or `"Ready"` (blue — the agent loop can take the next slice). Owner-blocked rows sort first. |
| `label` | no | Short human milestone name for the current checkpoint. |
| `asOf` | no | `YYYY-MM-DD` the checkpoint state was last set. |
| `evidence` | no | Path (relative to harness root) to the `05_build_plan.md` or `05_build/verification_log.md` backing this state. |
| `reason` | no | One line on what the gate is waiting on or what task is next. |

## Add idea (with brief)

1. Create `initiatives/[Initiative]/[Project]/[Idea]/01_brief.md` (and folders as needed).
2. In `priorities.json`, under the initiative → project → `ideas`, add or update:

```json
"Idea Name": {
  "priority": "Medium",
  "lifecycle": "In Review",
  "lastUpdated": "2026-05-29",
  "notes": "Brief drafted — awaiting approval → Pressure Test (`02_pressure_test.md`).\nreviewDocumentPath: initiatives/Initiative/Project/Idea/01_brief.md"
}
```

3. Set initiative `lastWork` to today when the session counts as substantive progress.
4. Set brief front matter `**Status:** In Review` to match.

Do **not** create `ideas.md` or `DASHBOARD.md` rows.

## Approve idea

1. Update the approved artifact (`**Status:** Approved`, approval stamp).
2. In `priorities.json`, set `lifecycle` to the next stage (e.g. `PressureTest` after Brief approval). Remove `In Review`. Clear or update `reviewDocumentPath` in `notes`.
3. Update `lastUpdated` and `notes` with the next artifact path.

## Add project

1. Create `initiatives/[Initiative]/[Project Name]/` and `00-how-to-use.md` (flat under the initiative — not under `projects/`).
2. Optionally add empty `repo/` with `.gitkeep` if the project has an associated GitHub repo (user runs `git submodule add`).
3. Add under `priorities.json` → initiative → `projects`:

```json
"Project Name": {
  "priority": "Medium",
  "purpose": "One-line purpose",
  "ideas": {}
}
```

## Add initiative

1. Create folder layout under `initiatives/[Name]/`: `General/`, `history/` (`done-history.md`, `dropped-history.md`), `project-history.md`, `sources/`, `outputs/`, `wiki/` — **no** `ideas.md`, **no** `projects/` container.
2. Add initiative entry to `priorities.json` with `tier`, `lastWork`, and default `General` project.

## Done / Dropped / Closed Projects

- Completed ideas: append to `history/done-history.md`; set `lifecycle` to `Done` in `priorities.json`.
- Dropped ideas: append to `history/dropped-history.md`; set `lifecycle` to `Dropped`.
- Closed projects: append to `project-history.md` under **## Closed Projects**; remove the project from `priorities.json`.

## Reconcile

On server start and `GET /api/discover`, reconcile walks the filesystem and:

- Adds missing initiative/project/idea keys (new ideas infer `In Review` from brief `**Status:**` when present).
- Prunes keys with no matching folders.
- **Never overwrites** existing lifecycle on ideas already in the file.

## Migration from markdown

If legacy `DASHBOARD.md` / `ideas.md` exist, run once:

```bash
npm run migrate-registry
```

Then delete the markdown registry files. If folders still use `initiatives/.../projects/[Project]/`, move them to the flat layout first.
