import fs from 'fs';
import path from 'path';
import { resolveIdeaFolderPath } from './ideaPaths.js';
import type { IdeaEntry } from './sidecarTypes.js';

/**
 * Derived, display-ready view of one idea.
 *
 * Design rule: **priorities.json stays simple; the view is smart.** Agents
 * write a handful of plain fields (`lifecycle`, `lastUpdated`, `notes`, and at
 * Build a one-word `checkpoint`). Everything the Web UI needs beyond that —
 * which stage is under review, which document to open, how many checkpoints a
 * build has, how far along it is, whether it is waiting on the owner — is
 * computed here from the registry plus the idea's files on disk.
 *
 * Never write any of this back to priorities.json. If the UI needs a new
 * column, derive it here (or in the client) rather than adding a field agents
 * have to maintain.
 */

/** Stage artifacts, earliest stage first, with the label the UI shows. */
export const STAGE_ARTIFACTS: readonly { file: string; stage: string }[] = [
  { file: '01_brief.md', stage: 'Brief' },
  { file: '02_pressure_test.md', stage: 'Pressure Test' },
  { file: '02_market_research.md', stage: 'Research' },
  { file: '02b_customer_discovery.md', stage: 'Research' },
  { file: '03_prd.md', stage: 'PRD' },
  { file: '04_design.md', stage: 'Design' },
  { file: '05_build_plan.md', stage: 'Build' },
  { file: '06_evaluation.md', stage: 'Evaluation' },
  { file: '07_launch_plan.md', stage: 'Launch' },
  { file: '08_marketing_pack.md', stage: 'Marketing' },
  { file: '09_growth_log.md', stage: 'Growth' },
];

/** Registry spellings that read differently in the UI. */
const LIFECYCLE_LABELS: Record<string, string> = {
  PressureTest: 'Pressure Test',
};

export interface CheckpointHeading {
  /** Checkpoint id as written in the plan heading: "A", "C", "2", … */
  id: string;
  /** Short milestone name from the heading, decorations stripped. */
  name: string;
}

export interface BuildView {
  /** Harness-root posix path to `05_build_plan.md` (deep-link target). */
  planPath: string;
  /** Every `## Checkpoint X — Name` heading in the plan, in order. */
  checkpoints: CheckpointHeading[];
  /** Checkpoint id from the registry, normalised. Undefined = not recorded. */
  current?: string;
  /** Zero-based position of `current` = checkpoints already cleared. -1 when unknown. */
  index: number;
  /** Milestone name of `current`, from the plan heading. */
  name?: string;
}

export interface IdeaView {
  /** Stage label to display. For In Review ideas, the stage being reviewed. */
  stage: string;
  /** Waiting on the owner (registry `lifecycle: "In Review"`). */
  inReview: boolean;
  /** Harness-root path of the document to review (In Review ideas only). */
  reviewDocumentPath?: string;
  /** The "Next: …" sentence from notes, when there is one. */
  next?: string;
  /** Present while the idea is at Build and has a `05_build_plan.md`. */
  build?: BuildView;
}

// ─── Pure helpers (unit-tested) ───────────────────────────────────────────────

/**
 * Parse checkpoint headings from a build plan. Headings inside fenced code
 * blocks are ignored (plans sometimes quote the template). Duplicate ids keep
 * the first occurrence.
 */
