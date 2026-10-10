import { Router } from 'express';
import { loadCurrentSidecar } from '../utils/reconcileSidecar.js';
import { deriveIdeaView } from '../utils/ideaView.js';

export interface QueueItem {
  initiative: string;
  project: string;
  idea: string;
  /** Stage under review (Brief, Pressure Test, …), not the registry "In Review" flag. */
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
 * The registry only says *that* an idea is waiting. Which stage is under
 * review and which document to open are derived from the idea folder (latest
 * stage artifact on disk) — see `ideaView.ts`. Agents do not record them.
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
            if (ideaEntry.lifecycle !== 'In Review') continue;

            const view = deriveIdeaView(harnessRoot, initName, projName, ideaName, ideaEntry);
            queue.push({
              initiative: initName,
              project: projName,
              idea: ideaName,
              lifecycle: view.stage,
              lastUpdated: ideaEntry.lastUpdated,
              ...(view.reviewDocumentPath !== undefined && {
                reviewDocumentPath: view.reviewDocumentPath,
              }),
            });
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
