---
domain: operations
type: reference
status: Active
created: 2026-09-11
modified: 2026-09-12
---

# Build stack & hosting — One Bus Ride

Reusable operations reference for future Transit (and similar small static-product) ideas in this initiative.

**Stack:** vanilla HTML/CSS/JS, no framework, no build step (**ADR-transit-20260911-01**, full record in `One bus ride/05_build/decisions.md`). Chosen for a small, well-understood functional surface and to match the zero-install ethos this idea itself is testing.

**Content/code separation:** all route- or place-specific content lives in a dedicated JSON data file, never hardcoded into markup or app logic (**ADR-transit-20260911-02**). This is the standard mitigation this initiative should reach for whenever content staleness is a named risk.

**Analytics posture:** default to a minimal, cookie-free, no-personal-data pageview counter rather than either a full analytics suite or no signal at all (**ADR-transit-20260911-03**) — the evidence rule requires Growth-stage "we learned X" claims to be traceable to something, and qualitative feedback alone is thin for a public, unauthenticated tool.

**Hosting:** static files, no server. Feedback channel: GitHub Issues on the harness repo itself, rather than a form requiring a backend.

**Local tooling note:** a small `package.json` (`"type": "commonjs"`) may be needed inside a static app's own folder purely so Node's `require`/`module.exports` resolve correctly for verification scripts, when the repo root's own `package.json` declares `"type": "module"`. Browsers ignore this file; it exists only for testability.
