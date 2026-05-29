/**
 * Shared type definitions for the priorities.json sidecar file.
 *
 * Only `tier` and `priority` fields are web-editable (POST /api/priorities).
 * All other fields are agent-maintained (lifecycle, lastWork, lastUpdated, notes).
 */

export interface IdeaEntry {
  priority: string;     // "High" | "Medium" | "Low"
  lifecycle: string;    // "Backlog" | "Brief" | "Build" | "In Review" | …
  lastUpdated: string;  // ISO date yyyy-mm-dd
  notes: string;
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
