/**
 * POST /api/priorities
 *
 * Body: { path: string, value: unknown }
 *
 * `path` is a dot-separated key into priorities.json, e.g.:
 *   "initiatives.Time2Magic.tier"
 *   "initiatives.Time2Magic.projects.Agent Harness Web UI.priority"
 *   "initiatives.Time2Magic.projects.Agent Harness Web UI.ideas.Local shell and priority forms.priority"
 *
 * Rules (ADR-AHWUI-04):
 *   - Only paths ending in ".tier" or ".priority" are accepted; others → 400.
 *   - The resolved key must exist in the current priorities.json; unknown keys → 400.
 *   - Value type must match the field: tier → integer, priority → High|Medium|Low; else → 400.
 *
 * Success: HTTP 200 { ok: true }
 * Failure: HTTP 400 { ok: false, message: string }
 */

import { Router } from 'express';
import { applyPriorityUpdate } from '../utils/writePriorities.js';

export function createPrioritiesRouter(harnessRoot: string): Router {
  const router = Router();

  router.post('/', async (req, res) => {
    const { path: dotPath, value } = req.body as {
      path: unknown;
      value: unknown;
    };

    // Basic shape validation
    if (typeof dotPath !== 'string' || dotPath.trim() === '') {
      res.status(400).json({ ok: false, message: '"path" must be a non-empty string.' });
      return;
    }

    try {
      const result = await applyPriorityUpdate(harnessRoot, dotPath.trim(), value);
      if (result.ok) {
        res.status(200).json({ ok: true });
      } else {
        res.status(result.status).json({ ok: false, message: result.message });
      }
    } catch (err) {
      console.error('[POST /api/priorities] Unexpected error:', err);
      res.status(500).json({ ok: false, message: 'Internal server error.' });
    }
  });

  return router;
}
