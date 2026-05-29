import fs from 'fs';
import path from 'path';

const STATUS_LINE = /^\*\*Status:\*\*\s*(.+)$/im;

const ARTIFACT_FILES = [
  '09_growth_log.md',
  '08_marketing_pack.md',
  '07_launch_plan.md',
  '06_evaluation.md',
  '05_build_plan.md',
  '04_design.md',
  '03_prd.md',
  '02b_customer_discovery.md',
  '02_market_research.md',
  '02_pressure_test.md',
  '01_brief.md',
];

/**
 * Read lifecycle hint from artifact front matter (**Status:** line).
 * Returns canonical lifecycle string or null if not found.
 */
export const parseArtifactStatus = (fileContent: string): string | null => {
  const match = fileContent.match(STATUS_LINE);
  if (!match) return null;
  const raw = match[1].trim();
  if (/in\s+review/i.test(raw)) return 'In Review';
  if (/approved/i.test(raw)) return null;
  return null;
};

/**
 * Infer initial lifecycle for a new sidecar idea from on-disk artifacts.
 * Used only when creating a new idea entry during reconcile (not for overwrites).
 */
export const inferLifecycleFromArtifacts = (ideaFolderPath: string): string => {
  if (!fs.existsSync(ideaFolderPath)) return 'Backlog';

  for (const fileName of ARTIFACT_FILES) {
    const filePath = path.join(ideaFolderPath, fileName);
    if (!fs.existsSync(filePath)) continue;
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const status = parseArtifactStatus(content);
      if (status === 'In Review') return 'In Review';
    } catch {
      continue;
    }
  }

  if (fs.existsSync(path.join(ideaFolderPath, '01_brief.md'))) {
    return 'Backlog';
  }

  return 'Backlog';
};
