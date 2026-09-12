---
status: Approved
stage: Marketing
created: 2026-09-12
approved: 2026-09-12
---

# Marketing Pack — One Bus Ride

**Launch Plan:** [07_launch_plan.md](07_launch_plan.md)

## Executive summary and goals

This push aims to reach the next layer of Brief success criteria beyond the launch moment: at least one qualitative report of the plan being used for a real outing within the first month, and continued validation of A1/A2 at a slightly wider scale than the 10-person discovery round.

## Positioning and competitive angle for this release

Draws on `wiki/market/landscape.md` without repeating the full Research pass: the angle is "the only guide to what to do on one specific ride," positioned explicitly against general trip planners (comprehensive but destination-first) and neighborhood guides (comprehensive but car-agnostic), not against CapMetro's own app or site.

## Proof points

All traceable to `05_build/verification_log.md`, `06_evaluation.md`, and `05_build/decisions.md`:

- "Works for every stop and every time budget on the route" → AC-01 sweep, 36/36 combinations valid.
- "One page, ready to print or text" → AC-02/AC-03 evidence.
- "Built to stay honest about what it doesn't know" → the disclaimer requirement (AC-04) and ADR-transit-20260911-02's content/code separation, which keeps the "verify before you go" caveat meaningful rather than decorative.
- "8 of 10 people we talked to said they'd actually use it" → `02b_customer_discovery.md` synthesis.

## Channel plan

| Channel | Rationale | Priority | Cadence |
|---|---|---|---|
| r/Austin | Direct match to where discovery participants were originally found (Finder, `02b_customer_discovery.md`) | 1 | One post at launch, one follow-up after 2–4 weeks if traction warrants |
| Austin newcomer / off-campus housing Facebook groups | Matches the "new transplant" persona (Dana) directly | 2 | One post at launch |
| Nextdoor (North Lamar/Crestview and South Congress/Bouldin neighborhoods) | Matches the corridor's actual geography | 3 | One post at launch |
| Public harness repo README | Meta-channel: this project is also the harness's own worked example — a short "see it in action" link costs nothing and reaches a technical audience already inclined to explore the repo | 3 | One-time addition |

## Voice and company image for this push

Plain, practical, no hype — matches `wiki/identity/positioning.md`. Avoid tourism-guide language ("hidden gems," "must-see") that customer discovery's messaging insight (`02b_customer_discovery.md`) flagged as sounding too close to the general guides this idea is differentiating against.

## Social posts

| Platform | Post type | Copy | Suggested media | CTA | Hashtags |
|---|---|---|---|---|---|
| r/Austin | Text post | "Made a tiny free tool: pick a direction and how much time you have, get a full plan for one MetroRapid 801 ride — board here, do these things, catch the bus back. No login, no tracking beyond a basic visit counter, not affiliated with CapMetro. Feedback (especially 'this stop info is wrong') very welcome." | Screenshot of a generated itinerary | Link to the app | — |
| Facebook (newcomer group) | Text + image | "If you just moved here and don't have a car yet — here's a plan for one afternoon using just the 801 bus. Free, no signup." | og-image.svg or a itinerary screenshot | Link to the app | — |
| Nextdoor | Text post | "Built this for the 801 corridor — one bus ride, a full plan for what to do. Would love neighborhood feedback on the stop suggestions." | Screenshot | Link to the app | — |

## Blog / longform

**Working title:** "I built a one-page app that plans your bus ride for you." **Outline:** the original question ("what can you do with only one bus ride?"), why a bounded answer beats a flexible one for this specific moment, what customer discovery actually said (including the two people who pushed back), and what's still unresolved (corridor choice, live-data trust) going into Growth. No SEO work planned — this is a personal/dev-blog post, not an acquisition channel.

## Paid advertising

**N/A — deliberately skipped.** This is a free civic-hobby tool with no monetization path and no acquisition budget; paid channels would not serve any goal in the Brief or PRD. Recorded here rather than silently omitted, per the waiver convention for sections that don't apply.

## Guerrilla or unconventional tactics

- **Idea:** small QR-code stickers or flyers at actual 801 stops linking to the app. **Effort:** low (design + printing). **Risk:** Medium — placing anything on CapMetro property without permission is a real, avoidable risk given the still-open A3 assumption about CapMetro's posture toward this project; not authorized as part of this pack. If pursued, it needs its own Pressure-Test-style check first, not a marketing-pack green light.

## Posting checklist

1. Confirm the real GoatCounter site code is live (Launch pre-launch item).
2. Post to r/Austin.
3. Post to the newcomer Facebook group and relevant Nextdoor neighborhoods.
4. Add the "see it in action" link to the public harness README.
5. Watch the three monitoring signals from `07_launch_plan.md` for the first week before the optional r/Austin follow-up post.

## Materials index

- Social copy: this document, "Social posts" table.
- Share image: `outputs/app/og-image.svg`.
- Proof points: this document, "Proof points" section, all linked to source evidence.
- **Owner must still supply:** a real screenshot of a generated itinerary for the r/Austin and Facebook posts (the pack does not fabricate a screenshot).
