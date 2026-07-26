import fs from 'fs';
import writeFileAtomic from 'write-file-atomic';
import { prioritiesPath } from '../paths.js';
import { discoverHarness, HarnessTree } from './discoverHarness.js';
import { resolveIdeaFolderPath } from './ideaPaths.js';
import { inferLifecycleFromArtifacts } from './inferLifecycleFromArtifacts.js';
import {
  PrioritiesFile,
  InitiativeEntry,
  ProjectEntry,
  emptySidecar,
  defaultInitiative,
  defaultProject,
  defaultIdea,
  todayISO,
} from './sidecarTypes.js';
import { lifecycleDisplayForIdea } from './reviewStageFromPath.js';

// ─── File I/O helpers ─────────────────────────────────────────────────────────

function loadSidecar(harnessRoot: string): PrioritiesFile {
  const filePath = prioritiesPath(harnessRoot);
  if (!fs.existsSync(filePath)) return emptySidecar();
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw) as PrioritiesFile;
  } catch (err) {
    console.warn(`[reconcile] Could not parse ${filePath}:`, err);
    return emptySidecar();
  }
}

async function writeSidecar(harnessRoot: string, data: PrioritiesFile): Promise<void> {
  const filePath = prioritiesPath(harnessRoot);
  await writeFileAtomic(filePath, JSON.stringify(data, null, 2) + '\n');
}

// ─── Merge helpers ────────────────────────────────────────────────────────────

/**
 * Merge the filesystem tree into the existing sidecar data:
 * - ADD keys missing from sidecar (with defaults)
 * - PRUNE keys in sidecar that have no matching filesystem folder
 * - PRESERVE existing values for keys present in both
 *
 * Mutates `sidecar` in place.
 */
function mergeTrees(sidecar: PrioritiesFile, tree: HarnessTree, harnessRoot: string): void {
  const fsInitNames = new Set(Object.keys(tree));

  // Prune stale initiatives
  for (const initName of Object.keys(sidecar.initiatives)) {
    if (!fsInitNames.has(initName)) {
      delete sidecar.initiatives[initName];
    }
  }

  // Add/merge initiatives
  for (const [initName, initNode] of Object.entries(tree)) {
    if (!sidecar.initiatives[initName]) {
      sidecar.initiatives[initName] = defaultInitiative();
    }
    const sidecarInit: InitiativeEntry = sidecar.initiatives[initName];
    const fsProjectNames = new Set(Object.keys(initNode.projects));

    // Prune stale projects
    for (const projName of Object.keys(sidecarInit.projects)) {
      if (!fsProjectNames.has(projName)) {
        delete sidecarInit.projects[projName];
      }
    }

    // Add/merge projects
    for (const [projName, projNode] of Object.entries(initNode.projects)) {
      if (!sidecarInit.projects[projName]) {
        sidecarInit.projects[projName] = defaultProject();
      }
      const sidecarProj: ProjectEntry = sidecarInit.projects[projName];
      const fsIdeaNames = new Set(Object.keys(projNode.ideas));

      // Prune stale ideas
      for (const ideaName of Object.keys(sidecarProj.ideas)) {
        if (!fsIdeaNames.has(ideaName)) {
          delete sidecarProj.ideas[ideaName];
        }
      }

      // Add missing ideas (infer lifecycle from artifacts; never overwrite existing)
      for (const ideaName of Object.keys(projNode.ideas)) {
        if (!sidecarProj.ideas[ideaName]) {
          const ideaFolder = resolveIdeaFolderPath(
            harnessRoot,
            initName,
            projName,
            ideaName
          );
          const ideaEntry = defaultIdea();
          ideaEntry.lifecycle = inferLifecycleFromArtifacts(ideaFolder);
          sidecarProj.ideas[ideaName] = ideaEntry;
        }
      }
    }
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Run the full reconcile cycle:
 * 1. Discover filesystem tree
 * 2. Load (or create) priorities.json
 * 3. Merge: add missing keys with defaults, prune stale keys, preserve existing values
 * 4. Write back atomically
 * 5. Return the reconciled PrioritiesFile
 *
 * Called at server startup and on every GET /api/discover request.
 */
export async function reconcile(harnessRoot: string): Promise<PrioritiesFile> {
  const tree = discoverHarness(harnessRoot);
  const sidecar = loadSidecar(harnessRoot);

  mergeTrees(sidecar, tree, harnessRoot);
  sidecar.updated = todayISO();

  await writeSidecar(harnessRoot, sidecar);
  return sidecar;
}

/**
 * Build the merged response tree that combines filesystem structure with
 * sidecar priority/lifecycle data.  Used by GET /api/discover.
 *
 * Each initiative node includes: tier, lastWork, projects (with priority),
 * and ideas (with priority + lifecycle + lastUpdated + notes).
 *
 * For ideas with registry lifecycle "In Review", `lifecycle` in the response is
 * the stage under review (from reviewDocumentPath) — same as the approval queue.
 * Disk/`priorities.json` is not modified.
 */
export function buildDiscoverResponse(sidecar: PrioritiesFile): PrioritiesFile {
  const initiatives: PrioritiesFile['initiatives'] = {};

  for (const [initName, initEntry] of Object.entries(sidecar.initiatives)) {
    const projects: InitiativeEntry['projects'] = {};

    for (const [projName, projEntry] of Object.entries(initEntry.projects)) {
      const ideas: ProjectEntry['ideas'] = {};

      for (const [ideaName, ideaEntry] of Object.entries(projEntry.ideas)) {
        ideas[ideaName] = {
          ...ideaEntry,
          lifecycle: lifecycleDisplayForIdea(ideaEntry),
        };
      }

      projects[projName] = { ...projEntry, ideas };
    }

    initiatives[initName] = { ...initEntry, projects };
  }

  return { ...sidecar, initiatives };
}

/**
 * Convenience: reload the sidecar from disk without re-running the walk.
 * Use when you need the current on-disk state without a full reconcile.
 */
export function loadCurrentSidecar(harnessRoot: string): PrioritiesFile {
  return loadSidecar(harnessRoot);
}

/** Re-export for callers that resolve the sidecar location. */
export { prioritiesPath as sidecarPath };
export type { PrioritiesFile, IdeaEntry };
