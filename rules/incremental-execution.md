# Incremental Execution

Break every significant piece of work into thin vertical slices. Implement, verify, commit the slice, then move on. Do not let the system sit broken between slices. This is the execution discipline that turns a scary Build into a sequence of boring, reviewable moves.

## When this rule bites

- **Build** — this rule is the spine of the Build stage
- **Launch** — staged rollout is incremental execution in a different register
- **Growth experiments** — each experiment is a slice with its own verification
- **Wiki ingest** when a single source updates many pages — slice by domain
- **Refactors** to system files (like this one, or `IDEA_LIFECYCLE.md`)

## The slice cycle

```
┌──────────────────────────────────────┐
│   Plan slice → Produce → Verify ─┐   │
│       ▲                          │   │
│       └──── Save + note ◄────────┘   │
│              │                       │
│              ▼                       │
│          Next slice                  │
└──────────────────────────────────────┘
```

For each slice:

1. **Plan** the smallest complete unit that delivers value end-to-end
2. **Produce** it — the minimum that is obviously correct
3. **Verify** it against the slice's acceptance criteria (see `evidence-and-verification.md`)
4. **Save + note** — for software this is an atomic commit, for writing a dated save with a one-line change note, for marketing a new version file. Every slice leaves a named save-point.
5. **Next slice** — carry forward context, don't restart

## Vertical slicing (preferred)

Build one complete user-facing path at a time, not one layer at a time.

**Bad (horizontal):**
```
Task 1: Do all the research
Task 2: Do all the design
Task 3: Do all the writing
Task 4: Do all the editing
```

**Good (vertical — novel example):**
```
Slice 1: Chapter 1 — outline, draft, one edit pass, read-aloud test
Slice 2: Chapter 2 — same five steps
Slice 3: Chapter 3 — same, with a consistency pass against 1–2
```

**Good (vertical — business example):**
```
Slice 1: One onboarding step end-to-end (form + email + dashboard confirmation)
Slice 2: Second onboarding step end-to-end
Slice 3: Analytics and drop-off alerts across the flow
```

Each slice produces something you could in principle ship or show.

## Rule 0 — Simplicity first

Before producing any slice, ask: *What is the simplest thing that could work?*

After producing it, review against these checks:

- Can this be shorter, smaller, or fewer moving parts?
- Are the abstractions earning their complexity?
- Would a trusted senior look at this and say "why didn't you just…"?
- Am I building for a hypothetical future, or the current slice?

Three copies of a thing beats a premature abstraction built on one. Implement the naive, obviously correct version first. Optimize only after correctness is proven.

## Rule 0.5 — Scope discipline

Touch only what the slice requires. If you notice something worth fixing outside scope, note it — don't fix it:

```
NOTICED BUT NOT TOUCHING:
- wiki/market/competitor-x.md has a stale claim about pricing
- 02_market_research.md capitalization of product names is inconsistent
→ Capture as a follow-up note in the idea's Open Questions; do not expand this slice.
```

## Rule 1 — One thing at a time

Each slice changes one logical thing. Don't mix a new feature with a refactor, or a chapter edit with a voice rewrite, or a launch copy change with a PRD update. Separate save-points.

## Rule 2 — Keep it working

After each slice, the system must still hold together:

- Software: build succeeds, tests pass
- Novel: the chapter reads, the timeline wiki is current, the voice document still matches the draft
- Personal brand: the portfolio still loads, the messaging still coheres
- Marketing: the campaign is still launchable from what exists

Do not leave the system in a broken state between slices.

## Rule 3 — Safe defaults for partial work

Work-in-progress should default to safe/hidden:

- Software: feature flags gate incomplete features, defaulting off
- Writing: draft chapters are clearly labeled `status: Draft` in front matter
- Launch: unfinished channels are skipped in the posting checklist, not half-run
- Wiki: partially synthesized pages are labeled `status: Draft` until complete

## Rule 4 — Revertable

Every slice must be independently revertable. The Agent should be able to say "roll back slice 3" without unwinding slices 1, 2, 4, and 5.

For software: atomic commits. For artifacts: save-points are separable versions. For wiki: pages move to `wiki/.archive/` rather than being deleted.

## The slice checklist

After each slice:

- [ ] The slice did one thing and did it completely
- [ ] Acceptance criteria for this slice are all met
- [ ] Evidence of verification is captured in `verification_log.md`
- [ ] The system as a whole still holds together
- [ ] The slice has a named save-point (commit / versioned file / dated save)
- [ ] Anything noticed outside scope is logged as a follow-up, not absorbed

## Sizing guidelines

| Size | Typical scope | Guidance |
|---|---|---|
| **XS** | One small change to one file | Good first move in a new stage |
| **S** | One artifact or component | Normal slice |
| **M** | Up to ~5 files or one small feature path | Still one slice |
| **L** | Touches two independent subsystems | Break it down |
| **XL** | Cannot describe acceptance in three bullets | Break it down — it is two tasks wearing a trench coat |

A slice that feels like it requires an "and" in the title is two slices.

## Rationalizations

| Rationalization | Reality |
|---|---|
| "It's faster to do it all at once" | It feels faster until something breaks. A small error compounds across the whole batch. |
| "These pieces are too small to split" | Small saves are free. Large ones hide mistakes and make rollbacks painful. |
| "I'll verify at the end" | Bugs compound across slices. A bad slice 1 makes slices 2–5 wrong. |
| "This refactor is small enough to sneak in" | Refactors mixed with features make both harder to review and debug. Separate them. |
| "I'll clean up the adjacent stuff while I'm here" | That is scope expansion. Log it; do not absorb it. |

## Red flags

- A Build slice touches more than about five files or changes two independent subsystems
- Verification is deferred to "the end"
- Multiple unrelated changes sit in one save-point
- The system is broken between slices
- The Agent keeps "noticing and absorbing" things outside the current slice
- Slices are named with "and" in the title

## See also

- [`evidence-and-verification.md`](evidence-and-verification.md) — the verification side of each slice
- [`decision-records.md`](decision-records.md) — for architectural or narrative decisions that show up mid-slice
- [`anti-rationalization.md`](anti-rationalization.md) — the shortcut-excuse catalogue
