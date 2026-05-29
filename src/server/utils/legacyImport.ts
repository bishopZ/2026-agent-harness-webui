/**
 * Legacy markdown import — seeds or merges priorities.json from DASHBOARD.md + ideas.md.
 *
 * - `runLegacyImport`: one-time seed when priorities.json is absent (not run on server boot).
 * - `mergeMarkdownIntoSidecar`: overlay agent fields from markdown onto existing priorities.json.
 */

import fs from 'fs';
import path from 'path';
import writeFileAtomic from 'write-file-atomic';
import { discoverHarness } from './discoverHarness.js';
import { reconcile } from './reconcileSidecar.js';
import {
  PrioritiesFile,
  emptySidecar,
  defaultInitiative,
  defaultProject,
  defaultIdea,
  todayISO,
  IdeaEntry,
  ProjectEntry,
  InitiativeEntry,
} from './sidecarTypes.js';

// ─── Markdown table helpers ───────────────────────────────────────────────────

/** Strip common Markdown inline formatting from a cell value. */
export function stripMarkdown(raw: string): string {
  return raw
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim();
}

export function parseTable(lines: string[]): string[][] {
  const rows: string[][] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;
    const cells = trimmed
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells.every((c) => /^[-:]+$/.test(c))) continue;
    if (cells.length === 0) continue;
    rows.push(cells);
  }
  return rows;
}

function extractLinkUrl(cell: string): string | null {
  const m = cell.match(/\(([^)]+)\)/);
  return m ? m[1].trim() : null;
}

export function normalisePriority(raw: string): string {
  const lower = raw.toLowerCase();
  if (lower === 'high' || lower === '1') return 'High';
  if (lower === 'low' || lower === '3') return 'Low';
  return 'Medium';
}

// ─── DASHBOARD.md parser ──────────────────────────────────────────────────────

export interface DashboardInitiative {
  folderName: string;
  tier: number;
  lastWork: string;
}

export function parseDashboard(dashboardPath: string): DashboardInitiative[] {
  const results: DashboardInitiative[] = [];
  let content: string;
  try {
    content = fs.readFileSync(dashboardPath, 'utf8');
  } catch {
    console.warn(`[legacyImport] Could not read ${dashboardPath}`);
    return results;
  }

  const lines = content.split('\n');
  let inInitiativesTable = false;

  for (const line of lines) {
    if (/^##\s+Initiatives/.test(line.trim())) {
      inInitiativesTable = true;
      continue;
    }
    if (inInitiativesTable && /^##\s/.test(line.trim())) {
      inInitiativesTable = false;
      break;
    }
    if (!inInitiativesTable) continue;

    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;

    const cells = trimmed.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 4) continue;
    if (cells.every((c) => /^[-:| ]+$/.test(c))) continue;

    const tierRaw = stripMarkdown(cells[0]);
    if (/tier\s*points/i.test(tierRaw)) continue;
    const tier = parseInt(tierRaw, 10);
    if (isNaN(tier)) {
      console.warn(`[legacyImport] Could not parse tier from: "${cells[0]}"`);
      continue;
    }

    const url = extractLinkUrl(cells[1]);
    if (!url) {
      const name = stripMarkdown(cells[1]);
      if (!name) continue;
      const lastWork = stripMarkdown(cells[3]) || '';
      results.push({ folderName: name, tier, lastWork });
      continue;
    }
    const urlDecoded = decodeURIComponent(url);
    const segments = urlDecoded.replace(/\\/g, '/').split('/');
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

export interface ParsedIdea {
  name: string;
  status: string;
  priority: string;
  lastUpdated: string;
  notes: string;
}

export interface ParsedProject {
  name: string;
  priority: string;
  purpose: string;
  ideas: ParsedIdea[];
}

export function parseIdeasMd(ideasPath: string): ParsedProject[] {
  const projects: ParsedProject[] = [];
  let content: string;
  try {
    content = fs.readFileSync(ideasPath, 'utf8');
  } catch {
    console.warn(`[legacyImport] Could not read ${ideasPath}`);
    return projects;
  }

  const lines = content.split('\n');
  const projectPriorities: Record<string, string> = {};
  const projectPurposes: Record<string, string> = {};

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
    for (const row of rows) {
      if (row[0]?.toLowerCase() === 'project') continue;
      const projName = stripMarkdown(row[0] ?? '');
      const purpose = stripMarkdown(row[1] ?? '');
      const priority = normalisePriority(stripMarkdown(row[2] ?? 'Medium'));
      if (projName) {
        projectPriorities[projName] = priority;
        projectPurposes[projName] = purpose;
      }
    }
  }

  {
    let currentProject: string | null = null;
    let collectingIdeas = false;
    const ideaLines: string[] = [];

    const flushProject = () => {
      if (!currentProject) return;
      const rows = parseTable(ideaLines);
      const ideas: ParsedIdea[] = [];
      for (const row of rows) {
        if (row[0]?.toLowerCase() === 'idea') continue;
        const name = stripMarkdown(row[0] ?? '');
        const status = stripMarkdown(row[1] ?? 'Backlog');
        const priority = normalisePriority(stripMarkdown(row[2] ?? 'Medium'));
        const lastUpdated = stripMarkdown(row[3] ?? '') || todayISO();
        const notes = stripMarkdown(row[4] ?? '');
        if (name && name !== '*(Add ideas here)*') {
          ideas.push({ name, status, priority, lastUpdated, notes });
        }
      }
      projects.push({
        name: currentProject,
        priority: projectPriorities[currentProject] ?? 'Medium',
        purpose: projectPurposes[currentProject] ?? '',
        ideas,
      });
      ideaLines.length = 0;
    };

    for (const line of lines) {
      const projectMatch = line.trim().match(/^##\s+Project:\s+(.+)$/);
      if (projectMatch) {
        flushProject();
        currentProject = projectMatch[1].trim();
        collectingIdeas = true;
        continue;
      }
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
    flushProject();
  }

  return projects;
}

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
      if (line.trim() === sectionHeader) {
        inSection = true;
        historyLines.push(line);
        continue;
      }
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

const SIDECAR_FILENAME = 'priorities.json';

function loadSidecarFile(harnessRoot: string): PrioritiesFile | null {
  const filePath = path.join(harnessRoot, SIDECAR_FILENAME);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) as PrioritiesFile;
  } catch (err) {
    console.warn(`[legacyImport] Could not parse ${filePath}:`, err);
    return null;
  }
}

