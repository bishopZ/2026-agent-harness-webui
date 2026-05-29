/**
 * Legacy import — Task 8
 *
 * When priorities.json is ABSENT and DASHBOARD.md is present at HARNESS_ROOT,
 * seeds priorities.json by parsing:
 *   1. DASHBOARD.md  → initiative tier + lastWork
 *   2. initiatives/[Name]/ideas.md → project priority + idea lifecycle/priority
 *
 * All parse errors are warnings — they are never fatal.
 * This module is skipped entirely if priorities.json already exists.
 */

import fs from 'fs';
import path from 'path';
import writeFileAtomic from 'write-file-atomic';
import { discoverHarness } from './discoverHarness.js';
import {
  PrioritiesFile,
  emptySidecar,
  defaultInitiative,
  defaultProject,
  defaultIdea,
  todayISO,
} from './sidecarTypes.js';

// ─── Markdown table helpers ───────────────────────────────────────────────────

/** Strip common Markdown inline formatting from a cell value. */
function stripMarkdown(raw: string): string {
  return raw
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // **bold**
    .replace(/\*([^*]+)\*/g, '$1')       // *italic*
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // [text](url)
    .replace(/`([^`]+)`/g, '$1')         // `code`
    .trim();
}

/**
 * Parse a Markdown pipe table into rows of trimmed cell strings.
 * Skips separator rows (cells consisting only of dashes and colons).
 */
function parseTable(lines: string[]): string[][] {
  const rows: string[][] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;
    const cells = trimmed
      .split('|')
      .slice(1, -1)           // drop the leading/trailing empty strings
      .map(c => c.trim());
    // Skip separator rows: every cell is dashes/colons
    if (cells.every(c => /^[-:]+$/.test(c))) continue;
    if (cells.length === 0) continue;
    rows.push(cells);
  }
  return rows;
}

/**
 * Extract the URL from a Markdown link like `[text](url)`.
 * Returns the plain text if no link is found.
 */
function extractLinkUrl(cell: string): string | null {
  const m = cell.match(/\(([^)]+)\)/);
  return m ? m[1].trim() : null;
}

/**
 * Map a priority label (from ideas.md) to one of the canonical strings.
 * Falls back to "Medium" on unrecognised input.
 */
function normalisePriority(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower === 'high' || lower === '1') return 'High';
  if (lower === 'low' || lower === '3') return 'Low';
  return 'Medium';
}

// ─── DASHBOARD.md parser ──────────────────────────────────────────────────────

interface DashboardInitiative {
  folderName: string;   // derived from the URL in the Markdown link
  tier: number;
  lastWork: string;
}

/**
 * Parse the Initiatives table from DASHBOARD.md.
 *
 * Expected columns: Tier points | Initiative (link) | What | Last initiative work
 */
function parseDashboard(dashboardPath: string): DashboardInitiative[] {
  const results: DashboardInitiative[] = [];
  let content: string;
  try {
    content = fs.readFileSync(dashboardPath, 'utf8');
  } catch {
    console.warn(`[legacyImport] Could not read ${dashboardPath}`);
    return results;
  }

  // Find the Initiatives section
  const lines = content.split('\n');
  let inInitiativesTable = false;

  for (const line of lines) {
    // The initiatives table appears after a heading containing "## Initiatives"
    if (/^##\s+Initiatives/.test(line.trim())) {
      inInitiativesTable = true;
      continue;
    }
    // Stop when we hit the next top-level section
    if (inInitiativesTable && /^##\s/.test(line.trim())) {
      inInitiativesTable = false;
      break;
    }
    if (!inInitiativesTable) continue;

    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;

    const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
    if (cells.length < 4) continue;
    if (cells.every(c => /^[-:| ]+$/.test(c))) continue; // separator row

    // Col 0: tier points
    const tierRaw = stripMarkdown(cells[0]);
    const tier = parseInt(tierRaw, 10);
    if (isNaN(tier)) {
      console.warn(`[legacyImport] Could not parse tier from: "${cells[0]}"`);
      continue;
    }

    // Col 1: [Initiative Name](initiatives/FolderName/ideas.md)
    const url = extractLinkUrl(cells[1]);
    if (!url) {
      // Might be a plain name — use it directly
      const name = stripMarkdown(cells[1]);
      if (!name) continue;
      const lastWork = stripMarkdown(cells[3]) || '';
      results.push({ folderName: name, tier, lastWork });
      continue;
    }
    // Extract folder name from URL like "initiatives/Time2Magic/ideas.md"
    const urlDecoded = decodeURIComponent(url);
    const segments = urlDecoded.replace(/\\/g, '/').split('/');
    // Structure: initiatives / [FolderName] / ideas.md
    const folderName = segments[1] ?? stripMarkdown(cells[1]);
    if (!folderName) {
      console.warn(`[legacyImport] Could not extract folder from URL: "${url}"`);
      continue;
    }

    const lastWork = stripMarkdown(cells[3]) || '';
    results.push({ folderName, tier, lastWork });
  }

  return results;
}

// ─── ideas.md parser ─────────────────────────────────────────────────────────

interface ParsedIdea {
  name: string;
  status: string;
  priority: string;
}

interface ParsedProject {
  name: string;
  priority: string;
  ideas: ParsedIdea[];
}

/**
 * Parse an initiative's ideas.md.
 *
 * Extracts:
 * - Active Projects table: project name → priority
 * - Each "## Project: [Name]" section's idea table: idea name, status, priority
 *
 * Also copies Completed/Dropped Projects rows to project-history.md in the
 * initiative folder.
 */
function parseIdeasMd(ideasPath: string): ParsedProject[] {
  const projects: ParsedProject[] = [];
  let content: string;
  try {
    content = fs.readFileSync(ideasPath, 'utf8');
  } catch {
    console.warn(`[legacyImport] Could not read ${ideasPath}`);
    return projects;
  }

  const lines = content.split('\n');

  // ── Pass 1: Active Projects table ────────────────────────────────────────
  const projectPriorities: Record<string, string> = {};
  {
    let inActiveProjects = false;
    const tableLines: string[] = [];

    for (const line of lines) {
      if (/^##\s+Active Projects|^##\s+Projects/.test(line.trim())) {
        inActiveProjects = true;
        continue;
      }
      if (inActiveProjects && /^##\s/.test(line.trim())) {
        inActiveProjects = false;
      }
      if (inActiveProjects) tableLines.push(line);
    }

    const rows = parseTable(tableLines);
    // Columns: Project | Purpose | Priority  (skip header row: first row has "Project" as first cell)
    for (const row of rows) {
      if (row[0]?.toLowerCase() === 'project') continue; // header
      const projName = stripMarkdown(row[0] ?? '');
      const priority = normalisePriority(stripMarkdown(row[2] ?? 'Medium'));
      if (projName) projectPriorities[projName] = priority;
    }
  }

  // ── Pass 2: Per-project idea tables ──────────────────────────────────────
  {
    let currentProject: string | null = null;
    let collectingIdeas = false;
    const ideaLines: string[] = [];

    const flushProject = () => {
      if (!currentProject) return;
      const rows = parseTable(ideaLines);
      const ideas: ParsedIdea[] = [];
      for (const row of rows) {
        // Header row: first cell is "Idea" or similar
        if (row[0]?.toLowerCase() === 'idea') continue;
        const name = stripMarkdown(row[0] ?? '');
        const status = stripMarkdown(row[1] ?? 'Backlog');
        const priority = normalisePriority(stripMarkdown(row[2] ?? 'Medium'));
        if (name && name !== '*(Add ideas here)*') {
          ideas.push({ name, status, priority });
        }
      }
      projects.push({
        name: currentProject,
        priority: projectPriorities[currentProject] ?? 'Medium',
        ideas,
      });
      ideaLines.length = 0;
    };

    for (const line of lines) {
      // Match "## Project: SomeName"
      const projectMatch = line.trim().match(/^##\s+Project:\s+(.+)$/);
      if (projectMatch) {
        flushProject();
        currentProject = projectMatch[1].trim();
        collectingIdeas = true;
        continue;
      }
      // Stop collecting at the next heading of same or higher level that is NOT a project
      if (/^##\s/.test(line.trim()) && !line.trim().match(/^##\s+Project:/)) {
        flushProject();
        currentProject = null;
        collectingIdeas = false;
        continue;
      }
      if (collectingIdeas) {
        ideaLines.push(line);
      }
    }
    // Flush the last project
    flushProject();
  }

  return projects;
}

// ─── project-history.md writer ────────────────────────────────────────────────

/**
 * Copy Completed Projects and Dropped Projects table content from ideas.md
 * into initiatives/[Name]/project-history.md.  Non-fatal if it fails.
 */
function writeProjectHistory(ideasPath: string, initiativeDir: string): void {
  let content: string;
  try {
    content = fs.readFileSync(ideasPath, 'utf8');
  } catch {
    return;
  }

  const lines = content.split('\n');
  const historyLines: string[] = [
    `# Project History`,
    ``,
    `_Auto-generated from ideas.md during legacy import on ${todayISO()}._`,
    ``,
  ];

  const sections = ['## Completed Projects', '## Dropped Projects'];
  for (const sectionHeader of sections) {
    let inSection = false;
    for (const line of lines) {
      if (line.trim() === sectionHeader) { inSection = true; historyLines.push(line); continue; }
      if (inSection && /^##\s/.test(line.trim()) && line.trim() !== sectionHeader) break;
      if (inSection) historyLines.push(line);
    }
    historyLines.push('');
  }

  const historyPath = path.join(initiativeDir, 'project-history.md');
  try {
    fs.writeFileSync(historyPath, historyLines.join('\n'));
  } catch (err) {
    console.warn(`[legacyImport] Could not write ${historyPath}:`, err);
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

const SIDECAR_FILENAME = 'priorities.json';

/**
 * Run the legacy import.
 *
 * Conditions for running:
 * - priorities.json does NOT exist at HARNESS_ROOT
 * - DASHBOARD.md DOES exist at HARNESS_ROOT
 *
 * If priorities.json already exists, this function returns immediately without
 * reading or modifying anything.
 */
export async function runLegacyImport(harnessRoot: string): Promise<void> {
  const sidecarFilePath = path.join(harnessRoot, SIDECAR_FILENAME);
  const dashboardPath = path.join(harnessRoot, 'DASHBOARD.md');

  // Guard: skip if sidecar already exists
  if (fs.existsSync(sidecarFilePath)) {
    console.log('[legacyImport] priorities.json already exists — skipping legacy import.');
    return;
  }

  // Guard: skip if no DASHBOARD.md
  if (!fs.existsSync(dashboardPath)) {
    console.log('[legacyImport] No DASHBOARD.md found — skipping legacy import.');
    return;
  }

  console.log('[legacyImport] Seeding priorities.json from DASHBOARD.md + ideas.md…');

  // 1. Parse DASHBOARD.md for tier + lastWork per initiative
  const dashboardEntries = parseDashboard(dashboardPath);
  const dashboardByFolder: Record<string, { tier: number; lastWork: string }> = {};
  for (const entry of dashboardEntries) {
    dashboardByFolder[entry.folderName] = { tier: entry.tier, lastWork: entry.lastWork };
  }

  // 2. Discover the filesystem tree so we know which initiatives/projects/ideas exist
  const tree = discoverHarness(harnessRoot);

  // 3. Build the sidecar
  const sidecar: PrioritiesFile = emptySidecar();

  for (const [initFolderName, initNode] of Object.entries(tree)) {
    const dashInfo = dashboardByFolder[initFolderName];
    const initEntry = defaultInitiative();

    if (dashInfo) {
      initEntry.tier = dashInfo.tier;
      initEntry.lastWork = dashInfo.lastWork;
    }

    // 4. Parse ideas.md for project priority + idea lifecycle/priority
    const initiativeDir = path.join(harnessRoot, 'initiatives', initFolderName);
    const ideasPath = path.join(initiativeDir, 'ideas.md');
    const parsedProjects = parseIdeasMd(ideasPath);

    // Build a lookup: project name → parsed data
    const parsedByProject: Record<string, ParsedProject> = {};
    for (const pp of parsedProjects) {
      parsedByProject[pp.name] = pp;
    }

    // 5. Merge parsed data into the sidecar initiative entry
    for (const [projName, projNode] of Object.entries(initNode.projects)) {
      const parsedProj = parsedByProject[projName];
      const projEntry = defaultProject();

      if (parsedProj) {
        projEntry.priority = parsedProj.priority;

        // Build idea lookup from parsed ideas.md
        const parsedByIdea: Record<string, ParsedIdea> = {};
        for (const pi of parsedProj.ideas) {
          parsedByIdea[pi.name] = pi;
        }

        for (const ideaName of Object.keys(projNode.ideas)) {
          const parsedIdea = parsedByIdea[ideaName];
          const ideaEntry = defaultIdea();
          if (parsedIdea) {
            ideaEntry.lifecycle = parsedIdea.status || 'Backlog';
            ideaEntry.priority = parsedIdea.priority;
          }
          projEntry.ideas[ideaName] = ideaEntry;
        }
      } else {
        // No ideas.md data for this project — set all ideas to defaults
        for (const ideaName of Object.keys(projNode.ideas)) {
          projEntry.ideas[ideaName] = defaultIdea();
        }
      }

      initEntry.projects[projName] = projEntry;
    }

    sidecar.initiatives[initFolderName] = initEntry;

    // 6. Write project-history.md for this initiative
    writeProjectHistory(ideasPath, initiativeDir);
  }

  // 7. Write priorities.json atomically
  try {
    await writeFileAtomic(sidecarFilePath, JSON.stringify(sidecar, null, 2) + '\n');
    console.log(`[legacyImport] priorities.json written to ${sidecarFilePath}`);
    console.log(`[legacyImport] Seeded ${Object.keys(sidecar.initiatives).length} initiatives.`);
  } catch (err) {
    console.error('[legacyImport] Failed to write priorities.json:', err);
  }
}
