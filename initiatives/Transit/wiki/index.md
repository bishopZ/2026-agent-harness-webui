# Transit Wiki Index

Architecture map for the Transit knowledge base. The Agent reads this first on every query to locate relevant pages. Updated on every ingest, query, update, and lint pass.

See `log.md` for the full chronological activity record.

---

## Domain Status

### `identity/` - Who Transit Is
| Page | Type | Status | Summary |
|---|---|---|---|
| [positioning.md](identity/positioning.md) | reference | Active | Mission, voice, and the One Bus Ride positioning statement. |

**What belongs here:** Initiative brief, voice guide, mission, vision, core values, founding story, positioning statement.

---

### `offerings/` - What We Offer
| Page | Type | Status | Summary |
|---|---|---|---|
| [one-bus-ride.md](offerings/one-bus-ride.md) | reference | Active | The One Bus Ride app: what it is, differentiator, links to source docs. |

**What belongs here:** Project and deliverable catalog, individual project briefs, differentiators, feature lists.

---

### `customers/` - Who We Serve
| Page | Type | Status | Summary |
|---|---|---|---|
| [personas.md](customers/personas.md) | reference | Active | Three named personas (Dana, Marcus, Priya) and the new-transplant journey map. |
| [discovery-synthesis.md](customers/discovery-synthesis.md) | reference | Active | Condensed 10-conversation discovery synthesis and decision-framework outcome. |

**What belongs here:** Partner and beneficiary personas, conversation notes and synthesis from discovery outreach, journey map, buying signals, objection handling.

---

### `market/` - Where We Operate
| Page | Type | Status | Summary |
|---|---|---|---|
| [landscape.md](market/landscape.md) | reference | Active | Competitive landscape, the "bounded outing" gap, and the content-staleness risk. |

**What belongs here:** Landscape overview, individual partner/competitor profiles, sizing, positioning matrix, trends and tailwinds.

---

### `operations/` - How We Work
| Page | Type | Status | Summary |
|---|---|---|---|
| [build-stack-and-hosting.md](operations/build-stack-and-hosting.md) | reference | Active | Stack, content/code separation, analytics posture, and hosting conventions for future static-product ideas. |

**What belongs here:** Team structure, key processes, tools stack, playbooks for repeatable workflows, integrations.

---

### `strategy/` - Where We're Going
| Page | Type | Status | Summary |
|---|---|---|---|
| [decisions-and-goals.md](strategy/decisions-and-goals.md) | reference | Active | Initiative goal, ADR index, lessons learned, and the open corridor-generalization bet. |

**What belongs here:** Goals and OKRs, active initiative summaries, key decisions log, lessons learned, long-term bets.

---

## Cross-Reference Index

| Topic | Primary Page | Also Mentioned In |
|---|---|---|
| One Bus Ride (the app) | [offerings/one-bus-ride.md](offerings/one-bus-ride.md) | identity/positioning.md, customers/personas.md, market/landscape.md, strategy/decisions-and-goals.md |
| Discovery personas | [customers/personas.md](customers/personas.md) | offerings/one-bus-ride.md |
| Content/code separation (ADR-transit-20260911-02) | [operations/build-stack-and-hosting.md](operations/build-stack-and-hosting.md) | strategy/decisions-and-goals.md |
| Corridor-generalization question | [strategy/decisions-and-goals.md](strategy/decisions-and-goals.md) | customers/discovery-synthesis.md |

---

## Open Questions (Across All Domains)

- [ ] Is MetroRapid 801 the strongest pilot corridor, or would a different route generalize better? (Growth Experiment 1, `One bus ride/09_growth_log.md`)
- [ ] Does the no-live-data disclaimer need to be more prominent than a footer line? (Growth Experiment 2, from Renée's Evaluation feedback)
- [ ] Is public CapMetro schedule/route data fully fine to reference without CapMetro's involvement? (A3, still `INFERENCE` as of Launch)

---

*Last updated: 2026-09-12 - One Bus Ride reached Growth; all six domains populated from Brief through Growth.*
