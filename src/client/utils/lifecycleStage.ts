export const REVIEW_LIFECYCLE_STAGES = [
  'Brief',
  'Pressure Test',
  'Research',
  'PRD',
  'Design',
  'Build',
  'Evaluation',
  'Launch',
  'Marketing',
  'Growth',
] as const;

const stageRank = new Map<string, number>(
  REVIEW_LIFECYCLE_STAGES.map((stage, index) => [stage, index]),
);

export type LifecycleSortDirection = 'asc' | 'desc';

export const compareLifecycleStages = (
  left: string,
  right: string,
  direction: LifecycleSortDirection,
): number => {
  const leftRank = stageRank.get(left);
  const rightRank = stageRank.get(right);

  if (leftRank === undefined) return rightRank === undefined ? 0 : 1;
  if (rightRank === undefined) return -1;

  const comparison = leftRank - rightRank;
  return direction === 'asc' ? comparison : -comparison;
};
