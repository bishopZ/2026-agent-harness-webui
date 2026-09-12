# Slice 2 — Itinerary engine and core UI render

**Task:** Task 2 in `05_build_plan.md`.

## What changed

Added `outputs/app/index.html` (controls + render target) and `outputs/app/app.js`: loads `stops.json`, computes an alight stop from a direction/start/budget selection via `computeAlightIndex` (clamped to the corridor's bounds), renders the resulting plan, and supports a "Surprise me" random-selection control.

## Why

This is the end-to-end core of the product — the first point where the app actually does the thing described in the Brief's one-liner. Everything in Slices 3–4 builds on this working core rather than changing it.

## Notes for future slices

`buildPlan` accepts an optional `stopsOverride` parameter (defaults to the loaded `STOPS.stops`) specifically so it can be exercised from a script without a browser DOM — this is what Slice 2's own verification sweep (see `evidence.md`) and any future automated test rely on. A local `package.json` (`"type": "commonjs"`) was added to `outputs/app/` purely so Node resolves `require`/`module.exports` correctly when running that sweep — the repo root's own `package.json` declares `"type": "module"`, which would otherwise make Node misinterpret this file. Browsers ignore this file entirely.
