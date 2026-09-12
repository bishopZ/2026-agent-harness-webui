# Build Summary — One Bus Ride

**Build Plan:** [../05_build_plan.md](../05_build_plan.md) · **Design:** [../04_design.md](../04_design.md)

## What was built

A static, no-backend web app (`outputs/app/`) that turns a direction + start stop + time budget into a bounded, printable, shareable one-ride itinerary for MetroRapid 801: `index.html`, `styles.css`, `app.js`, `stops.json`, `og-image.svg`. Four slices, two checkpoints, both closed. Full detail per slice in `slices/`; full evidence in `verification_log.md`; architecture decisions in `decisions.md`.

## Build Review

Run at the end of Build (6c), before Evaluation, per `IDEA_LIFECYCLE.md`.

### Quality Reviewer — five-axis review

## Review Summary

**Verdict:** APPROVE

**Overview:** A small, well-scoped static app that does exactly what the PRD asked for, with content and code cleanly separated and every P0 acceptance criterion backed by a recorded verification.

### Critical findings (block approval)
- None.

### Important findings (should be resolved before approval)
- None outstanding. One was found and resolved during Slice 4 — see Suggestions for the record.

### Suggestions (advisory)
- [outputs/app/index.html] The pageview-counter script uses a placeholder site code (`one-bus-ride.goatcounter.com`); fine for this repo as a teaching/reference artifact, but the operator must swap in a real site code before a real public deploy — flagged again in `07_launch_plan.md`.
- [outputs/app/stops.json] Only one or two POIs per stop; acceptable for v1 (AC-01 only requires ≥1), but a thin POI list is a natural first Growth-stage content addition rather than a code change.

### What's done well
- Content/code separation (ADR-transit-20260911-02) is real, not just documented — `grep`-verified that no POI or stop text appears in `app.js`/`index.html` (AC-05 evidence).
- `buildPlan`'s optional `stopsOverride` parameter is a small, well-judged testability seam that didn't require changing any production call site.

### Verification story
- Acceptance criteria reviewed against evidence: all 8 PRD ACs have a PASS row in `verification_log.md` with a named method (test/demo/review) and, for the three test-method rows, an actual scripted run rather than a description of one.
- Decision Records reviewed: yes — all three ADRs are complete (context, decision, alternatives, consequences, evidence, open questions) and none are missing an evidence label.
- Evidence log consulted: yes — `verification_log.md` has one row per Task/AC pairing, not a single "Build passed" summary line.
- Cross-references to wiki pages checked: `wiki/operations/build-stack-and-hosting.md` correctly reflects ADR-transit-20260911-01/02/03.

### Evaluator — verification coverage analysis

## Verification Coverage Analysis

### Scope
- Artifact(s) reviewed: `outputs/app/` (all 5 files) against `03_prd.md`.
- Commitments to verify: FR-1 through FR-11, NFR-1 through NFR-6, AC-01 through AC-08.

### Current coverage
- 12 verification rows covering all 8 acceptance criteria plus 3 supporting FR/task-level checks.
- Evidence log rows: 12 (`verification_log.md`).
- Coverage gaps identified: NFR-2 (mobile viewport) is covered indirectly via AC-04's mobile check, not a standalone row — acceptable, since AC-04 only makes sense to check on a mobile viewport in the first place. NFR-3 (no third-party trackers beyond the one disclosed counter) has no dedicated row; recommend adding one.

### Recommended verifications
1. **NFR-3 explicit check** — Grep `index.html` for `<script src=` tags and confirm the only external one is the disclosed GoatCounter-class counter. Level: review. Cheap, closes a real gap before Launch.

### Priority
- **Critical** — none.
- **High** — none outstanding.
- **Medium** — the NFR-3 explicit check above; low effort, do before Launch.
- **Low** — none.

### Verdict
- **SUFFICIENT TO ADVANCE**, with the Medium NFR-3 check carried as a pre-Launch action item (see `06_evaluation.md` pre-launch checklist) rather than blocking this gate — it is a five-minute grep, not new work.

### Risk Auditor — report

Invoked because the artifact is user-facing and public.

## Risk Audit Report

### Summary
- Critical: 0
- High: 0
- Medium: 1 (resolved during Build)
- Low: 1
- Info: 1

### Findings

#### [MEDIUM] Undisclosed analytics script (resolved)
- **Zone:** Reputation / Data
- **Location:** `outputs/app/index.html`, head section
- **Description:** An early draft added the pageview-counter script without disclosing it anywhere on the page.
- **Impact:** A visitor who inspects the page source finds an undisclosed script; low real harm (no cookies, no personal data) but a real trust/reputational gap for a tool whose whole pitch is "no live data, no accounts, nothing hidden."
- **Likelihood:** Low that anyone inspects source, but the cost of disclosure is near zero, so fix rather than accept.
- **Proof or scenario:** A privacy-conscious visitor views source, finds the script tag, finds no matching disclosure in the footer.
- **Recommendation:** Add a one-line footer disclosure. **Status: fixed in Slice 4** — see `slices/slice_04_accessibility-legal-and-analytics/changes.md`.

#### [LOW] Placeholder analytics site code
- **Zone:** Infrastructure
- **Location:** `outputs/app/index.html`
- **Description:** The GoatCounter `data-goatcounter` attribute points at a placeholder site, not a real, owner-registered one.
- **Impact:** Harmless in this repo; would silently collect nothing if deployed unchanged.
- **Likelihood:** N/A (known placeholder).
- **Recommendation:** Operator swaps in a real site code at deploy time — carried into `07_launch_plan.md` as a blocking launch asset.

#### [INFO] No Subresource Integrity hash on the external counter script
- **Zone:** Infrastructure
- **Description:** `<script src="https://gc.zgo.at/count.js">` loads without an `integrity` attribute.
- **Recommendation:** Consider adding one if/when the vendor publishes stable hashes; not blocking for a script with no access to page data beyond triggering a pageview.

### Positive observations
- No user input is ever sent anywhere — the entire app is read-only against a local JSON file plus one outbound pageview ping. This sharply limits the whole risk surface compared to almost any interactive web app.
- The CapMetro disclaimer is prominent, not buried, which directly reduces the brand/accuracy exposure risk (R4) named in Pressure Test and Research.

### Rollout and rollback review (at Launch only)
- Deferred to `07_launch_plan.md` — this Build Review predates the Launch plan.

### Outstanding assumptions
- A3 (public schedule data can be referenced without CapMetro sign-off) is still `INFERENCE`, not `DATA` — carried to Launch's pre-launch checklist as a lightweight fact-check item.

## Build Review outcome

No Critical or High findings. The one Medium finding was fixed within Build, not deferred. Approved to advance to Evaluation.
