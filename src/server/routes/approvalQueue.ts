import { Router } from 'express';
import { loadCurrentSidecar } from '../utils/reconcileSidecar.js';

export interface QueueItem {
  initiative: string;
  project: string;
  idea: string;
  lifecycle: string;
  lastUpdated: string;
  reviewDocumentPath?: string;
}

/**
 * GET /api/approval-queue
 *
 * Reads priorities.json and returns an array of every idea whose lifecycle
 * field equals "In Review".  Returns [] when nothing is pending.
 *
 * Response shape: QueueItem[]
 */
export function createApprovalQueueRouter(harnessRoot: string): Router {
  const router = Router();

  router.get('/', (_req, res) => {
    try {
      const sidecar = loadCurrentSidecar(harnessRoot);
      const queue: QueueItem[] = [];

      for (const [initName, initEntry] of Object.entries(sidecar.initiatives)) {
        for (const [projName, projEntry] of Object.entries(initEntry.projects)) {
          for (const [ideaName, ideaEntry] of Object.entries(projEntry.ideas)) {
            if (ideaEntry.lifecycle === 'In Review') {
              const match = ideaEntry.notes?.match(/^reviewDocumentPath:\s+(.+)$/m);
              const reviewDocumentPath = match ? match[1].trim() : undefined;
              queue.push({
                initiative: initName,
                project: projName,
                idea: ideaName,
                lifecycle: ideaEntry.lifecycle,
                lastUpdated: ideaEntry.lastUpdated,
                ...(reviewDocumentPath !== undefined && { reviewDocumentPath }),
              });
            }
          }
        }
      }

      res.json(queue);
    } catch (err) {
      console.error('[/api/approval-queue] Error:', err);
      res.status(500).json({ error: 'Failed to build approval queue' });
    }
  });

  return router;
}
