/**
 * Sort helpers for the Build Checkpoints table.
 *
 * Two columns need real comparators rather than string compare:
 *
 * - **Gate** sorts by how much it blocks you, not alphabetically. "In Review"
 *   (needs you) before "Ready" — same idea as `compareLifecycleStages`.
 * - **Progress** sorts by fraction complete, so a build at 3/4 outranks one at
 *   2/5. Raw `index` would put a 2-of-2 build below a 3-of-8 build.
 *
 * Checkpoint labels are per-plan ("A"…"D" in some, "1"…"8" in others), so they
 * only sort meaningfully within one build. Natural sort keeps digits numeric
 * so "10" lands after "9" rather than between "1" and "2".
 */

/**
 * Gate states, in default view order.
 *
 * Only one question matters here: **can the agent loop pick this up, or is it
 * waiting on you?** The registry does not store this — it is derived from
 * `lifecycle`: an idea at Build with `lifecycle: "In Review"` is owner-gated,
 * anything else at Build is `Ready`. Which checkpoint, how far along, and what
 * is next are derived too (build plan headings, notes) — see the server's
 * `ideaView.ts`.
 *
 * A finished or abandoned build simply leaves the Build stage (its lifecycle
 * moves on), so it drops out of the panel without any cleanup step.
 */
export const CHECKPOINT_STATUS_ORDER = ['In Review', 'Ready'] as const;

export type CheckpointGate = (typeof CHECKPOINT_STATUS_ORDER)[number];

/** Derive the gate label from the idea's In Review flag. */
export const checkpointGate = (inReview: boolean): CheckpointGate =>
  inReview ? 'In Review' : 'Ready';

/** Gate → colour. Amber = needs you (same signal as the approval queue). */
export const CHECKPOINT_GATE_COLORS: Record<CheckpointGate, string> = {
  'In Review': '#b45309',
  Ready: '#0369a1',
};

const statusRank = new Map<string, number>(
  CHECKPOINT_STATUS_ORDER.map((status, index) => [status, index]),
);

/** The gate is open and the agent loop cannot advance until you approve. */
export const isOwnerBlocked = (status: string): boolean => status === 'In Review';

export type SortDirection = 'asc' | 'desc';

/** Unknown statuses sort last in both directions, matching compareLifecycleStages. */
export const compareCheckpointStatus = (
  left: string,
  right: string,
  direction: SortDirection,
): number => {
  const leftRank = statusRank.get(left);
  const rightRank = statusRank.get(right);

  if (leftRank === undefined) return rightRank === undefined ? 0 : 1;
  if (rightRank === undefined) return -1;

  const comparison = leftRank - rightRank;
  return direction === 'asc' ? comparison : -comparison;
};

/** Fraction of the plan's checkpoints that have cleared. Guards total = 0. */
export const checkpointProgress = (index: number, total: number): number =>
  total > 0 ? index / total : 0;

/** Ties on fraction break toward the longer plan (5/10 is further along than 1/2). */
export const compareCheckpointProgress = (
  left: { index: number; total: number },
  right: { index: number; total: number },
  direction: SortDirection,
): number => {
  const delta =
    checkpointProgress(left.index, left.total) -
    checkpointProgress(right.index, right.total);
  const comparison = delta !== 0 ? delta : left.total - right.total;
  return direction === 'asc' ? comparison : -comparison;
};

/** Natural compare so "2" < "10" and "A" < "B". Falls back to case-insensitive text. */
export const compareNatural = (
  left: string,
  right: string,
  direction: SortDirection,
): number => {
  const comparison = (left ?? '').localeCompare(right ?? '', undefined, {
    numeric: true,
    sensitivity: 'base',
  });
  return direction === 'asc' ? comparison : -comparison;
};

/** Blank dates sort last in both directions — "unknown" is never "earliest". */
export const compareDates = (
  left: string | undefined,
  right: string | undefined,
  direction: SortDirection,
): number => {
  const hasLeft = Boolean(left);
  const hasRight = Boolean(right);

  if (!hasLeft) return hasRight ? 1 : 0;
  if (!hasRight) return -1;

  const comparison = (left as string).localeCompare(right as string);
  return direction === 'asc' ? comparison : -comparison;
};
