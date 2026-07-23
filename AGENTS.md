# AGENTS.md

## Overview

### What this repo is

This is the **Agent Harness Web UI** demo harness: a local Express + React app plus a Markdown lifecycle workspace. Initiative and idea registry data lives in **`priorities.json`** at the repo root. Lifecycle artifacts live under `initiatives/[Name]/projects/[Project]/[Idea]/`.

### Key documents

- `SYSTEM_OVERVIEW.md` — system design, folder layout, lifecycle statuses.
- `IDEA_LIFECYCLE.md` — stages, gates, artifact templates.
- `priorities.json` — **canonical registry** (tier, lastWork, project priority, idea lifecycle, notes). See [`docs/priorities-registry.md`](docs/priorities-registry.md).
- `PRIORITIZATION.md` — how to pick the next idea using `priorities.json`.
- `USER.md` — user context; read at session start.
- `rules/` — cross-cutting rules cited by lifecycle stages.
- `agents/` — specialist review profiles at gates (not this file).
- Each initiative: `initiatives/[Name]/` with `projects/`, `sources/`, `outputs/`, and `wiki/`. **No** per-initiative `ideas.md`.

### Active initiatives

Read `priorities.json` → `initiatives` for the list, tier stack, and in-flight ideas. Ideas with `lifecycle: "In Review"` appear in the Web UI approval queue.

### Running the app

```bash
npm install
npm run dev    # http://127.0.0.1:PORT — set HARNESS_ROOT in .env
npm test
```

### How to work in this repo

1. Read `USER.md`, then `SYSTEM_OVERVIEW.md` and `docs/priorities-registry.md`.
2. For lifecycle work, read `IDEA_LIFECYCLE.md` and cited rules/agents.
3. **Always update `priorities.json`** when adding ideas, changing lifecycle, or updating initiative `lastWork`.
4. At Build, follow `rules/incremental-execution.md`; update `05_build/verification_log.md` per checkpoint.
5. Never delete wiki pages — archive to `wiki/.archive/`.
6. Never modify `sources/` after ingestion.
7. Update `wiki/index.md` and `wiki/log.md` after wiki operations.

---

## reviewDocumentPath convention

When an idea advances to `lifecycle: "In Review"`, the agent **must** include the following line in that idea's `notes` field in `priorities.json`:

```
reviewDocumentPath: path/relative/to/harness/root.md
```

**Example:**

```json
"notes": "Brief drafted 2026-06-12.\nreviewDocumentPath: initiatives/Time2Magic/projects/Agent Harness Web UI/New Idea/03_prd.md"
```

**Rules:**
- The path is relative to `HARNESS_ROOT` (the same root used by all `/api/*` endpoints).
- The line must begin exactly with `reviewDocumentPath:` followed by a space and the path — no leading spaces.
- Only one `reviewDocumentPath` line per notes block. If you update the path, replace the old line.
- When an idea leaves `In Review` (approved, dropped, or redirected), remove the `reviewDocumentPath` line from notes or leave it — it will be ignored when `lifecycle` is not `"In Review"`.

**Why:** The Web UI approval queue reads this field to deep-link each queue row to the document that needs review, so the user can open it in one click.
