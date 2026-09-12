---
status: Active
stage: Growth
created: 2026-09-12
---

# Growth Log — One Bus Ride

**Marketing Pack:** [08_marketing_pack.md](08_marketing_pack.md). This stage has no terminal approval gate (`IDEA_LIFECYCLE.md`, Stage 10) — it continues until the idea is retired or folded into something larger. This log is maintained as new entries, oldest first.

---

## Entry 1 — 2026-09-12 (go-live day)

### Launch and marketing retrospective

Go-live and the first marketing push both happened today, per `07_launch_plan.md` and `08_marketing_pack.md`. Being honest about what "retrospective" can mean on day zero: there is no week of usage to reflect on yet. What's true today: the app is live, all pre-launch checklist items are closed, and the initial share with the three Evaluation participants (Dana, Marcus, Renée) went out.

### Early metrics

None yet against the Brief's real-world success criterion ("at least one qualitative report of the plan being used for a real outing within the first month") — too early by definition. The GoatCounter pageview signal (`ADR-transit-20260911-03`) starts accumulating from today; first check-in against it is scheduled for Entry 2.

### User feedback summary

Only the Evaluation-stage feedback exists so far (Dana, Marcus, Renée — see `06_evaluation.md`). No new post-launch feedback yet; the r/Austin and community posts from the Marketing Pack's posting checklist go out this same window.

### Assumption audit (ongoing)

| # | Assumption | Status |
|---|---|---|
| A3 (public data referenceable without CapMetro sign-off) | Still `INFERENCE`. Lightweight fact-check (Launch pre-launch item) — record the outcome here once complete, whichever way it lands. |
| A4 (content stays useful ~2 quarters) | Still `ASSUMPTION` by construction — cannot be resolved before real time passes. First real checkpoint: 90 days from `lastVerified` (2026-09-11), i.e. mid-December 2026. |
| A5 (801 is a well-suited corridor) | Still `ASSUMPTION`, with two dissenting discovery voices. See Growth Experiment 1 below. |
| A6 (people act on a printed/shared plan) | `DATA` (partial, from Marcus's Evaluation reaction). Needs a real post-launch report to fully confirm — this is the same thing Brief success criterion 3 is waiting on. |

### Product and growth levers

- Renée's Evaluation-stage feedback (disclaimer visible but skippable) is a real, low-effort lever: make the "not live data" caveat harder to miss without needing a redesign.
- The quality-reviewer's Build Review suggestion (thin POI lists per stop) is a natural low-risk content lever — adding POIs is a `stops.json` edit, not a code change, by design (ADR-transit-20260911-02).

### Iteration backlog

1. Strengthen the disclaimer's visual prominence (from Renée's feedback, Evaluation).
2. Expand `stops.json` with additional POIs per stop as they're identified (from Build Review suggestion).
3. Revisit whether a short "lunch break" budget label change would help discoverability of the short option (Alicia, discovery #9, already covered by the existing "short" budget — this is a labeling question, not a missing feature).

### Growth experiments (queued, not yet run)

**Experiment 1 — Corridor fit check.** Hypothesis: MetroRapid 801 is at least as good a pilot corridor as any obvious alternative (addresses A5 and Brief open question 1, raised again by discovery #6 and #10). Plan: once real usage data exists (Entry 2 or later), compare qualitative reactions against a hand-sketched alternative corridor on paper — no code required for this experiment; if the 801 clearly wins, close A5 as `DATA`; if not, this is a candidate for a full new Brief rather than a quiet pivot, per `IDEA_LIFECYCLE.md`'s Growth guidance on larger bets re-entering at Brief. Acceptance criteria and a recorded result to be added when the experiment actually runs.

**Experiment 2 — Live-data trust probe.** Hypothesis: a stronger, more prominent static disclaimer resolves Renée-style trust concerns without needing real-time data (addresses Brief open question 2). Plan: ship the iteration-backlog item #1 above, then ask the same three Evaluation participants plus any real post-launch users whether the concern is resolved. Thin vertical slice, explicit acceptance criteria and verification plan to be written when scheduled.

### Incident triage

None to date.

### Scaling plan

Not yet triggered. Per the Brief, the "does this generalize to other routes or cities" question is explicitly a Growth-stage decision, not a Launch-stage one, and is exactly what Experiment 1 above is designed to inform. No investment increase is planned until real post-launch signal exists (Entry 2 onward) and/or Experiment 1 concludes.

---

*Next entry due after the first week of monitoring signals per `07_launch_plan.md`.*
