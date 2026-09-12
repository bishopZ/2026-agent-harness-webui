---
status: Approved
stage: Design
created: 2026-09-11
approved: 2026-09-11
---

# Design — One Bus Ride

**PRD:** [03_prd.md](03_prd.md)

## Approach summary

Ship a static, single-page app: plain HTML/CSS/JavaScript, no framework, no build step, no backend. The corridor's stop and point-of-interest content lives in one JSON data file, separate from the app logic, so content can be updated without touching code (FR-8 / AC-05) and so the staleness risk from Research has a structural mitigation, not just a disclaimer. This also matches the harness's own "everything is a file" ethos — the app itself is a handful of files anyone can open, edit, and understand without installing anything.

## Architecture

```
outputs/app/
  index.html     - page shell, controls, itinerary render target, noscript fallback
  styles.css     - layout, mobile-first, print stylesheet
  app.js         - itinerary logic, URL param read/write, rendering
  stops.json     - corridor data: ordered stops, each with points of interest
  og-image.svg   - share-card image for social/chat previews
```

No server, no database, no build pipeline. Deployed as static files (see `07_launch_plan.md`).

## User / process flow

1. User opens the page. `app.js` fetches `stops.json`.
2. User picks a direction, a boarding stop, and a time budget — or clicks "Surprise me" for a random valid combination.
3. `app.js` computes the alight stop by walking the ordered stop list from the boarding stop, in the chosen direction, by an offset determined by the time budget, clamped to the corridor's bounds.
4. The app renders: board stop, ride direction, alight stop, the alight stop's points of interest, a return-trip note, and the static CapMetro disclaimer/link.
5. The current selection is written to the URL as query parameters (`?dir=&start=&budget=`) so the exact plan is shareable and reproducible (FR-7 / AC-03).
6. If JavaScript is disabled, a `<noscript>` block shows one hardcoded default itinerary (the original hand-written Southbound/North Lamar plan) so the page is never blank (NFR-6 / AC-07).
7. A dedicated print stylesheet hides the controls and shows only the rendered plan when printed (NFR-4 / AC-02).

## Technical stack or tooling

Vanilla HTML/CSS/JavaScript. See **ADR-transit-20260911-01** in `05_build/decisions.md` for why this was chosen over a framework/build-tooled approach.

## Data model

`stops.json`:

```json
{
  "corridor": "MetroRapid 801",
  "lastVerified": "2026-09-11",
  "stops": [
    {
      "id": "crestview",
      "name": "North Lamar & Justin Ln (Crestview)",
      "pois": [
        { "name": "Crestview/Brentwood neighborhood strip", "category": "shops & coffee", "walkMinutes": 5, "description": "A walkable stretch of small, independent shops, coffee, and record stores just off the corridor." }
      ]
    },
    { "id": "north-loop", "name": "North Loop", "pois": [ { "name": "North Loop shopping strip", "category": "shops & food", "walkMinutes": 4, "description": "A short, walkable strip of vintage shops and casual food just west of the stop." } ] },
    { "id": "ut-west-mall", "name": "Guadalupe & MLK (UT West Mall)", "pois": [ { "name": "University of Texas West Mall & Littlefield Fountain", "category": "public landmark", "walkMinutes": 6, "description": "Open, walkable university grounds with a well-known public fountain and mall." }, { "name": "Guadalupe St (\"The Drag\")", "category": "shops & food", "walkMinutes": 2, "description": "A dense strip of shops and casual food across from campus." } ] },
    { "id": "capitol", "name": "Congress Ave & 11th (Capitol)", "pois": [ { "name": "Texas State Capitol grounds", "category": "public landmark", "walkMinutes": 5, "description": "Public state capitol building and grounds, open for walking and self-guided viewing." }, { "name": "Congress Avenue Bridge", "category": "public landmark", "walkMinutes": 10, "description": "Public bridge over Lady Bird Lake, known for its evening bat colony in warmer months." } ] },
    { "id": "bouldin", "name": "South 1st & Bouldin", "pois": [ { "name": "Lady Bird Lake Hike-and-Bike Trail access", "category": "park", "walkMinutes": 6, "description": "Public trail along the lake, walkable in either direction with no set route required." } ] },
    { "id": "soco", "name": "South Congress (SoCo)", "pois": [ { "name": "South Congress Avenue", "category": "shops & food", "walkMinutes": 1, "description": "A well-known, walkable strip of shops, food, and street life on both sides of the avenue." } ] }
  ]
}
```

Stops are stored in a single north-to-south order; "Northbound" and "Southbound" walk the same array in opposite directions. Each POI carries `walkMinutes` from the stop rather than a fixed clock time, and the file carries a top-level `lastVerified` date so staleness is visible rather than hidden (mitigates R1 from Pressure Test/Research).

## Interfaces and integrations

None. No GTFS or live-data integration (explicit non-goal). The only outbound link is to CapMetro's public 801 schedule page, presented as "verify before you go," never as embedded live data.

## Build phases

Becomes the spine of `05_build_plan.md`:

1. Data model and `stops.json`.
2. Itinerary engine and core UI render.
3. Print stylesheet and shareable URL params.
4. Accessibility pass, legal/disclaimer footer, and minimal analytics.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| R1 stale content | Content lives in `stops.json` with a `lastVerified` date, separate from code; favors durable landmarks over specific named businesses where the itinerary doesn't lose value by doing so. |
| JS-disabled visitors get nothing (NFR-6) | `<noscript>` fallback itinerary hardcoded into `index.html`. |
| No backend means no usage data to support Growth's evidence requirements | **ADR-transit-20260911-03**: adopt a minimal, privacy-respecting, cookie-free pageview counter rather than shipping with zero signal or building a backend just to measure. |
| CapMetro accuracy/brand exposure (R4) | Visible disclaimer + outbound link only, no restated live times as fact. |

## Alternatives considered

- **React + a build step** — rejected. Adds a build pipeline and dependency surface the scope doesn't need, and contradicts the zero-install ethos this idea is explicitly testing for its own product category (see **ADR-transit-20260911-01**).
- **Server-rendered app with live GTFS integration** — rejected. Explicitly out of scope per the Brief's non-goals; a materially larger engineering lift with its own reliability and cost surface.
- **Ship with zero analytics** — rejected in favor of a minimal counter (**ADR-transit-20260911-03**); the evidence rule requires that "we learned X" claims in Growth be traceable to something, and qualitative feedback alone is thin for a public, unauthenticated tool.

Full ADRs are recorded in `05_build/decisions.md` at the start of Build.
