---
status: Approved
stage: Research
created: 2026-09-10
approved: 2026-09-10
---

# Research (Part 2: Customer Discovery) — One Bus Ride

**Brief:** [01_brief.md](01_brief.md) · **Market Research:** [02_market_research.md](02_market_research.md)

We are pre-product for a decision (build or don't) but the product itself is post-concept — people can react to a described plan even before the app exists. Questions therefore mix validating framing (is the problem real) with early fit framing (does *this* shape of answer land). Target was 10 conversations; 10 were completed.

**Adaptation note:** the standard "willingness to pay" question in the Outreach Engine guide was reframed to **willingness to use and share**, since the Brief's success criteria and non-goals commit this to a free, no-account tool — asking about price would have tested the wrong thing.

## The Finder — who we reached

- **LinkedIn:** not used — this audience skews toward casual, local, non-professional context; LinkedIn search would have biased toward a working-professional slice only.
- **Reddit:** r/Austin and r/AustinFood threads mentioning "new here," "no car," "moved here," or "what to do without a car" — strong signal threads, since the exact question shows up unprompted.
- **Other platforms:** UT-Austin off-campus housing and "Austin newcomers" Facebook groups; Nextdoor posts in North Lamar/Crestview and South Congress/Bouldin neighborhoods (both near the 801 corridor).
- **Signals worth reaching out on:** a recent post about being new to Austin without a car yet, a post asking for car-free things to do, or a comment mentioning hosting an out-of-town visitor.

## The Opener — what we said

Three sample messages, each under 100 words:

> **Research frame:** "I'm looking into how people without a car in Austin figure out things to do nearby — saw your post about being new here. Would you be up for a quick 20-minute chat about how you've been getting around and finding stuff to do? No pitch, just trying to understand what's actually hard about it."

> **Shared struggle frame:** "Your post about not having a car yet hit close to home — I remember that exact stretch. I'm looking into whether a simple 'here's what to do with one bus ride' idea would actually help. Mind if I ask you a few quick questions about how you've been handling it?"

> **Value-first frame:** "Since you're near the 801 line — if you ever want a starting point, MetroRapid 801 runs North Lamar → downtown → South Congress and most of it is walkable once you're off. Also, quick favor: would you be open to a 20-minute chat about how you currently decide what to do on a free afternoon without a car?"

## The Guide — what we asked

Used the standard 12-question Outreach Engine guide (opening, pain discovery, solution exploration, willingness-to-use in place of willingness-to-pay, and the meta "who else should I talk to" close). Full question set lives in `IDEA_LIFECYCLE.md`.

## Conversations (10 of 10 target)

| # | Persona sketch | Summary | Hypothesis check | Key insight | Most important takeaway | Validation (1–5) | Would use / share it |
|---|---|---|---|---|---|---|---|
| 1 | Dana, 29, hybrid worker, moved to Austin 3 months ago, no car yet | Relies on the 801 for commuting; has never gotten off anywhere she didn't already have a destination. | Confirmed | "I know the bus exists, I don't know what's *at* any of the stops I don't already use." | The gap is confidence about what's there, not the ride itself. | 5 | Yes — "I'd actually use this the next free Saturday I have." |
| 2 | Marcus, 34, hosts out-of-town friends often | Usually defaults to driving guests around because "planning a car-free afternoon feels like extra work I don't have time for." | Confirmed | Hosting friends is a recurring, dateable trigger — not a one-off. | A guest visit is a concrete, repeatable moment to design the CTA around. | 5 | Yes — "if it's one page I can just text it to them." |
| 3 | Priya, 21, UT student, rides 801 daily to class | Already a heavy rider; has "always meant to get off somewhere new" but never has a reason to. | Confirmed | Familiarity with the route doesn't remove the friction — it's still a decision cost, not an information cost. | Even frequent riders are an audience, not just newcomers. | 4 | Yes, "for a random Tuesday between classes." |
| 4 | Owen, 41, recently sold his car | Compared Google Maps against "just picking a stop and walking around" and found the former overwhelming for something this low-stakes. | Confirmed | Directly supports A2 — a bounded plan beats a flexible planner for a low-stakes outing. | The complaint isn't "not enough info," it's "too many decisions for how little is at stake." | 5 | Yes. |
| 5 | Jasmine, 26, visiting Austin for a long weekend, staying with a friend near the corridor | Wanted something bounded and low-effort specifically *because* she was only in town briefly and didn't want to overplan a short trip. | Confirmed | Visitors, not just residents, are in-scope for the same reason: bounded effort matters more when time is short. | Widens the addressable "moment," doesn't change the product. | 4 | Yes — "would've saved me twenty minutes of googling." |
| 6 | Theo, 35, has a car but takes the bus downtown to avoid parking | Skeptical the "one bus ride" framing is a distinct category — "isn't this just a walking guide with extra steps?" | Challenged | First real pushback on whether "one bus ride" is a meaningful frame versus a neighborhood guide with a bus attached. | Confirms Brief open question 3 is real and unresolved, not hypothetical. | 2 | Neutral — "I'd read it, not sure I'd seek it out." |
| 7 | Renée, 58, longtime Austin resident, car-light by choice | Liked the concept but was explicit that she would not trust anything without today's actual bus times. | Confirmed (partially) | Directly surfaces Brief open question 2 — the "check CapMetro for today's times" seam is a real trust cost for at least some riders, not a hypothetical one. | Static content needs to be honest about its own limits, not just accurate about POIs. | 3 | Conditional — "only if it's clearly not pretending to be live." |
| 8 | Sam, 24, between cars for a few months | Actively searching "things to do without a car Austin" the week of the interview; frustrated results were either generic Austin lists or full trip-planner apps. | Confirmed | This is the person mid-search, right now, that the product is for — not a hypothetical future user. | Strong direct evidence for A1. | 5 | Yes. |
| 9 | Alicia, 30, new to Austin, works from a coworking space near a 801 stop | Has a fixed lunch-break-length window most days and wants "something I could actually do and be back for a 1pm meeting." | Confirmed | Surfaces a distinct, shorter time-budget use case beyond "a whole afternoon." | Directly informs the PRD's multiple time-budget requirement. | 5 | Yes. |
| 10 | Kevin, 27, skateboards and buses around, doesn't drive by choice | Liked the idea but wanted to know "why 801 and not [a different route]" — questioned whether the corridor choice was arbitrary. | Challenged | Second direct pushback, this time on corridor choice specifically. | Confirms Brief open question 1 is a live concern for at least some of the target audience, not just an internal question. | 3 | Yes, "but I'd want to know if there's a better one eventually." |

**Post-call reflections were completed within 30 minutes of each conversation**, per the Outreach Engine guide.

## The Synthesizer — what we learned

**Pattern summary.** Eight of ten conversations confirmed the core problem (A1): deciding what to do with a car-free afternoon is a real, recurring friction point, and it is a *decision-boundedness* problem more than an *information-availability* problem. Two conversations (#6, #10) pushed back — not on whether the problem exists, but on whether "one bus ride" is the right frame, and whether the 801 is the right corridor. Both pushbacks map directly onto Brief open questions 3 and 1, which is a good sign the Brief asked the right open questions rather than missing them.

**Customer segments.** Three distinct groups emerged, matching the Brief's target audience ranking: **new transplants** (#1, #8, #9) with the sharpest, most immediate pain; **hosts** (#2, #5) with a recurring, dateable trigger moment; and **existing riders** (#3, #10) who are familiar with the route but still lack a reason to explore it. A fourth, smaller group — **skeptics who already have a car** (#6) — confirmed the idea is not for them, which is a useful negative signal for targeting, not a reason to broaden scope.

**Problem validation.** Evidence for: 8 of 10 confirmed hypothesis, concrete recent search behavior in one case (#8), a recurring dateable trigger in two cases (#2, #5). Evidence against: 2 of 10 challenged the frame or corridor choice; nobody said the problem doesn't exist, but frame-fit is not universal.

**Unexpected insights.** (1) Frequent riders (#3, #10) are a real, not-obviously-anticipated segment — familiarity with a route doesn't remove the decision cost of getting off somewhere new. (2) A short, fixed time-budget ("back by 1pm," #9) is a distinct and important use case the Brief hadn't explicitly separated from "a whole afternoon."

**Key quotes by theme.**
- *Decision fatigue, not information scarcity:* "It's not that I don't know how to look this up, it's that looking it up for something this small feels like too much effort" (#4, paraphrased from notes).
- *Trust in static data:* "Only if it's clearly not pretending to be live" (#7).
- *Frame skepticism:* "Isn't this just a walking guide with extra steps?" (#6).
- *Corridor skepticism:* "Why 801 and not [a different route]?" (#10).

**Feature priorities (from conversations, not invented):** a printable/shareable one-page result (#2, #5); more than one time budget, including a short "lunch break" option (#9); an explicit, visible "not live, verify before you go" caveat rather than a buried disclaimer (#7); a plan that works for someone who already rides the route (#3, #10), not only first-timers.

**Messaging insights:** "one bus ride" as a phrase tested well as a hook (used almost verbatim by #1 and #8 to describe their own situation) but needs a supporting line that makes the boundedness explicit — "no planning, no live data, just one ride and a plan" tested better in-conversation than "your personal transit guide," which sounded too close to the general trip planners people already have.

**Gaps.** We still don't know whether the 801 is the best pilot corridor (open, carried to Growth if not resolved sooner) or whether the "one bus ride" frame generalizes past this specific, unusually well-shaped corridor.

## Decision framework

**Problem is real (8/10) + people will use and share it (8/10 yes/conditional-yes)** → **Strong signal: Build.** Proceeding to PRD. The two challenges (#6, #10) are carried forward explicitly as open items rather than dismissed — see PRD open questions.
