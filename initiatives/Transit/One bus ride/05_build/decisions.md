# Decision Records — One Bus Ride

---
id: ADR-transit-20260911-01
domain: operations
type: decision-record
status: Active
supersedes:
superseded-by:
created: 2026-09-11
modified: 2026-09-11
tags: [stack, build]
---

# Vanilla HTML/CSS/JS, no framework or build step

## Context

The PRD (NFR-1) requires the app to ship as static files with no backend and no required build step to run. The Brief's "why now" and the harness's own product philosophy both lean on zero-install as a differentiator. Effort budget is days, not weeks (Brief).

## Decision

Build `outputs/app/` as plain HTML, CSS, and vanilla JavaScript. No React, no bundler, no package.json for the app itself.

## Alternatives considered

- **React + Vite** — familiar, but adds a build pipeline and a dependency surface (node_modules, lockfile, build step) this scope doesn't need, and undercuts the zero-install positioning this idea is testing.
- **A tiny framework (Preact, Alpine.js via CDN)** — smaller than React, but still an external dependency for a UI simple enough not to need one (a handful of dropdowns and a render function).

## Consequences

- Easier: anyone can open, read, and edit the three source files without installing anything; hosting is "copy the files somewhere."
- Harder: state management is manual; acceptable at this scope (one selection object), would need revisiting if FR-11 (multi-corridor) is ever built out.
- In 30/90 days we'll know this was right if the app never needed a build step added to ship a fix.

## Evidence

`DATA` — the app's functional surface (three inputs, one derived output, one data file) is small enough that framework overhead is a cost without a corresponding benefit at this scope.

## Open questions

If FR-11 (a second corridor) is ever built, revisit whether manual state management still holds up, or whether a small state layer is warranted.

---

---
id: ADR-transit-20260911-02
domain: operations
type: decision-record
status: Active
supersedes:
superseded-by:
created: 2026-09-11
modified: 2026-09-11
tags: [data, content]
---

# Corridor content lives in stops.json, separate from app code

## Context

Research identified content staleness (specific points of interest closing or moving) as a real risk to a static, unmaintained artifact. FR-8 and AC-05 require content to be editable without touching app logic.

## Decision

All stop and point-of-interest content lives in `outputs/app/stops.json`, loaded at runtime by `app.js`. No stop or POI text is hardcoded into HTML or JS.

## Alternatives considered

- **Hardcode stops directly in `index.html`** — simplest to write once, but couples content edits to code edits and makes the `lastVerified` staleness signal meaningless (no single place to timestamp).
- **A CMS or headless data source** — would need a backend or a third-party service, contradicting ADR-transit-20260911-01 and NFR-1.

## Consequences

- Easier: updating a closed business or a changed stop is a one-file JSON edit, no code review of app logic required.
- Harder: requires a small amount of defensive code (handle malformed or missing fields) that hardcoding wouldn't.
- In 90 days we'll know this was right if a content update was ever made without touching `app.js` or `index.html`.

## Evidence

`INFERENCE` — following from the staleness risk identified in `02_market_research.md`, separating content from code is a standard mitigation for exactly this failure mode.

## Open questions

None blocking; revisit the schema if a second corridor (FR-11) is ever added.

---

---
id: ADR-transit-20260911-03
domain: operations
type: decision-record
status: Active
supersedes:
superseded-by:
created: 2026-09-11
modified: 2026-09-11
tags: [analytics, privacy, growth]
---

# Minimal, privacy-respecting pageview counter instead of no analytics

## Context

The app has no backend and no accounts by design (NFR-1). The evidence-and-verification rule requires that Growth-stage "we learned X" claims be traceable to a measurement or conversation, not intuition. With zero signal at all, Growth would have nothing but qualitative feedback to work from.

## Decision

Add one lightweight, cookie-free, no-personal-data pageview counter script (of the GoatCounter/Plausible class) to `index.html`, disclosed in the footer alongside the CapMetro disclaimer.

## Alternatives considered

- **No analytics at all** — simplest and most private, but leaves Growth with only anecdotal feedback, which the evidence rule treats as weak evidence for an "improvement" claim.
- **A full analytics suite (e.g., a cookie-based, ad-network-linked tool)** — rejected outright; disproportionate to a small civic tool and inconsistent with not collecting personal data from an unauthenticated public page.

## Consequences

- Easier: Growth can cite actual pageview trends instead of only qualitative reports.
- Harder: one more disclosure line is required in the footer, and one more (very small) external script is loaded.
- In 30 days we'll know this was right if pageview data actually informed a Growth-stage decision rather than sitting unused.

## Evidence

`ASSUMPTION` — that a pageview counter alone (without funnel or usage detail) will be sufficient signal for Growth's early questions. If Growth finds pageviews insufficient, this ADR should be revisited rather than silently supplemented with a heavier tool.

## Open questions

Which specific counter service to use is left as a Launch-time implementation detail; the requirement is the properties (no cookies, no personal data, disclosed), not a specific vendor.
