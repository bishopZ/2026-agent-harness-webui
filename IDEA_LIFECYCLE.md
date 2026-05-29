# Idea Lifecycle

This document defines every stage an idea moves through - from raw capture to active growth. Each stage includes a description, what the Agent needs to begin, what the Agent will produce, and the approval gate criteria before moving on.

For system context, see `SYSTEM_OVERVIEW.md`. For initiative tier, project/idea priority, lifecycle, and approval queue, see `priorities.json` and [`docs/priorities-registry.md`](docs/priorities-registry.md). For combined score and picking the next idea, see `PRIORITIZATION.md`.

**Rules and agent profiles.** Every stage in this document operates under the rules in `rules/`. The six rule files — evidence and verification, incremental execution, context engineering, decision records, anti-rationalization, and red flags — apply at every stage. At approval gates that involve depth or risk, The Agent also runs one or more of the specialist profiles in `agents/` (`quality-reviewer`, `evaluator`, `risk-auditor`). Each stage below cites which rules to load and which profiles, if any, to invoke.

**The wiki relationship.** Each initiative has a persistent wiki organized by domain (identity, customers, market, etc.) that accumulates knowledge over time. Lifecycle stages don't operate in isolation - knowledge-intensive stages both draw from and contribute to the initiative wiki. Stage artifacts (`01_brief.md`, `02_market_research.md`, etc.) under `initiatives/[Initiative Name]/[Project Name]/[Idea Name]/` are the formal deliverables for a specific idea; the wiki is the broader, growing knowledge base for the entire initiative. When the Agent produces a stage artifact, it also updates relevant wiki pages and logs the activity.

---

## Stage Map

```
Backlog → Brief → Pressure Test → Research → PRD → Design → Build → Evaluation → Launch → Marketing → Growth
```

At any point, an idea may move to `On Hold` or `Dropped`. While waiting on you after a stage or elaboration draft, the idea uses `In Review` (see **At every approval gate** below).

---

## Deliverable types and lifecycle shortcuts

**Not every idea is a software product.** The default stage map and the Stage 4 PRD template are **product-shaped** (user stories, functional requirements, launch metrics). That is correct when the idea is to ship or materially change a product. It is **incorrect** when the idea’s committed outcome is only a **document**, **research memo**, **process**, or **one-off asset**.

**How to avoid “wrong PRD” confusion**

1. **Name the deliverable in the Brief** — In `01_brief.md`, state explicitly what ships when the idea completes: e.g. “single competitive research document in `outputs/` and wiki `market/` update,” not “inform the PRD” without naming the terminal artifact.
2. **Tag the idea or front matter** — Use **notes** in `priorities.json` or optional YAML (e.g. `deliverable_class: research_document`) so Stage 4 is interpreted as **requirements for that work product**, not as an app specification. Parent **project** folder (e.g. Love Street) provides context; it does **not** redefine the idea’s deliverable.
3. **Stage 4 still applies, but the content changes** — `03_prd.md` should specify **scope, sections, acceptance criteria, and verification** for the document (or other non-code deliverable), **not** product user stories unless the idea is actually to build the product.
4. **Research-only or doc-only exit** — If the Brief defines the outcome as “published research” or “one report,” then after approved Research the work is usually: thin **Design** (outline, template, canonical location) → **Build** (write, cite, place in `outputs/` per `SYSTEM_OVERVIEW.md`) → **Evaluation** (stakeholder read, fact-check) → **Done** or a single **Launch** if the “release” is publication. **Marketing / Growth** may be waived with rationale in **Notes** when they do not apply.
5. **When full product stages are required** — Use the full map through Launch (and beyond) when the idea commits to shipping or operating something in market (app, recurring service, public campaign with ongoing metrics). When in doubt, the Brief’s **success criteria** decide: if they only mention a document or a wiki update, do not generate an app PRD.

**Why agents default to app PRDs:** The Research stage’s decision framework says “Build → proceed to PRD.” That “Build” means **continue the initiative pipeline**, not “write a product requirements document for the parent project.” Combined with a **project** name that is a product (Love Street), it is easy to mis-route Stage 4 into **parent-product** scope. The Brief + deliverable tag breaks that ambiguity.

---

## Wiki domains by initiative type

This document often names `**customers/`** and `**market/`** because those folders match a **business** wiki (e.g. My Company). On a **personal brand** wiki, use `**audience/`** anywhere this doc says `**customers/`** (or "customers / audience" below). The stages and artifacts are the same.

When an idea is tied to something you sell or ship, also load and update `**offerings/**` with `**identity/**` and `**market/**` (or the creative equivalents below).

**Creative projects (e.g. a novel)** use `identity/`, `characters/`, `world/`, `plot/`, `craft/`, and `publishing/` (see `SYSTEM_OVERVIEW.md`). Map lifecycle hooks to those folders like this:


| This document names                            | Typical home in a creative wiki                                                                                  |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `customers/`, reader or audience discovery     | `publishing/` (target reader, discovery notes); sometimes `characters/` when the focus is who inhabits the story |
| `market/`, landscape, competitors              | `publishing/` (comp titles, positioning); `craft/` (influences, analogous works)                                 |
| `strategy/`                                    | `publishing/` (query, marketing, long-term publishing bets); `plot/` (structure and story-priority decisions)    |
| `operations/` (tools, process, how build runs) | `craft/` (writing process, tools); `publishing/` for submission or production workflow                           |


