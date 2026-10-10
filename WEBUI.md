# Agent Harness Web UI

Local Express + React app: **doc reader** (read-only Markdown) and **priority workspace** (edit tier and priority fields).

This repo is the **2026 Agent Harness** lifecycle system (v2.0.0 flat layout) plus this local UI layer. Registry: [`priorities.json`](priorities.json). Agent guide: [`docs/priorities-registry.md`](docs/priorities-registry.md).

## Configuration

| Variable | Purpose |
|----------|---------|
| `HARNESS_ROOT` | Absolute path to **this repo root** (`priorities.json`, `SYSTEM_OVERVIEW.md`, `initiatives/`). |
| `PORT` | Local bind port (default `3747`). |

Copy `.env.example` to `.env` and set `HARNESS_ROOT` to this directory.

## priorities.json

**Canonical registry** for initiative tier, `lastWork`, project/idea priority, lifecycle, and notes.

**Location:** `${HARNESS_ROOT}/priorities.json`

- Web UI edits: `tier`, `priority` (via `POST /api/priorities`)
- Agents edit: `lifecycle`, `lastWork`, `lastUpdated`, `notes`, `purpose`, and at Build a one-word `checkpoint`

Approval queue: derived from ideas with `lifecycle === "In Review"`.

### Simple registry, smart view

`priorities.json` is kept deliberately simple so agents can update it by hand without mistakes. The UI does the work: the server's `src/server/utils/ideaView.ts` adds a derived `view` to every idea in `GET /api/discover` — the stage under review and its document (latest artifact in the idea folder), the build checkpoint list and progress (headings in `05_build_plan.md` plus the one-word `checkpoint` id), the gate (`lifecycle`), and the next step (`Next:` line in `notes`). Nothing in `view` is ever written back.

When you add a dashboard feature, derive what it needs in the view. Do not add fields to `priorities.json` for display. See [`docs/priorities-registry.md`](docs/priorities-registry.md) **Design rule**.

## Folder layout

Lifecycle artifacts use the **flat** project layout (same as main Agent Harness):

`initiatives/[Initiative]/[Project]/[Idea]/`

Each initiative also has `history/` (done/dropped idea logs), `project-history.md` (Closed Projects), `wiki/`, `sources/`, and `outputs/`. There is no `projects/` container directory.

## Run

```bash
npm install
cp .env.example .env   # set HARNESS_ROOT
npm run dev
```

Open `http://127.0.0.1:3747/`.

## Migrate leftover markdown registries

```bash
npm run migrate-registry
```

Then remove leftover markdown registry files if present. If folders still nest under `projects/`, move them to the flat layout first.
