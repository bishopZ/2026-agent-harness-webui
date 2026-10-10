import { Router } from 'express';
import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import { guardPath } from '../utils/pathGuard.js';

/** Directory names skipped entirely when walking the harness tree. */
const SKIP_DIRS = new Set(['node_modules']);

/**
 * Directory names shown in the sidebar as a single "open in Finder" row.
 * The walk lists them but never descends into them.
 */
export const LINK_DIRS = new Set(['repo', 'repos', 'sources']);

export interface HarnessTreeListing {
  /** `.md` file paths relative to `initiatives/`. */
  files: string[];
  /** `repo` / `repos` / `sources` folder paths relative to `initiatives/`. */
  folders: string[];
}

/**
 * Walk `dir` and collect `.md` files plus link folders, as paths relative to
 * `root`. Hidden entries and node_modules are skipped; link folders are
 * listed but not walked.
 */
export function collectHarnessTree(dir: string, root: string): HarnessTreeListing {
  const out: HarnessTreeListing = { files: [], folders: [] };
  walk(dir, root, out);
  out.files.sort((a, b) => a.localeCompare(b));
  out.folders.sort((a, b) => a.localeCompare(b));
  return out;
}

function walk(dir: string, root: string, out: HarnessTreeListing): void {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    // Skip hidden files/dirs (e.g. .git, .env)
    if (entry.name.startsWith('.')) continue;

    const fullPath = path.join(dir, entry.name);

    // Belt-and-suspenders: stay inside root.
    try {
      guardPath(root, path.relative(root, fullPath));
    } catch {
      continue;
    }

    const rel = path.relative(root, fullPath).split(path.sep).join('/');

    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      if (LINK_DIRS.has(entry.name)) {
        out.folders.push(rel);
        continue;
      }
      walk(fullPath, root, out);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.files.push(rel);
    }
  }
}

/**
 * The OS command that shows `absPath` in the file manager.
 * Folders open directly; files open their containing folder (with the file
 * selected where the platform supports it).
 */
export function revealCommand(
  absPath: string,
  isDir: boolean,
  platform: NodeJS.Platform = process.platform
): { cmd: string; args: string[] } {
  if (platform === 'darwin') {
    return { cmd: 'open', args: isDir ? [absPath] : ['-R', absPath] };
  }
  if (platform === 'win32') {
    return { cmd: 'explorer', args: isDir ? [absPath] : [`/select,${absPath}`] };
  }
  return { cmd: 'xdg-open', args: [isDir ? absPath : path.dirname(absPath)] };
}

export function createFilesRouter(harnessRoot: string): Router {
  const router = Router();
  const initiativesRoot = path.join(harnessRoot, 'initiatives');

  /**
   * GET /api/files
   * All .md file paths under initiatives/, sorted, relative to initiatives/.
   * repo / repos / sources folders are not walked (see /api/files/folders).
   */
  router.get('/', (_req, res) => {
    try {
      res.json(collectHarnessTree(initiativesRoot, initiativesRoot).files);
    } catch (err) {
      console.error('[/api/files] Error walking harness:', err);
      res.status(500).json({ error: 'Failed to list files' });
    }
  });

  /**
   * GET /api/files/folders
   * repo / repos / sources folder paths under initiatives/, relative to
   * initiatives/. The sidebar shows these as "open in Finder" rows.
   */
  router.get('/folders', (_req, res) => {
    try {
      res.json(collectHarnessTree(initiativesRoot, initiativesRoot).folders);
    } catch (err) {
      console.error('[/api/files/folders] Error walking harness:', err);
      res.status(500).json({ error: 'Failed to list folders' });
    }
  });

  /**
   * POST /api/files/reveal  { path: string }
   * `path` is relative to initiatives/ (as returned by /api/files).
   * Opens a folder in Finder, or a file's containing folder with it selected.
   */
  router.post('/reveal', (req, res) => {
    const rel: unknown = req.body?.path;
    if (typeof rel !== 'string') {
      res.status(400).json({ error: 'path (string) is required' });
      return;
    }
    let abs: string;
    try {
      abs = guardPath(initiativesRoot, rel);
    } catch {
      res.status(403).json({ error: 'Forbidden: path traversal detected' });
      return;
    }
    let stat: fs.Stats;
    try {
      stat = fs.statSync(abs);
    } catch {
      res.status(404).json({ error: 'Not found' });
      return;
    }
    const { cmd, args } = revealCommand(abs, stat.isDirectory());
    execFile(cmd, args, (err) => {
      if (err) {
        console.error('[/api/files/reveal] Failed to open:', err);
        res.status(500).json({ error: 'Failed to open in file manager' });
        return;
      }
      res.json({ ok: true });
    });
  });

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
