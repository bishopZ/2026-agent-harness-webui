# Example Idea

**Status:** In Review  
**Captured:** 2026-05-29  
**Next:** `02_pressure_test.md` — Pressure Test after approval.

---

## What ships when this idea is done

This is a **workflow validation** deliverable, not a product launch. The committed outcome is proof that the My Company initiative can move an idea from capture through an approved Brief and into Pressure Test using the standard folder layout (`General/[Idea]/`). Optional follow-on: a one-page note in `outputs/` summarizing lessons for onboarding new contributors to the lifecycle. No code, no customer-facing release.

---

## One-liner

A zero-stakes company initiative idea used to exercise capture, brief drafting, and approval-queue mechanics before real product bets enter the pipeline.

---

## Problem statement

My Company has no active ideas in flight and an empty approval queue. That makes it hard to validate end-to-end lifecycle behavior (status transitions, registry rows, links from `priorities.json` to artifacts) without risking a real strategic bet. Agents and owners need a **safe exemplar** that follows the same gates as production ideas but carries no revenue or reputation downside if the idea is revised, paused, or dropped after Pressure Test.

*`ASSUMPTION`: Running a deliberately thin “example” idea is an acceptable use of dashboard and wiki attention; the alternative (waiting for a real bet) delays harness and process validation.*

---

## Hypothesis

If we add **Example Idea** under **General**, draft this brief, and park it in **In Review**, then approve → Pressure Test will confirm that My Company’s registry rows, paths, and Web UI approval queue stay aligned. That reduces friction when the first real company idea enters the same pipeline.

---

## Target audience

**Primary:** You (initiative owner) and agents operating the cowork lifecycle or Agent Harness Web UI — anyone who needs to see a complete row + artifact + approval entry without ambiguity.

**Secondary:** Future collaborators who read `priorities.json` and need a concrete pattern for how General-bucket ideas are named and linked.

---

## Why now

The Agent Harness Web UI and priority workspace are being exercised against real initiative data. My Company is configured (tier 8, General project, empty queue) but has no sample idea to click through. Adding Example Idea now validates the path before a substantive business idea lands in the same buckets.

---

## Success criteria

1. `priorities.json` lists **Example Idea** with `lifecycle` `In Review`, a `reviewDocumentPath` to this brief, and a clear next step pointing at Pressure Test.
2. The Web UI approval queue includes a row for My Company / General / Example Idea with a working brief link.
3. After you approve the brief, `02_pressure_test.md` can be drafted without renaming folders or fixing broken relative links.
4. *(Optional)* A short `outputs/example-idea-lessons.md` exists if Evaluation concludes the exercise should be documented for reuse.

---

## Out of scope

- Building software, shipping marketing, or changing live products.
- Customer research, competitive analysis, or financial modeling (those belong in later stages only if this idea is kept past Pressure Test).
- Populating empty wiki domains with fictional company facts (wiki stays honest; this idea does not invent brand positioning).

---

## Rough effort estimate

| Stage | Effort |
| --- | --- |
| Brief (this document) | Complete — one session |
| Pressure Test | ~1 hour (thin adversarial pass) |
| Later stages | Only if you choose to keep the idea after Pressure Test; otherwise mark **Done** or **Dropped** with reason |

**Total if stopped after Pressure Test:** under half a day of async work. No budget.

---

## Open questions

1. **After Pressure Test:** Should Example Idea be **Dropped** (mission accomplished) or kept through Research as a longer onboarding tutorial? *Owner decision.*
2. **Harness UI:** Should the Web UI surface Example Idea in default views, or hide “example” rows behind a filter? *Product choice for Agent Harness Web UI.*
3. **Wiki:** Is a minimal `strategy/example-lifecycle-walkthrough.md` page worth creating when the walkthrough completes, or is the artifact folder sufficient?

---

## Recommendation

**Pursue through Pressure Test, then decide.** The idea’s value is procedural, not strategic. Approving this brief unlocks a quick Pressure Test that should confirm assumptions about paths and gates. If the test passes, you can drop the idea with a documented “validation complete” outcome or extend it deliberately for training — either path is success.
