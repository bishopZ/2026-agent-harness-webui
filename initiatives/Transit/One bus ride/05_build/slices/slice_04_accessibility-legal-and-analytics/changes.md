# Slice 4 — Accessibility, legal/disclaimer footer, and analytics

**Task:** Task 4 in `05_build_plan.md`.

## What changed

Added the `<noscript>` fallback itinerary, the CapMetro disclaimer/link footer, OG/share meta tags, an `og-image.svg` share card, and the minimal cookie-free pageview counter script from **ADR-transit-20260911-03**. Chose the color palette in `styles.css` against a contrast calculation rather than by eye.

## Why

This slice is where the idea's risk surface gets closed out before Evaluation: legal/brand exposure (R4), the JS-disabled dead-end (NFR-6), and the "no signal for Growth" gap identified in Design.

## Note on a finding fixed during this slice

An earlier draft of the footer disclosed the CapMetro caveat but not the analytics script. The Build Review (see `../README.md`) flagged this as a Medium risk-auditor finding (undisclosed tracking, however minimal) before Evaluation; it was fixed in this slice by adding the second footer line disclosing the pageview counter and its no-cookie/no-personal-data properties. Documented here rather than silently corrected, per the evidence-and-verification rule.
