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
- Agents edit: `lifecycle`, `lastWork`, `lastUpdated`, `notes`, `purpose`

Approval queue: derived from ideas with `lifecycle === "In Review"`.

## Folder layout

Lifecycle artifacts use the **flat** project layout (same as main Agent Harness):

`initiatives/[Initiative]/[Project]/[Idea]/`

Each initiative also has `history/` (done/dropped idea logs), `project-history.md` (Closed Projects), `wiki/`, `sources/`, and `outputs/`. There is no `projects/` container directory and no per-initiative `ideas.md`.

## Run

```bash
npm install
cp .env.example .env   # set HARNESS_ROOT
npm run dev
```

Open `http://127.0.0.1:3747/`.

## Migrate from markdown

```bash
npm run migrate-registry
```

Then remove legacy `DASHBOARD.md` and `initiatives/*/ideas.md` if present. If folders still nest under `projects/`, move them to the flat layout first.
