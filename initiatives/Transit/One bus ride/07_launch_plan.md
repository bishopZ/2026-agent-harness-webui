---
status: Approved
stage: Launch
created: 2026-09-12
approved: 2026-09-12
---

# Launch Plan — One Bus Ride

**Evaluation:** [06_evaluation.md](06_evaluation.md)

## Launch objectives

Ship v1 live at a public, static URL with the minimum messaging needed to make sense of it cold, and confirm nothing breaks in the first few days of real, unplanned use.

## Target audience and channels

Initial reach: the three discovery participants already engaged at Evaluation (Dana, Marcus, Renée), plus a single r/Austin post per the channel identified in customer discovery's Finder work. Wider channel plan lives in `08_marketing_pack.md`.

## Launch timeline

| When | Activity | Owner |
|---|---|---|
| Pre-launch | Swap placeholder GoatCounter site code for a real one; complete the A3 lightweight fact-check (confirm public CapMetro schedule pages remain freely referenceable) | Owner |
| Go-live | Publish `outputs/app/` as static files at the launch URL | Owner |
| Go-live +0 | Share directly with the three Evaluation participants | Owner |
| Go-live +1–2 days | Post to r/Austin per the channel plan | Owner |
| Go-live +1 week | First Growth-log check-in (see `09_growth_log.md`) | Owner |

## Messaging and positioning

Minimum go-live copy: **"One MetroRapid 801 ride, planned for you. Board here, ride this far, do these things, catch the bus back. Not affiliated with Capital Metro."** This is already the app's own header/tagline (see `outputs/app/index.html`) and needs no separate copy to go live — sustained campaign messaging lives in `08_marketing_pack.md`. Where messaging depends on a Build-time decision, it cites the relevant ADR: the "no live data" framing traces to **ADR-transit-20260911-02** and the Design non-goal on GTFS integration.

## Launch assets (blocking)

- [x] The app itself (`outputs/app/`), verified per `06_evaluation.md`.
- [ ] Real GoatCounter site code in place of the placeholder (owner action; see Risk Auditor finding in `05_build/README.md`).
- [ ] A3 lightweight fact-check completed and noted in `wiki/strategy/decisions-and-goals.md`.

## Release notes

v1: pick a direction, a boarding stop along MetroRapid 801, and a time budget (short/medium/long); get a printable, shareable one-page plan with a board stop, an alight stop, and nearby things to do. No live data, no account. Grounded in `05_build/decisions.md` (ADR-transit-20260911-01/02/03) and `05_build/verification_log.md`.

## Rollout plan

**Staged**, not full-launch, with rationale: this is a public-facing artifact citing a public transit agency's routes, and the one open assumption (A3) is about whether that's fully fine to do without CapMetro's sign-off. Staged rollout (a handful of known people, then one public post, then wider) gives room to react if A3 turns out to need more care than expected, before the audience is large. A full-launch choice was considered and rejected for this reason.

## Monitoring plan

- **Signal 1 — pageviews** via the disclosed GoatCounter counter (ADR-transit-20260911-03). Owner checks daily for the first week.
- **Signal 2 — factual-error reports** via GitHub Issues on this repo, linked from the app's disclaimer footer as the feedback channel (chosen specifically because there is no backend to build a feedback form, and this keeps feedback in the same "everything is a file" system as the rest of the harness).
- **Signal 3 — any CapMetro contact** (informal or otherwise) regarding the app's use of route/schedule information — directly tests the open A3 assumption.

Owner reacts to all three signals; no on-call rotation needed at this scale.

## Rollback or contingency plan

**Trigger conditions:** (1) a confirmed factual error about a CapMetro schedule or stop location is reported; (2) CapMetro (or any party) requests removal or correction of route/schedule content; (3) the app breaks in a way that leaves a visitor with no usable result (e.g., `stops.json` fails to load).

**Owner** flips the switch in all three cases. **Rollback state:** revert `outputs/app/` to the last known-good commit; for trigger (2) specifically, the app is taken down entirely (not just reverted) until the request is resolved, since a partnership/brand concern is a different kind of risk than a bug.

## Risk Auditor — rollout and rollback review

- Rollback trigger conditions defined: yes (see above), and one of the three (a takedown request) is explicitly stronger than a code revert.
- Rollback owner named: yes — the owner in all cases, at this scale.
- Monitoring signals cover failure modes: yes — pageviews (usage), issue reports (factual/technical defects), and direct CapMetro contact (the specific open assumption, A3) are each a distinct failure mode, not one generic "something's wrong" signal.
- Staged rollout rationale documented: yes, tied directly to the one open assumption rather than to a generic caution.

## Approval

- [x] Owner approves Launch.