export const parseCheckpoints = (markdown: string): CheckpointHeading[] => {
  const result: CheckpointHeading[] = [];
  const seen = new Set<string>();
  let inFence = false;

  for (const line of markdown.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = line.match(/^#{2,4}\s+Checkpoint\s+([A-Za-z0-9]+)\b(.*)$/);
    if (!match) continue;

    const id = match[1]!.toUpperCase();
    if (seen.has(id)) continue;
    seen.add(id);

    const name = match[2]!
      .replace(/^\s*[—–:,-]+\s*/, '')      // leading "— ", ": " or ", "
      .split(/\s+[—–]\s+\*\*/)[0]!          // trailing "— **APPROVED …**"
      .replace(/\*\*/g, '')
      .trim();

    result.push({ id, name });
  }

  return result;
};

/**
 * Normalise the registry `checkpoint` value. Accepts the simple form
 * (`"C"`, `"Checkpoint C"`) and tolerates the retired object form
 * (`{ current: "C", … }`) so older registries still render.
 */
export const normaliseCheckpointId = (value: unknown): string | undefined => {
  let raw: unknown = value;
  if (raw && typeof raw === 'object' && 'current' in raw) {
    raw = (raw as { current: unknown }).current;
  }
  if (typeof raw !== 'string' && typeof raw !== 'number') return undefined;

  const id = String(raw).replace(/^\s*checkpoint\s+/i, '').trim().toUpperCase();
  return id || undefined;
};

/** Pull the "Next: …" line out of free-text notes. */
export const extractNext = (notes?: string): string | undefined => {
  const match = notes?.match(/(?:^|[\s(*])Next(?:\s*\([^)\n]{0,80}\))?\s*:\**\s*([^\n]+)/);
  if (!match) return undefined;
  const text = match[1]!.trim();
  return text.length > 280 ? `${text.slice(0, 277)}…` : text;
};

export const lifecycleLabel = (lifecycle: string): string =>
  LIFECYCLE_LABELS[lifecycle] ?? lifecycle;

// ─── Derivation ───────────────────────────────────────────────────────────────

const toHarnessPath = (harnessRoot: string, absolute: string): string =>
  path.relative(harnessRoot, absolute).split(path.sep).join('/');

/** Latest-stage artifact present in the idea folder, or undefined. */
const latestArtifact = (folder: string): { file: string; stage: string } | undefined => {
  for (let i = STAGE_ARTIFACTS.length - 1; i >= 0; i--) {
    const artifact = STAGE_ARTIFACTS[i]!;
    if (fs.existsSync(path.join(folder, artifact.file))) return artifact;
  }
  return undefined;
};

const buildView = (
  harnessRoot: string,
  folder: string,
  checkpointValue: unknown,
): BuildView | undefined => {
  const planAbsolute = path.join(folder, '05_build_plan.md');
  if (!fs.existsSync(planAbsolute)) return undefined;

  let checkpoints: CheckpointHeading[] = [];
  try {
    checkpoints = parseCheckpoints(fs.readFileSync(planAbsolute, 'utf8'));
  } catch {
    // Unreadable plan: still link it, just without checkpoint detail.
  }

  const current = normaliseCheckpointId(checkpointValue);
  const index = current ? checkpoints.findIndex(c => c.id === current) : -1;

  return {
    planPath: toHarnessPath(harnessRoot, planAbsolute),
    checkpoints,
    ...(current !== undefined && { current }),
    index,
    ...(index >= 0 && { name: checkpoints[index]!.name }),
  };
};

/**
 * Compute the display view for one idea from its registry entry and its
 * folder on disk. Read-only: never touches priorities.json.
 */
export const deriveIdeaView = (
  harnessRoot: string,
  initiative: string,
  project: string,
  idea: string,
  entry: Pick<IdeaEntry, 'lifecycle' | 'notes'> & { checkpoint?: unknown },
): IdeaView => {
  const folder = resolveIdeaFolderPath(harnessRoot, initiative, project, idea);
  const inReview = entry.lifecycle === 'In Review';

  let stage = lifecycleLabel(entry.lifecycle);
  let reviewDocumentPath: string | undefined;

  if (inReview) {
    const artifact = latestArtifact(folder);
    if (artifact) {
      stage = artifact.stage;
      reviewDocumentPath = toHarnessPath(harnessRoot, path.join(folder, artifact.file));
    }
  }

  const build = stage === 'Build' ? buildView(harnessRoot, folder, entry.checkpoint) : undefined;
  const next = extractNext(entry.notes);

  return {
    stage,
    inReview,
    ...(reviewDocumentPath !== undefined && { reviewDocumentPath }),
    ...(next !== undefined && { next }),
    ...(build !== undefined && { build }),
  };
};
