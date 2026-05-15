# Anti-Rationalization

A catalogue of the excuses that agents and humans use to skip discipline, matched with the counter-argument that defeats each one. Read this before every approval gate. If the current gate rests on any of the rationalizations below, treat the gate as unsatisfied and go back a step.

The value of this file is in making the reasoning explicit. Rationalizations work when they stay unspoken. Writing them down neutralizes most of their pull.

## Why this rule exists

Every step in this system has a shortcut. Skipping the shortcut looks fine in the moment — the Brief is drafted, the research is synthesized, the Build is claimed complete, the Launch goes out. The cost shows up later, when a decision rests on an unverified assumption, or a chapter contradicts an earlier one, or the Growth metrics have no baseline to compare against.

Agents (human or AI) reach for the same five or six shortcuts every time. Naming them takes their power.

## Master catalogue

### On planning and process

| Rationalization | Reality |
|---|---|
| "I can hold it all in my head" | Context windows are finite — for AI and for humans. Written plans survive session boundaries and consolidation. |
| "The tasks are obvious" | Write them down anyway. Explicit tasks surface hidden dependencies and forgotten edge cases. |
| "Planning is overhead" | Planning *is* the task. Executing without a plan is not work, it is typing. |
| "I'll figure it out as I go" | That is how tangles form. Ten minutes of planning saves hours of rework. |
| "We can skip Pressure Test — this idea is obvious" | Then Pressure Test is short. It is still worth producing, because the one time you are wrong is the one time you needed it. |

### On evidence and verification

| Rationalization | Reality |
|---|---|
| "I'm confident — I've done this before" | Confidence without evidence is pattern-matching against a different situation. This initiative still needs its own evidence. |
| "It seems right" | "Seems right" is the first sentence of every regret. Verify. |
| "The evidence is obvious" | Capture it. Thirty seconds of citation prevents hours of relitigation. |
| "We'll verify it at the end" | Bugs and bad claims compound. Verify each slice as you go. |
| "The user will catch it at the gate" | The user is the gate's second line, not the first. The Agent produces verified work. |

### On scope and simplicity

| Rationalization | Reality |
|---|---|
| "I'll just clean up this adjacent thing while I'm here" | That is scope expansion. Log it — do not absorb it. |
| "I should build the abstraction now; we'll need it later" | Three copies is cheaper than a premature abstraction. Wait for the third use case. |
| "A generic solution is more future-proof" | Generic code solves imaginary problems with real complexity. Solve the actual problem first. |
| "The refactor is small enough to slip in" | Refactors mixed with features make both harder to review and debug. Split them. |
| "A config-driven approach is cleaner" | Sometimes. Usually it is displaced complexity. Start concrete; abstract only when the pattern is real. |

### On increments and saves

| Rationalization | Reality |
|---|---|
| "It's faster to do it all at once" | Until something breaks, and you cannot find which of 500 changed lines caused it. |
| "These pieces are too small to save separately" | Small saves are free. Large ones hide mistakes and make rollbacks painful. |
| "I'll commit at the end when it's all done" | If there is an "all done" coming, it is already too big. Slice it. |
| "The feature flag can come later" | If the work is not ready for users, it must not be user-visible. Add the flag now. |

### On reviews and gates

| Rationalization | Reality |
|---|---|
| "We don't have time to review" | A missed Critical finding costs more than the review would have. |
| "The changes are too small to need a review" | Then the review is small. It is still not optional at a gate. |
| "The reviewer always just approves anyway" | Then use a specialist profile (see [`agents/`](../agents)) that will actually push back. |
| "This launch is urgent; we'll skip the checklist" | Urgent launches are exactly when checklists earn their keep. |
| "We can audit risk after launch" | Risk audits after launch are retrospectives, not audits. Do the audit before. |

### On documentation and decisions

| Rationalization | Reality |
|---|---|
| "Everyone knows why we chose this" | Future you and a future agent do not. Write the ADR. |
| "We'll document it once it settles" | The context that drove the choice evaporates. Record it while the uncertainty is fresh. |
| "The reasoning is obvious from the artifact" | The artifact shows what. The ADR shows why, and what was rejected. |
| "Writing the reasoning down slows us down" | Not writing it down hides the fact that nobody actually knew why. That surfaces later at the worst time. |

### On customer and market claims

| Rationalization | Reality |
|---|---|
| "I talked to enough people — we don't need more" | Under 5 gives no signal. Under 10 gives shaky patterns. 10+ is the discipline. |
| "These personas are close enough to what we already have" | Then confirm by citing the specific conversation that supports them. If the citation does not exist, the persona is speculation. |
| "Our competitors aren't real competitors" | Someone is taking the attention or money you want. They are competition, even if they look different. |
| "The market is too big to size" | Then sketch a plausible range with the method shown. A range is not a guess — it is a bounded model. |

### On launches, marketing, and growth

| Rationalization | Reality |
|---|---|
| "The minimum narrative is fine for marketing" | Launch minimum narrative is for go-live only. Marketing pack is a separate, fuller pass. |
| "We don't need a rollback plan for this one" | You need it precisely when you believe you will not. |
| "The campaign looked great internally" | Internal opinion is not a market signal. Test externally. |
| "Growth numbers don't need a baseline — the direction is obvious" | No baseline means no direction. Direction requires a before-state. |
| "The assumption worked out; we don't need to update it" | Working once is an `INFERENCE`, not a `DATA` point. Label it honestly. |

### On wiki discipline

| Rationalization | Reality |
|---|---|
| "I'll just remember this; it doesn't need a wiki page" | Your future self is another person. Write it down. |
| "The wiki is for finished thinking" | The wiki is for durable thinking. Flag assumptions explicitly; do not wait until they are certain. |
| "We can skip the log entry for this update" | Unlogged updates create drift between index, log, and reality. Always log ingests, updates, lints, and inits. |

## Using this file at a gate

At every approval gate, ask:

1. Is any answer I'm about to give to a verification question resting on one of these rationalizations?
2. If yes, what evidence would defeat the rationalization?
3. Can I produce that evidence before the gate, or do I need to go back to the stage before?

If the answer to 3 is "go back," go back. Approval given on a rationalization is not approval — it is a promise to pay the cost later, with interest.

## See also

- [`evidence-and-verification.md`](evidence-and-verification.md)
- [`red-flags.md`](red-flags.md) — the concrete trouble signals that often follow a rationalization
- [`agents/`](../agents) — specialist profiles trained to push back when they smell a rationalization
