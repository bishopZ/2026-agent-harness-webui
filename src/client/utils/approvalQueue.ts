/**
 * Client-side approval queue derivation.
 *
 * The server queue (`GET /api/approval-queue`) lists ideas whose registry
 * `lifecycle` is "In Review". Backlog ideas are also waiting on the owner —
 * they need a go-ahead before The Agent starts a Brief — so the front end adds
 * them from the `/api/discover` tree it already has. Agents keep writing plain
 * `lifecycle: "Backlog"`; nothing new is stored and no agent rule changes.
 */

import type { DiscoverData } from '../components/InitiativeTable.js';

export interface QueueItem {
  initiative: string;
  project: string;
  idea: string;
  /** Stage under review (Brief, Pressure Test, …), or "Backlog" for a captured idea. */
  lifecycle: string;
  lastUpdated: string;
  reviewDocumentPath?: string;
}

export const BACKLOG_STAGE = 'Backlog';

const isBacklog = (lifecycle: string | undefined): boolean =>
  (lifecycle ?? '').trim().toLowerCase() === 'backlog';

/** Every idea in the discover tree with `lifecycle: "Backlog"`, as queue rows. */
export const collectBacklogItems = (data: DiscoverData): QueueItem[] => {
  const items: QueueItem[] = [];
  for (const [initiative, initEntry] of Object.entries(data.initiatives ?? {})) {
    for (const [project, projEntry] of Object.entries(initEntry.projects ?? {})) {
      for (const [idea, ideaEntry] of Object.entries(projEntry.ideas ?? {})) {
        if (!isBacklog(ideaEntry.lifecycle)) continue;
        items.push({
          initiative,
          project,
          idea,
          lifecycle: BACKLOG_STAGE,
          lastUpdated: ideaEntry.lastUpdated ?? '',
        });
      }
    }
  }
  return items;
};

const itemKey = (item: QueueItem): string =>
  `${item.initiative}/${item.project}/${item.idea}`;

/**
 * Server In Review rows first (work already done, waiting on you), then
 * Backlog rows. De-duplicated by idea path in case the server ever starts
 * returning Backlog ideas itself.
 */
export const buildApprovalQueue = (
  serverItems: QueueItem[],
  data: DiscoverData | null,
): QueueItem[] => {
  if (!data) return serverItems;
  const seen = new Set(serverItems.map(itemKey));
  const backlog = collectBacklogItems(data).filter(item => !seen.has(itemKey(item)));
  return [...serverItems, ...backlog];
};