During **Marketing**, wiki updates emphasize initiative-wide messaging, channel, and competitive notes derived from the pack. During **Growth**, "all domains" means every folder for that initiative type (for a novel, all six creative domains).

---

## Stage 0 - Idea Capture (Backlog)

**What it is:** A raw idea has been named and added to the initiative’s idea list. No work has been done yet.

**To enter this stage:**

- Give the idea a name
- Optionally write one or two sentences describing it
- Add it to `priorities.json` under the correct initiative and **project** with `lifecycle` `Backlog`

**What The Agent does:** Nothing yet. This stage is owned entirely by you.

**Artifact:** An entry in `priorities.json` for that initiative and project.

**Rules to load:** None — this stage is pre-work.

**To advance:** Tell The Agent to take the idea to the `Brief` stage.

---

## Stage 1 - Brief

**What it is:** A concise framing document that defines the idea clearly enough to decide whether it deserves further investment. This is a thinking tool, not a commitment.

**To enter this stage:**

- The idea has a name and at least a rough description

**What The Agent will produce (`01_brief.md`):**

- **One-liner** - a single sentence describing what this is
- **Problem statement** - what problem or opportunity this addresses, and for whom
- **Hypothesis** - what we believe to be true, and what we're betting on
- **Target audience** - who this is primarily for
- **Why now** - what makes this the right moment to pursue
- **Success criteria** - how we would know this worked (specific, measurable where possible)
- **Out of scope** - what this explicitly does not try to solve
- **Rough effort estimate** - ballpark: days / weeks / months, and what kind of resources
- **Open questions** - unknowns that need to be resolved before or during research
- **Recommendation** - The Agent's initial read: is this worth pursuing further, and why?

**Rules to load:** `rules/context-engineering.md` (load the wiki before drafting), `rules/evidence-and-verification.md` (label assumptions honestly).

**Wiki domains to load:** `identity/` (for brand voice and positioning), `customers/` or `audience/` (for existing persona knowledge). The Agent will check these before drafting rather than starting from zero.

**Wiki update:** The brief's target audience and problem framing will be checked against and may update the relevant domain pages.

**Approval gate:** Review the brief. Ask: Is the problem real? Is the audience clear? Are the success criteria meaningful? Do the open questions feel answerable? Approve to advance to Pressure Test, or ask for revisions.

---

## Stage 2 - Pressure Test

**What it is:** A short adversarial pass against the Brief before heavy research begins. The goal is to surface the strongest case against the idea, the assumptions it rests on, and the specific experiments that would kill or confirm it. Pressure Test exists so ideas are stress-tested before research deepens and long before a PRD commits the team to build.

**To enter this stage:**

- An approved `01_brief.md` exists

**What The Agent will produce (`02_pressure_test.md`):**

- **Steel-man the other side** - the strongest case that this idea is wrong, mistimed, or serving the wrong audience
- **Assumption audit** - every load-bearing assumption in the Brief, labeled `DATA` / `INFERENCE` / `ASSUMPTION` / `SPECULATION` per `rules/evidence-and-verification.md`
- **Risks, in order** - what is most likely to kill this, what would cost the most to get wrong, and what is merely uncomfortable
- **Next experiments** - the smallest, fastest experiments that would move an `ASSUMPTION` to `DATA` — ideally weeks, not months
- **Waiver note (if applicable)** - if Pressure Test is being waived for an idea, the rationale lives here or in that idea's Notes in `ideas.md` per `SYSTEM_OVERVIEW.md`

**Rules to load:** `rules/evidence-and-verification.md`, `rules/anti-rationalization.md` (this stage is the first formal anti-rationalization pass), `rules/red-flags.md`.

**Wiki domains to load:** `market/`, `customers/` or `audience/`, `offerings/`, `identity/`, plus `USER.md`.

**Wiki update:** Any assumption that survives Pressure Test as a working assumption should be reflected in the relevant domain page with the `ASSUMPTION` label, so downstream stages inherit it honestly.

**Approval gate:** Review the pressure test. Ask: Are we honest about risks? Do the next experiments look small enough to actually run? Is there a named assumption we should validate before more research? Approve to advance to Research, or send back with a revised Brief.

---

## Stage 3 - Research

**What it is:** A two-part investigation that pressure-tests the brief further and informs the PRD. Part 1 is desk research (market landscape, competitors, existing data). Part 2 is primary research - real conversations with real people who have the problem.

**To enter this stage:**

- An approved `01_brief.md` exists, and Pressure Test is approved or waived

---

### Part 1 - Market Research

**What The Agent will produce (`02_market_research.md`):**

- **Competitive landscape** - who else is doing this (or something close), at what scale, with what strengths and weaknesses
- **Market size & dynamics** - estimated addressable audience or market, growth trends, tailwinds or headwinds
- **User pain points** - what real users say about existing solutions (from reviews, forums, interviews, public research)
- **Gaps and opportunities** - where existing solutions fall short, and where this idea could differentiate
- **Analogous markets or models** - similar problems solved in adjacent domains worth learning from
- **Key risks** - market, timing, and competitive risks identified at this stage
- **Research synthesis** - a 3–5 sentence summary of what the research reveals about the opportunity

