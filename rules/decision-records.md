# Decision Records

Document *why* — not only what. A Decision Record captures the context a choice was made under, the options considered, the option chosen, and the expected consequences. Decision Records are how this system keeps its judgment honest and makes future course-correction possible.

## When this rule bites

- **Design** — architectural choices, platform or tool selection, approach vs. alternatives
- **Build** — in-flight decisions that re-shape slices (we chose X over Y because…)
- **Launch** — rollout strategy, rollback triggers, release-notes reasoning
- **Growth** — experiment framing, assumption updates, scope changes
- **Wiki pages** — when a domain page records a strategic call

When not to use: trivial choices (naming a variable, picking a file name). If the choice reverses an earlier decision or locks in a direction, write a record.

## Where records live

**Per-idea decisions** — in the idea folder:
- `05_build/decisions.md` — ADRs produced during Build
- Individual stage artifacts embed small decision blocks inline (Design lists alternatives considered; Launch lists rollback triggers)

**Initiative-wide decisions** — in the wiki, under the most relevant domain:
- Business initiatives: `wiki/strategy/` for strategy, `wiki/operations/` for process
- Creative initiatives: `wiki/craft/` for process calls, `wiki/plot/` for narrative calls, `wiki/publishing/` for publishing strategy
- Personal brand: `wiki/strategy/` and `wiki/identity/`

Every decision record page has a unique ID in its frontmatter so other documents can cite it: `ADR-[initiative-slug]-YYYYMMDD-NN`.

## The record format

```markdown
---
id: ADR-t2m-20260417-01
domain: strategy
type: decision-record
status: Active        # Active | Superseded | Withdrawn
supersedes:           # optional: prior ADR ID this replaces
superseded-by:        # filled in if this is replaced later
created: 2026-04-17
modified: 2026-04-17
tags: [pricing, launch]
---

# [Short title of the decision]

## Context
What is the situation that forced this choice? What constraints apply?
What evidence or uncertainty informs it?

## Decision
The choice, in one or two sentences. Imperative voice.

## Alternatives considered
- **Option A** — what it would look like, why it was not chosen
- **Option B** — same
- **Option C** — same

## Consequences
- What becomes easier
- What becomes harder
- What we will know in 30 / 90 days that would tell us we chose well or poorly

## Evidence
`DATA` / `INFERENCE` / `ASSUMPTION` labels per
[`evidence-and-verification.md`](evidence-and-verification.md). Cite sources.

## Open questions
What do we still not know that could change this decision?
```

## When to write a record vs. an inline note

| Situation | Where it goes |
|---|---|
| Choosing an architecture, approach, or long-lived pattern | Dedicated ADR in `05_build/decisions.md` or the wiki |
| Choosing between two launch channels | Inline note in `07_launch_plan.md` — ADR only if it sets policy for future launches |
| Revising an earlier decision | New ADR that `supersedes:` the prior one. Never edit the prior one — mark it `status: Superseded` |
| A tiny preference (names, file layout) | Not a decision record. Convention in `00-how-to-use.md` or the wiki's relevant domain |

## Superseding vs. editing

Never rewrite an ADR to reflect a changed decision. Write a new ADR that `supersedes:` the old one, and update the old one's frontmatter with `superseded-by:` and `status: Superseded`. This preserves the record of what was believed when, which is the whole point.

## Decision records in non-software initiatives

Records work the same way across domains — they just change flavor.

| Initiative | Representative decision records |
|---|---|
| Software product | Tech stack, API shape, data model, auth approach, caching, rollout strategy |
| Novel | Narrative POV, tense, structural model, which influences anchor which sections, publishing path |
| Personal brand | Positioning statement, primary platform, content cadence, partnership posture |
| Meetup / event | Venue model, ticketing approach, sponsor posture, content format |
| Marketing campaign | Channel mix philosophy, voice posture, paid vs. organic balance, attribution model |

## Citing a decision record

Other artifacts cite decision records by ID:

> "See ADR-t2m-20260417-01 for the decision to target prosumers before enterprise."

This lets a reader trace any claim about direction back to the evidence and alternatives that shaped it.

## Rationalizations

| Rationalization | Reality |
|---|---|
| "Everyone knows why we chose this" | Future you and a future agent do not. Write it down. |
| "The reasoning is obvious from the artifact" | The artifact shows the what, not the alternatives considered. That is the valuable part of a decision record. |
| "We'll document it later once it settles" | The context that drove the choice evaporates. Record it while the uncertainty is fresh. |
| "It's not a big enough decision" | If it is worth an argument, it is worth an ADR. If it is small, the ADR is small too. |

## Red flags

- A Build milestone lands with no entries in `decisions.md` even though there were architectural choices
- An artifact reverses an earlier stage's direction with no ADR explaining the reversal
- Multiple stages cite "we decided…" without a traceable record
- An ADR is edited in place after the fact instead of being superseded
- Assumptions in a decision record are never revisited at Evaluation or Growth

## See also

- [`evidence-and-verification.md`](evidence-and-verification.md) — evidence labels used inside ADRs
- [`incremental-execution.md`](incremental-execution.md) — ADRs are common outputs of Build slices
- `SYSTEM_OVERVIEW.md` — wiki document standards (frontmatter, domains)