/**
 * Build a full PrioritiesFile from DASHBOARD.md + ideas.md + filesystem discovery.
 */
export function importFromMarkdown(harnessRoot: string): PrioritiesFile {
  const dashboardPath = path.join(harnessRoot, 'DASHBOARD.md');
  const dashboardEntries = fs.existsSync(dashboardPath)
    ? parseDashboard(dashboardPath)
    : [];

  const dashboardByFolder: Record<string, { tier: number; lastWork: string }> = {};
  for (const entry of dashboardEntries) {
    dashboardByFolder[entry.folderName] = { tier: entry.tier, lastWork: entry.lastWork };
  }

  const tree = discoverHarness(harnessRoot);
  const sidecar: PrioritiesFile = emptySidecar();

  for (const [initFolderName, initNode] of Object.entries(tree)) {
    const dashInfo = dashboardByFolder[initFolderName];
    const initEntry = defaultInitiative();

    if (dashInfo) {
      initEntry.tier = dashInfo.tier;
      initEntry.lastWork = dashInfo.lastWork;
    }

    const initiativeDir = path.join(harnessRoot, 'initiatives', initFolderName);
    const ideasPath = path.join(initiativeDir, 'ideas.md');
    const parsedProjects = parseIdeasMd(ideasPath);
    const parsedByProject: Record<string, ParsedProject> = {};
    for (const pp of parsedProjects) {
      parsedByProject[pp.name] = pp;
    }

    for (const [projName, projNode] of Object.entries(initNode.projects)) {
      const parsedProj = parsedByProject[projName];
      const projEntry = defaultProject();

      if (parsedProj) {
        projEntry.priority = parsedProj.priority;
        projEntry.purpose = parsedProj.purpose;

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
            ideaEntry.lastUpdated = parsedIdea.lastUpdated;
            ideaEntry.notes = parsedIdea.notes;
          }
          projEntry.ideas[ideaName] = ideaEntry;
        }
      } else {
        for (const ideaName of Object.keys(projNode.ideas)) {
          projEntry.ideas[ideaName] = defaultIdea();
        }
      }

      initEntry.projects[projName] = projEntry;
    }

    sidecar.initiatives[initFolderName] = initEntry;

    if (fs.existsSync(ideasPath)) {
      writeProjectHistory(ideasPath, initiativeDir);
    }
  }

  sidecar.updated = todayISO();
  return sidecar;
}

