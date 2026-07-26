import path from 'path';

/**
 * Map a harness-root `reviewDocumentPath` to the lifecycle stage being reviewed.
 * Queue rows are always `lifecycle: "In Review"`; the useful label is which stage.
 */
const ARTIFACT_STAGE_LABELS: Record<string, string> = {
  '01_brief.md': 'Brief',
  '02_pressure_test.md': 'Pressure Test',
  '02_market_research.md': 'Research',
  '02b_customer_discovery.md': 'Research',
  '03_prd.md': 'PRD',
  '04_design.md': 'Design',
  '05_build_plan.md': 'Build',
  '06_evaluation.md': 'Evaluation',
  '07_launch_plan.md': 'Launch',
  '08_marketing_pack.md': 'Marketing',
  '09_growth_log.md': 'Growth',
};

/** Pull `reviewDocumentPath` from an idea notes block (AGENTS.md convention). */
export const parseReviewDocumentPath = (notes?: string): string | undefined => {
  const match = notes?.match(/^reviewDocumentPath:\s+(.+)$/m);
  return match ? match[1].trim() : undefined;
};

/**
 * Infer the stage under review from a `reviewDocumentPath`.
 * Returns null when the path is missing or does not match a known artifact.
 */
export const reviewStageFromPath = (reviewDocumentPath?: string): string | null => {
  if (!reviewDocumentPath) return null;

  const normalized = reviewDocumentPath.replace(/\\/g, '/');
  const base = path.posix.basename(normalized).toLowerCase();
  const fromFile = ARTIFACT_STAGE_LABELS[base];
  if (fromFile) return fromFile;

  // Build checkpoint / slice / verification artifacts live under 05_build/
  if (/(^|\/)05_build(\/|$)/i.test(normalized)) return 'Build';

  return null;
};

/**
 * Display label for Lifecycle columns: when registry lifecycle is "In Review",
 * show the stage being reviewed (from reviewDocumentPath) instead.
 */
export const lifecycleDisplayForIdea = (idea: {
  lifecycle: string;
  notes?: string;
}): string => {
  if (idea.lifecycle !== 'In Review') return idea.lifecycle;
  return reviewStageFromPath(parseReviewDocumentPath(idea.notes)) ?? 'In Review';
};
