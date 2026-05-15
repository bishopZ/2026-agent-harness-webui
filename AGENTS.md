# AGENTS.md

## Overview

### What this repo is

This is a pure Markdown knowledge management system for tracking initiatives and ideas through a staged lifecycle. There is no source code, no build system, no package manager, and no runnable services. The "application" is the collection of Markdown documents and the AI assistant workflow described in `SYSTEM_OVERVIEW.md`.

### Key documents

- `SYSTEM_OVERVIEW.md` defines the system, file organization, wiki operations, and naming conventions.
- `IDEA_LIFECYCLE.md` defines every lifecycle stage, its inputs, outputs, wiki hooks, and approval gates.
- `DASHBOARD.md` is the high-level dashboard and approval queue.
- `USER.md` has context about the user and should be read at the start of every session.
- `rules/` is the index of cross-cutting operating rules (evidence labeling, incremental execution, context engineering, decision records, anti-rationalization, red flags). Every stage in `IDEA_LIFECYCLE.md` names which rules to load. Read the cited rule when the stage calls for it.
- `agents/` (the folder) contains specialist review profiles (`quality-reviewer`, `evaluator`, `risk-auditor`) invoked at specific lifecycle gates. Do not confuse this folder with *this* file (`AGENTS.md`), which is the agent-operating-instructions for the repo as a whole.
- Each initiative lives under `initiatives/[Name]/` with its own `ideas.md`, project-named idea artifact folders, `sources/`, and `wiki/` directories.

### Active initiatives

The current initiative list and their priority stack live in `DASHBOARD.md`. Read that file for the authoritative list. Wiki domain layouts for each initiative type (business, personal brand, creative project) are in `SYSTEM_OVERVIEW.md` under **Wiki Domain Structure**.

### No dependencies or services to run

There are no dependencies to install, no servers to start, and no build or test commands to run. The only tooling required is Git and a text editor. Linting, testing, and building are not applicable to this repo.

### How to work in this repo

1. Read `USER.md` first for user context.
2. Read `SYSTEM_OVERVIEW.md` for the full system design.
3. Read `IDEA_LIFECYCLE.md` when advancing an idea through stages. Load the rule files it cites at each stage; load the agent profiles it cites at each gate.
4. At Build, follow the Plan → Slice → Verify cycle in `rules/incremental-execution.md`. Every slice has an entry in `05_build/verification_log.md`.
5. At any gate that involves user-facing output or sensitive data, run `agents/risk-auditor.md`. At end of Build and at Evaluation, run `agents/quality-reviewer.md` and `agents/evaluator.md`.
6. Never delete wiki pages. Archive them to `wiki/.archive/` instead.
7. Never modify files in `sources/`. They are immutable after ingestion.
8. Always update `wiki/index.md` and `wiki/log.md` after any wiki operation.
