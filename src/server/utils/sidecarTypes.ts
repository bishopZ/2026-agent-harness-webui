/**
 * Shared type definitions for the priorities.json sidecar file.
 *
 * Only `tier` and `priority` fields are web-editable (POST /api/priorities).
 * All other fields are agent-maintained (lifecycle, lastWork, lastUpdated, notes,
 * checkpoint).
 *
 * Keep this shape SIMPLE. Agents edit the file by hand, so every field here is
 * one more thing they can get wrong. Anything the UI can work out from these
 * fields plus the files on disk belongs in the view layer (`ideaView.ts` on the
 * server, components on the client), never in a new stored field.
 */

export interface IdeaEntry {
  priority: string;     // "Very High" | "High" | "Medium" | "Low" | "Very Low"
  lifecycle: string;    // "Backlog" | "Brief" | "Build" | "In Review" | …
  lastUpdated: string;  // ISO date yyyy-mm-dd
  notes: string;
  /**
   * Build stage only: id of the checkpoint the build is at or heading toward,
   * exactly as written in the `05_build_plan.md` heading ("A", "C", "2").
   * Count, position, milestone name and owner-blocked state are all derived
   * by the view — do not store them.
   */
  checkpoint?: string;
}

export interface ProjectEntry {
  priority: string;     // "Very High" | "High" | "Medium" | "Low" | "Very Low"
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
