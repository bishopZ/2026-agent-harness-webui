# Rules

Cross-stage operating rules that apply to every lifecycle stage (`IDEA_LIFECYCLE.md`) and to any initiative type — business, personal brand, novel, or hobby product.

Stages say **what** to do at each step. Rules say **how** to do it well regardless of step. When a stage template and a rule appear to conflict, the rule wins: rules encode the non-negotiable discipline that makes every stage trustworthy.

## The six rules

| Rule | Core idea | When it bites hardest |
|---|---|---|
| [`evidence-and-verification.md`](evidence-and-verification.md) | "Seems right" is never sufficient. Every claim and every artifact must be backed by evidence and explicit verification. | Research synthesis, Build, Evaluation, Growth retrospectives |
| [`incremental-execution.md`](incremental-execution.md) | Break work into thin vertical slices. Simplicity first. Keep the system working at every step. | Build, Launch, Growth experiments |
| [`context-engineering.md`](context-engineering.md) | Feed the agent the right information at the right time. Rules files and the wiki are the highest-leverage persistent context. | Every session; especially when output quality drifts |
| [`decision-records.md`](decision-records.md) | Document *why* decisions are made — context, alternatives, trade-offs — not only what. | Design, Build, Launch |
| [`anti-rationalization.md`](anti-rationalization.md) | A catalogue of the excuses agents and humans use to skip discipline, with the counter-argument that defeats each one. | Every stage, reviewed at each approval gate |
| [`red-flags.md`](red-flags.md) | Concrete signals that something is going wrong right now. Listed by stage. | Read before every stage; surface when you see one |

## How rules interact with the lifecycle

1. At the start of every stage, The Agent (re)loads the rules most relevant to that stage. `IDEA_LIFECYCLE.md` lists the relevant rules per stage.
2. At every approval gate, The Agent confirms the rules were honored. If a red flag was hit or a rationalization was accepted silently, it is surfaced in the gate summary.
3. When a rule and a template disagree, The Agent follows the rule and flags the tension for you in chat.

## How rules interact with agent profiles

The specialist profiles in [`agents/`](../agents) are instantiations of these rules. A `quality-reviewer` review is mostly an enforcement of `evidence-and-verification.md` and `anti-rationalization.md`. A `risk-auditor` is enforcing the Data Protection and boundary portions of `evidence-and-verification.md`.

## Non-software projects

Every rule in this folder is written to apply to any domain — software, writing, design, marketing, personal brand. Where a raw concept ("tests pass," "build succeeds") is software-specific, the rule file translates it into the general pattern ("verification passes," "the artifact still holds together") with concrete examples per initiative type.

## Adding or changing a rule

Rules are durable. Change them when you have seen the same problem multiple times, not after a single incident. Any rule change should be backed by at least one ADR in the initiative's wiki (`wiki/strategy/` or `wiki/operations/`) explaining what drove the change.
