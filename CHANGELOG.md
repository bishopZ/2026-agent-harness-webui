# Changelog

All notable changes to the Initiative & Idea Management System are recorded here.

This file follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) conventions.
Version numbers follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html) as applied to a knowledge system:

- **MAJOR** — breaking changes to file structure, stage names, scoring formula, or naming conventions that require migrating existing initiative data.
- **MINOR** — new skills, new lifecycle stages, new wiki domain types, or new system-level documents that are backward-compatible.
- **PATCH** — clarifications, copy fixes, non-breaking adjustments to templates or instructions.

---

## [Unreleased]

### Added

- Added `history/` folders (`done-history.md`, `dropped-history.md`) per initiative, plus an optional `project-history.md` for closed projects, to keep `priorities.json` and idea folders lean as they grow.
- Added `npm run migrate-registry`, `docs/priorities-registry.md`, and `src/server/utils/registryWrite.ts` to support the markdown → JSON registry migration.

### Changed

- **Breaking (demo harness):** `priorities.json` is the single registry; removed the root markdown dashboard and per-initiative markdown idea lists. Agents and skills update `priorities.json` + artifact folders only.
- Web UI approval queue reads `lifecycle: "In Review"` from `priorities.json` (fixes drift when markdown registries were updated without the sidecar).
- Reconcile infers `In Review` from brief artifacts when adding new idea keys.
- **Build checkpoint discipline.** `SYSTEM_OVERVIEW.md` and `IDEA_LIFECYCLE.md` (Stage 6) now require Build Plan checkpoints to act as agent session boundaries with a closure checklist (`verification_log.md`, that idea's entry in `priorities.json`, `wiki/log.md`). Aligns with the upstream Agent Harness `rules/incremental-execution.md`.
- Clarified project language across system docs and skills: projects now use **Closed Projects** (recorded in `project-history.md`) instead of **Dropped Projects**.
- Updated project and initiative removal guidance to prefer **remove/close** wording, while keeping idea-level `Done` and `Dropped` `lifecycle` values unchanged.
- **Synced Web UI harness Markdown and folder structure to the main Agent Harness v2.0.0:** flat project layout (no `projects/` container folder), per-initiative `history/` folders, Build checkpoint discipline, and the `README.md` version badge — all adapted for `priorities.json` as the registry.

### Removed

- Root markdown dashboard and per-initiative markdown idea lists from this harness repo (use `priorities.json` instead).

---

## [2.0.0] — 2026-04-23

### Added

- **Git submodule convention for projects with repos.** Projects that have an associated GitHub repository use a `repo/` subfolder as a git submodule. The agent creates the empty placeholder and provides the `git submodule add` command; the user runs it to attach the repo. Documented in `README.md` (optional `repo/` section), `SYSTEM_OVERVIEW.md` (folder structure and key rules), and `IDEA_LIFECYCLE.md` (Build stage — project `repo/` and slice execution).
- `IDEA_LIFECYCLE.md` — **Deliverable types and lifecycle shortcuts** (non-product PRDs, research-only exits, avoiding parent-product scope confusion).

### Changed

- **BREAKING — project folder layout:** Project folders are **direct children of each initiative** at `initiatives/[Initiative Name]/[Project Name]/` (alongside `wiki/`, `sources/`, `outputs/`, `history/`, and `priorities.json` as the registry). The old `initiatives/.../projects/[Project Name]/` layout is removed. The shipped defaults (`My Company`, `My Personal Life`, `My Hobby`) move `General` from `projects/General/` to `General/`. **Migration:** for existing forks, run `git mv "initiatives/<Initiative>/projects/<Project>" "initiatives/<Initiative>/<Project>"` for each project folder, then remove empty `initiatives/<Initiative>/projects/` if present; update any project keys in `priorities.json` and any links in the wiki that pointed at the old path.
- `README.md` — synced with upstream system docs, including the optional `repo/` submodule workflow and folder structure; version badge `2.0.0`.
- `SYSTEM_OVERVIEW.md` — full file tree with optional `repo/`, key rules for submodule code vs harness Markdown, and where implementation work goes when `repo/` exists; registry references point at `priorities.json`.
- `IDEA_LIFECYCLE.md` — Build stage aligned with `repo/` submodules; Build Plan / slice execution / build artifacts paths use `initiatives/.../[Project Name]/[Idea Name]/` (flat).
- `skills/add-project/SKILL.md` — steps for `[Project Name]/`, optional `repo/` + `00-how-to-use.md` **Repo** section.

### Migration (v1.1.x → v2.0.0)

1. Move each `initiatives/<Initiative>/projects/<Project>/` to `initiatives/<Initiative>/<Project>/` (preserve Git history with `git mv` when possible).
2. Search and replace path references in `priorities.json` (`notes`), wiki, and any bookmarks from `projects/<Project>` to `<Project>` under that initiative.
3. Run the **health-check** skill and fix any broken links.

---

## [1.1.0] — 2026-04-19

### Added

- `rules/` directory with six cross-cutting operating rules: `evidence-and-verification.md`, `incremental-execution.md`, `context-engineering.md`, `decision-records.md`, `anti-rationalization.md`, `red-flags.md`.
- `agents/` directory with three specialist review profiles: `quality-reviewer.md`, `evaluator.md`, `risk-auditor.md`.
- `CHANGELOG.md` and `VERSION` file for explicit version tracking.
- Version management documentation in `README.md` and `SYSTEM_OVERVIEW.md`.

### Changed

- `IDEA_LIFECYCLE.md` — expanded Build stage with Plan → Slice → Verify cycle; every stage now cites which rules and agent profiles to load.
- `SYSTEM_OVERVIEW.md` — added wiki operation detail and version management section.
- `AGENTS.md` — updated to reference rules and agent directories introduced in this release.
- `README.md` — added version management and rules/agents overview sections.
- `skills/health-check/SKILL.md` — updated checks to cover v1.1 system additions (rules, agents, CHANGELOG).
- `skills/import/SKILL.md` — enforced required folder structure for `outputs/` and `sources/` during ingestion.

### Removed

- `LAUNCH_MATERIALS.md` — retired; launch guidance folded into lifecycle stages and rules.

---

## [1.0.0] — 2026-04-14

### Added

- Core system documents: `SYSTEM_OVERVIEW.md`, `IDEA_LIFECYCLE.md`, `DASHBOARD.md`, `PRIORITIZATION.md`, `USER.md`, `README.md`, `AGENTS.md`.
- Full 11-stage idea lifecycle: Backlog → Brief → Pressure Test → Research → PRD → Design → Build → Evaluation → Launch → Marketing → Growth.
- Approval-gate pattern at every stage; `In Review` status and `Awaiting your approval` queue in `DASHBOARD.md`.
- Combined scoring formula: `score = staleness_days × 2 + tier_points + project_points + idea_points`.
- Initiative-level priority with tier points and staleness-based fairness (cap at 90 days).
- Per-initiative wiki structure: `index.md`, `log.md`, domain subfolders, `.archive/` for retired pages.
- Three wiki domain layouts: business, personal brand, creative project.
- Four wiki operations: Ingest, Query, Update, Lint (plus one-time Init).
- YAML front-matter standard for wiki pages (`domain`, `type`, `tags`, `related_documents`, `status`, `version`, `created`, `modified`).
- Three default initiatives: `My Company` (business), `My Personal Life` (personal brand), `My Hobby` (creative project).
- Skills library: `add-idea`, `add-initiative`, `add-project`, `approve-idea`, `bootstrap`, `complete-idea`, `drop-idea`, `health-check`, `import`, `next-idea`, `remove-initiative`, `remove-project`, `update`.
- `/raw/` drop zone, per-initiative `sources/` (immutable), and `outputs/` folders.
- `/archive/` for completed or dropped work bundles.
- `VERSION` file tracking system version.

[Unreleased]: https://github.com/bishopZ/2026-agent-harness-webui/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/bishopZ/2026-agent-harness-webui/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/bishopZ/2026-agent-harness-webui/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/bishopZ/2026-agent-harness-webui/releases/tag/v1.0.0
