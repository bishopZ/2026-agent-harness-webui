---
status: Approved
stage: Research
created: 2026-09-09
approved: 2026-09-09
---

# Research (Part 1: Market Research) — One Bus Ride

**Brief:** [01_brief.md](01_brief.md) · **Pressure Test:** [02_pressure_test.md](02_pressure_test.md) · **Customer Discovery:** [02b_customer_discovery.md](02b_customer_discovery.md)

## Competitive landscape

- **General-purpose trip planners** (Google Maps, Citymapper, the CapMetro app, Transit app) — `DATA`, well-known consumer products. All are comprehensive and live-data-backed, and all assume the user already knows their destination. None curate "what to do" content bound to a single ride.
- **Local "things to do" content** (city/tourism guides, neighborhood roundups) — `DATA` that this category of content exists broadly; it is organized by neighborhood or category, not by "one bus ride you can take right now," and doesn't account for whether a destination is reachable without a car.
- **CapMetro's own site** — `DATA` — publishes route maps and schedules but does not publish curated activity content along a route.

**Gap:** no product occupies "a single bounded outing, reachable by one ride, printable, zero setup." That is the wedge this idea is testing.

## Market size & dynamics

Sizing a "one bus ride guide" market directly isn't meaningful with public data at this scope. As a directional proxy only (`INFERENCE`, not a real TAM estimate): CapMetro's continued MetroRapid frequency investment plus Austin's ongoing inbound-transplant volume and large renter population near frequent corridors suggest a nontrivial and recurring population of car-light residents cycling through the exact situation this idea targets. Treat this as a reason the idea is worth testing cheaply, not as evidence the idea will work.

## User pain points

`ASSUMPTION` until customer discovery confirms with real quotes (see `02b_customer_discovery.md`): people new to a car-dependent-feeling city commonly default to either over-researching (comparing five neighborhoods and six routes before doing anything) or under-doing (staying in because assembling a plan feels like more effort than it's worth for a single afternoon). The friction is specifically in *bounding* the decision, not in a lack of available information — there is arguably too much information already.

## Gaps and opportunities

- Nobody occupies "single bounded outing, printable, zero setup" — general trip planners are the wrong shape and neighborhood guides are the wrong scope.
- A static, single-page result is inherently shareable as a link or a screenshot (a text-message or Slack-message artifact) in a way a trip-planner session is not.
- Content that is explicitly disclaimed as static and non-real-time sidesteps most of the trust risk a live-data competitor would have to solve — the differentiation is the constraint, not a data advantage.

## Analogous markets or models

Bounded "one perfect day" itinerary content is an established magazine/travel-content format that reliably finds an audience (`INFERENCE` — general knowledge of the travel content category, not primary research). It is aimed at a different moment (planning ahead for a trip) than this idea (an unplanned free afternoon, right now), but it is evidence that people respond well to a tightly bounded itinerary format specifically *because* it removes decisions, which is the same mechanism this idea is betting on at neighborhood scale.

## Key risks

Carried forward from Pressure Test (R1 stale content, R2 nobody asked for this, R3 scope creep, R4 CapMetro exposure), plus one new risk surfaced here: **corridor content ages when specific businesses close or move**, which is a design constraint, not just a market risk — the data model needs to make points of interest easy to update independently of the app's code, and should favor durable public landmarks and geographic areas over specific named businesses wherever the itinerary doesn't lose value by doing so.

## Data sufficiency

**PASS.** Public CapMetro 801 route/schedule material plus publicly known Austin landmarks and districts are sufficient for a v1. No partner data, private lists, or CapMetro-provided data are required.

## Research synthesis

The competitive gap is real and specific: nothing currently turns "I have one bus ride" into a bounded, printable plan. The risk is not that a better-resourced competitor already does this — it's that the underlying need (A1) may be thinner than it looks, or that people default to a general trip planner even when a bounded one exists (A2/A6). Both of those are now squarely customer-discovery questions, not desk-research questions, which is exactly why Research Part 2 carries the weight here. Proceeding to Part 2 with those two assumptions as the explicit target.
