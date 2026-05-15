# Evidence and Verification

**The single most important rule in this system.** "Seems right" is never sufficient. Every claim that drives a decision, every artifact that moves a stage forward, and every approval gate must be backed by evidence and explicit verification. If you cannot show your work, it did not happen.

## When this rule bites

Every stage, but especially:

- **Research** — claims about market, competitors, or customer pain
- **PRD** — user stories and acceptance criteria drawn from conversations
- **Design** — architectural choices made under uncertainty
- **Build** — every slice must be verified before the next one begins
- **Evaluation** — go/no-go is an evidence judgment, not an intuition
- **Growth** — "we learned that…" claims must be traceable to data or conversations

## Evidence labels

When a claim drives a decision, tag it:

| Label | Meaning | When to use |
|---|---|---|
| `DATA` | Grounded in a cited source, measurement, or search result | Market size, competitor pricing, metrics, cited quotes |
| `INFERENCE` | A reasonable conclusion drawn from evidence that exists | "Therefore customers likely…" — follows from DATA above it |
| `ASSUMPTION` | Plausible but not yet verified; flagged for later validation | "We assume buyers are willing to pay $X" before customer discovery |
| `SPECULATION` | Could be wrong; included because it changes the plan if true | "What if the market shifts toward…" |

Use these labels inline in any analytical artifact (`02_market_research.md`, `02b_customer_discovery.md`, `03_prd.md`, `06_evaluation.md`, `09_growth_log.md`) where strategy depends on the strength of the claim.

The wiki's `market/` and `customers/` pages also use these labels on claim-level statements. Validated pages mark validated knowledge; assumptions are separated visibly.

## Verification, not "seems right"

Every artifact has one or more **verification questions** the gate must answer yes to. Examples:

| Artifact | Verification questions |
|---|---|
| `01_brief.md` | Does every open question have an owner and a way to answer it? Is the success criterion measurable? |
| `02_market_research.md` | Is every `DATA` claim sourced? Are the sources primary where that matters? |
| `02b_customer_discovery.md` | Do at least 5 conversations support the pattern synthesis? Are quotes preserved verbatim? |
| `03_prd.md` | Does every acceptance criterion have a verification method (test, review, demo)? |
| `05_build/` per slice | Did the slice's acceptance criteria pass? Is the evidence captured in `verification_log.md`? |
| `06_evaluation.md` | Does each P0 criterion from the PRD have a recorded pass/fail verdict with evidence? |
| `09_growth_log.md` | Is every "we learned…" statement traceable to a metric, conversation, or experiment? |

`IDEA_LIFECYCLE.md` lists the required verification per stage.

## Verification by domain

Verification means different things in different initiatives. Match the evidence to the claim.

| Initiative type | Strong evidence | Weak evidence |
|---|---|---|
| Software product | Passing tests, reproducible runs, instrumented metrics, user logs | "I looked at it and it seems right" |
| Novel | A trusted reader's specific reaction, line-by-line critique, a successful cold-read aloud | "I reread it and it sounded good" |
| Personal brand | Engagement metrics against a baseline, a specific quote from a real viewer, a portfolio test with target audience | "My friends liked it" |
| Marketing campaign | A/B test result on a real segment, response rate vs. prior benchmark, tracked UTM conversions | Author opinion about the copy |
| Business strategy | Primary-source market data, customer conversations with verbatim quotes, a pilot run | A whitepaper summary or a pundit's quote |

## Verification evidence log

For multi-slice work (Build, Growth experiments), maintain `verification_log.md` inside the work folder. One row per verification event:

```
| Date | Slice / item | What was verified | Method | Result | Notes / link |
```

This becomes the single source of truth for "what has actually been proven." Launch and Marketing read from it.

## The verification gate

At every approval gate, The Agent states:

1. What was produced
2. What was verified, and with what evidence
3. Any remaining `ASSUMPTION` or `SPECULATION` that the next stage must carry
4. The verification questions and explicit pass/fail for each

Skipping step 4 voids the gate. If you cannot answer a verification question, say so and flag it as a blocker — do not paper over it.

## Rationalizations

| Rationalization | Reality |
|---|---|
| "I'm confident — I've done this before" | Confidence without evidence is pattern-matching against a different situation. The current initiative still needs its own evidence. |
| "The evidence is obvious" | Then capture it. Thirty seconds of citation saves hours of re-litigation later. |
| "We don't have time to verify everything" | You don't have to verify everything — only the claims that drive the decision. Identify those and verify them. |
| "The user will catch it at the gate" | The user is the gate's second line of defense, not the first. The Agent produces verified work; the user confirms. |
| "The test is trivial, I'll skip recording it" | An unrecorded test is indistinguishable from no test. Record it. |

## Red flags

- An artifact declares a stage complete with no evidence log
- A claim labeled `DATA` has no source
- A PRD acceptance criterion cannot be verified except by "it looks right"
- Build slices move forward without a recorded pass in `verification_log.md`
- Growth retrospective claims improvements without a measurement baseline
- `ASSUMPTION` labels quietly disappear between stages without being validated or escalated

## See also

- [`anti-rationalization.md`](anti-rationalization.md) — full catalogue of shortcut excuses
- [`red-flags.md`](red-flags.md) — concrete trouble signals by stage
- [`decision-records.md`](decision-records.md) — how to capture the *why* behind a decision
- [`agents/evaluator.md`](../agents/evaluator.md) — the agent profile that audits verification
