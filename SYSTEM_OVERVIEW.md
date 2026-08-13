# Initiative & Idea Management System - Overview

## What This System Is

This is a human-in-the-loop system for moving ideas from raw concept to market, built on four interlocking layers:

- **The Lifecycle Layer** - a structured pipeline for advancing ideas through stages (Backlog → Brief → Pressure Test → Research → PRD → Design → Build → Evaluation → Launch → Marketing → Growth), with approval gates at every step. This answers: *what stage is each idea in?*
- **The Knowledge Layer** - a persistent wiki per initiative that accumulates everything you learn: sources ingested, research synthesized, customer conversations recorded, decisions made. This answers: *what do we actually know?*
- **The Rules Layer** - a small set of cross-cutting operating rules in [`rules/`](rules/README.md) that govern *how* the work is done at every stage: how evidence is labeled and logged, how work is sliced and verified, how context is assembled, how decisions are recorded, how rationalizations are caught, and what red flags warrant stopping. This answers: *what standards do we hold the work to?*
- **The Agent Profiles Layer** - specialist review personas in [`agents/`](agents/README.md) (`quality-reviewer`, `evaluator`, `risk-auditor`) that The Agent adopts at specific gates to stress-test an artifact through a focused lens. This answers: *who is checking the work, and against what?*

The layers work together. The lifecycle drives action. The wiki captures learning. The rules keep the work disciplined. The agent profiles provide specialist scrutiny at the gates. Every stage of the lifecycle draws from and contributes to the wiki, is governed by the rules, and is gated by reviews from one or more profiles.

This repo is the **Agent Harness Web UI** variant of the system: the same Markdown lifecycle, rules, and agent profiles as the upstream Agent Harness, plus a small local **Express + React app** (see [`WEBUI.md`](WEBUI.md)) that renders the docs and gives you a browser view of every initiative, project, and idea. The registry lives in **[`priorities.json`](priorities.json)** — see [`docs/priorities-registry.md`](docs/priorities-registry.md) for the schema and agent read/write rules.

### Thinking partner, not only a draft engine

The default is to use AI for **thinking**, not only for producing documents. That means multi-step passes that build context, **explicit adversarial or contrarian steps** where they help, **human checkpoints** so you steer and validate, **accumulated context** that carries forward across steps, and **tools** (for example web search) at moments where evidence matters. Pressure Test exists so ideas are stress-tested before research deepens and long before a PRD commits the team to build.

### Context Assets (foundation before heavy chains)

**Context Assets** are durable inputs you maintain and reattach when running a long chain. They are not a second filing system. They map onto files this repo already uses.

| Context asset | Where it lives |
|---|---|
| **Founder context** - background, strengths, constraints, blind spots | [`USER.md`](USER.md). Enrich over time. You can use an interview-style session in chat to expand it; the durable home stays `USER.md`. |
| **Market context** - landscape, players, trends, what is validated vs assumed | Initiative `wiki/market/` and `wiki/strategy/` when decisions belong there. Mark **validated** vs **working assumption** on the page. |
| **Customer context** - segments, problems, language, buying behavior | `wiki/customers/` for business initiatives, `wiki/audience/` for personal brand. Same epistemic discipline as market pages. |
| **Product context** - what you ship, how it differs, current state | `wiki/offerings/` plus `identity/` or `strategy/` when the product story lives there. |

Lifecycle artifacts (`01_brief.md`, `02_pressure_test.md`, and so on) stay the **per-idea** record. The wiki stays the **initiative-wide** compounding base. Both should distinguish signal from assumption where it matters.

---

## The Core Documents

