# My Company Wiki Log

Append-only record of all wiki activity. Each entry starts with a consistent prefix for easy scanning.

Format: `## [YYYY-MM-DD] operation | description`

Operations: `ingest`, `query`, `update`, `lint`, `init`

---

## [2026-04-14] init | Wiki created

Wiki initialized as part of system setup. No sources ingested yet.

## [2026-04-14] lint | Health check pass

Ran health check across all three initiatives (My Company, My Personal Life, My Hobby). Fixed broken Initiatives table links in DASHBOARD.md that still pointed at old renamed folder paths. Scrubbed remaining personal names from SYSTEM_OVERVIEW.md, IDEA_LIFECYCLE.md, and all skill files that came back via the latest pull. No ideas are in flight; approval queue is empty across all initiatives.

## [2026-04-14] lint | Final health check pass

All references clean: no INITIATIVES_TRACKER, PRIORITIZATION_AND_NEXT_WORK, Bishop, BZ, Time2Magic, or Art of War strings remain anywhere in the repo. Removed dead link to deleted rules/no-dashes-in-copy.mdc from AGENTS.md. Approval queue empty. No active ideas across any initiative. All initiative folder structures intact with correct sources/, outputs/, projects/General/, and wiki/ directories.

## [2026-05-29] update | Example Idea captured (General)

Added **Example Idea** under project **General** via add-idea: `priorities.json` lifecycle **In Review**, brief at `projects/General/Example Idea/01_brief.md`. Next stage after owner approval: Pressure Test (`02_pressure_test.md`).

## [2026-07-23] update | Synced to main Agent Harness v2.0.0 layout

Flattened project folders (`projects/General/` → `General/`), added `history/` done/dropped logs, and synced system docs/skills to upstream v2.0.0 while keeping `priorities.json` as the registry. Example Idea brief path is now `General/Example Idea/01_brief.md`.
