# Slice 3 — Print stylesheet and shareable URL params

**Task:** Task 3 in `05_build_plan.md`.

## What changed

Added `outputs/app/styles.css` print rules (`@media print`) that hide the form and non-essential chrome so only the generated itinerary and core disclaimer print. Extended `app.js` with `readParams`/`writeParams` so the current selection is reflected in the URL (`?dir=&start=&budget=`) and restored on load.

## Why

Directly answers two customer-discovery findings: Marcus (#2) wanted something he could text to a visiting friend (share links), and the one-page requirement traces back to the original Brief's success criteria for a bounded, low-effort artifact.
