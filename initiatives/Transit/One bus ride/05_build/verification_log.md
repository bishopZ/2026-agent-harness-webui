# Verification Log — One Bus Ride

One row per verification event. Method matches the acceptance criterion's specified verification method in `03_prd.md`.

| Date | Slice / item | What was verified | Method | Result | Notes / evidence |
|---|---|---|---|---|---|
| 2026-09-11 | Task 1 | `stops.json` is valid JSON with 6 stops, each with ≥1 POI, plus a `lastVerified` field | Test (script) | PASS | `python3 -c "import json; json.load(open('stops.json'))"` — parses clean; schema spot-check confirmed all fields present. |
| 2026-09-11 | Task 1 | Manual review against Design's data schema | Review | PASS | Field names, nesting, and north-to-south stop order match `04_design.md`. |
| 2026-09-11 | Task 2 / AC-01 | Every direction × start stop × budget combination produces a valid, in-bounds itinerary with ≥1 POI | Test (scripted sweep) | PASS | 36 combinations (2 directions × 6 stops × 3 budgets) checked via Node script against `app.js`'s `buildPlan`; 0 failures. Alight index correctly clamps at both corridor ends. |
| 2026-09-11 | Task 2 | "Surprise me" produces a valid random combination | Demo (manual, 10 clicks) | PASS | All 10 manual clicks produced a rendered plan with no invalid state; relies on the same `buildPlan` path already covered by the AC-01 sweep. |
| 2026-09-11 | Task 3 / AC-03 | A generated share URL, opened fresh, reproduces the identical plan | Test (round-trip script) | PASS | Node script encodes a selection to `?dir=&start=&budget=`, decodes it back, and confirms the resulting plan object is identical. |
| 2026-09-11 | Task 3 / AC-02 | Printed plan fits one page at 8.5x11 with controls hidden | Demo (manual print-preview check) | PASS | Print stylesheet hides `form`, `header .tagline`, and the analytics/meta line; only the itinerary and the core disclaimer line render. Checked across all three budgets in print preview. |
| 2026-09-11 | Task 4 / AC-04 | Disclaimer and CapMetro link visible without scrolling on a mobile viewport | Review (manual, 375px-wide layout) | PASS | Footer sits directly below the itinerary card; at the default "medium" budget the full page (including footer) fits without scrolling on a 375×667 viewport. |
| 2026-09-11 | Task 4 / AC-05 | Stop/POI content changes require editing only the data file | Review (code inspection) | PASS | `app.js` and `index.html` contain no stop or POI names, categories, or descriptions — all content is read from `stops.json` at runtime. |
| 2026-09-11 | Task 4 / AC-06 | Primary text/background contrast passes WCAG AA | Test (contrast ratio calculation) | PASS | Computed via the WCAG relative-luminance formula: ink-on-paper 16.96:1, muted-on-paper 7.50:1, button text 7.89:1 — all exceed the 4.5:1 AA threshold for normal text. |
| 2026-09-11 | Task 4 / AC-07 | Page shows a usable default itinerary with JavaScript disabled | Demo (manual, scripting disabled) | PASS | `<noscript>` block in `index.html` renders a complete default itinerary (Crestview → South Congress) independent of `app.js`. |
| 2026-09-11 | Task 4 / AC-08 | Keyword scan finds no private, partner, or confidential names | Test (grep sweep) | PASS | `grep -rniE` sweep of the full idea folder for owner, initiative, and unrelated-project names returned zero matches. |
| 2026-09-11 | Task 4 / FR-10 | OG/share meta tags present | Review (code inspection) | PASS | `og:title`, `og:description`, `og:image`, `og:type` present in `index.html` `<head>`. |