**Rules to load:** `rules/evidence-and-verification.md` (every `DATA` claim has a source), `rules/context-engineering.md`.

**Wiki domains to load:** `market/` (existing competitor and landscape pages). The Agent will check these first and update them with new findings.

**Wiki update:** This is the most wiki-intensive stage for market knowledge. The Agent will create or update pages across the `market/`, `customers/`, and `strategy/` domains - competitor profiles, market sizing, user pain point summaries - and flag any contradictions with existing pages.

---

### Part 2 - Customer Discovery

**What it is:** Direct conversations with real people who have the problem. The goal is 10 conversations before writing the PRD. Ten is the sweet spot - patterns don't emerge reliably with fewer than 5, and more than 20 yields diminishing returns before taking action.

This is the most important research you can do. Desk research tells you what's out there. Customer conversations tell you what's true for real humans.

**Are you pre-product or post-product?**

- **Pre-product (validating):** Focus on whether the problem is real and painful. Questions center on current behavior, past attempts, and willingness to pay.
- **Post-product (acquiring):** Focus on fit and what would make someone try the solution. Questions center on specific situations and decision criteria.

**What The Agent will help you produce:**

#### The Finder - Who to reach

The Agent will help identify 10–20 specific people to reach out to. Not target segments - actual humans with names and profiles. Output includes:

- LinkedIn search strategy (keywords + filters)
- Relevant Reddit communities or thread types
- Other platforms where this person is active
- Signals that someone is worth reaching out to (recent activity, evidence of the problem)

#### The Opener - What to say

The Agent will draft personalized messages under 100 words using one of three frames:


| Frame                                                                                                          | Best for                                     |
| -------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| **Research Frame** - "I'm studying [problem]. Would you share your experience?"                                | People who've publicly described the problem |
| **Shared Struggle Frame** - "Your post hit close to home. I've experienced the same thing. Can we swap notes?" | People in similar situations to you          |
| **Value-First Frame** - Lead with something useful, then ask for time                                          | Busy people, influencers                     |


Rules for every message: specific to the person, under 100 words, frames as research not sales, makes it easy to say yes or no.

#### The Guide - What to ask

Use these 12 questions across a 30-minute conversation. Listen 80% of the time. Ask "why" up to five times to get beneath surface answers. Get specific - "tell me about the last time" beats "how do you usually." Never mention your solution until asked.

**Opening (get them talking):**

1. "Can you walk me through how you currently handle [problem area]?"
2. "What does a typical week look like when you're dealing with [problem]?"

**Pain Discovery (find the real problem):**

1. "What's the most frustrating part of that?"
2. "When was the last time [problem] cost you time, money, or opportunity?"
3. "What have you tried before? What happened?"

