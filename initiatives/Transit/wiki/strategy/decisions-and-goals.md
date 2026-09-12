---
domain: strategy
type: reference
status: Active
created: 2026-09-08
modified: 2026-09-12
---

# Strategy — goals & decisions log (Transit)

## Goal

Ship at least one real, working idea from this initiative rather than accumulating unshipped ideas on the board. One Bus Ride is the first idea to reach Launch/Growth.

## Key decisions (ADR index)

- **ADR-transit-20260911-01** — vanilla stack, no build step. `One bus ride/05_build/decisions.md`.
- **ADR-transit-20260911-02** — content/code separation via `stops.json`. `One bus ride/05_build/decisions.md`.
- **ADR-transit-20260911-03** — minimal privacy-respecting analytics. `One bus ride/05_build/decisions.md`.

## Lessons learned

- A tightly bounded idea (one route, one page, no live data) was fast to validate and fast to ship — worth defaulting to this shape for the initiative's next few ideas rather than starting broad.
- Customer discovery surfaced real, specific pushback (2 of 10 questioned the corridor and the frame itself) that desk research alone would have missed — worth continuing to run full 10-conversation discovery even for small ideas.

## Long-term bet (open)

Whether "one bus ride" generalizes past the 801's unusually well-shaped corridor to other routes or cities is explicitly undecided — see `One bus ride/09_growth_log.md`, Experiment 1. Do not treat generalization as a foregone conclusion in future planning until that experiment concludes.
