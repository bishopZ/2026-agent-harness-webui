# AGENTS.md

## Overview

### What this repo is

This is the **Agent Harness Web UI** demo harness: a local Express + React app (see [`WEBUI.md`](WEBUI.md)) plus a Markdown lifecycle workspace. Initiative and idea registry data lives in **`priorities.json`** at the repo root — there is no `DASHBOARD.md` and no per-initiative `ideas.md`. Lifecycle artifacts live under `initiatives/[Name]/[Project]/[Idea]/`, **flat** — there is no `projects/` container folder between the initiative and its projects.

### Key documents

- `SYSTEM_OVERVIEW.md` — system design, folder layout, lifecycle statuses.
- `IDEA_LIFECYCLE.md` — stages, gates, artifact templates.
- `priorities.json` — **canonical registry** (tier, `lastWork`, project priority, idea `lifecycle`, `notes`). See [`docs/priorities-registry.md`](docs/priorities-registry.md).
- `PRIORITIZATION.md` — how to pick the next idea using `priorities.json`.
- `USER.md` — user context; read at session start.
- `rules/` — cross-cutting rules cited by lifecycle stages.
- `agents/` — specialist review profiles at gates (not this file).
- Each initiative: `initiatives/[Name]/` with project folders directly inside it, `sources/`, `outputs/`, `history/` (`done-history.md`, `dropped-history.md`), an optional `project-history.md`, and `wiki/`. **No** per-initiative `ideas.md`.

### Active initiatives

Read `priorities.json` → `initiatives` for the list, tier stack, and in-flight ideas. Ideas with `lifecycle: "In Review"` appear in the Web UI approval queue.

### Running the app

```bash
npm install
npm run dev    # http://127.0.0.1:PORT — set HARNESS_ROOT in .env
npm test
```

### How to work in this repo

1. Read `USER.md`, then `SYSTEM_OVERVIEW.md` and [`docs/priorities-registry.md`](docs/priorities-registry.md).
2. For lifecycle work, read `IDEA_LIFECYCLE.md` and the rules/agent profiles it cites at each stage.
3. **Always update `priorities.json`** when adding ideas, changing `lifecycle`, or updating an initiative's `lastWork`. Never recreate `ideas.md` or `DASHBOARD.md` — they are retired in this harness.
4. **At Build, checkpoints are session boundaries.** Follow `rules/incremental-execution.md` for the Plan → Slice → Verify cycle. Treat checkpoints named in `05_build_plan.md` as boundaries for **this agent's session** — after the last task before a checkpoint, stop and do not start the next task unless the user explicitly says to continue past it. Before stopping, run the checkpoint's **Closure checklist**: append or update `05_build/verification_log.md` for everything verified this session; update that idea's entry in `priorities.json` (`lifecycle`, `lastUpdated`, `notes` with a clear **Next:**); append `wiki/log.md` if wiki pages changed. The Web UI approval queue and priority workspace read `priorities.json` directly, so skipping closure lets the registry drift out of sync with the repo just as badly as it would with a stale `ideas.md` — treat that as a process failure, not a shortcut. See `SYSTEM_OVERVIEW.md` **Build checkpoint discipline**.
5. Never delete wiki pages — archive to `wiki/.archive/`.
6. Never modify `sources/` after ingestion.
7. Update `wiki/index.md` and `wiki/log.md` after wiki operations.
8. Keep artifact paths flat: `initiatives/[Initiative]/[Project]/[Idea]/` — never introduce a `projects/` container folder or a new `ideas.md`.

---

## reviewDocumentPath convention

When an idea advances to `lifecycle: "In Review"`, the agent **must** include the following line in that idea's `notes` field in `priorities.json`:

```
reviewDocumentPath: path/relative/to/harness/root.md
```

**Example:**

```json
"notes": "Brief drafted 2026-06-12.\nreviewDocumentPath: initiatives/Time2Magic/Agent Harness Web UI/New Idea/03_prd.md"
```

**Rules:**
- The path is relative to `HARNESS_ROOT` (the same root used by all `/api/*` endpoints).
- The line must begin exactly with `reviewDocumentPath:` followed by a space and the path — no leading spaces.
- Only one `reviewDocumentPath` line per notes block. If you update the path, replace the old line.
- When an idea leaves `In Review` (approved, dropped, or redirected), remove the `reviewDocumentPath` line from notes or leave it — it will be ignored when `lifecycle` is not `"In Review"`.

**Why:** The Web UI approval queue reads this field to deep-link each queue row to the document that needs review, so the user can open it in one click.
