---
status: Approved
stage: Build
created: 2026-09-11
approved: 2026-09-11
---

# Build Plan — One Bus Ride

**Design:** [04_design.md](04_design.md)

## Overview

Build a static, no-backend web app that turns a direction + start stop + time budget into a printable, shareable one-ride itinerary for MetroRapid 801, per `03_prd.md` and `04_design.md`. Four thin, sequential slices, two checkpoints.

## Architecture decisions carried forward

- **ADR-transit-20260911-01** — vanilla HTML/CSS/JS, no framework or build step.
- **ADR-transit-20260911-02** — corridor content lives in `stops.json`, separate from app logic.
- **ADR-transit-20260911-03** — minimal, privacy-respecting pageview counter instead of no analytics or a full backend.

Full records in `05_build/decisions.md`.

## Task list

## Task 1: Data model and stops.json

**Description:** Author `outputs/app/stops.json` per the Design schema — six stops, north-to-south order, each with at least one point of interest, plus a top-level `lastVerified` date.

**Acceptance criteria:**
- [ ] File is valid JSON.
- [ ] Every stop has at least one POI with `name`, `category`, `walkMinutes`, `description`.
- [ ] Top-level `lastVerified` date is present.

**Verification:**
- [ ] JSON parses without error (scripted check).
- [ ] Manual review against Design's schema.

**Dependencies:** None

**Files or artifacts likely touched:**
- `outputs/app/stops.json`

**Estimated scope:** S (1 file)

## Task 2: Itinerary engine and core UI render

**Description:** Build `index.html` (controls + render target) and `app.js` (load `stops.json`, compute board/alight stop from direction + start + budget, render the plan). This is the end-to-end core of the product.

**Acceptance criteria:**
- [ ] Every combination of direction × start stop × budget produces a valid, in-bounds itinerary with at least one POI (AC-01).
- [ ] Alight stop is correctly clamped at either end of the corridor rather than erroring.
- [ ] "Surprise me" produces a valid random combination (FR-9).

**Verification:**
- [ ] Scripted sweep of all direction/start/budget combinations, asserting a valid result for each (AC-01).
- [ ] Manual click-through of "Surprise me" ten times, confirming no invalid state.

**Dependencies:** Task 1

**Files or artifacts likely touched:**
- `outputs/app/index.html`
- `outputs/app/app.js`

**Estimated scope:** M (2 files)

## Checkpoint A — Core itinerary engine works end-to-end

**Scope:** Tasks 1–2 finished; picking a direction, start stop, and budget reliably produces a correct, on-screen itinerary for every valid input.

**Hard stop for agents:** End here. Do not start Task 3 in this session unless the user explicitly continues past Checkpoint A.

**Closure checklist:**

- [ ] `05_build/verification_log.md` — Tasks 1–2 verified this session.
- [ ] `priorities.json` — Transit > One bus ride > One bus ride entry updated (`lifecycle`, `lastUpdated`, `notes` with **Next:** Task 3, and the `checkpoint` object set to Checkpoint A).
- [ ] `wiki/log.md` — updated if wiki changed.

**Human / next session:** Continue to Task 3 once the core engine is confirmed correct.

## Task 3: Print stylesheet and shareable URL params

**Description:** Add `styles.css` print rules so the rendered plan fits one printed page with controls hidden, and add URL query-param read/write to `app.js` so a link reproduces the exact plan.

**Acceptance criteria:**
- [ ] Printed output is exactly one page at 8.5x11 with controls hidden (AC-02).
- [ ] Opening a generated share URL fresh reproduces the identical plan (AC-03).

**Verification:**
- [ ] Manual print-preview check across all three budgets.
- [ ] Round-trip test: generate a URL, open in a fresh context, compare rendered plan.

**Dependencies:** Task 2

**Files or artifacts likely touched:**
- `outputs/app/styles.css`
- `outputs/app/app.js`

**Estimated scope:** S (2 files, small addition to each)

## Task 4: Accessibility, legal/disclaimer footer, and analytics

**Description:** Add the `<noscript>` fallback itinerary, the CapMetro disclaimer/link footer, contrast-checked styling, basic OG/share meta tags, and the minimal pageview counter from ADR-transit-20260911-03.

**Acceptance criteria:**
- [ ] Disclaimer and CapMetro link visible without scrolling on a mobile viewport (AC-04).
- [ ] Primary text/background contrast passes WCAG AA (AC-06).
- [ ] Page shows a usable default itinerary with JavaScript disabled (AC-07).
- [ ] Keyword scan finds no private/partner/confidential names (AC-08).
- [ ] OG/share meta tags present (FR-10).

**Verification:**
- [ ] Manual mobile-viewport check.
- [ ] Contrast ratio calculation against the chosen palette.
- [ ] Manual check with scripting disabled.
- [ ] Grep sweep for forbidden names.

**Dependencies:** Task 3

**Files or artifacts likely touched:**
- `outputs/app/index.html`
- `outputs/app/styles.css`
- `outputs/app/og-image.svg`

**Estimated scope:** M (3 files)

## Checkpoint B — Launch-ready

**Scope:** Tasks 1–4 finished; every PRD acceptance criterion has a recorded verification result.

**Hard stop for agents:** End here. Build Review (6c) runs before Evaluation begins — do not skip straight to Evaluation.

**Closure checklist:**

- [ ] `05_build/verification_log.md` — Tasks 3–4 verified this session.
- [ ] `05_build/README.md` — Build Review results recorded.
- [ ] `priorities.json` — Transit > One bus ride > One bus ride entry updated (`lifecycle`, `lastUpdated`, `notes` with **Next:** Evaluation, and the `checkpoint` object set to Checkpoint B).
- [ ] `wiki/log.md` — updated if wiki changed.

**Human / next session:** Proceed to `06_evaluation.md`.

## Risks and mitigations

Carried from Design, mapped to slices: stale content → Task 1 (`lastVerified` field, content/code separation); JS-disabled visitors → Task 4 (noscript fallback); no usage signal for Growth → Task 4 (analytics ADR); CapMetro exposure → Task 4 (disclaimer/footer).

## Open questions

Carried from PRD (corridor choice, no-live-data trust, category fit) — none block Build; all are Growth/Evaluation-stage questions, not implementation blockers.

## Parallelization notes

Mostly sequential — Task 1 blocks everything else, and each subsequent task builds on the prior task's files. No safe parallelization opportunities at this scope; splitting further would create more coordination overhead than it saves.
