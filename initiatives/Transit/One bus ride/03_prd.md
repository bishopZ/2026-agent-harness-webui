---
status: Approved
stage: PRD
created: 2026-09-10
approved: 2026-09-10
deliverable_class: product
---

# PRD — One Bus Ride

**Brief:** [01_brief.md](01_brief.md) · **Pressure Test:** [02_pressure_test.md](02_pressure_test.md) · **Research:** [02_market_research.md](02_market_research.md), [02b_customer_discovery.md](02b_customer_discovery.md)

## Executive summary

One Bus Ride is a free, static, single-page web app for MetroRapid 801. A visitor picks a direction, a boarding stop, and a rough time budget; the app hands back a bounded, printable, shareable plan: board here, ride this far, do these things, catch the bus back. No account, no backend, no live data — the constraint is the product, per customer discovery (`02b_customer_discovery.md`, 8 of 10 conversations confirmed the core problem and 8 of 10 said they'd use or share the result).

## Goals and non-goals

**Goals:** ship a working v1 for both directions of the 801 with at least three time budgets; make the result printable and shareable via URL; make content (stops and points of interest) easy to update independently of the app's code, per the staleness risk identified in Research.

**Non-goals (carried from Brief):** live GTFS/real-time arrivals, other CapMetro routes, ticketing/payment, user accounts, other cities, an independent CapMetro accessibility audit.

## User personas

Drawn directly from customer discovery (`02b_customer_discovery.md`):

- **Dana (transplant)** — 29, moved to Austin 3 months ago, no car yet, already rides the 801 to commute but has never gotten off anywhere she didn't already have a destination (discovery #1).
- **Marcus (host)** — 34, hosts out-of-town friends often, currently defaults to driving them around because planning a car-free afternoon "feels like extra work" (discovery #2).
- **Priya (existing rider)** — 21, UT student, rides the 801 daily, has "always meant to get off somewhere new" but never had a reason to (discovery #3).

## User stories

1. As **Dana**, I want to pick a direction and how much time I have, so that I get a plan I can act on today without researching anything myself.
2. As **Marcus**, I want a one-page result I can text to a visiting friend, so that I don't have to build an itinerary myself.
3. As **Priya**, I want a plan that assumes I already know the route, so that it tells me where to get off, not how to ride a bus.
4. As **Alicia** (discovery #9, short fixed window), I want a short time-budget option, so that I can fit an outing into a lunch break and be back on time.
5. As any user, I want the plan to clearly say it isn't live data, so that I know to check CapMetro before I actually go (discovery #7).
6. As any user, I want a "surprise me" option, so that I don't have to make a direction/stop/budget decision myself if I don't want to.
7. As any user, I want to share a link that reproduces my exact plan, so that I can send it to someone else without re-entering choices.

## Functional requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-1 | User can choose a direction (Northbound: South Congress → downtown → North Lamar, or Southbound: North Lamar → downtown → South Congress). | P0 |
| FR-2 | User can choose a boarding stop from the corridor's defined stop list. | P0 |
| FR-3 | User can choose a time budget (Short / Medium / Long) that maps to how far from the boarding stop the alight stop is. | P0 |
| FR-4 | The app computes a valid plan (board stop, alight stop, walking suggestions at the alight stop) for any valid combination of direction, start stop, and budget, clamped to the corridor's length. | P0 |
| FR-5 | The generated plan renders as a single-page, print-friendly view (see NFR-4). | P0 |
| FR-6 | The app includes a visible, unmissable disclaimer that data is static and not live, with a link to CapMetro's own 801 schedule page. | P0 |
| FR-7 | The current selection (direction, start stop, budget) is reflected in the page URL via query parameters, so a link reproduces the same plan. | P0 |
| FR-8 | Stop and point-of-interest content lives in a separate data file, not hardcoded into markup or app logic, so it can be updated without touching code. | P0 |
| FR-9 | A "Surprise me" control picks a valid random direction/start/budget combination. | P1 |
| FR-10 | The page includes basic Open Graph / share meta tags so shared links render a title and description in chat apps. | P1 |
| FR-11 | Scaffold the data model so a second corridor could be added later without a redesign (no second corridor is built now). | P2 |

## Non-functional requirements

| ID | Requirement |
|---|---|
| NFR-1 | Ships as static files only — no backend, no build step required to run it, no user accounts. |
| NFR-2 | Works on a mobile viewport (device width ≥ 320px) as the primary target, since this is used while out and about. |
| NFR-3 | No third-party trackers beyond, at most, one privacy-respecting, cookie-free pageview counter (see Design ADR). |
| NFR-4 | The rendered plan fits on one printed page (8.5x11) via a dedicated print stylesheet. |
| NFR-5 | Primary text meets WCAG AA contrast against its background. |
| NFR-6 | The page remains usable with JavaScript disabled, via a static fallback itinerary. |

## Acceptance criteria

| AC | Criterion | Verification method |
|---|---|---|
| AC-01 | Every combination of direction × start stop × time budget produces a valid, in-bounds itinerary with at least one point of interest. | Test (scripted sweep of all combinations) |
| AC-02 | The rendered plan prints to exactly one page at 8.5x11. | Demo (manual print-preview check) |
| AC-03 | A generated share URL, opened fresh, reproduces the identical plan. | Test (round-trip check) |
| AC-04 | The static disclaimer and CapMetro link are present and visible without scrolling on a mobile viewport. | Review (manual, mobile viewport) |
| AC-05 | Stop/POI content changes require editing only the data file, not the app code. | Review (code inspection) |
| AC-06 | Primary text/background contrast passes WCAG AA. | Test (contrast ratio calculation) |
| AC-07 | With JavaScript disabled, the page still shows a usable default itinerary rather than a blank page. | Demo (manual check with scripting disabled) |
| AC-08 | Keyword scan finds no private, partner, or confidential names anywhere in the artifact. | Test (grep sweep) |

## Dependencies and assumptions

Carried forward from Pressure Test and Research with labels intact:

- A3 `INFERENCE` — public CapMetro schedule/route information can be referenced without CapMetro's sign-off; worth a lightweight fact-check before Launch, not yet fully validated.
- A4 `ASSUMPTION` — static content stays useful for roughly two quarters without maintenance; not yet tested by time passing.
- A5 `ASSUMPTION` — MetroRapid 801 is a representative, well-suited pilot corridor; two of ten discovery conversations questioned this directly (discovery #6, #10).
- A6 `ASSUMPTION` — people act on a printed/shared plan rather than reopening a general trip planner once out the door; discovery is directionally supportive (Marcus, #2) but not conclusively tested.

## Open questions

Carried forward, not resolved by this PRD:

1. Is 801 the strongest pilot corridor, or should Growth test an alternative (Brief Q1 / discovery #10)?
2. Does the no-live-data seam hold up in real use, or does it need a stronger caveat or a lighter live-data integration later (Brief Q2 / discovery #7)?
3. Does "one bus ride" hold up as a category on its own, distinct from "a neighborhood guide" (Brief Q3 / discovery #6)?
4. How do we measure the success metrics below without standing up a backend? (New — see Design ADR on analytics.)

## Timeline and milestones

Matches the Build Plan's checkpoints: Checkpoint A (core itinerary engine working end-to-end) after the data model and itinerary logic are built; Checkpoint B (Launch-ready) after print/share support and the accessibility/legal pass. Both targeted within the same short build window — see `05_build_plan.md`.

## Success metrics

- At least 5 of the original 10 discovery participants confirm they'd use or share the shipped result when shown the actual app (Evaluation, not just the concept).
- Zero reported factual errors about CapMetro schedules or stop locations in the first two weeks post-launch.
- At least one qualitative report of the plan actually being used for a real outing within the first month (tracked via the feedback channel in the Launch plan, since there is no backend to instrument usage directly).
