---
status: Approved
stage: Evaluation
created: 2026-09-12
approved: 2026-09-12
---

# Evaluation — One Bus Ride

**Build Review:** [05_build/README.md](05_build/README.md) · **PRD:** [03_prd.md](03_prd.md)

## Evaluation approach

Holistic, end-to-end pass across the complete artifact — not per-slice re-checking, which Build already covers. Includes the evaluator's one recommended follow-up from Build Review (NFR-3 explicit check) and a second, post-build round with three of the original ten discovery participants shown the actual working app.

## Acceptance criteria review

| AC | Criterion | Evidence | Verdict |
|---|---|---|---|
| AC-01 | All direction/start/budget combinations valid | `05_build/verification_log.md`, scripted 36-combination sweep | PASS |
| AC-02 | Printed plan fits one page | `05_build/verification_log.md`, print-preview check across 3 budgets | PASS |
| AC-03 | Share URL round-trips to the identical plan | `05_build/verification_log.md`, scripted round-trip test | PASS |
| AC-04 | Disclaimer/CapMetro link visible on mobile without scrolling | `05_build/verification_log.md`, 375px manual check | PASS |
| AC-05 | Content edits don't require code edits | `05_build/verification_log.md`, code inspection | PASS |
| AC-06 | WCAG AA contrast | `05_build/verification_log.md`, contrast calculation (16.96:1 / 7.50:1 / 7.89:1) | PASS |
| AC-07 | Usable with JavaScript disabled | `05_build/verification_log.md`, manual no-JS check | PASS |
| AC-08 | No private/partner names | `05_build/verification_log.md`, grep sweep | PASS |

No gaps. All 8 P0 acceptance criteria pass with recorded evidence.

## End-to-end checks

- **NFR-3 explicit check (Build Review evaluator follow-up):** `grep -n '<script' index.html` confirms exactly one external script (the disclosed pageview counter) plus the local `app.js` and one inline enhancement script. PASS.
- **Cross-artifact consistency:** `stops.json`'s `lastVerified` date (2026-09-11) matches the date shown in the footer via the small inline script in `index.html`. Confirmed by manual load.
- **Full user journey:** boarding-stop selection → budget selection → rendered plan → print → share link → reopen — walked end to end manually for both directions. No dead ends.

## External reaction

Three of the original ten discovery participants (Dana #1, Marcus #2, Renée #7) were shown the actual working app, not just the concept, per the Evaluation stage's requirement for outside-of-Build feedback.

- **Dana:** "This is exactly the thing I described — I'd use the medium budget option most." Confirms A1/A2 held up against the real artifact, not just the pitch.
- **Marcus:** "The print button is the whole reason I'd use this instead of just texting someone a Google Maps link." Directly confirms the print/share requirement mattered in practice.
- **Renée:** Still wanted the disclaimer to be more prominent than a footer line — read it, but only after being told to look. This is a real, specific piece of feedback, not fully resolved by AC-04 (which only checks visibility, not prominence). Logged as an open item below rather than waved off.

## Specialist review summaries

Pulled from Build Review (`05_build/README.md`): quality-reviewer APPROVE with two non-blocking suggestions; evaluator SUFFICIENT TO ADVANCE with one Medium follow-up (now closed, see above); risk-auditor 0 Critical / 0 High / 1 Medium (resolved in Build) / 1 Low / 1 Info. No new specialist review was re-run at Evaluation beyond the NFR-3 follow-up and the external reaction round above, since no new risk surface was introduced between Build Review and Evaluation.

## Issues found

- **[Low, open]** Renée's feedback that the disclaimer reads as easy to skip. Not a Critical or High finding — the disclaimer is present and visible (AC-04 passes as written), but "visible" and "hard to miss" are different bars. Carried to Growth rather than blocking Launch, since it's a refinement, not a defect.

## Remediation plan

No blocking issues. The one Low item (disclaimer prominence) is queued as a Growth iteration-backlog item rather than reopening Build for a cosmetic change on the eve of Launch.

## Assumption audit

| # | Assumption | Status after Evaluation |
|---|---|---|
| A1 (real friction) | `DATA` — confirmed by discovery (8/10) and reconfirmed against the real artifact (Dana, Marcus). |
| A2 (bounded plan preferred) | `DATA` — confirmed by discovery and by Marcus's print/share reaction. |
| A3 (public data referenceable without CapMetro sign-off) | Still `INFERENCE`. Not resolved this cycle; carried to the Launch pre-launch checklist as a lightweight fact-check, not blocking Launch given the clear disclaimer already in place. |
| A4 (content stays useful ~2 quarters) | Still `ASSUMPTION` — cannot be validated by time passing within a speed-run; explicitly a Growth-stage question. |
| A5 (801 is a well-suited corridor) | Still `ASSUMPTION`, with two dissenting discovery voices (#6, #10) unresolved. Carried to Growth as a named experiment candidate. |
| A6 (people act on a printed/shared plan) | `DATA` (partial) — Marcus's reaction to the print button is direct support; not yet observed in an actual real-world outing (Brief success criterion 3 needs real post-launch reports). |
| A7 (buildable in days) | `DATA` — confirmed; Build completed within the estimated window. |

## Pre-launch checklist

- [x] All P0 acceptance criteria pass with evidence.
- [x] Build Review Medium finding resolved.
- [x] Evaluator's NFR-3 follow-up closed.
- [ ] Swap the placeholder GoatCounter site code for a real one (owner action, tracked in `07_launch_plan.md`).
- [ ] Lightweight fact-check on A3 (owner action, tracked in `07_launch_plan.md`).

## Go / No-go recommendation

**GO.** All P0 acceptance criteria are met with evidence, the one Build-time risk finding was resolved rather than deferred, and the two remaining pre-launch items are owner-side configuration steps, not defects. The one open Low item (disclaimer prominence) is real but does not block a v1 launch.