| Document | Purpose |
|---|---|
| `SYSTEM_OVERVIEW.md` | This document. How the system works. |
| `PRIORITIZATION.md` | Combined score (staleness + initiative tier + project + idea), tie-breakers, and how to pick the next idea (excluding blocked work). **Tier points** are **not** edited here. |
| `IDEA_LIFECYCLE.md` | Defines every stage an idea moves through, with templates and approval criteria. References the `rules/` and `agents/` folders at each gate. |
| [`priorities.json`](priorities.json) | **Canonical registry** at repo root: initiative tier and `lastWork`, project priority and `purpose`, idea priority, `lifecycle`, `lastUpdated`, `notes`. Approval queue = ideas with `lifecycle: "In Review"`. See [`docs/priorities-registry.md`](docs/priorities-registry.md). |
| [`WEBUI.md`](WEBUI.md) | The local Express + React app: configuration, `npm run dev`, and what the doc reader and priority workspace do. |
| `initiatives/[Name]/project-history.md` | Optional archive of completed or closed **projects** for that initiative (not the live registry — projects here are point-in-time records, not a status you flip). |
| `USER.md` | Context about you - preferences, background, working style. The agent reads this to stay oriented. |
| [`rules/README.md`](rules/README.md) | **Rules index** - six cross-cutting operating rules that apply across every stage: evidence-and-verification, incremental-execution, context-engineering, decision-records, anti-rationalization, and red-flags. |
| [`agents/README.md`](agents/README.md) | **Agent profiles index** - three specialist review personas (`quality-reviewer`, `evaluator`, `risk-auditor`) invoked at specific gates in the lifecycle. |
| [`skills/next-idea/SKILL.md`](skills/next-idea/SKILL.md) | **next-idea skill** - invoke when you want the agent to pick the highest-priority idea and step it forward. Contains the execution protocol, file-keeping rules, wiki rules, prioritization procedure, and approval pattern. |
| [`skills/add-idea/SKILL.md`](skills/add-idea/SKILL.md) | **add-idea skill** - invoke when you want to capture a new idea. Handles initiative/project routing, `priorities.json` entries, rich content files, new project scaffolding, and `00-how-to-use.md` creation. |
| [`skills/drop-idea/SKILL.md`](skills/drop-idea/SKILL.md) | **drop-idea skill** - drops an idea, archives artifacts when needed, and records rationale in `history/dropped-history.md`. |
| [`skills/remove-project/SKILL.md`](skills/remove-project/SKILL.md) | **remove-project skill** - project closure/removal workflow (archive/move/delete idea handling + project cleanup, recorded in `project-history.md`). |
| [`skills/remove-initiative/SKILL.md`](skills/remove-initiative/SKILL.md) | **remove-initiative skill** - initiative retirement/removal workflow with archive safeguards. |
| [`VERSION`](VERSION) | Single-line file holding the current system version (e.g. `2.0.0`). Bump this when you release a change. |
| [`CHANGELOG.md`](CHANGELOG.md) | Append-only record of every system release in [Keep a Changelog](https://keepachangelog.com) format. |

---

## How the Lifecycle Works

### 1. You maintain `priorities.json` and each idea's artifact folder

`priorities.json` is the **source of truth** for initiative tier, `lastWork`, project priority, idea priority, `lifecycle`, and `notes`. Lifecycle artifacts live under `initiatives/[Initiative Name]/[Project Name]/[Idea Name]/` (flat — there is no `projects/` container folder). The Web UI's approval queue (and `GET /api/approval-queue`) lists every idea where `lifecycle` is **In Review**; you can also read it straight out of `priorities.json`.

### 2. You delegate a task to The Agent

When you're ready to advance an idea, tell The Agent:

> "Take *Idea X* to the next step."
> "Run Pressure Test for *Idea Y*."
> "Run the market research stage for *Idea Y*."
> "Pick up *Idea Z* - it's at the Brief stage."

### 3. The Agent's execution protocol

Before starting any real work, The Agent will:
1. **Summarize** - restate the request, including any clarifying assumptions
2. **Plan** - lay out the step-by-step approach
3. **Wait for approval** - pause for you to confirm or redirect
4. **Execute** - work through the plan step by step
5. **Summarize** - deliver the output and a brief summary of what was done

The Agent will not skip planning approval or advance past a lifecycle gate without your go-ahead.

### 4. You review and approve (or redirect)

- **Approve** - advance to the next stage
- **Revise** - redo or adjust the current stage output
- **Pause** - set `lifecycle` to `On Hold` for that idea in `priorities.json`, with the reason in `notes`
- **Kill** - set `lifecycle` to `Dropped` in `priorities.json` and record rationale in `history/dropped-history.md` (see **drop-idea** skill)

---

## How the Wiki Works

Each initiative has its own wiki - a directory of markdown files organized by domain. The Agent writes and maintains all of it. You source, explore, and ask questions; The Agent does the summarizing, cross-referencing, filing, and bookkeeping.

The wiki is a **persistent, compounding artifact**. The synthesis is already there. Cross-references are already built. Contradictions are already flagged. Every source you add, every question you ask, and every customer conversation you have makes it richer.

### Four Wiki Operations

**Ingest.** Drop a document into `/raw/` and tell The Agent to process it for a specific initiative. The Agent will: read the source, discuss key takeaways with you, write or update wiki pages in the relevant domains, update `index.md` and `log.md`, and move the source file to the initiative's `sources/` folder. A single source may touch pages across multiple domains.

**Query.** Ask a question about an initiative. The Agent reads `wiki/index.md` first to locate relevant pages across domains, then synthesizes an answer with citations. Good answers - comparisons, analyses, discovered connections - are filed back into the wiki as new pages. Filing a page back counts as an Update and is logged. Routine queries that don't produce a new page are not logged.

**Update.** After any significant conversation, decision, or session where you've discussed strategy or learned something new, tell The Agent to capture it. The Agent will review what was discussed, identify what's new or changed, propose specific updates to wiki pages (with exact changes), and wait for your approval before writing. Nothing important should disappear into chat history.

**Lint.** Periodically ask The Agent to health-check a wiki. The Agent will look for: contradictions between pages, stale claims superseded by newer sources, orphan pages with no inbound links, important concepts lacking their own page, missing cross-references, and data gaps that a web search could fill. Lint passes are logged. Run at least monthly.

**Init (one-time).** When a wiki is first created, The Agent records a single `init` entry in `log.md`. That is not part of the recurring loop above. It marks setup before the first ingest, query, update, or lint.

### The Two Navigation Files

Every wiki contains two special files at the root of the wiki folder:

- **`index.md`** - the architecture map. A catalog of every wiki page organized by domain, with status (Draft/Active), one-line summaries, and a cross-reference index (topic → primary page → also mentioned in). The agent reads this first on every query. Updated on every operation.
- **`log.md`** - append-only activity record. Log structural changes: ingests, updates, lint passes, and init. Skip routine queries - if a query produces something worth keeping, filing it as a new wiki page is the record. Format: `## [YYYY-MM-DD] operation | description`.

### Wiki Domain Structure

Each initiative wiki is organized into six domains - adapted to fit the initiative type. Domains become subfolders within `wiki/`. This allows loading an entire domain at once for relevant tasks.

**For a business initiative (e.g., My Company):**

| Domain | What lives here |
|---|---|
| `identity/` | Company brief, brand voice, mission, values, positioning |
| `offerings/` | Products, services, pricing, differentiation |
| `customers/` | Personas, conversation notes, journey maps, buying signals |
| `market/` | Competitor profiles, landscape, positioning matrix |
| `operations/` | Team structure, processes, tools stack |
| `strategy/` | Goals, active initiatives, key decisions |

**For a personal brand initiative (e.g., My Personal Life):**

| Domain | What lives here |
|---|---|
| `identity/` | Brand voice, personal positioning, values, your story |
| `audience/` | Audience profiles, platform segments, fan types |
| `offerings/` | Content types, products, services, programs |
| `market/` | Competitive creators, platform trends, landscape |
| `operations/` | Content workflow, publishing cadence, tools |
| `strategy/` | Growth goals, content strategy, partnerships |

**For a creative project (e.g., My Hobby):**

| Domain | What lives here |
|---|---|
| `identity/` | Premise, themes, author voice, genre |
| `characters/` | Character profiles, relationships, arcs |
| `world/` | Setting, lore, rules of the universe |
| `plot/` | Structure, chapters, story threads |
| `craft/` | Writing style, influences, research notes |
| `publishing/` | Query strategy, comp titles, audience, marketing |

### Wiki Document Standards

When creating wiki pages, include YAML front matter (`domain`, `type`, `tags`, `related_documents`, `status`, `version`, `created`, `modified`), a purpose callout explaining when to load the page, an Open Questions section, and See Also cross-links. Common types: `brief`, `profile`, `catalog`, `map`, `guide`, `playbook`, `synthesis`.

Where claims matter for strategy, separate **validated** knowledge from **working assumptions** (short labels or a small table are enough). That keeps Context Assets honest as they evolve.

**Deprecation:** Never delete wiki pages. Move outdated pages to `wiki/.archive/` with a note explaining why they were retired.

---

## Operating Principles

**Constructive Challenge.** The Agent won't just execute what's asked. It will look beneath the surface, flag what might be overlooked, and push back when something doesn't add up. On high-stakes steps (Pressure Test, research synthesis), it will also **steel-man the other side** and surface what you might be missing.

**Adaptive Guidance.** Depth and approach are tailored to where you are in the process. Early stages get exploratory thinking; later stages get precision.

**Interview before drafting.** When building a new wiki page or lifecycle artifact for the first time, The Agent will ask questions to gather real information rather than generating generic content. The goal is to capture what's true for this initiative, not what's plausible in general.

**Evidence grounding when it counts.** For important claims, The Agent can tag lines as `DATA` (grounded in a cited source or search), `INFERENCE` (follows from evidence), `ASSUMPTION` (needs validation), or `SPECULATION` (might be wrong). Use this especially in market and competitive work.

**Synthesis checkpoints.** After a heavy subsection, The Agent pauses to distill 3–5 bullets that must carry forward so context compounds instead of dissolving.

**Knowledge compounds.** Insights belong in the wiki, not in chat history. If something is learned - from a source, a conversation, or a decision - it gets written down, cross-referenced, and connected to what's already there.

**Ask before acting externally.** The Agent will not send emails, post publicly, or take actions outside the workspace without explicit permission.

Full patterns for optional deep chains (market analysis, GTM, customer research synthesis) and advanced prompting moves live in `IDEA_LIFECYCLE.md`.

### Rules that codify these principles

The principles above are enforced in practice by a small set of operating rules in [`rules/`](rules/README.md). Every stage of the lifecycle references one or more of these rules at its gate. Read the rule when the stage calls for it; no need to memorize them upfront.

| Rule | What it governs |
|---|---|
| [`rules/evidence-and-verification.md`](rules/evidence-and-verification.md) | The `DATA` / `INFERENCE` / `ASSUMPTION` / `SPECULATION` labels, and the verification-evidence log that every Build slice and Evaluation writes to. *"Seems right is never sufficient."* |
| [`rules/incremental-execution.md`](rules/incremental-execution.md) | How Build is sliced (Plan → Produce → Verify → Save), Simplicity First (Chesterton's Fence), Scope Discipline (NOTICED BUT NOT TOUCHING), slice sizing. |
| [`rules/context-engineering.md`](rules/context-engineering.md) | The 6-level context hierarchy (system rules → user → wiki → stage artifacts → slice → session), trust levels, and how to handle contradictory context. |
| [`rules/decision-records.md`](rules/decision-records.md) | Architecture Decision Record (ADR) template, ID format, and the supersede-don't-edit pattern. |
| [`rules/anti-rationalization.md`](rules/anti-rationalization.md) | Common excuses for skipping discipline, with counter-arguments. The Agent cites these when it pushes back. |
| [`rules/red-flags.md`](rules/red-flags.md) | System-wide and per-stage red flags. When one is observed, The Agent reports it and recommends a stop or course-correct. |

### Specialist reviews at the gates

At certain gates, The Agent adopts one of three specialist profiles from [`agents/`](agents/README.md). Each profile is a focused lens with a dedicated framework and output format.

| Profile | Lens | Invoked at |
|---|---|---|
| [`agents/quality-reviewer.md`](agents/quality-reviewer.md) | Fidelity, clarity, structure, safety, performance | End of Build; deep reviews at Evaluation |
| [`agents/evaluator.md`](agents/evaluator.md) | Verification coverage: every claim/criterion traces to evidence | Build Plan approval; end-to-end Evaluation |
| [`agents/risk-auditor.md`](agents/risk-auditor.md) | Input/auth/data/infra/reputation exposures | Evaluation for user-facing or sensitive work; Launch rollout + rollback review |

`IDEA_LIFECYCLE.md` specifies which profiles must run at which gates. You can also invoke any profile on demand to stress-test an artifact between gates.

---

## Idea Statuses

| Status | Meaning |
|---|---|
| `Backlog` | Captured, not yet started |
| `Brief` | Brief is being written or has been approved |
| `PressureTest` | Ideation pressure test (`02_pressure_test.md`) in progress or complete |
| `Research` | Market research and/or customer discovery underway or complete |
| `PRD` | Product requirements document in progress or approved |
| `Design` | Architecture, flows, or design specs in progress or approved |
| `Build` | Active development. Spans sub-phases **6a Build Plan**, **6b Slice Execution**, and **6c Build Review** — use `notes` for that idea in `priorities.json` to spell out which sub-phase the idea is in. |
| `Evaluation` | End-to-end verification, QA, specialist reviews (quality-reviewer, evaluator, risk-auditor), and pre-launch validation. |
| `Launch` | Launch plan, minimum go-live assets, rollout, and go-live. Covers pre-release work and execution. Use `notes` in `priorities.json` to spell out whether you are still planning or already live. |
| `Marketing` | Post-launch marketing pack: channel plan, copy, checklist; you publish; Agent prepares materials |
| `Growth` | Post-marketing-pack: metrics, product iteration, user-base growth, ongoing experiments |
| `In Review` | Stage or elaboration output is ready. Waiting on you before the next lifecycle action. No new execution on this idea until you approve or redirect. Set `lifecycle` to **`In Review`** in `priorities.json` when the stage is done — the Web UI approval queue picks it up automatically. |
| `On Hold` | Paused - reason should be noted in `notes` |
| `Dropped` | Killed - reason should be noted in `notes`, then recorded in `history/dropped-history.md` |

### Project priority

Each **active project** lives under its initiative in `priorities.json` (`initiatives.[Name].projects.[Project]`) with `priority` and `purpose` fields. When a project is no longer active, record it under **## Closed Projects** in that initiative's `project-history.md` and remove its live entry from `priorities.json` (projects are **closed**, not completed or dropped — those labels apply to ideas). **Priority** ranks whole projects so every idea under that project inherits the same project layer in the combined score (see [PRIORITIZATION.md](PRIORITIZATION.md)).

You may set **Priority** using words or numbers (same meaning either way).

| Value | Meaning | Points in combined score |
|---|---|---:|
| `High` or `1` | Strongest project pull in this initiative | 6 |
| `Medium` or `2` | Normal project pull | 4 |
| `Low` or `3` | Weakest project pull | 2 |

If a project's `priority` is missing, treat it as **Medium** (4 points) for scoring until you set it.

### Priority levels (ideas)

Use these values on the `priority` field for each idea under a project in `priorities.json`. You may use **`High` / `Medium` / `Low`** or **`1` / `2` / `3`** with the same mapping as **Project priority** above (1 = High, 2 = Medium, 3 = Low).

| Priority | Meaning |
|---|---|
| `High` or `1` | Do this before other work in this project unless blocked or overridden in `notes`. |
| `Medium` or `2` | Normal queue for this project. |
| `Low` or `3` | Backlog of value. Pick after higher-priority ideas unless you promote it. |

**How layers combine.** Initiative **tier points** (`priorities.json`), **project_points**, and **idea_points** **add** in the combined score in [PRIORITIZATION.md](PRIORITIZATION.md). Staleness and phase tie-breakers there are unchanged.

If two ideas still tie after the score, use tie-breakers in [PRIORITIZATION.md](PRIORITIZATION.md). Cross-initiative ordering uses **combined score** and each initiative's `lastWork` so lower-tier initiatives still get sessions.

---

## File & Folder Organization

```
/
  SYSTEM_OVERVIEW.md            ← How the system works (this file)
  PRIORITIZATION.md             ← Combined score and next-work selection
  IDEA_LIFECYCLE.md             ← Stage definitions, templates, and gate criteria
  priorities.json               ← Canonical registry: tier, lastWork, priorities, lifecycle, notes
  WEBUI.md                      ← Local Express + React app: config, npm run dev, API
  USER.md                       ← Context about you

  /docs/
    priorities-registry.md      ← Agent guide for reading/writing priorities.json

  /rules/                       ← Cross-cutting operating rules (apply at every stage)
    README.md                   ← Rules index
    evidence-and-verification.md
    incremental-execution.md
    context-engineering.md
    decision-records.md
    anti-rationalization.md
    red-flags.md

  /agents/                      ← Specialist review profiles invoked at gates
    README.md                   ← Profiles index
    quality-reviewer.md
    evaluator.md
    risk-auditor.md

  /skills/                      ← Skills The Agent runs on demand
    add-idea/SKILL.md
    next-idea/SKILL.md
    health-check/SKILL.md
    [...]

  /initiatives/
    [Initiative Name]/
      project-history.md        ← Optional: ## Closed Projects table for this initiative
      history/
        done-history.md         ← Long-form completed-idea records
        dropped-history.md      ← Long-form dropped-idea records
      sources/                  ← Immutable source documents (moved here from /raw)
      outputs/                  ← Finished deliverables produced by completed ideas (documents, reports, assets)
      [Project Name]/           ← Matches the project key under this initiative in priorities.json (flat — no `projects/` container)
        repo/                   ← Git submodule (only present for projects with an associated repo)
        [Idea Name]/            ← Matches the idea key under this project in priorities.json; full lifecycle artifacts from first brief onward
          01_brief.md
          02_pressure_test.md
          02_market_research.md
          02b_customer_discovery.md
          03_prd.md
          04_design.md
          05_build_plan.md            ← Approved at 6a (Build Plan gate)
          05_build/                   ← Build workspace (produced during 6b / 6c)
            README.md                 ← Build Review summary (6c), links to reviews
            decisions.md               ← Architecture Decision Records from Design + Build
            verification_log.md        ← Evidence log: one row per verification event
            slices/
              slice_NN_name/
                changes.md            ← What this slice produced
                acceptance.md         ← What "done" meant for this slice
                evidence.md           ← Verification results for this slice
          outputs/              ← Finished deliverables produced by this idea (documents, reports, assets)
          06_evaluation.md
          07_launch_plan.md
          08_marketing_pack.md
          09_growth_log.md
      wiki/
        index.md                ← Architecture map: all pages, domains, cross-reference index
        log.md                  ← Append-only activity record
        .archive/               ← Deprecated wiki pages (never deleted, just retired)
        identity/               ← Domain subfolders (adapted to initiative type)
        [domain2]/
        [domain3]/
        [domain4]/
        [domain5]/
        [domain6]/

  /raw/                         ← Drop zone for unprocessed documents
  /archive/                     ← Completed, dropped, or outdated work

  /src/                         ← Web UI app source (Express server + React client)
  /scripts/                     ← migrate-registry.ts and other maintenance scripts
```

**Key rules:**
- There is **no `projects/` container folder.** Project folders are direct children of `initiatives/[Initiative Name]/`, matching the project keys under that initiative in `priorities.json` exactly. This mirrors the flat layout used by the upstream Agent Harness (v2.0.0).
- `repo/` is an optional git submodule at the **project** folder (`initiatives/[Initiative Name]/[Project Name]/repo/`), present when that project has a separate codebase repository. Add it from the **harness repo root** with `git submodule add <repository-url> "initiatives/[Initiative Name]/[Project Name]/repo"`. The agent cannot run `git submodule add` or configure remotes for you; when a project needs a submodule, it can scaffold guidance and you run the command locally. Once linked, `repo/` has its own Git history and remote—use branches, commits, and pushes there for product code.
- **Where code changes go:** When `repo/` exists, **all implementation work for that project's software** (application source, services, app config that belongs in the product repo, etc.) happens **inside `repo/`**, not in the harness tree. Lifecycle Markdown (`01_brief.md` through `05_build/`, wiki, `outputs/` for docs) stays in the harness; the submodule is the canonical home for the codebase. Prefer pushing branches to the submodule's remote rather than funneling product code through pull requests against this harness repository.
- `/raw/` is a staging area only. After ingestion, files move to that initiative's `sources/`.
- `sources/` is immutable - The Agent reads from these files but never modifies them.
- `outputs/` holds finished deliverables produced by completed ideas - documents, reports, assets, and any other tangible products of the work. These are distinct from `sources/` (user-supplied input) and from lifecycle artifacts (process scaffolding). When an idea's product is a document, place the finished file in that idea's `outputs/` folder and link to it from `history/done-history.md` (with only a compact pointer in `priorities.json` `notes`). Use initiative-level `outputs/` for deliverables that apply across multiple ideas. Do not mix source documents into `outputs/` and do not mix output deliverables into `sources/`.
- `wiki/` is entirely The Agent-maintained - you read it, The Agent writes and updates it.
- `wiki/.archive/` holds retired pages - never delete, always archive.
- Lifecycle artifact folders live at `initiatives/[Initiative Name]/[Project Name]/[Idea Name]/` and hold the full lifecycle from `01_brief.md` onward.
- `05_build_plan.md` is the approved plan from gate 6a. `05_build/` is the working folder for slice execution (6b) and Build Review (6c). `05_build/verification_log.md` accumulates evidence across all slices and is the primary artifact Evaluation maps against the PRD's P0 acceptance criteria.
- **Build checkpoint discipline (6b):** Checkpoints named in the Build Plan are **session boundaries for The Agent** unless you explicitly ask to continue past one (for example: "continue past Checkpoint B"). After the **last task that belongs before** a checkpoint, The Agent **ends the session slice there** — it does **not** start the next task in the same turn. Before stopping, it runs a **closure checklist**: append or update `05_build/verification_log.md` for every task completed in that session; update that idea's entry in `priorities.json` (`lifecycle`, `lastUpdated`, `notes` with a clear **Next:**, **and** the `checkpoint` object that drives the Web UI Build Checkpoints table — see `docs/priorities-registry.md` **Build checkpoint object**); append `wiki/log.md` if any wiki pages under that initiative changed. Because the Web UI approval queue and priority workspace read `priorities.json` directly, chaining implementation across checkpoints without closure lets the registry drift behind the repo — treat that as a process failure. Author Build Plans with explicit **Hard stop for agents** and **Closure checklist** subsections at each checkpoint (`IDEA_LIFECYCLE.md` Stage 6). The slice cycle and anti-rationalization notes live in `rules/incremental-execution.md`.
- `05_build/decisions.md` holds ADRs for any Design- or Build-time direction-setting choice. ADRs follow [`rules/decision-records.md`](rules/decision-records.md) — supersede, don't edit, when a decision changes.
- `/rules/` and `/agents/` are **system-level** resources - they apply to every initiative, not to any single idea. Do not copy rule or profile files into an initiative folder; reference them in place.
- Completed or dropped work moves to `/archive/` when you take artifacts off the main tree. Completed and dropped ideas stay recorded in each initiative's `history/done-history.md` and `history/dropped-history.md`, with `priorities.json` `notes` linking to those files. Closed projects are recorded in that initiative's `project-history.md`. When archiving, move the lifecycle artifacts and `outputs/` folder together so deliverables stay with the work that produced them.

---

## Naming Conventions

- **Ideas:** Clear, noun-based names. e.g., `Podcast Series`, `Website Rebrand`, `Chapter 3 Draft`
- **Projects:** Folder names under `initiatives/[Initiative Name]/` match the **project key** for that initiative in `priorities.json` exactly.
- **Idea folders:** Under `initiatives/[Initiative Name]/[Project Name]/`, folder names match the **idea key** for that project in `priorities.json` exactly.
- **Wiki pages:** Lowercase, hyphenated. e.g., `competitor-analysis.md`, `target-audience.md`
- **Archived items:** Prefix with initiative and end date. e.g., `My Personal Life - Podcast Series - 2026-06-30`
- **Log entries:** `## [YYYY-MM-DD] ingest | Source Title` / `## [YYYY-MM-DD] query | Question` / `## [YYYY-MM-DD] update | Topic` / `## [YYYY-MM-DD] lint | notes` / `## [YYYY-MM-DD] init | description`

---

## Review Cadence

- **Weekly (10 min):** Run the initiative health pass in [`skills/health-check/SKILL.md`](skills/health-check/SKILL.md) (or ask the agent to run the **health-check** skill). It uses `priorities.json` and the filesystem. Update `lifecycle`, priorities, and `notes` when you find drift.
- **Monthly:** In `priorities.json`, look at ideas with `lifecycle` `On Hold` and `Backlog`. Kill what's stale, revive what's ready. Run a wiki lint pass on at least one initiative.
- **Quarterly:** Review `/archive/` for patterns. What worked? What stalled? Let that inform the next round.

---

## Approval Gates

Every lifecycle stage ends with an Approval Gate. The Agent will not proceed without your explicit sign-off. The pattern is always:

1. The Agent produces the stage output (and updates relevant wiki pages)
2. The Agent sets that idea's `lifecycle` to **`In Review`** in `priorities.json`, and states: *"Stage complete. [Summary of what was produced and what changed in the wiki.] Ready to move to [Next Stage] when you approve."* The Web UI approval queue (and `docs/priorities-registry.md`) reflects this automatically — no separate dashboard row to maintain.
3. You review and respond

After you approve, update `lifecycle` to the next stage label (or keep the same label if you asked for revision). Clear or update `notes` when the block is lifted.

Full gate criteria for each stage are in `IDEA_LIFECYCLE.md`. Elaboration for thin ideas uses the same gate pattern. See [PRIORITIZATION.md](PRIORITIZATION.md) for blocked ideas and next-work selection.

---

---

## Version Management

The system version is tracked in [`VERSION`](VERSION) and documented in [`CHANGELOG.md`](CHANGELOG.md). Version numbers follow [Semantic Versioning](https://semver.org/) applied to the system design:

| Change type | When to use | Version bump |
|---|---|---|
| **MAJOR** | Breaking structural changes — renamed stages, restructured folders, scoring formula changes, or naming convention changes that require updating existing initiative files. | `1.0.0` → `2.0.0` |
| **MINOR** | New skills, new lifecycle stages, new wiki domain types, new system documents — backward-compatible additions. | `1.0.0` → `1.1.0` |
| **PATCH** | Clarifications, copy fixes, non-breaking template or instruction adjustments. | `1.0.0` → `1.0.1` |

**When to update.** Update `VERSION` and `CHANGELOG.md` when you make any intentional, permanent change to the system design — not for edits inside individual initiative files (those are content, not system changes).

**How to release.**
1. Move the `## [Unreleased]` block in `CHANGELOG.md` to a new dated section: `## [X.Y.Z] — YYYY-MM-DD`.
2. Update the version number in `VERSION`.
3. Update the `[Unreleased]` and new version comparison links at the bottom of `CHANGELOG.md`.
4. Commit with a message like `chore: release vX.Y.Z`.

## Getting Started

1. Add the idea to `priorities.json` under the right initiative and project with `lifecycle` `Backlog`. Create `initiatives/[Initiative Name]/[Project Name]/[Idea Name]/` when you start lifecycle artifacts.
2. Drop any relevant background documents into `/raw/`
3. Tell The Agent: *"Ingest the files in /raw for the [Initiative] wiki"* - or go straight to *"Take [Idea] to the Brief stage"*
4. Optionally, run `npm run dev` (see [`WEBUI.md`](WEBUI.md)) to browse the docs and priority workspace in your browser at `http://127.0.0.1:3747/`.
