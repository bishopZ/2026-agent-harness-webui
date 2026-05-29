/**
 * Typed helpers for agent-maintained fields in priorities.json.
 * Used by tests and migration; agents edit priorities.json directly per docs/priorities-registry.md.
 */

import fs from 'fs';
import writeFileAtomic from 'write-file-atomic';
import { prioritiesPath } from '../paths.js';
import {
  PrioritiesFile,
  IdeaEntry,
  ProjectEntry,
  InitiativeEntry,
  defaultIdea,
  defaultProject,
  defaultInitiative,
  todayISO,
} from './sidecarTypes.js';

export const VALID_LIFECYCLES = [
  'Backlog',
  'Brief',
  'PressureTest',
  'Research',
  'PRD',
  'Design',
  'Build',
  'Evaluation',
  'Launch',
  'Marketing',
  'Growth',
  'In Review',
  'On Hold',
  'Dropped',
  'Done',
] as const;

export type LifecycleStatus = (typeof VALID_LIFECYCLES)[number];

const loadSidecar = (harnessRoot: string): PrioritiesFile => {
  const filePath = prioritiesPath(harnessRoot);
  if (!fs.existsSync(filePath)) {
    return { version: 3, updated: todayISO(), initiatives: {} };
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as PrioritiesFile;
};

const writeSidecar = async (harnessRoot: string, data: PrioritiesFile): Promise<void> => {
  data.updated = todayISO();
  await writeFileAtomic(
    prioritiesPath(harnessRoot),
    JSON.stringify(data, null, 2) + '\n'
  );
};

export const assertValidLifecycle = (lifecycle: string): void => {
  if (!(VALID_LIFECYCLES as readonly string[]).includes(lifecycle)) {
    throw new Error(
      `Invalid lifecycle "${lifecycle}". Must be one of: ${VALID_LIFECYCLES.join(', ')}`
    );
  }
};

export const upsertInitiative = async (
  harnessRoot: string,
  initiativeName: string,
  fields: Partial<Pick<InitiativeEntry, 'tier' | 'lastWork'>>
): Promise<void> => {
  const sidecar = loadSidecar(harnessRoot);
  if (!sidecar.initiatives[initiativeName]) {
    sidecar.initiatives[initiativeName] = defaultInitiative();
  }
  const entry = sidecar.initiatives[initiativeName];
  if (fields.tier !== undefined) entry.tier = fields.tier;
  if (fields.lastWork !== undefined) entry.lastWork = fields.lastWork;
  await writeSidecar(harnessRoot, sidecar);
};

export const upsertProject = async (
  harnessRoot: string,
  initiativeName: string,
  projectName: string,
  fields: Partial<Pick<ProjectEntry, 'priority' | 'purpose'>>
): Promise<void> => {
  const sidecar = loadSidecar(harnessRoot);
  if (!sidecar.initiatives[initiativeName]) {
    sidecar.initiatives[initiativeName] = defaultInitiative();
  }
  const init = sidecar.initiatives[initiativeName];
  if (!init.projects[projectName]) {
    init.projects[projectName] = defaultProject();
  }
  const proj = init.projects[projectName];
  if (fields.priority !== undefined) proj.priority = fields.priority;
  if (fields.purpose !== undefined) proj.purpose = fields.purpose;
  await writeSidecar(harnessRoot, sidecar);
};

export const upsertIdea = async (
  harnessRoot: string,
  initiativeName: string,
  projectName: string,
  ideaName: string,
  fields: Partial<IdeaEntry>
): Promise<void> => {
  if (fields.lifecycle !== undefined) assertValidLifecycle(fields.lifecycle);
  const sidecar = loadSidecar(harnessRoot);
  if (!sidecar.initiatives[initiativeName]) {
    sidecar.initiatives[initiativeName] = defaultInitiative();
  }
  const init = sidecar.initiatives[initiativeName];
  if (!init.projects[projectName]) {
    init.projects[projectName] = defaultProject();
  }
  const proj = init.projects[projectName];
  if (!proj.ideas[ideaName]) {
    proj.ideas[ideaName] = defaultIdea();
  }
  const idea = proj.ideas[ideaName];
  if (fields.priority !== undefined) idea.priority = fields.priority;
  if (fields.lifecycle !== undefined) idea.lifecycle = fields.lifecycle;
  if (fields.lastUpdated !== undefined) idea.lastUpdated = fields.lastUpdated;
  if (fields.notes !== undefined) idea.notes = fields.notes;
  await writeSidecar(harnessRoot, sidecar);
};

export const setIdeaLifecycle = async (
  harnessRoot: string,
  initiativeName: string,
  projectName: string,
  ideaName: string,
  lifecycle: string
): Promise<void> => {
  await upsertIdea(harnessRoot, initiativeName, projectName, ideaName, {
    lifecycle,
    lastUpdated: todayISO(),
  });
};

export const removeIdea = async (
  harnessRoot: string,
  initiativeName: string,
  projectName: string,
  ideaName: string
): Promise<void> => {
  const sidecar = loadSidecar(harnessRoot);
  const proj = sidecar.initiatives[initiativeName]?.projects[projectName];
  if (proj?.ideas[ideaName]) {
    delete proj.ideas[ideaName];
    await writeSidecar(harnessRoot, sidecar);
  }
};
