---
status: Approved
stage: Brief
created: 2026-09-08
approved: 2026-09-08
deliverable_class: product
---

# Brief — One Bus Ride

**Initiative:** Transit · **Project:** One bus ride
**One-liner:** A free, no-login, single-page web app that turns one ride on CapMetro's MetroRapid 801 into a complete, already-planned half-day outing — board here, ride this far, do these things, catch the bus back.

## Problem

Someone without a car in Austin — a new transplant renting near a frequent route before they own a car, someone hosting a visiting friend for an afternoon, a student who wants a change of scenery — has an afternoon and one bus line, and no easy way to turn that into a plan. Their choices today are a general-purpose trip planner (Google Maps, Citymapper, the CapMetro app) that assumes they already know where they're going, or a "things to do in Austin" list that ignores whether any of it is reachable without a car. Neither answers the actual question: *what can I do with just one bus ride?*

## Hypothesis

If we constrain the problem to exactly one ride on one well-known, high-frequency corridor, we can hand someone a complete, printable plan in under two minutes — and that constraint (one route, no live data, no account) is what makes the plan fast to trust and fast to use, not a limitation to apologize for.

## Target audience

Car-free or car-light people in Austin, in roughly this order of priority:

1. **New transplants** who've moved near the MetroRapid 801 corridor before buying a car or learning the city.
2. **Hosts** with a visiting friend or family member and an afternoon to fill without renting a car.
3. **Budget-conscious students and riders** (UT-adjacent) who already ride the 801 for other reasons and want a reason to get off somewhere new.

## Why now

CapMetro's frequency and awareness investment along the MetroRapid network has increased over the past two years (`INFERENCE` — first-hand knowledge of CapMetro's public route promotion; not independently sourced yet, see Research), which plausibly means more first-time and infrequent riders are already on this exact corridor. Separately, the 801 corridor (North Lamar → downtown → South Congress) already strings together a dense, walkable set of well-known destinations end to end — the corridor's own shape does most of the "itinerary" work, which is unusual and worth exploiting before designing for a second, less naturally-shaped route. Transit is also an initiative with ideas on the board but nothing shipped yet; this is deliberately small enough to actually ship.

## Success criteria

- A working, deployed static app (no backend, no login) that generates a valid itinerary for both directions and at least three time budgets.
- In a discovery/test round of at least 10 people, at least 6 complete a plan without help in under two minutes.
- At least 5 of those 10 say they would actually use the resulting plan for a real outing (not just "neat idea").
- Zero private, partner, or confidential data anywhere in the artifact — public schedule facts and public points of interest only.

## Out of scope

Live GTFS/real-time arrival data, other CapMetro routes, ticketing or payment, user accounts, other cities, and an independent accessibility audit of CapMetro's vehicles or stops (we link out to CapMetro's own accessibility information rather than re-deriving it).

## Rough effort estimate

Days, not weeks. One person, static front-end only, no backend to stand up.

## Open questions

1. Is MetroRapid 801 actually the strongest pilot corridor, or would a shorter or more scenic route (for example, one that touches Lady Bird Lake) prove the "one ride" concept faster?
2. Does the absence of live arrival data become a trust-killer once someone is standing at a stop, or is "check CapMetro for today's times" an acceptable seam?
3. Does "one bus ride" read as a real category to people, or do discovery conversations show they just want a slightly-curated map?
4. Is public-schedule-based, non-commercial content squarely fine to publish without CapMetro's involvement, or is a lightweight fact-check/outreach worth doing before Launch?
5. If this works, does the concept generalize to other single "signature" routes or cities, or is the Austin/801 pairing a one-off that doesn't repeat?

None of these block starting Pressure Test — they're exactly the kind of question Pressure Test and Research exist to narrow.

## Recommendation

Worth a fast Pressure Test and a bounded Research pass before committing build time. The idea is cheap to validate and cheap to kill if wrong, which is the right shape of bet for this initiative right now.
