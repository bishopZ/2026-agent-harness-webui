# Agent Harness Web UI

Local Express + React app: **doc reader** (read-only Markdown) and **priority workspace** (edit tier and priority fields).

## Configuration

| Variable | Purpose |
|----------|---------|
| `HARNESS_ROOT` | Absolute path to **this repo root** (the folder that contains `priorities.json`, `SYSTEM_OVERVIEW.md`, and `initiatives/`). |
| `PORT` | Local bind port (default `3747`). |

Copy `.env.example` to `.env` and set `HARNESS_ROOT` to this directory.

## priorities.json

Canonical sidecar for initiative tier, project/idea priority, lifecycle, and related fields used by the Web UI.

**Location:** `${HARNESS_ROOT}/priorities.json`

With the default `.env`, that is this repo’s root:

`initiatives/Time2Magic/Agent Harness Web UI/repo/priorities.json`

The server resolves the path in `src/server/paths.ts` and exposes it on startup and `GET /api/health` as `prioritiesPath`.

cowork-v3 (the parent Markdown harness) does **not** use `priorities.json`; it uses `DASHBOARD.md` and per-initiative `ideas.md`.

## Run

```bash
npm install
cp .env.example .env   # set HARNESS_ROOT
npm run dev
```

Open `http://127.0.0.1:3747/`.
