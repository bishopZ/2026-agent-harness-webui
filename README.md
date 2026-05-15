# 2026 Agent Harness v1.1

![Version](https://img.shields.io/badge/version-1.1.0-blue) [![Changelog](https://img.shields.io/badge/changelog-CHANGELOG.md-informational)](CHANGELOG.md)

- Lifecycle Management for every idea
- Memory with Knowledge Management
- Human-in-the-loop gating
- Automatic prioritization
- Self-healing

Together these form the harness, the operating system for the work. The agent is the emergent execution behavior that runs inside this structure when you follow the documented skills and file rules.

A structured knowledge management system for moving ideas from raw concept to shipped result, with an AI agent as your execution partner at every step.

This is not a task manager. It is part pipeline, part knowledge graph, part AI collaboration framework. Every idea you capture gets the same rigorous process: a brief, a pressure test, deep research, specifications, build and launch, post-launch marketing, and a growth loop. And everything learned along the way is filed, cross-referenced, and available the next time you need it.

---

## Step 1 - Get the repo running

There is no build step, no package manager, no server to start. The system is entirely Markdown files and an AI workflow built on top of them.

There are two ways to use it:

- Clone the repo and open it in your favorite AI-enhanced IDE.
- Fork the repo (make it private!), point a cloud agent service at it, and let agent(s) run autonomously.

---

## Step 2 - Bootstrap

First, run the **bootstrap** skill. It will interview you with a short series of questions to get started.

> "Run the bootstrap skill."

The agent will walk you through the rest. When it is done, your system is personalized and ready.

---

## Step 3 - Add your work

With your initiatives configured, the next step is to populate them with projects and ideas.

The repo ships with three defaults.

- **My Company** - a business initiative
- **My Personal Life** - a personal brand and goals initiative
- **My Hobby** - a creative project initiative

You can also use the **add-initiative** skill to create a new one, or the **remove-initiative** skill to retire one you no longer want.

Inside each initiative, ideas are grouped into **projects**. A product launch, a content series, a fundraising campaign, anything that groups several ideas under one theme. Every initiative starts with a **General** project for ungrouped ideas.

Use the **add-project** skill to create a project, and the **remove-project** skill to retire one.

Each project has ideas. These are the individual tasks to be worked on.

Use the **add-idea** skill to capture an idea in the right place with the right structure.

> "Add an idea to My Company. I want to build a referral program."

---

## Step 4 - Feed the wiki

Each initiative has a persistent **wiki**, a growing knowledge base maintained entirely by the AI. The wiki is where everything you learn gets filed, cross-referenced, and made available for future sessions. The AI draws on it automatically whenever it works on an idea in that initiative.

### Feeding it sources

The `/raw/` folder is the inbox for documents you want the AI to absorb. They can be loose notes, unstructured data, market reports, research papers, interview transcripts, competitor teardowns, reference materials, anything relevant to your goals. Then run the **update** skill. The AI reads each file, synthesizes the key knowledge into the wiki, and moves the file to the appropriate `sources/` folder for permanent keeping.

> "Run the update skill."

Sources and outputs are kept in separate folders so you always know what you brought in versus what the system produced.

- `**/raw/`** - the staging inbox. Files here are temporary. The AI absorbs them and moves them out.
- `**sources/`** - immutable documents you provided. Once filed here, they are never modified.
- `**outputs/`** - finished deliverables the AI produced. Reports, strategy memos, brand guides, generated assets. These are the products of your ideas.

These can exist at three levels of scope: the initiative level (for the whole area of focus), the project level (for shared project materials), and the idea level (for deliverables tied to one specific idea). Ideas stay grouped in project-named folders, but there is no extra `projects/` container directory.

---

## Step 5 - Run the next-idea loop

This is where the system earns its keep.

> "Run the next-idea skill."

The agent reads your priority stack and selects the highest-priority eligible idea. It then executes the next stage, and puts the result in your approval queue.

If you are using a cloud agent service with scheduled task support, you can automate this entirely. Set up a scheduled prompt that runs on whatever cadence matches your budget and pace.

---

## Step 6 - Manage priorities and approvals

### DASHBOARD.md

Your high-level control panel. It has two sections:

**Initiatives table** - the priority stack. Each initiative has a tier point value. Higher tier means more AI pull. The AI also tracks the date work last happened on each initiative, so lower-priority initiatives do not starve - if you have not touched an initiative in a while, it starts pulling harder regardless of tier.

**Awaiting your approval** - the queue of everything the AI has finished and is waiting on you to review. After reviewing an idea, approve it with notes.

> "Run the approve-idea skill for Create Marketing Plan, Brief"

Approving an idea is a great time to give notes or answer any open questions your agent asked you in the document.

### ideas.md

Each initiative has its own `ideas.md` - the complete inventory of everything in that initiative, organized by project. This is where you see statuses, priorities, notes, and links to artifact files.

Priorities are **High**, **Medium**, or **Low** - set them on individual ideas and on projects. The AI combines initiative tier, project priority, and idea priority into a single score when deciding what to work on next.

---

## Step 7 - Run monthly health checks

Once a month, tell the AI to run the health-check.

> "Run the health-check skill."

The agent reads the Dashboard and every active ideas file, verifies that In Review rows have matching approval queue entries, checks that file links are not broken, and flags any drift between what the files say and what is actually on disk. It applies obvious fixes and tells you what still needs your attention. The whole pass takes seconds and keeps the system honest.

---

## The lifecycle

Every idea moves through the same pipeline. The AI never skips a stage and never advances past a gate without your approval.

```
Backlog → Brief → Pressure Test → Research → PRD → Design → Build → Evaluation → Launch → Marketing → Growth
```

**Brief** - a concise framing document: one-liner, problem statement, hypothesis, target audience, why now, success criteria, scope, effort estimate, and an initial recommendation on whether to proceed.

**Pressure Test** - before research deepens, the AI stress-tests the brief. It surfaces the riskiest assumptions, steelmans the case against the idea, and proposes the cheapest experiments to validate or kill the core hypothesis. This is where bad ideas get eliminated before you invest weeks of effort.

**Research** - a two-part investigation. Desk research covers the competitive landscape, market size, user pain points, and key risks. Customer discovery involves real conversations: the AI helps you find the right people to talk to, drafts outreach messages, provides a structured interview guide, and synthesizes findings across conversations into a clear build/no-build signal.

**PRD** - the full specification, written after research and never before: executive summary, goals and non-goals, user personas from real discovery conversations, user stories, requirements, acceptance criteria, dependencies, timeline, and success metrics.

**Design** - the blueprint: approach, architecture or structure, process flows, technical stack, build phases, risks, and alternatives considered.

**Build** - active construction, broken into sub-milestones with a gate at each one. The AI executes one milestone at a time and waits for your go-ahead before continuing. Finished deliverables go into the idea's `outputs/` folder; working files go into `05_build/`.

**Evaluation** - the AI reviews the build against the PRD's acceptance criteria, rates any issues found, and delivers a go/no-go recommendation.

**Launch** - the launch plan: release-moment objectives, initial audience and channels, sequenced go-live timeline, **minimum** messaging and blocking assets, rollout, monitoring, and a contingency plan.

**Marketing** - after go-live, the AI produces a full post-launch pack: goals, positioning and competitive angle for this release, channel plan, voice guardrails, drafted social posts, blog outlines or drafts, paid-ad skeletons (no account actions), guerrilla ideas, and a posting checklist. You execute publishing; the AI does not post without your permission.

**Growth** - the only stage with no terminal gate. After the marketing pack, the AI focuses on metrics, feedback, **product** iteration, user-base levers, and experiments—logged over time. Each experiment can spin up as its own mini-lifecycle. Significant new directions become new ideas in the backlog.

At every gate, the AI tells you what it produced and waits. You approve, redirect, pause, or drop. Nothing advances without your sign-off.

---

## The archive

Completed and dropped work moves to `/archive/` when you want to take it off the main tree. Each bundle keeps everything together - lifecycle artifacts, output files, and a README noting what was done and why it was retired. The history never disappears: completed and dropped ideas stay recorded in `ideas.md` permanently, even after their folders are archived.

---

## Folder structure

```
/
  USER.md                        ← Your identity and preferences
  DASHBOARD.md                   ← Initiative priority stack and approval queue
  SYSTEM_OVERVIEW.md             ← Full system design and rules
  IDEA_LIFECYCLE.md              ← Stage definitions and templates
  PRIORITIZATION.md              ← How the AI scores and selects ideas

  /initiatives/
    [Initiative Name]/
      ideas.md                   ← All ideas, grouped by project
      sources/                   ← Documents you provided (immutable)
      outputs/                   ← Documents the work produced
      [Project Name]/
        sources/                 ← Project-scoped documents you provided
        outputs/                 ← Project-scoped deliverables
        [Idea Name]/
          01_brief.md
          02_pressure_test.md
          02_market_research.md
          02b_customer_discovery.md
          03_prd.md
          04_design.md
          05_build/
          06_evaluation.md
          07_launch_plan.md
          08_marketing_pack.md
          09_growth_log.md
          sources/               ← Idea-scoped documents you provided
          outputs/               ← Finished deliverables from this idea
      wiki/                      ← AI-maintained knowledge base

  /raw/                          ← Inbox for documents to be ingested (temporary)
  /archive/                      ← Completed and dropped work, bundled and preserved
  /skills/                       ← AI skill runbooks
```

---

## Upgrade from a previous version

1. Replace this repo's `initiatives/` folder with the `initiatives/` folder from your old version. Also copy over your USER.md file.

Then run these skills in order:

> "Run the import skill."

> "Run the bootstrap skill."

> "Run the health-check skill."

That's all. Import complete!

---

## Version history

See [CHANGELOG.md](CHANGELOG.md) for a full record of what changed in each release.

The current system version is tracked in [`VERSION`](VERSION). Version numbers follow [Semantic Versioning](https://semver.org/):

- **MAJOR** — breaking changes to file structure, stage names, scoring formula, or naming conventions that require migrating existing initiative data.
- **MINOR** — new skills, lifecycle stages, wiki domain types, or system documents (backward-compatible).
- **PATCH** — clarifications, copy fixes, and non-breaking template adjustments.

When you ship a meaningful change to the system (new skill, revised stage, structural rename), bump `VERSION`, move the `[Unreleased]` block in `CHANGELOG.md` to a dated release section, and update the comparison links at the bottom of that file.

---

## License

This project is released under the [MIT License](https://opensource.org/licenses/MIT). You are free to use, copy, modify, and distribute it for any purpose.