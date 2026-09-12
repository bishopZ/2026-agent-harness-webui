---
status: Approved
stage: PressureTest
created: 2026-09-08
approved: 2026-09-08
---

# Pressure Test — One Bus Ride

**Brief:** [01_brief.md](01_brief.md)

## Steel-man the other side

Google Maps, Citymapper, and CapMetro's own app already solve trip planning better than this ever will — they have live arrival data, every route, and turn-by-turn directions. A static hobby page with hand-entered stops and points of interest will look stale within a season: businesses close, a stop gets relocated for construction, a "walk five minutes to X" note goes wrong the day it matters most. Worse, the people who don't already have a plan for their afternoon may not be blocked on *information* at all — they may simply not want a content product, they want a friend's recommendation, or they weren't going to go out regardless. "One bus ride" could be a category that only makes sense to the person who thought of it.

There's also a real institutional-risk angle: content that reads as authoritative about a public transit agency's routes, without that agency's involvement, risks looking official when it isn't, and risks being wrong about something CapMetro would consider its responsibility to get right (schedules, stop locations, accessibility). And there's a scope-creep risk that shows up in almost every idea this initiative has looked at: "one ride, one page" is an easy line to draw today and an easy line to erode once someone asks "can it just also show the 803" or "can it show live arrivals."

## Assumption audit

| # | Assumption | Label | Notes |
|---|---|---|---|
| A1 | Car-free/car-light residents feel real, recurring friction turning "I have time + one bus line" into an actual plan | `ASSUMPTION` | This is the core bet. Untested until customer discovery. |
| A2 | A bounded, printable, single-ride plan is preferred over a flexible live trip planner for this specific low-stakes, low-planning-effort outing | `ASSUMPTION` | Distinct from A1 — A1 is "is there a problem," A2 is "is *this shape* of answer the right one." |
| A3 | Public CapMetro schedule and route information can be referenced and summarized in a non-commercial, clearly-unaffiliated project without needing CapMetro's sign-off | `INFERENCE` | Public agency schedules are routinely referenced by third-party apps and civic projects; not legal advice, and worth a lightweight fact-check before Launch (Brief open question 4). |
| A4 | Static, hand-curated stop and points-of-interest data stays useful for long enough (roughly two quarters) to be worth shipping a v1 without live data | `ASSUMPTION` | Directly drives the Design decision on how content is structured versus code. |
| A5 | MetroRapid 801 is a representative, well-suited corridor for this concept | `ASSUMPTION` | Carried from Brief open question 1; Research should look for a fast comparison, not necessarily resolve it before Build. |
| A6 | People will actually act on a printed or screenshotted plan rather than reopening a general trip planner once they're out the door | `ASSUMPTION` | If false, the "printable one-pager" requirement in the eventual PRD is solving the wrong problem. |
| A7 | This is buildable as a static, no-backend site in a few days by one person | `DATA` | A claim about our own capability and scope, not about the market — grounded in the concept's small, well-understood surface area (a handful of stops, no live integration). |

## Risks, in order

1. **R1 — Stale content erodes trust (HIGH likelihood, MEDIUM cost).** Points of interest and stop details drift out of date. Cheap to caveat ("verify before you go"), harder to fully prevent without maintenance.
2. **R2 — Nobody asked for this (MEDIUM likelihood, HIGH cost).** If A1/A2 are wrong, this is a well-built answer to a question nobody has, and the build time is a sunk cost the initiative can't easily recover.
3. **R3 — Scope creep into a full trip planner (MEDIUM likelihood, MEDIUM cost).** "Just one more route," "just add live times" are each individually reasonable and together undo the thing that makes this different from Google Maps.
4. **R4 — CapMetro brand or accuracy exposure (LOW likelihood, MEDIUM cost).** Mitigated by a clear "not affiliated with Capital Metro" disclaimer and linking out to CapMetro for anything time-sensitive, rather than restating it as fact.

## Next experiments

Ordered by how much they kill relative to effort, cheapest first.

- **E1 — Ten customer discovery conversations (next lifecycle stage, ~a few hours of outreach + calls).** Directly tests A1, A2, and A6 before any code is written. This is Research Part 2, not a separate side quest — calling it out here so Research is read as an experiment, not a formality.
- **E2 — Hand-draft one sample itinerary for the 801 and time a stranger reading it (under 1 hour).** Fast, cheap confirm/kill on A2: does a bounded one-ride plan actually read as "enough," or does it feel thin next to what a trip planner already gives you?
- **E3 — Quick corridor comparison note (under 1 hour, folded into Research).** Is there a materially better pilot corridor than the 801? Answers Brief open question 1 without blocking this pass — if the 801 is merely *fine* rather than *ideal*, that's still good enough to proceed.

## Waiver note

Not applicable — Pressure Test is not being waived for this idea.

## Recommendation

Proceed to Research. The risks are real but each has a fast, cheap next step, and none of them require build time to investigate.
