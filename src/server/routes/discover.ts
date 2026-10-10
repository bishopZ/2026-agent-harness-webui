import { Router } from 'express';
import { reconcile, buildDiscoverResponse } from '../utils/reconcileSidecar.js';

/**
 * GET /api/discover
 *
 * Re-runs the filesystem walk + priorities.json reconcile on every call so the
 * response always reflects the current harness state.  Returns the merged tree:
 *
 * {
 *   version, updated,
 *   initiatives: {
 *     "[Initiative]": {
 *       tier, lastWork,
 *       projects: {
 *         "[Project]": {
 *           priority, purpose,
 *           ideas: {
 *             "[Idea]": {
 *               priority, lifecycle, lastUpdated, notes, checkpoint?,   ← as stored
 *               view: { stage, inReview, reviewDocumentPath?, next?, build? }  ← derived
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 *
 * Stored fields pass through untouched. `view` is computed per request from
 * the registry plus the idea folder (see `ideaView.ts`) and is never written.
 */
export function createDiscoverRouter(harnessRoot: string): Router {
  const router = Router();

  router.get('/', async (_req, res) => {
    try {
      const sidecar = await reconcile(harnessRoot);
      res.json(buildDiscoverResponse(sidecar, harnessRoot));
    } catch (err) {
      console.error('[/api/discover] Reconcile error:', err);
      res.status(500).json({ error: 'Failed to discover harness' });
    }
  });

  return router;
}
