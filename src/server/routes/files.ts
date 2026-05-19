import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { guardPath } from '../utils/pathGuard.js';

/** Directory names skipped when walking the harness tree for sidebar listing. */
const SKIP_DIRS = new Set(['node_modules']);

export function createFilesRouter(harnessRoot: string): Router {
  const router = Router();

  /**
   * GET /api/files
   * Returns all .md file paths under HARNESS_ROOT, sorted alphabetically,
   * as relative paths from HARNESS_ROOT.
   */
  router.get('/', (_req, res) => {
    try {
      const files = collectMdFiles(harnessRoot, harnessRoot);
      files.sort((a, b) => a.localeCompare(b));
      res.json(files);
    } catch (err) {
      console.error('[/api/files] Error walking harness:', err);
      res.status(500).json({ error: 'Failed to list files' });
    }
  });

  /**
   * Recursively collect all .md files under dir, returning paths relative to root.
   * Directories and non-.md files are excluded.
   */
  function collectMdFiles(dir: string, root: string): string[] {
    const results: string[] = [];
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return results;
    }
    for (const entry of entries) {
      // Skip hidden files/dirs (e.g. .git, .env)
      if (entry.name.startsWith('.')) continue;

      const fullPath = path.join(dir, entry.name);

      // Guard: ensure we stay inside harnessRoot (shouldn't be needed for
      // recursive walk starting from root, but belt-and-suspenders)
      try {
        guardPath(root, path.relative(root, fullPath));
      } catch {
        continue;
      }

      if (entry.isDirectory()) {
        if (SKIP_DIRS.has(entry.name)) continue;
        results.push(...collectMdFiles(fullPath, root));
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        results.push(path.relative(root, fullPath));
      }
    }
    return results;
  }

  return router;
}

/**
 * Render-endpoint path guard — exported so the render route can reuse it.
 * Returns the absolute path if safe, sends 403 and returns null if not.
 */
export function guardOrReject(
  harnessRoot: string,
  requestedPath: string,
  res: import('express').Response
): string | null {
  if (!requestedPath || requestedPath.trim() === '') {
    res.status(400).json({ error: 'path parameter is required' });
    return null;
  }
  try {
    return guardPath(harnessRoot, requestedPath);
  } catch {
    res.status(403).json({ error: 'Forbidden: path traversal detected' });
    return null;
  }
}
