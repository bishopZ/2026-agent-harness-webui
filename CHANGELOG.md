# Changelog

All notable changes to the Initiative & Idea Management System are recorded here.

This file follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) conventions.
Version numbers follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html) as applied to a knowledge system:

- **MAJOR** — breaking changes to file structure, stage names, scoring formula, or naming conventions that require migrating existing initiative data.
- **MINOR** — new skills, new lifecycle stages, new wiki domain types, or new system-level documents that are backward-compatible.
- **PATCH** — clarifications, copy fixes, non-breaking adjustments to templates or instructions.

---

## [Unreleased]

### Changed

- **Breaking (demo harness):** `priorities.json` is the single registry; removed `DASHBOARD.md` and per-initiative `ideas.md`. Agents and skills update `priorities.json` + artifact folders only.
- Web UI approval queue reads `lifecycle: "In Review"` from `priorities.json` (fixes drift when markdown registries were updated without the sidecar).
- Reconcile infers `In Review` from brief artifacts when adding new idea keys.
- Added `npm run migrate-registry`, `docs/priorities-registry.md`, and `src/server/utils/registryWrite.ts`.

### Removed

- `DASHBOARD.md` and `initiatives/*/ideas.md` from this harness repo (use `priorities.json` instead).

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

[Unreleased]: https://github.com/bishopZ/2026-agent-harness/compare/v1.1.0...HEAD
[1.1.0]: https://github.com/bishopZ/2026-agent-harness/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/bishopZ/2026-agent-harness/releases/tag/v1.0.0
