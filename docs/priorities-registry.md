# priorities.json — agent registry guide

`priorities.json` at the harness root is the **single source of truth** for initiative tier, project priority, and idea lifecycle metadata. The Web UI reads and writes **tier** and **priority** fields only; agents maintain **lifecycle**, **lastWork**, **lastUpdated**, **notes**, and (at Build) **checkpoint**.

## Design rule: simple registry, smart view

`priorities.json` is written by agents, by hand, many times a day. Every field in it is something an agent has to remember to set and can get wrong, so the file holds **only facts an agent knows and the Web UI cannot work out for itself**. Everything else the dashboard shows is **derived by the view** (the Web UI server's `src/server/utils/ideaView.ts` and the React components) from these fields plus the idea's files on disk:

| The UI shows | Derived from |
|---|---|
| Stage under review (Brief, PRD, Build…) | latest lifecycle artifact in the idea folder, when `lifecycle` is `In Review` |
| Document to open from the approval queue | that same artifact (no path in `notes`) |
| Build checkpoint list, count, milestone names | `## Checkpoint X — Name` headings in `05_build_plan.md` |
| Checkpoint position / progress bar | where `checkpoint` sits among those headings |
| Gate (`In Review` = needs you, `Ready` = agent can go) | `lifecycle` (`In Review` or not) |
| "As of" date | `lastUpdated` |
| What happens next | the `Next:` line in `notes` |

**When the dashboard needs something new, change the view, not the schema.** Do not add display fields, cached counts, copies of other fields, paths the server can find, or status values that restate `lifecycle`. If a new display truly needs a fact that exists nowhere on disk, add the smallest plain field that captures it and derive the rest.

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
              "notes": "What happened. Next: the next step",
              "checkpoint": "C"
            }
          }
        }
      }
    }
  }
}
```

That is the whole schema. `checkpoint` appears only on Build-stage ideas.

The JSON key `projects` is the registry nest — it does **not** mean a `projects/` folder on disk.

## `lastWork` rule

Initiative `lastWork` is the date of the most recent work of **any** kind on that initiative — lifecycle stages, but also documents edited outside a stage, `outputs/` and `wiki/` changes, code in a project `repo/`, research, and registry or structural changes. Set it to today whenever a session changes anything for the initiative, and never move it backwards. It drives the staleness bonus in [`PRIORITIZATION.md`](../PRIORITIZATION.md) (**Any work counts toward `lastWork`**).

## Lifecycle values

`Backlog`, `Brief`, `PressureTest`, `Research`, `PRD`, `Design`, `Build`, `Evaluation`, `Launch`, `Marketing`, `Growth`, `In Review`, `On Hold`, `Dropped`, `Done`

**Approval queue:** any idea with `lifecycle: "In Review"` appears in the Web UI approval table (`GET /api/approval-queue`). The view works out which stage is under review and links the latest artifact in the idea folder — do **not** put a `reviewDocumentPath:` line in `notes` (retired convention; old lines are harmless and ignored).

## Build `checkpoint` (one field)

At Build, set `checkpoint` on the idea to the **id of the checkpoint the build is at or heading toward**, exactly as it appears in the `05_build_plan.md` heading (`"A"`, `"C"`, `"2"`). That is the only checkpoint data agents store.

- **When to set it:** when the Build Plan (gate 6a) is drafted, and at every checkpoint stop. It is part of the closure checklist with `lifecycle`, `lastUpdated` and `notes` (see `AGENTS.md` item 4 and `SYSTEM_OVERVIEW.md` **Build checkpoint discipline**).
- **When to remove it:** never required. Once the idea leaves Build, the view ignores it.
- **Do not store** the checkpoint count, position, milestone name, gate status, evidence path, date, or reason. The view reads count and names from the plan headings, the date from `lastUpdated`, the next step from the `Next:` line in `notes`, and the gate from `lifecycle`.

A Build idea with a `05_build_plan.md` appears in the Web UI **Build Checkpoints** table whether or not `checkpoint` is set; a missing or unknown id shows as **not recorded** so the gap is visible.

### `lifecycle` is the eligibility signal

There is no separate checkpoint status. At Build:

- **`lifecycle: "Build"`** — the next action is an **agent-executable slice**. The idea is eligible for next-work. An *upcoming* owner checkpoint later in the plan does not change this — keep `Build` right up until the slice before that checkpoint is done.
- **`lifecycle: "In Review"`** — the build is **owner-gated** (Build Plan awaiting approval, or a checkpoint gate open). Not eligible for new slice work until the owner clears it.

Rules that keep the signal honest:

1. **If the next thing the idea needs is an owner action, `lifecycle` is `In Review`.** A slice the agent cannot finish in its environment counts as owner-gated once the authorable part is written — set `In Review` with the owner steps in the checkpoint section of `05_build_plan.md`.
2. **When `In Review`, `notes` names the exact next owner step on a `Next:` line** (e.g. `Next: owner builds Spike scheme in Xcode and records the M0 go/no-go`), so the next run and the Web UI both know who is blocked and on what.

## Add idea (with brief)

1. Create `initiatives/[Initiative]/[Project]/[Idea]/01_brief.md` (and folders as needed).
2. In `priorities.json`, under the initiative → project → `ideas`, add or update:

```json
"Idea Name": {
  "priority": "Medium",
  "lifecycle": "In Review",
  "lastUpdated": "2026-05-29",
  "notes": "Brief drafted — awaiting approval. Next: approve → Pressure Test (`02_pressure_test.md`)."
}
```

3. Set initiative `lastWork` to today (any work on the initiative counts — see **`lastWork` rule** above).
4. Set brief front matter `**Status:** In Review` to match.

Registry is `priorities.json` only. Do not add a markdown registry file.

## Approve idea

1. Update the approved artifact (`**Status:** Approved`, approval stamp).
2. In `priorities.json`, set `lifecycle` to the next stage (e.g. `PressureTest` after Brief approval). Remove `In Review`.
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

1. Create folder layout under `initiatives/[Name]/`: `General/`, `history/` (`done-history.md`, `dropped-history.md`), `project-history.md`, `sources/`, `outputs/`, `wiki/` — **no** markdown registry file, **no** `projects/` container.
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

Then delete them. If folders still use `initiatives/.../projects/[Project]/`, move them to the flat layout first.
