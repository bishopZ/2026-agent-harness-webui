import { Router } from 'express';
import fs from 'fs';
import { marked } from 'marked';
import { guardOrReject } from './files.js';
import { rewriteMarkdownLinks } from '../utils/linkRewrite.js';
import { normalizeRenderPath } from '../utils/renderPath.js';

export function createRenderRouter(harnessRoot: string): Router {
  const router = Router();

  /**
   * GET /api/render?path=<relative-path>
   * Reads a .md file from HARNESS_ROOT, renders it to HTML via marked v12,
   * rewrites relative .md hrefs to /doc?path= in-app routes,
   * and returns { html: string }.
   *
   * `path` may be initiatives-relative (sidebar) or harness-root
   * (`reviewDocumentPath` / AGENTS.md). See normalizeRenderPath.
   */
  router.get('/', (req, res) => {
    const requestedPath = req.query['path'] as string | undefined;
    if (!requestedPath) {
      res.status(400).json({ error: 'path query parameter is required' });
      return;
    }

    const restoredPath = normalizeRenderPath(requestedPath);
    const safePath = guardOrReject(harnessRoot, restoredPath, res);
    if (!safePath) return; // guardOrReject already sent 403

    if (!fs.existsSync(safePath)) {
      res.status(404).json({ error: `File not found: ${requestedPath}` });
      return;
    }

    let content: string;
    try {
      content = fs.readFileSync(safePath, 'utf8');
    } catch (err) {
      console.error('[/api/render] Read error:', err);
      res.status(500).json({ error: 'Failed to read file' });
      return;
    }

    let rawHtml: string;
    try {
      rawHtml = marked(content) as string;
    } catch (err) {
      console.error('[/api/render] Marked error:', err);
      res.status(500).json({ error: 'Failed to render Markdown' });
      return;
    }

    const html = rewriteMarkdownLinks(rawHtml);
    res.json({ html });
  });

  return router;
}
