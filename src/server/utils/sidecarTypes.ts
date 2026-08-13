/**
 * Shared type definitions for the priorities.json sidecar file.
 *
 * Only `tier` and `priority` fields are web-editable (POST /api/priorities).
 * All other fields are agent-maintained (lifecycle, lastWork, lastUpdated, notes).
 */

/**
 * Where a Build-stage idea currently sits among the checkpoints defined in its
 * `05_build_plan.md`.  Agent-maintained; written at every checkpoint closure so
 * the workspace can answer "which checkpoint are we on?" without re-reading the
 * build plan and verification log.
 *
 * `current` is the checkpoint the idea is sitting AT (the one whose gate has not
 * yet cleared), not the last one approved.  When every checkpoint has cleared,
 * `status` is "Complete" and `index` equals `total`.
 */
export interface CheckpointEntry {
  /** Checkpoint label as written in the build plan: "A", "C", "2", … */
  current: string;
  /** 1-based position of `current` among the plan's checkpoints. 0 = not started. */
  index: number;
  /** Count of checkpoints defined in `05_build_plan.md`. */
  total: number;
  /** Gate state at `current`. */
  status: CheckpointStatus;
  /** Short milestone name from the build plan heading. */
  label?: string;
  /** Why the build sits in this state — what the owner must do, or what is next. */
  reason?: string;
  /** ISO date of the verification-log entry this was read from. */
  asOf?: string;
  /** Harness-root path to the evidence (usually the verification log). */
  evidence?: string;
  /**
   * Harness-root path to `05_build_plan.md`. Derived per request by
   * `buildDiscoverResponse` — never stored in priorities.json, so it cannot
   * go stale when a folder is renamed.
   */
  buildPlanPath?: string;
}

/**
 * Gate states. The only distinction that changes behaviour is whether the agent
 * loop can proceed or is waiting on the owner — so there are exactly two, not a
 * taxonomy of how the build got here.
 *
 * A finished or abandoned build has no status: **remove the `checkpoint` object
 * entirely** when the last gate clears or the plan is superseded. Only in-flight
 * builds carry one.
 */
export const CHECKPOINT_STATUSES = [
  'In Review',  // hard stop — owner gate open (a Build Plan at 6a, or a mid-build checkpoint)
  'Ready',      // a gate has cleared and tasks remain; agent may pick this up
] as const;

export type CheckpointStatus = (typeof CHECKPOINT_STATUSES)[number];

export interface IdeaEntry {
  priority: string;     // "High" | "Medium" | "Low"
  lifecycle: string;    // "Backlog" | "Brief" | "Build" | "In Review" | …
  lastUpdated: string;  // ISO date yyyy-mm-dd
  notes: string;
  /**
   * Present only while a build is in flight — from Build Plan (6a) until the
   * final checkpoint clears. Removed once the build is done or superseded.
   */
  checkpoint?: CheckpointEntry;
}

export interface ProjectEntry {
  priority: string;     // "High" | "Medium" | "Low"
  purpose?: string;     // one-line project description (agent-maintained)
  ideas: Record<string, IdeaEntry>;
}

export interface InitiativeEntry {
  tier: number;
  lastWork: string;     // ISO date yyyy-mm-dd or ""
  projects: Record<string, ProjectEntry>;
}

export interface PrioritiesFile {
  version: number;
  updated: string;      // ISO date of last reconcile
  initiatives: Record<string, InitiativeEntry>;
}

// ─── Default factory helpers ──────────────────────────────────────────────────

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function defaultIdea(): IdeaEntry {
  return { priority: 'Medium', lifecycle: 'Backlog', lastUpdated: todayISO(), notes: '' };
}

export function defaultProject(): ProjectEntry {
  return { priority: 'Medium', purpose: '', ideas: {} };
}

export function defaultInitiative(): InitiativeEntry {
  return { tier: 5, lastWork: '', projects: {} };
}

export function emptySidecar(): PrioritiesFile {
  return { version: 3, updated: todayISO(), initiatives: {} };
}
