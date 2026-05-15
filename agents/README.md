# Agents

Specialist profiles The Agent adopts when a stage calls for a focused review. Each profile is a persona with a narrow remit, a review framework, and an output format. They are opinionated by design — the point is that a specialist asks the questions a generalist overlooks.

Agent profiles are not separate tools. They are lenses The Agent applies to an artifact, with the voice and standards of the specialist. They are invoked by name at specific moments in the lifecycle.

## The three profiles

| Profile | Role | Invoked at |
|---|---|---|
| [`quality-reviewer.md`](quality-reviewer.md) | Senior quality reviewer | Every Build approval gate; deep reviews at Evaluation |
| [`evaluator.md`](evaluator.md) | Verification and coverage specialist | Build Plan approval, end-to-end Evaluation |
| [`risk-auditor.md`](risk-auditor.md) | Risk, safety, and boundary review | Evaluation (always for user-facing work); Launch; any idea involving sensitive data, user trust, or legal exposure |

## When to invoke

`IDEA_LIFECYCLE.md` specifies which profiles must run at which gates. In short:

- **Build complete** — quality-reviewer runs on the entire Build. Evaluator confirms verification coverage. Risk-auditor runs if the idea is user-facing or touches sensitive data.
- **Evaluation** — all three run on the end-to-end artifact, at depth proportional to risk.
- **Launch** — risk-auditor reviews the rollout plan and rollback triggers.
- **Spot reviews** — the user can invoke any profile at any stage to stress-test an artifact.

## How a review runs

1. The user (or the stage itself) requests a review by naming the profile
2. The Agent loads the profile file and the artifact(s) in scope
3. The Agent produces a review in the profile's output format — findings categorized by severity, with a verdict and at least one "What's Done Well" observation
4. Critical and Important findings block the gate. Suggestions are advisory.
5. Findings that require changes to the artifact go back through the artifact's normal revision loop
6. The review itself is saved as part of the stage's evidence (linked from `06_evaluation.md` or the relevant artifact)

## Cross-domain adaptation

These profiles are written to apply across any initiative type. Where a raw software concept (like "N+1 queries" or "OWASP Top 10") would be too narrow, the profile translates into the general pattern:

| Software flavor | General translation |
|---|---|
| Code review | Work review — does the artifact meet its acceptance criteria? |
| Test coverage | Verification coverage — is every claim or criterion backed by evidence? |
| Security audit | Risk audit — confidentiality, legal, vendor, safety, reputational exposure |
| Performance profiling | Load / scale review — does the artifact hold up under real use? |
| Refactor review | Simplification review — can this be simpler without losing fidelity? |

Each profile includes concrete examples for software, writing, personal brand, and marketing initiatives so the review framework stays usable regardless of domain.

## Writing a new profile

Add new profiles only when a repeated pattern of errors escapes the three profiles above. New profiles must include:

- A clear remit (what they review, what they do not)
- A review framework (dimensions or questions)
- A severity scheme with explicit thresholds
- An output format
- At least one domain-generalization note (how it applies to non-software initiatives)

See also [`rules/decision-records.md`](../rules/decision-records.md) — adding a profile is an ADR-worthy change.