**Solution Exploration (don't pitch, probe):**

1. "If you could wave a magic wand, what would be different?"
2. "What would 'good enough' look like?"
3. "What would make you switch from your current approach?"

**Willingness to Pay (only if the conversation is going well):**

1. "How much is this problem costing you right now?"
2. "Would you pay to solve this? What's it worth to you?"
3. "What would you need to see before you'd try something new?"

**Meta (always valuable):**

1. "Who else should I talk to about this?"

**After each conversation:** Complete the post-call reflection within 30 minutes - memory decays fast. Capture: 2–3 sentence summary, hypothesis check (confirmed / challenged / wrong), key insights, the single most important takeaway, problem validation score (1–5), and honest assessment of whether they'd pay.

#### The Synthesizer - What you learned

After 5 conversations, check for emerging patterns. After 10, The Agent will run a full synthesis:

- Pattern summary - what did most people say?
- Customer segments - do distinct groups emerge?
- Problem validation - evidence for and against
- Unexpected insights - what surprised you?
- Key quotes - organized by theme
- Feature priorities - what to build first
- Messaging insights - language that resonates
- Gaps - what you still don't know

**The decision framework:**


| What you found                       | Signal    | Action                                        |
| ------------------------------------ | --------- | --------------------------------------------- |
| Problem is real + people will pay    | Strong    | **Build** - proceed to PRD                    |
| People will pay + problem is unclear | Dangerous | Find the real problem first                   |
| Problem is real + people won't pay   | Hobby     | Find different customers or a different model |
| Neither                              | Clear     | Stop - find a different problem               |


**What The Agent will produce (`02b_customer_discovery.md`):**
A synthesis document with all findings, key quotes, the decision framework outcome, and recommended next steps. This also feeds into the wiki's `customers/` domain.

**Wiki domains to load:** `customers/` or `audience/` (existing persona pages).

**Wiki update:** Conversation notes, synthesis, persona updates, and key quotes all go into the `customers/` or `audience/` domain. The synthesis page becomes a living reference for all future ideas in this initiative.

---

**Approval gate (Research):** Review both the market research and customer discovery. Ask: Is the opportunity real and differentiated? Do real humans confirm the problem? Are the risks manageable? Does the decision framework signal Build? Approve to advance to PRD, or send back for more research on specific questions.

---

## Stage 4 - PRD (Product Requirements Document)

**What it is:** The detailed specification for what will be built or done. This is the contract between the idea and the execution team. It is written after Research - never before - because it should reflect what real customers actually need, not what we assumed.

**To enter this stage:**

- Approved `01_brief.md`, `02_pressure_test.md` (or a recorded waiver), `02_market_research.md`, and `02b_customer_discovery.md` exist (or research has been waived with good reason)

**What The Agent will produce (`03_prd.md`):**

- **Executive summary** - what this is and why it's being built
- **Goals and non-goals** - explicit statement of what success looks like and what is out of scope
- **User personas** - 1–3 specific, named user types drawn from customer discovery conversations
- **User stories** - "As a [persona], I want to [action] so that [outcome]" for all key interactions
- **Functional requirements** - what the system/product/initiative must do, numbered and prioritized (P0, P1, P2)
- **Non-functional requirements** - performance, reliability, security, accessibility, or other quality constraints
- **Acceptance criteria** - specific, testable conditions that define "done" for each requirement. Each criterion names its **verification method** (test, review, demo, citation, conversation).
- **Dependencies and assumptions** - what this relies on being true or in place. Assumptions carry forward from Pressure Test with their `ASSUMPTION` label intact until validated.
- **Open questions** - unresolved decisions that need to be made before or during build
- **Timeline and milestones** - suggested phasing with rough dates or durations
- **Success metrics** - how this will be measured post-launch

**Rules to load:** `rules/evidence-and-verification.md` (every acceptance criterion has a verification method), `rules/decision-records.md` (any direction-setting choice gets an ADR), `rules/anti-rationalization.md`.

**Wiki domains to load:** `customers/` (personas, discovery synthesis), `market/` (competitive context), `identity/` (brand and positioning). The Agent draws on all three when writing personas and requirements.

**Wiki update:** Finalized personas and success metrics are filed back into the `customers/` domain as reference pages for future ideas in this initiative.

**Approval gate:** Review the PRD carefully. Ask: Are all requirements clear and testable? Does every acceptance criterion name a verification method? Are priorities correct? Are there missing user stories? Are the success metrics the right ones? This is the last gate before significant effort is invested. Approve to advance to Design, or revise.

---

## Stage 5 - Design

**What it is:** The technical and structural blueprint for how this will be built or executed. For software, this is architecture and flows. For non-software initiatives, this is the execution plan and structure.

**To enter this stage:**

- An approved `03_prd.md` exists

**What The Agent will produce (`04_design.md`):**

- **Approach summary** - the overall approach chosen and why (vs. alternatives considered)
- **Architecture or structure** - how the pieces fit together (systems, components, teams, processes)
- **User or process flows** - step-by-step walkthroughs of key interactions or workflows
- **Technical stack or tooling** - what will be used to build this and why
- **Data model or information architecture** - how information is structured and stored
- **Interfaces and integrations** - what this connects to, and how
- **Build phases** - how the build will be broken into chunks with milestones (this becomes the spine of the Build Plan in Stage 6)
- **Risks and mitigations** - technical or execution risks and how they'll be managed
- **Alternatives considered** - what else was evaluated and why it was set aside. Any direction-setting choice is written as a Decision Record (`rules/decision-records.md`) in `05_build/decisions.md` at the start of Build, or in the wiki if it is initiative-wide.

**Rules to load:** `rules/decision-records.md`, `rules/evidence-and-verification.md`, `rules/incremental-execution.md` (design must be sliceable — see below).

**Design must be sliceable.** A Design that cannot be broken into thin vertical slices is incomplete. The first thing Build will do is decompose this Design into a Build Plan; if the Design cannot be decomposed that way, it is still Design work. See `rules/incremental-execution.md`.

**Wiki domains to load:** `operations/` (tools, processes, existing infrastructure).

**Approval gate:** Review the design. Ask: Is the approach sound? Are the build phases reasonable and vertically sliceable? Are risks well understood? Are there missing integrations or edge cases? Are the alternatives considered captured well enough to revisit later? Approve to advance to Build, or send back for revisions.

---

## Stage 6 - Build

**What it is:** Active construction of the idea - writing code, drafting content, building systems, or executing plans. Build is the longest stage, and the stage most prone to drift. It runs as a tight loop of three sub-phases: **Plan → Slice → Verify**, under the rules in `rules/incremental-execution.md` and `rules/evidence-and-verification.md`.

**To enter this stage:**

- An approved `04_design.md` exists

### Sub-phase 6a - Build Plan

Before any construction begins, The Agent decomposes the Design into a **Build Plan**: an ordered list of thin vertical slices with explicit acceptance criteria, verification steps, and dependencies.

**What The Agent will produce (`05_build_plan.md`):**

- **Overview** - a paragraph restating what will be built, from the PRD and Design
- **Architecture decisions carried forward** - a short index of ADRs from Design (or new ones emerging now)
- **Task list, ordered** - each slice follows the task structure below
- **Checkpoints** - explicit gates after every 2–3 slices where the system must be verified end-to-end
- **Risks and mitigations** - the risks from Design, refreshed, with mitigations mapped to specific slices
- **Open questions** - unknowns that must be resolved before or during Build, each with a proposed path to an answer
- **Parallelization notes** - which slices can safely be done in parallel, which must be sequential, which need coordination (e.g. a shared contract defined first)

**Task structure for each slice:**

```markdown
## Task N: [Short, descriptive title — no "and"]

**Description:** One paragraph on what this slice accomplishes end-to-end.

**Acceptance criteria:**
- [ ] Specific, testable condition
- [ ] Specific, testable condition

**Verification:**
- [ ] Verification step (test, review, demo, read-aloud, citation, etc.)
- [ ] Verification step

**Dependencies:** Task numbers this depends on, or "None"

**Files or artifacts likely touched:**
- `path/to/thing.ext`

**Estimated scope:** S (1–2 files) | M (3–5 files) | L (break it down)
```

**Sizing.** Each slice should be S or M. L and XL slices are broken down before the Plan is approved. A slice with "and" in its title is two slices.

**Rules to load (6a):** `rules/incremental-execution.md`, `rules/evidence-and-verification.md`, `rules/context-engineering.md`, `rules/anti-rationalization.md`.

**Approval gate (6a — Build Plan):** You (or the `evaluator` profile) confirm that every slice has acceptance criteria, every acceptance criterion has a verification method, and that the plan is vertically sliceable. Approve to begin construction, or revise.

### Sub-phase 6b - Slice Execution

With the Build Plan approved, The Agent executes one slice at a time following the cycle in `rules/incremental-execution.md`:

1. **Plan the slice** — re-read the slice's acceptance criteria and the relevant prior artifacts
2. **Produce** — the minimum that is obviously correct
3. **Verify** — run the acceptance checks; record the evidence
4. **Save** — atomic commit (software) or named save-point (non-software) with a descriptive message
5. **Log** — append an entry to `05_build/verification_log.md`
6. **Record decisions** — any architectural or direction-setting choice made during the slice becomes a Decision Record in `05_build/decisions.md`
7. **Next slice** — carry forward, don't restart

Between slices the system must hold together: build succeeds, existing verifications still pass, the narrative still coheres, the pack is still launchable. This is enforced by `rules/incremental-execution.md` Rule 2.

At each checkpoint from the Build Plan, The Agent stops, summarizes, and waits for your go-ahead before moving on. Checkpoints are mini-gates — you can redirect, pause, or adjust scope at any of them.

**Rules to load (6b):** `rules/incremental-execution.md`, `rules/evidence-and-verification.md`, `rules/decision-records.md`, `rules/red-flags.md`, `rules/anti-rationalization.md`.

### Sub-phase 6c - Build Review

When all slices and checkpoints are complete, The Agent runs a **Build Review** before advancing to Evaluation. The review invokes the specialist profiles in `agents/`:

- `agents/quality-reviewer.md` — five-axis review (fidelity, clarity, structure, safety, performance) across the Build as a whole
- `agents/evaluator.md` — verification coverage analysis; every P0 acceptance criterion must map to a verification result in `05_build/verification_log.md`
- `agents/risk-auditor.md` — invoked when the idea is user-facing, publishes externally, or touches sensitive data

The results are written into `05_build/README.md` and any Critical / High findings block the Evaluation gate. These findings either loop back into a new slice or are explicitly deferred with rationale.

### Build artifacts (summary)

```
[Project Name]/[Idea Name]/
  05_build_plan.md              ← approved at gate 6a
  05_build/
    README.md                   ← build summary + index (incl. Build Review results)
    decisions.md                ← ADRs from Design and Build
    verification_log.md         ← evidence log, one row per verification event
    slices/
      slice_01_[name]/
        changes.md              ← what changed and why
        acceptance.md           ← checklist of acceptance criteria, checked
        evidence.md             ← pointers to tests, reviews, or other verification output
      slice_02_[name]/
        ...
  outputs/                      ← finished deliverables (documents, reports, code artifacts, assets)
```

Working files and drafts stay in `05_build/`. When the build produces a finished deliverable (a document, report, asset, or other tangible output), place it in the idea's `outputs/` folder. Link to output files from the Done row in `ideas.md` when the idea completes.

**Wiki update:** Key technical decisions, architectural choices, and lessons from the build are captured in the `operations/` domain (business / personal brand) or `craft/` (creative). ADRs that rise above per-idea scope are also promoted into `wiki/strategy/` or the domain most relevant to the decision.

**Approval gate (6 — end of Build):** Review the Build Review results. Ask: Are all Critical and High findings resolved or explicitly deferred? Does `verification_log.md` cover every P0 acceptance criterion from the PRD? Are the Decision Records complete? Approve to advance to Evaluation.

---

## Stage 7 - Evaluation

**What it is:** Holistic validation that the thing built, taken as a whole, meets the commitments made in the Brief, PRD, and Design. Per-slice correctness is already proven in Build; Evaluation asks whether the slices hang together, how the artifact behaves end-to-end, what real users / readers / buyers think, and whether it is safe to ship.

**To enter this stage:**

- Build is complete, the Build Review has run, and all artifacts are in place

**What The Agent will produce (`06_evaluation.md`):**

- **Evaluation approach** - how the complete artifact was tested end-to-end (not just per-slice)
- **Acceptance criteria review** - each P0 criterion from the PRD, its verification method, and the evidence entry from `05_build/verification_log.md` that proves it. Any gap is a blocker.
- **End-to-end checks** - integration across slices, full user / reader / buyer journey, performance at scale, cross-artifact consistency
- **External reaction** - feedback from at least one real stakeholder outside the Build (target user, trusted reader, sample buyer, subject matter expert, depending on initiative type). For customer-facing work, a structured post-Build discovery round is strongly recommended.
- **Specialist review summaries** - results from `quality-reviewer`, `evaluator`, and (where applicable) `risk-auditor`, pulled from Build Review and any additional depth reviews run at Evaluation
- **Issues found** - bugs, gaps, or quality problems identified, with severity ratings aligned to specialist profiles
- **Remediation plan** - how issues will be addressed before launch, or explicit rationale for accepting them
- **Assumption audit** - every `ASSUMPTION` carried in from earlier stages, whether Evaluation has validated or invalidated it, and what still needs Growth to answer
- **Pre-launch checklist** - all items that must be complete before going live
- **Go / No-go recommendation** - The Agent's assessment with rationale

**Rules to load:** `rules/evidence-and-verification.md`, `rules/red-flags.md`, `rules/anti-rationalization.md`.

**Agent profiles to run at this gate:**

- `agents/quality-reviewer.md` — end-to-end review of the complete artifact
- `agents/evaluator.md` — confirm every PRD P0 maps to evidence
- `agents/risk-auditor.md` — mandatory for user-facing, sensitive, or regulated work; optional otherwise

**Wiki update:** External reaction and any validated / invalidated assumptions update the relevant wiki domain pages (`customers/` for external reaction, `market/` for competitive findings, `strategy/` for revised positioning).

**Approval gate:** Review the evaluation. Are all P0 acceptance criteria met? Are all specialist-review Critical findings resolved? Is the assumption audit honest? Is the pre-launch checklist complete? Approve to advance to Launch, or send back to Build to address critical issues.

---

## Stage 8 - Launch

**What it is:** Taking the idea to market - shipping the product, publishing the content, announcing the initiative, or activating the plan. Launch is the release moment and its immediate aftermath: go-live, initial messaging, monitoring, and rollback if needed. Launch runs on the principle that **faster is safer**: small, staged releases with clear rollback beat a single do-or-die event.

**To enter this stage:**

- Evaluation is approved and the pre-launch checklist is complete

**What The Agent will produce (`07_launch_plan.md`):**

- **Launch objectives** - what a successful **release moment** looks like (ship day and immediate aftermath)
- **Target audience and channels** - who is being reached for the **initial** announcement (high level)
- **Launch timeline** - sequenced activities with owners and dates for go-live
- **Messaging and positioning** - **minimum** narrative and copy required to flip the switch (sustained campaign messaging, channel depth, and post queue live in `08_marketing_pack.md`). Where messaging depends on a Build-time decision, cite the relevant ADR from `05_build/decisions.md`.
- **Launch assets** - **blocking** list: content, copy, or materials that must exist before go-live (The Agent can produce this minimum set)
- **Release notes** - short, user-facing summary of what is shipping, grounded in `05_build/decisions.md` and `verification_log.md`
- **Rollout plan** - phased (staged rollout, feature-flag percentages, geographic or cohort phasing) or full launch, and how it's being managed. A staged rollout is the default; a full-launch choice requires rationale.
- **Monitoring plan** - what's being watched in the first hours/days after launch, which specific signals, which owner reacts
- **Rollback or contingency plan** - the trigger conditions (not just "if it breaks"), who flips the switch, and what state the system returns to

**Rules to load:** `rules/incremental-execution.md` (staged rollout), `rules/decision-records.md` (ADR for rollout strategy if non-standard), `rules/red-flags.md`.

**Agent profiles to run at this gate:** `agents/risk-auditor.md` for the rollout and rollback plan — always, regardless of initiative type.

**Wiki domains to load:** `identity/` (brand voice and messaging), `customers/` (personas), `strategy/` (goals and positioning).

**Approval gate:** Review the launch plan. Is the minimum messaging sufficient for go-live? Is the rollout sound and properly staged where staged rollout is available? Are the rollback trigger conditions specific and owned? Does the monitoring plan cover the known failure modes from Evaluation? Approve to execute the launch, or revise the plan.

**To advance:** After go-live matches the plan (or you note exceptions in that initiative’s `ideas.md`), tell The Agent to take the idea to **Marketing** for the post-launch marketing pack.

---

## Stage 9 - Marketing

**What it is:** After go-live, a structured **post-launch acquisition and awareness** pass. The Agent produces a full marketing execution pack—plan, copy, channel recommendations, and a posting checklist—so **you only publish** (paste, schedule, upload). The Agent does not post on your behalf without explicit permission (see `SYSTEM_OVERVIEW.md` **Operating Principles**).

**To enter this stage:**

- `07_launch_plan.md` is approved and go-live is complete as defined in that plan (or you have recorded in **Notes** that you want the pack drafted ahead of go-live)

**What The Agent will produce (`08_marketing_pack.md`):**

- **Executive summary and goals** - what this push achieves; tie to PRD success metrics where relevant
- **Positioning and competitive angle for this release** - stage-specific; draws on wiki `market/` without repeating full early-stage research
- **Proof points** - the specific evidence from `05_build/verification_log.md`, `06_evaluation.md`, and the relevant ADRs in `05_build/decisions.md` that substantiate messaging. Claims in marketing copy must be traceable here.
- **Channel plan** - recommended channels with rationale, priority order, and cadence
- **Voice and company image for this push** - short guardrails; align with wiki `identity/`
- **Social posts** - table: platform, post type, copy, suggested media, CTA, optional hashtags (no live posting actions)
- **Blog / longform** - titles, outlines or drafts, SEO notes if useful
- **Paid advertising** - campaign skeleton, audiences, angles, example copy, budget bands as assumptions (no buying, placing, or operating ad accounts)
- **Guerrilla or unconventional tactics** - ideas with effort and risk notes
- **Posting checklist** - ordered steps for you: what to paste where and in what order
- **Materials index** - links to sections above; list what you must supply (e.g. screenshots) vs. what the pack already contains

**Rules to load:** `rules/evidence-and-verification.md` (proof points traceable), `rules/context-engineering.md` (reuse the wiki, do not rebuild it).

**Agent profiles to run at this gate:** `agents/quality-reviewer.md` on the pack's fidelity, clarity, and safety dimensions. `agents/risk-auditor.md` if the campaign includes comparative claims, testimonials, or regulated content.

**Wiki domains to load:** `identity/`, `customers/` or `audience/`, `market/`, `strategy/` (and for creative initiatives, `publishing/` per [Wiki domains by initiative type](#wiki-domains-by-initiative-type)).

**Wiki update:** File durable messaging, channel, and competitive learnings that should outlive this idea. Do not duplicate the entire pack into the wiki unless it becomes initiative-wide reference.

**Approval gate:** Does the plan, channel mix, and tone match the initiative? Is every claim in the copy traceable to a proof point? Are you willing to execute the posting checklist yourself? Approve to advance to **Growth** (and start or continue `09_growth_log.md`), or request revisions.

---

## Stage 10 - Growth

**What it is:** Ongoing **product and user-base** work after the marketing pack is approved: metrics, feedback, feature and improvement iteration, and scaling. This stage is ongoing and cyclical. The first “big push” materials live in `08_marketing_pack.md`; Growth focuses on learning, product levers, and durable growth—not on drafting the initial post-launch campaign from scratch.

**To enter this stage:**

- `08_marketing_pack.md` is approved (or you explicitly waive Marketing per **Notes** and record the rationale)

**What The Agent will produce (maintained in `09_growth_log.md`):**

- **Launch and marketing retrospective** - what happened at go-live and during the first push vs. expectations; pull lessons from `08_marketing_pack.md` execution when relevant
- **Early metrics** - first data against success criteria, always compared against the baseline recorded at Evaluation
- **User feedback summary** - what real users are saying
- **Assumption audit (ongoing)** - every `ASSUMPTION` carried in from earlier stages; Growth validates, invalidates, or supersedes them with `DATA`. Superseded assumptions trigger a new ADR in the wiki.
- **Product and growth levers** - highest-leverage improvements to the offering, onboarding, retention, or distribution (beyond the prepared campaign)
- **Iteration backlog** - new ideas or improvements generated from real-world use
- **Growth experiments** - specific hypotheses to test (often product- or funnel-shaped), with expected outcomes. Each experiment is itself an incremental slice per `rules/incremental-execution.md`: a thin vertical test with explicit acceptance criteria, a verification plan, and a recorded result.
- **Incident triage (when needed)** - any defect, regression, or outage goes through the five-step triage: reproduce, localize, reduce, fix root cause, guard against recurrence. Captured as its own slice.
- **Scaling plan** - when and how to increase investment if signals are positive

**Customer discovery in Growth:** Real-world use generates new questions. Use the Outreach Engine framework (Finder, Opener, Guide, Synthesizer) to run fresh conversation rounds focused on retention, expansion, or new segments. Post-product outreach focuses on fit and switching criteria rather than problem validation.

**Rules to load:** `rules/evidence-and-verification.md` (no improvement claims without baselines), `rules/incremental-execution.md` (experiments as slices), `rules/decision-records.md` (reversed or superseded decisions get new ADRs), `rules/red-flags.md`.

**Agent profiles to run:** `evaluator` for every experiment's verification coverage; `risk-auditor` when new risk surfaces (new integration, new market, new data type).

**Wiki domains to load and update:** All domains may be updated during Growth. User feedback updates `customers/`. Competitive responses update `market/`. Lessons learned update `strategy/` and `operations/`. Validated or invalidated assumptions update the pages where those assumptions were recorded. New ideas generated should be added to that initiative’s `ideas.md` as `Backlog` entries under the right **project**.

**How Growth works:**
Growth is the only stage that loops. Each growth experiment can be treated as a mini-lifecycle of its own (brief → build slice → evaluate). Smaller experiments may use that short path on purpose. Larger bets should re-enter at Brief or Research so the full pipeline stays honest. Significant new directions may become entirely new rows in `ideas.md`.

**This stage has no terminal approval gate.** It continues until the initiative is retired, the idea is folded into something larger, or is deliberately wound down.

---

## Moving to On Hold or Dropped

An idea can move to either of these states from any stage.

**On Hold:** The idea is paused. Add a note in that initiative’s `ideas.md` with the reason and date. Resume at any time by telling The Agent to pick it back up.

**Dropped:** The idea is killed. Move it to the **Dropped** section in `ideas.md` with the reason. Dropped ideas stay on file for reference. They may be relevant later or inform future decisions.

---

## Stage Summary Table


| Stage             | Status Label   | Key Artifact                                                                  | Rules most relevant                                                                    | Specialist profiles at gate                              | Wiki Domains                                                                          | Approval Question                                              |
| ----------------- | -------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 0 – Capture       | `Backlog`      | Entry in `priorities.json`                                                | —                                                                                      | —                                                        | —                                                                                     | N/A - owned by you                                             |
| 1 – Brief         | `Brief`        | `01_brief.md`                                                                 | context-engineering, evidence                                                          | —                                                        | identity, customers / audience                                                        | Is this worth pressure-testing (or waived)?                    |
| 2 – Pressure Test | `PressureTest` | `02_pressure_test.md`                                                         | evidence, anti-rationalization, red-flags                                              | —                                                        | market, customers / audience, offerings, identity (+ `[USER.md](USER.md)`)            | Are we honest about risks and next experiments?                |
| 3 – Research      | `Research`     | `02_market_research.md` + `02b_customer_discovery.md`                         | evidence, context-engineering                                                          | evaluator (on synthesis if called)                       | market, customers / audience                                                          | Is the opportunity real + do people confirm it?                |
| 4 – PRD           | `PRD`          | `03_prd.md`                                                                   | evidence, decision-records, anti-rationalization                                       | —                                                        | customers / audience, market, identity (+ offerings when relevant)                    | Is this ready to build? Does every criterion have verification? |
| 5 – Design        | `Design`       | `04_design.md`                                                                | decision-records, incremental-execution, evidence                                      | —                                                        | operations                                                                            | Is the approach sound and vertically sliceable?                |
| 6a – Build Plan   | `Build`        | `05_build_plan.md`                                                            | incremental-execution, evidence, context-engineering                                   | evaluator                                                | operations                                                                            | Are slices small, verifiable, and ordered correctly?            |
| 6b – Slices       | `Build`        | `05_build/slices/` + `verification_log.md` + `decisions.md`                   | incremental-execution, evidence, decision-records, red-flags                           | —                                                        | operations                                                                            | (per-checkpoint mini-gates)                                    |
| 6c – Build Review | `Build`        | `05_build/README.md` (Build Review section)                                   | evidence, anti-rationalization                                                         | quality-reviewer, evaluator, risk-auditor (when applicable) | operations                                                                            | Is the Build verified, reviewed, and ready for Evaluation?     |
| 7 – Evaluation    | `Evaluation`   | `06_evaluation.md`                                                            | evidence, red-flags, anti-rationalization                                              | quality-reviewer, evaluator, risk-auditor (when applicable) | — (updates where external reaction applies)                                            | Is this ready to ship?                                         |
| 8 – Launch        | `Launch`       | `07_launch_plan.md`                                                           | incremental-execution, decision-records, red-flags                                     | risk-auditor                                             | identity, customers / audience, strategy                                              | Is the rollout staged, monitored, and reversible?              |
| 9 – Marketing     | `Marketing`    | `08_marketing_pack.md`                                                        | evidence, context-engineering                                                          | quality-reviewer, risk-auditor (conditional)             | identity, customers / audience, market, strategy (+ publishing for creative)          | Ready to execute the checklist yourself?                       |
| 10 – Growth       | `Growth`       | `09_growth_log.md`                                                            | evidence, incremental-execution, decision-records, red-flags                           | evaluator, risk-auditor (when new risk appears)          | all domains (see [Wiki domains by initiative type](#wiki-domains-by-initiative-type)) | Ongoing - no terminal gate                                     |


`In Review` is not a numbered stage. It marks a **waiting state** between stages when deliverables are ready and you have not approved the next step. **Elaboration** for thin ideas uses the same approval pattern and may occur before Stage 1.

Build sub-phases (6a, 6b, 6c) all share the same **`Build`** status label in `ideas.md`. Use **Notes** on the idea row to record which sub-phase is in progress.

Personal brand initiatives use `audience/` instead of `customers/`. Creative initiatives map columns to their wiki as described in that section.

---

## Advanced techniques (optional prompts)

Use these at checkpoints when stakes are high or analysis feels too comfortable.

**Adversarial prompting.** After a draft, ask for the strongest case **against** the plan. Example: “What would a skeptical investor say is wrong? What are we missing or overweighting?” The Pressure Test stage bakes this in; use ad-hoc adversarial prompting mid-Build or mid-Marketing when things feel too smooth.

**Persona shifting.** Ask for the same artifact through two or three lenses (for example bootstrap founder, experienced buyer, well-funded competitor). The specialist agent profiles in `agents/` are a structured form of this.

**Evidence grounding.** Tag claims as `DATA`, `INFERENCE`, `ASSUMPTION`, or `SPECULATION` per `rules/evidence-and-verification.md`.

**Iterative deepening.** When a single point drives the decision, ask what would make it true or false, what evidence to collect, and what second-order effects follow.

**Synthesis checkpoints.** Before leaving a major section, capture 3–5 bullets that must carry forward so the next step does not lose the thread.
