# Red Flags

Concrete signals that something is going wrong right now, organized by stage. A red flag is not a nice-to-have check — it is a symptom that predicts failure if ignored. When The Agent sees a red flag, it should state it plainly in chat and pause for direction before continuing.

Read this file at the start of every stage. Re-read before every approval gate.

## Why this rule exists

Rationalizations ([`anti-rationalization.md`](anti-rationalization.md)) are the *excuses* for bad moves. Red flags are the *smells* of bad moves already in progress. Recognizing the smell earlier keeps the cost smaller.

## System-wide red flags (any stage)

- The Agent is producing output without having read the prior stage artifact
- Claims are stated without `DATA` / `INFERENCE` / `ASSUMPTION` / `SPECULATION` labels in a stage where they matter
- The Agent says "seems right" or "should be fine" where verification is the standard
- The output quality is visibly declining as the session gets longer, and no fresh session has been started
- A stage is advanced without the verification checklist being answered
- The wiki has been silent — no ingests, updates, or lint passes — for weeks despite active work
- The Agent is inventing sources, pages, or file names that do not exist in the repo

## Stage 1 — Brief

- Success criteria that cannot be measured ("users love it")
- Open Questions with no owner and no path to an answer
- Target audience is listed as a segment, not an actual describable person
- Recommendation is "maybe" or waffles across paragraphs — a real recommendation is a direction

## Stage 2 — Pressure Test

- The Pressure Test is waived silently — a waiver must be recorded in Notes, not assumed
- The adversarial pass is a single paragraph — a real pressure test surfaces multiple angles
- Next experiments are not named, or they would take months to run when weeks would do

## Stage 3 — Research

**Part 1 — Market:**
- Competitive landscape lists competitors without linking to specific sources
- Market sizing is a single number with no range and no method shown
- "Gaps and opportunities" read like marketing copy rather than evidence-backed observations

**Part 2 — Customer Discovery:**
- Fewer than 5 conversations before synthesis claims a pattern
- No verbatim quotes — only paraphrases
- All quotes come from one persona, and synthesis talks as if they speak for everyone
- The decision framework is filled in without the underlying evidence

## Stage 4 — PRD

- Acceptance criteria that cannot be verified except by "it looks right"
- User stories without a specific named persona drawn from customer discovery
- Success metrics that would move even if the feature failed
- Functional requirements with no priority labels (P0 / P1 / P2 missing)
- Open Questions that block Build listed casually rather than escalated

## Stage 5 — Design

- The approach is chosen with no alternatives considered, or alternatives listed without rationale for rejecting them
- No explicit risk register
- Build phases are "build everything" — horizontal not vertical
- Integrations named without owners on each end
- Decision Records are missing for choices that will be hard to reverse

## Stage 6 — Build

**During planning:**
- The Build Plan has fewer than three slices for a significant idea, or more than ten (at which point it is at the wrong granularity)
- A slice's acceptance criteria cannot be stated in three bullet points
- Slices are named with "and" in the title
- No checkpoints exist between phases
- Dependencies between slices are not identified

**During execution:**
- More than ~100 lines of code, or the equivalent volume in other media, produced without verification
- Multiple unrelated changes landing in one save-point
- "Let me just quickly add this too" — scope expansion during a slice
- Tests or verification skipped to move faster
- The system is broken between slices (build fails, tests fail, the narrative does not hold together)
- Large uncommitted / unsaved changes accumulating
- Abstractions being built before the third use case demands it
- Files or sections outside slice scope being edited "while I'm here"
- `verification_log.md` is missing rows for completed slices
- Decisions are being made that do not make it into `05_build/decisions.md`

## Stage 7 — Evaluation

- P0 acceptance criteria marked "met" without the evidence link
- No end-to-end test of the complete artifact (only per-slice verification)
- The go/no-go recommendation is "probably" — real recommendations have a direction
- The pre-launch checklist is aspirational rather than concrete
- Known issues listed without severity or remediation plan
- No specialist review (`quality-reviewer`, `evaluator`, `risk-auditor`) where the idea warranted one

## Stage 8 — Launch

- No rollback plan, or a rollback plan that is only a sentence
- Monitoring plan names no specific metric or owner
- Launch assets reference copy or imagery that does not yet exist
- Staged rollout collapsed into "launch everywhere at once" without rationale
- Release notes do not cite the ADRs that drove the big choices

## Stage 9 — Marketing

- Marketing copy contradicts the Brief's problem statement or the PRD's personas
- Claims in the pack are ungrounded — no tie to `verification_log.md` or the wiki
- Channels listed without rationale for priority order
- The posting checklist is not step-ordered and a human could not execute it in sequence
- The pack rebuilds work that already exists in the wiki — duplication rather than reuse

## Stage 10 — Growth

- Early metrics reported without a baseline for comparison
- "Improvements" claimed after a change with no instrumentation that could detect an improvement
- Assumptions from the PRD / Design are never revisited — no assumption audit
- The iteration backlog drifts away from PRD success metrics with no explanation
- The first-product retrospective is missing, even as experiments begin
- Growth experiments are treated as new stages without going back to Brief or at least a clear hypothesis

## How to raise a red flag

When The Agent sees a red flag, it says so in chat with this shape:

```
RED FLAG (Stage N): [name of the flag from this file]
Observed: [one sentence of what's actually happening]
Why this matters: [one sentence of the likely cost]
Proposed next step: [go back to previous stage / pause for user input / tighten scope]
```

Do not absorb the flag silently. Do not carry on past it. The whole point of the flag is that it looked like it would be fine if ignored.

## See also

- [`anti-rationalization.md`](anti-rationalization.md) — the excuses that usually precede a red flag
- [`evidence-and-verification.md`](evidence-and-verification.md) — the standard most red flags violate
- [`agents/`](../agents) — specialist profiles trained to surface these flags
