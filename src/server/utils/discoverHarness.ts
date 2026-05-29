import fs from 'fs';
import path from 'path';

/**
 * Folder names that are NOT projects when scanning an initiative directory
 * directly (i.e. when there is no explicit `projects/` subfolder).
 */
const RESERVED_INITIATIVE_DIRS = new Set([
  'wiki',
  'outputs',
  'sources',
  'history',
  'archive',
  '.archive',
  'projects',
  'node_modules',
  'raw',
  'agents',
  'rules',
  'skills',
  'repo',
]);

/**
 * Folder names that are NOT idea folders when scanning a project directory.
 * These are structural/output subfolders, not lifecycle idea containers.
 */
const RESERVED_IDEA_DIRS = new Set([
  'outputs',
  'repo',
  '05_build',
  'wiki',
  '.archive',
  'archive',
  'node_modules',
  'manuscript',
  'history',
]);

/**
 * Exact filenames that identify a folder as a lifecycle idea.
 * Any one of these present in a folder → that folder is an idea.
 */
const LIFECYCLE_ARTIFACT_NAMES = new Set([
  '01_brief.md',
  '03_prd.md',
  '04_design.md',
  '05_build_plan.md',
  '06_evaluation.md',
  '07_launch_plan.md',
  '08_marketing_pack.md',
  '09_growth_log.md',
]);

/** Returns true if `folderPath` contains at least one lifecycle artifact. */
function hasLifecycleArtifact(folderPath: string): boolean {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(folderPath, { withFileTypes: true });
  } catch {
    return false;
  }
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (LIFECYCLE_ARTIFACT_NAMES.has(entry.name)) return true;
    // Match 02_*.md pattern (pressure test, market research, customer discovery…)
    if (/^02_.*\.md$/.test(entry.name)) return true;
  }
  return false;
}

// ─── Public types ─────────────────────────────────────────────────────────────

export type IdeaMap = Record<string, Record<string, never>>;

export interface ProjectNode {
  ideas: IdeaMap;
}

export interface InitiativeNode {
  projects: Record<string, ProjectNode>;
}

/** Raw filesystem tree: no sidecar data, just structural discovery. */
export type HarnessTree = Record<string, InitiativeNode>;

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Discovers initiatives, projects, and ideas by traversing:
 *   HARNESS_ROOT/initiatives/[Initiative]/[Project]/[Idea]/
 *
 * When an initiative contains a `projects/` subfolder (demo-harness style),
 * projects are read from there instead of directly from the initiative dir.
 *
 * A folder qualifies as an **idea** only if it contains at least one lifecycle
 * artifact file (see LIFECYCLE_ARTIFACT_NAMES and the 02_*.md pattern).
 *
 * Returns a plain JS object. An absent or unreadable `initiatives/` dir
 * returns an empty object without throwing.
 */
export function discoverHarness(harnessRoot: string): HarnessTree {
  const result: HarnessTree = {};

  const initiativesDir = path.join(harnessRoot, 'initiatives');
  if (!fs.existsSync(initiativesDir)) return result;

  let initiativeEntries: fs.Dirent[];
  try {
    initiativeEntries = fs.readdirSync(initiativesDir, { withFileTypes: true });
  } catch {
    return result;
  }

  for (const initEntry of initiativeEntries) {
    if (!initEntry.isDirectory()) continue;
    if (initEntry.name.startsWith('.')) continue;

    const initPath = path.join(initiativesDir, initEntry.name);
    const projects: Record<string, ProjectNode> = {};

    // If the initiative has an explicit `projects/` subfolder (demo-harness
    // style), projects live there.  Otherwise, scan the initiative dir directly
    // and skip the reserved folder names.
    const explicitProjectsDir = path.join(initPath, 'projects');
    const useExplicitProjects = fs.existsSync(explicitProjectsDir)
      && fs.statSync(explicitProjectsDir).isDirectory();

    const projectsRoot = useExplicitProjects ? explicitProjectsDir : initPath;

    let projectEntries: fs.Dirent[];
    try {
      projectEntries = fs.readdirSync(projectsRoot, { withFileTypes: true });
    } catch {
      result[initEntry.name] = { projects };
      continue;
    }

    for (const projEntry of projectEntries) {
      if (!projEntry.isDirectory()) continue;
      if (projEntry.name.startsWith('.')) continue;
      // Skip reserved names only when reading directly from the initiative dir
      if (!useExplicitProjects && RESERVED_INITIATIVE_DIRS.has(projEntry.name)) continue;

      const projPath = path.join(projectsRoot, projEntry.name);
      const ideas: IdeaMap = {};

      let ideaEntries: fs.Dirent[];
      try {
        ideaEntries = fs.readdirSync(projPath, { withFileTypes: true });
      } catch {
        projects[projEntry.name] = { ideas };
        continue;
      }

      for (const ideaEntry of ideaEntries) {
        if (!ideaEntry.isDirectory()) continue;
        if (ideaEntry.name.startsWith('.')) continue;
        if (RESERVED_IDEA_DIRS.has(ideaEntry.name)) continue;

        const ideaPath = path.join(projPath, ideaEntry.name);
        if (hasLifecycleArtifact(ideaPath)) {
          ideas[ideaEntry.name] = {} as Record<string, never>;
        }
      }

      projects[projEntry.name] = { ideas };
    }

    result[initEntry.name] = { projects };
  }

  return result;
}
