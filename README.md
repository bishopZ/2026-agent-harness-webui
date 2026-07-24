# Agent Harness Web UI

![Version](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/bishopZ/2026-agent-harness-webui/main/docs/badges/version.json)

**A lifecycle system for working with AI agents — combining [Karpathy's](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) persistent wiki architecture with [Osmani's](https://github.com/addyosmani/agent-skills) structured skill discipline — plus a local browser shell.**

This repo is the [2026 Agent Harness](https://github.com/bishopZ/2026-agent-harness) Markdown system (v2.0.0 flat layout) with an additive Express + React UI:

- **Doc reader** — browse and read any `.md` file in the harness as rendered HTML with working relative links. Read-only: no editing, no form controls injected into document content.
- **Priority workspace** — view all initiatives, projects, and ideas with their tier, priority, and lifecycle labels. Edit the three priority fields (initiative tier, project priority, idea priority) inline; changes write to `priorities.json` atomically.

---

## Why

AI editors default to the shortest path — without structure, every session starts over and prior context evaporates. This system applies Karpathy's wiki pattern (persistent structured memory) together with Osmani's skill discipline (staged workflows with explicit human verification gates). The Web UI adds a localhost browser for reading docs and editing priorities without leaving the same harness files.

---

## What you get

| What | Count | Where |
| --- | --- | --- |
| Skills | 13 | `skills/` |
| Rules | 6 | `rules/` |
| Agent runbooks | 3 | `agents/` |
| Lifecycle stages | 11 | `IDEA_LIFECYCLE.md` |
| Registry | 1 | `priorities.json` (replaces `DASHBOARD.md` / `ideas.md`) |
| Local app | Express + React | `src/`, `npm run dev` |

_Counts current as of v2.0.0._

---

## What makes it different

| Differentiator | What it means |
| --- | --- |
| Human-approved at every stage | 11 stages from brief to growth; nothing advances without your sign-off. |
| Fair prioritization across everything | Combined score (`staleness × 2 + tier + project + idea`) so lower-tier initiatives are not starved. |
| Everything is a Markdown file (+ one JSON registry) | Rules, stages, and decisions stay plain files; `priorities.json` is the only structured sidecar the UI edits. |
| Local browser shell | Doc reader and priority forms on `127.0.0.1` — no hosted service. |

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

## How to migrate from a previous agent harness

Use this when you already have an older harness working tree (Markdown initiatives, optional project `repo/` submodules, custom rules/skills, `USER.md`) and want to move onto this Web UI harness. The process is manual today: copy your content into a fresh clone, re-wire git submodules carefully, then run the **import** skill so the registry and folder layout match v2.

Streamlining this into fewer steps is planned; until then, follow the procedure below exactly. Skipping the submodule steps is the most common failure mode.

### Before you start

1. **Clean every working tree.** In the old harness root and in every project `repo/` submodule: commit or stash changes, and confirm `git status` is clean. Do not migrate with uncommitted work you care about still only on disk.
2. Note the absolute path of your **old harness root** (call it `OLD_HARNESS`) and choose a **new folder name** for the fresh clone (call it `NEW_HARNESS`).
3. If any submodule has **unpushed commits** or local-only state you need, export that first from the old harness (`git status`, `git push`, or `git bundle`) before you tear anything down. Restoring exact dirty local submodule state by copying `.git/modules` is fragile and is **not** the recommended path.

### 1. Clone a clean copy of this harness

```bash
git clone git@github.com:bishopZ/2026-agent-harness-webui.git "./NEW_HARNESS"
cd "./NEW_HARNESS"
```

Treat this clone as a **template**, not as your long-lived remote tracking branch for personal harness data:

```bash
rm -rf .git CHANGELOG.md
```

You will re-init git as *your* harness repo in a later step. Removing upstream `CHANGELOG.md` avoids mixing template release notes with your own history; keep or restore it only if you intentionally want upstream changelog history in your tree.

### 2. Copy your content from the old harness

Copy personal / initiative content into the new root. Do **not** overwrite the new harness’s system files (`SYSTEM_OVERVIEW.md`, `IDEA_LIFECYCLE.md`, `skills/` defaults, `src/`, etc.) unless you are deliberately carrying a customized fork of those files.

Typical copies from `OLD_HARNESS` → `NEW_HARNESS`:

| Copy | Notes |
| --- | --- |
| `initiatives/` | Your initiatives, projects, ideas, wikis, histories. See submodule section before copying `repo/` trees. |
| Custom `rules/` files | Only files you added; merge carefully with shipped rules. |
| Custom `skills/` | Only skills you added or customized. |
| `USER.md` | Your user context. |
| `archive/` | Completed / dropped bundles, if present. |
| `.gitmodules` | Required if you use project `repo/` submodules (see below). |

**Preferred approach for initiatives with submodules:** copy harness Markdown and initiative content **excluding** each `initiatives/**/repo` working tree (or copy everything and then delete each `.../repo` directory before re-init). Plain recursive copies of `repo/` folders usually break submodule metadata — see [Project `repo/` submodules](#project-repo-submodules).

### 3. Configure the Web UI environment

```bash
cp .env.example .env
```

Open `.env` and set `HARNESS_ROOT` to the **absolute path** of `NEW_HARNESS` (the folder that contains `SYSTEM_OVERVIEW.md`, `priorities.json`, and `initiatives/`).

### 4. Initialize your harness git repo

```bash
git init
cp "../OLD_HARNESS/.gitmodules" ./   # if you had project submodules; otherwise skip
```

If you use project `repo/` submodules, complete [Project `repo/` submodules](#project-repo-submodules) **now** — before a broad `git add initiatives/` — so you do not accidentally ingest product source as normal files.

Then add and commit the harness tree:

```bash
git add .
git commit -m "Initial commit from harness migration"
```

Open the new folder in your IDE or Cowork session.

### 5. Run the import skill

Tell the agent you just upgraded to a new harness version and ask it to run the **import** skill (`skills/import/SKILL.md`). That skill:

- Verifies / repairs folder structure (flat `initiatives/[Initiative]/[Project]/[Idea]/`, required `sources/` / `outputs/`)
- Reconciles and registers projects and ideas in `priorities.json`
- Migrates legacy `ideas.md` In Review / Done / Dropped rows into the registry and history files
- Fixes broken path links where it can

If legacy root `DASHBOARD.md` / `ideas.md` registries still need a bulk pass into `priorities.json`, you can also run:

```bash
npm run migrate-registry
```

See [docs/priorities-registry.md](docs/priorities-registry.md). Prefer running structural import first, then registry cleanup.

### 6. Post-import cleanup

After import finishes:

1. **Remove old unused `ideas.md` files** (and root `DASHBOARD.md` if present) only after In Review / Done / Dropped rows have been applied to `priorities.json` and history files.
2. **Run the health-check skill** and fix anything it flags.
3. **Rename leftover old titles** inside lifecycle artifacts if folders were renamed during migration (for example idea titles in headers that still use previous project or idea names).
4. Commit the cleanup:

```bash
git add .
git commit -m "Post-migration import cleanup"
```

### 7. Install and run the Web UI

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:3747/` (or your configured `PORT`) in a browser. Confirm the Priority workspace and doc reader see your initiatives.

---

### Project `repo/` submodules

Projects with an associated codebase use `initiatives/[Initiative]/[Project]/repo/` as a **git submodule** of the harness repo. Submodules are recorded as:

- a `.gitmodules` file at the harness root, and
- a **gitlink** entry in the harness index (mode `160000`) pointing at a commit SHA — not as a normal tree of product files.

Migrating them incorrectly is easy. Use one of the procedures below.

#### Recommended procedure

1. Copy harness Markdown / initiative content **excluding** submodule working trees, **or** copy everything and then delete each `initiatives/**/repo` directory before re-init.
2. Copy `.gitmodules` from the old harness root (or recreate equivalent `[submodule]` entries for each `repo/` path).
3. From the **new harness root**, restore gitlinks and check out the submodule contents:

   **Option A — preserve the same SHAs as the old harness**

   ```bash
   # In OLD_HARNESS: list submodule gitlinks (mode 160000)
   git ls-files --stage | grep '^160000'
   # Example line:
   # 160000 <sha> 0       initiatives/Time2Magic/Some Project/repo

   # In NEW_HARNESS: with .gitmodules already copied, register each gitlink:
   git update-index --add --cacheinfo 160000,<sha>,"initiatives/[Initiative]/[Project]/repo"

   git submodule update --init --recursive
   ```

   **Option B — init after gitlinks are already in the new index / committed tree**

   Same end state as Option A if the committed tree already has mode-`160000` entries for each `repo/` path (for example you recreated them with `git submodule add` and checked out the desired commit). Then:

   ```bash
   git submodule update --init --recursive
   ```

4. Verify:

   ```bash
   git submodule status
   # and inside one project repo:
   cd "initiatives/[Initiative]/[Project]/repo"
   git status
   ```

5. Commit **only** `.gitmodules` and the gitlink entries — never commit the full contents of `repo/` into the harness as regular files.

To attach a brand-new project repo later (not a migration), from the harness root:

```bash
git submodule add <repository-url> "initiatives/[Initiative]/[Project]/repo"
```

#### Anti-patterns (do not do these)

| Anti-pattern | What goes wrong |
| --- | --- |
| Copying `initiatives/**/repo` with their `.git` pointer files but **not** the parent’s `.git/modules/` | `fatal: not a git repository: .../.git/modules/...` |
| Copying only `.gitmodules` and committing | Root looks fine; each `repo/` is still broken / empty |
| `git add initiatives/` after a plain folder copy of product trees | Ingests application source as normal harness files and **destroys** the submodule relationship |
| Expecting a recursive Finder / `cp -R` of the old tree to preserve submodules | Copies worktree files and broken git pointers; does not recreate gitlinks |
| Copying `.git/modules` by itself to “save” local submodule state | Fragile (worktree paths, index mode); not recommended |

If you need exact local submodule state (unpushed commits, dirty trees), export from the old harness first, re-init submodules in the new harness, then restore onto those checkouts.

---

### Migration from markdown registries only

If you are already on this harness layout and only still have legacy `DASHBOARD.md` / `ideas.md` files:

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
- **Artifacts:** `initiatives/[Name]/[Project]/[Idea]/` (flat — no `projects/` container).
- **History:** `initiatives/[Name]/history/` for done/dropped ideas; `project-history.md` for Closed Projects.
- **Reconcile:** every `GET /api/discover` syncs filesystem keys into `priorities.json` without overwriting existing lifecycle values.

See [WEBUI.md](WEBUI.md) and [docs/priorities-registry.md](docs/priorities-registry.md) for agent workflows. Deeper harness reading: [SYSTEM_OVERVIEW.md](SYSTEM_OVERVIEW.md), [IDEA_LIFECYCLE.md](IDEA_LIFECYCLE.md), [PRIORITIZATION.md](PRIORITIZATION.md), [CHANGELOG.md](CHANGELOG.md).

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
