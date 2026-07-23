# Agent Harness Web UI

Local Express + React app that gives you a browser shell for any [2026 Agent Harness](https://github.com/time2magic/2026-agent-harness) repo. Two features:

- **Doc reader** — browse and read any `.md` file in the harness as rendered HTML with working relative links. Read-only: no editing, no form controls injected into document content.
- **Priority workspace** — view all initiatives, projects, and ideas with their tier, priority, and lifecycle labels. Edit the three priority fields (initiative tier, project priority, idea priority) inline; changes write to `priorities.json` atomically.

---

## Quick start

```bash
npm install
cp .env.example .env        # then open .env and set HARNESS_ROOT
npm run dev
```

Open `http://127.0.0.1:3747/` in your browser.

The server binds to `127.0.0.1` only — it is never exposed on the network.

---

## Configuration

| Variable | Required | Default | Description |
|---|---|---|---|
| `HARNESS_ROOT` | Yes | — | Absolute path to your harness root — the folder that contains `SYSTEM_OVERVIEW.md`, `priorities.json`, and `initiatives/`. |
| `PORT` | No | `3747` | Local port to bind. Must be 1–65535. |

Both variables are loaded from `.env` at startup via `dotenv`. See `.env.example` for the template.

**Startup validation:** if `HARNESS_ROOT` is missing, points to a non-existent path, or does not contain `SYSTEM_OVERVIEW.md`, the server exits immediately with a descriptive error message showing the invalid path and the expected file name.

---

## `priorities.json`

`priorities.json` lives at `HARNESS_ROOT/priorities.json`. It is the **canonical registry** for initiatives, projects, ideas, tiers, priorities, and lifecycle state.

**Schema overview:**

```json
{
  "version": 3,
  "updated": "YYYY-MM-DD",
  "initiatives": {
    "Initiative Name": {
      "tier": 9,
      "lastWork": "YYYY-MM-DD",
      "projects": {
        "Project Name": {
          "priority": "High",
          "purpose": "optional one-line description",
          "ideas": {
            "Idea Name": {
              "priority": "Medium",
              "lifecycle": "Build",
              "lastUpdated": "YYYY-MM-DD",
              "notes": "optional note"
            }
          }
        }
      }
    }
  }
}
```

**What the Web UI can edit** (via `POST /api/priorities`):

| Field | Type | Values |
|---|---|---|
| `initiatives.[Name].tier` | integer | any positive integer |
| `initiatives.[Name].projects.[P].priority` | string | `"High"` \| `"Medium"` \| `"Low"` |
| `initiatives.[Name].projects.[P].ideas.[I].priority` | string | `"High"` \| `"Medium"` \| `"Low"` |

**Agent-maintained fields** (the Web UI never writes these):

| Field | Maintained by |
|---|---|
| `lifecycle` | Agent (next-idea, approve-idea skills) |
| `lastWork` | Agent (updated when initiative work completes) |
| `lastUpdated` | Agent (updated when idea row changes) |
| `notes` | Agent (next steps, links, waivers) |
| `purpose` (project) | Agent |

All writes go through a server-side allowlist that rejects any attempt to modify agent-maintained fields with HTTP 400. Writes use `write-file-atomic` — partial writes and corruption on concurrent requests are not possible.

---

## Approval queue

The approval queue (shown at the top of the Priority workspace) is **derived**, not stored. It is rebuilt on every `GET /api/approval-queue` call by scanning `priorities.json` for ideas where `lifecycle === "In Review"`. Clearing an item from the queue means the agent sets `lifecycle` to the next stage — the queue entry disappears automatically on the next refresh.

---

## Migration from markdown registries

If you still have legacy `DASHBOARD.md` / `ideas.md` files, run once:

```bash
npm run migrate-registry
```

Then remove those markdown files. Agents maintain [docs/priorities-registry.md](docs/priorities-registry.md). Completed/dropped **projects** may be recorded in `initiatives/[Name]/project-history.md`.

---

## Running the tests

```bash
npm test
```

Runs two security and correctness checks:

- **`pathGuard.test.ts`** — NF-01 (path traversal guard), NF-03 (localhost bind assertion), NF-05 (startup error message quality)
- **`renderCheck.test.ts`** — F-07 (rendered Markdown HTML contains zero form controls, via cheerio)
- **`reconcileSidecar.test.ts`** — new ideas infer `In Review` from brief artifacts
- **`approvalQueue.test.ts`** — queue derives from `priorities.json`

All scripts exit 0 on pass and 1 on any failure.

---

## API reference

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Returns `{ ok, harnessRoot, prioritiesPath }` |
| `GET` | `/api/files` | JSON array of `.md` paths (relative to `HARNESS_ROOT`), sorted alphabetically |
| `GET` | `/api/render?path=<rel>` | Renders a `.md` file to `{ html }` with relative links rewritten to `/doc?path=...` routes. Returns 403 on path traversal, 404 if missing. |
| `GET` | `/api/discover` | Returns the full merged tree of initiatives, projects, ideas with sidecar fields. Triggers a reconcile pass on every call. |
| `GET` | `/api/approval-queue` | Returns `[{ initiative, project, idea, lifecycle, lastUpdated }]` for every idea with `lifecycle === "In Review"`. |
| `POST` | `/api/priorities` | Body: `{ path: string, value }`. Updates one priority field in `priorities.json` atomically. Allowed suffixes: `.tier`, `.priority`. Returns 400 for disallowed fields, non-existent paths, or type mismatches. |

All file-read endpoints apply a path traversal guard. Requests that resolve outside `HARNESS_ROOT` return HTTP 403.

---

## Architecture

- **Registry:** `priorities.json` (agents write lifecycle; Web UI writes tier/priority only).
- **Artifacts:** `initiatives/[Name]/projects/[Project]/[Idea]/`.
- **Reconcile:** every `GET /api/discover` syncs filesystem keys into `priorities.json` without overwriting existing lifecycle values.

See [docs/priorities-registry.md](docs/priorities-registry.md) for agent workflows.

---

## What this is not

The Web UI is a small, local, browser-native shell over an opinionated Markdown harness repo. It is built to do one thing well: browse harness docs with working relative links and make lightweight priority edits backed by a JSON sidecar. These things are explicitly out of scope:

| Out of scope | Why |
|---|---|
| Ambient/passive capture (OpenChronicle model) | Web UI is human-intentional — Bishop opens it, reads what he wants, edits what he decides. Always-on screen capture and session classifiers are a different product solving a different problem. |
| Full personal OS / life OS (PAI model) | PAI maximizes coverage of life and work. The Web UI stays narrow: browse harness docs, tweak priorities. Not a second operating system. |
| Vertical codegen product (10x model) | 10x runs a Claude tool loop to generate iOS SwiftUI projects from a macOS app. Entirely different job: codegen plus simulator feedback, not Markdown initiative management. |
| MCP-heavy default install | Per the inference.sh harness essay warning on MCP volatility and opaque host-controlled context, the default install should not require a growing MCP graph for core browsing and priority edits. |
| Nested rule systems or per-user prompt dumps | Adding a second harness inside the harness — nested lifecycle docs, duplicate rules, per-user prompt files — defeats the purpose of a single, legible harness. Keep additions lifecycle-cited or don't add them. |

---

## License

MIT
