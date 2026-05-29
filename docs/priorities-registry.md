# priorities.json — agent registry guide

`priorities.json` at the harness root is the **single source of truth** for initiative tier, project priority, and idea lifecycle metadata. The Web UI reads and writes **tier** and **priority** fields only; agents maintain **lifecycle**, **lastWork**, **lastUpdated**, and **notes**.

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
              "notes": "Next step and links"
            }
          }
        }
      }
    }
  }
}
```

## Lifecycle values

`Backlog`, `Brief`, `PressureTest`, `Research`, `PRD`, `Design`, `Build`, `Evaluation`, `Launch`, `Marketing`, `Growth`, `In Review`, `On Hold`, `Dropped`, `Done`

**Approval queue:** any idea with `lifecycle: "In Review"` appears in the Web UI approval table (`GET /api/approval-queue`).

## Add idea (with brief)

1. Create `initiatives/[Initiative]/projects/[Project]/[Idea]/01_brief.md` (and folders as needed).
2. In `priorities.json`, under the initiative → project → `ideas`, add or update:

```json
"Idea Name": {
  "priority": "Medium",
  "lifecycle": "In Review",
  "lastUpdated": "2026-05-29",
  "notes": "Brief drafted — awaiting approval → Pressure Test (`02_pressure_test.md`)."
}
```

3. Set initiative `lastWork` to today when the session counts as substantive progress.
4. Set brief front matter `**Status:** In Review` to match.

Do **not** create `ideas.md` or `DASHBOARD.md` rows.

## Approve idea

1. Update the approved artifact (`**Status:** Approved`, approval stamp).
2. In `priorities.json`, set `lifecycle` to the next stage (e.g. `PressureTest` after Brief approval). Remove `In Review`.
3. Update `lastUpdated` and `notes` with the next artifact path.

## Add project

1. Create `initiatives/[Initiative]/projects/[Project Name]/` and `00-how-to-use.md`.
2. Add under `priorities.json` → initiative → `projects`:

```json
"Project Name": {
  "priority": "Medium",
  "purpose": "One-line purpose",
  "ideas": {}
}
```

## Add initiative

1. Create folder layout under `initiatives/[Name]/` (sources, outputs, projects/General, wiki) — **no** `ideas.md`.
2. Add initiative entry to `priorities.json` with `tier`, `lastWork`, and default `General` project.

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

Then delete the markdown registry files.
