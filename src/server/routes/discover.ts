import { Router } from 'express';
import { reconcile, buildDiscoverResponse } from '../utils/reconcileSidecar.js';

/**
 * GET /api/discover
 *
 * Re-runs the filesystem walk + priorities.json reconcile on every call so the
 * response always reflects the current harness state.  Returns the merged tree:
 *
 * {
 *   version: number,
 *   updated: string,
 *   initiatives: {
 *     "[Initiative]": {
 *       tier: number,
 *       lastWork: string,
 *       projects: {
 *         "[Project]": {
 *           priority: string,
 *           ideas: {
 *             "[Idea]": { priority, lifecycle, lastUpdated, notes }
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 */
export function createDiscoverRouter(harnessRoot: string): Router {
  const router = Router();

  router.get('/', async (_req, res) => {
    try {
      const sidecar = await reconcile(harnessRoot);
      res.json(buildDiscoverResponse(sidecar));
    } catch (err) {
      console.error('[/api/discover] Reconcile error:', err);
      res.status(500).json({ error: 'Failed to discover harness' });
    }
  });

  return router;
}
