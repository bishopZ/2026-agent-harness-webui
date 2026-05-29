# Agent Harness Web UI

Local Express + React app: **doc reader** (read-only Markdown) and **priority workspace** (edit tier and priority fields).

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

Agent guide: [docs/priorities-registry.md](docs/priorities-registry.md)

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

Then remove legacy `DASHBOARD.md` and `initiatives/*/ideas.md` if present.