/**
 * Overlay markdown-derived agent fields onto an existing priorities.json.
 * Preserves structural keys from reconcile; markdown wins for lifecycle, notes, lastUpdated, lastWork, tier.
 */
export async function mergeMarkdownIntoSidecar(harnessRoot: string): Promise<PrioritiesFile> {
  const dashboardPath = path.join(harnessRoot, 'DASHBOARD.md');
  let hasIdeasMd = false;
  const initiativesDir = path.join(harnessRoot, 'initiatives');
  if (fs.existsSync(initiativesDir)) {
    try {
      hasIdeasMd = fs.readdirSync(initiativesDir, { withFileTypes: true }).some(
        (e) =>
          e.isDirectory() &&
          fs.existsSync(path.join(initiativesDir, e.name, 'ideas.md'))
      );
    } catch {
      hasIdeasMd = false;
    }
  }
  const hasMarkdown = fs.existsSync(dashboardPath) || hasIdeasMd;

  if (!hasMarkdown) {
    console.log('[legacyImport] No DASHBOARD.md or ideas.md found — running reconcile only.');
    return reconcile(harnessRoot);
  }

  const fromMarkdown = importFromMarkdown(harnessRoot);
  let sidecar = loadSidecarFile(harnessRoot);

  if (!sidecar) {
    sidecar = fromMarkdown;
  } else {
    for (const [initName, mdInit] of Object.entries(fromMarkdown.initiatives)) {
      if (!sidecar.initiatives[initName]) {
        sidecar.initiatives[initName] = mdInit;
        continue;
      }
      const existingInit: InitiativeEntry = sidecar.initiatives[initName];
      if (mdInit.tier) existingInit.tier = mdInit.tier;
      if (mdInit.lastWork) existingInit.lastWork = mdInit.lastWork;

      for (const [projName, mdProj] of Object.entries(mdInit.projects)) {
        if (!existingInit.projects[projName]) {
          existingInit.projects[projName] = mdProj;
          continue;
        }
        const existingProj: ProjectEntry = existingInit.projects[projName];
        existingProj.priority = mdProj.priority;
        if (mdProj.purpose) existingProj.purpose = mdProj.purpose;

        for (const [ideaName, mdIdea] of Object.entries(mdProj.ideas)) {
          if (!existingProj.ideas[ideaName]) {
            existingProj.ideas[ideaName] = mdIdea;
            continue;
          }
          const existingIdea: IdeaEntry = existingProj.ideas[ideaName];
          existingIdea.lifecycle = mdIdea.lifecycle;
          existingIdea.priority = mdIdea.priority;
          existingIdea.lastUpdated = mdIdea.lastUpdated;
          existingIdea.notes = mdIdea.notes;
        }
      }
    }
    sidecar.updated = todayISO();
  }

  const filePath = path.join(harnessRoot, SIDECAR_FILENAME);
  await writeFileAtomic(filePath, JSON.stringify(sidecar, null, 2) + '\n');
  console.log(`[legacyImport] Merged markdown into ${filePath}`);

  return reconcile(harnessRoot);
}

/**
 * One-time seed when priorities.json is absent and DASHBOARD.md exists.
 * Not invoked on server startup — use `npm run migrate-registry` instead.
 */
export async function runLegacyImport(harnessRoot: string): Promise<void> {
  const sidecarFilePath = path.join(harnessRoot, SIDECAR_FILENAME);
  const dashboardPath = path.join(harnessRoot, 'DASHBOARD.md');

  if (fs.existsSync(sidecarFilePath)) {
    console.log('[legacyImport] priorities.json already exists — skipping seed.');
    return;
  }

  if (!fs.existsSync(dashboardPath)) {
    console.log('[legacyImport] No DASHBOARD.md found — skipping seed.');
    return;
  }

  console.log('[legacyImport] Seeding priorities.json from DASHBOARD.md + ideas.md…');
  const sidecar = importFromMarkdown(harnessRoot);

  try {
    await writeFileAtomic(sidecarFilePath, JSON.stringify(sidecar, null, 2) + '\n');
    console.log(`[legacyImport] priorities.json written to ${sidecarFilePath}`);
    console.log(`[legacyImport] Seeded ${Object.keys(sidecar.initiatives).length} initiatives.`);
  } catch (err) {
    console.error('[legacyImport] Failed to write priorities.json:', err);
  }
}
