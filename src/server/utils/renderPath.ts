import path from 'path';

/**
 * Normalize a /api/render `path` query value to a harness-root-relative path.
 *
 * Sidebar /api/files returns paths relative to `initiatives/` (no prefix).
 * AGENTS.md `reviewDocumentPath` is harness-root relative and includes `initiatives/`.
 * Accept both forms so approval-queue deep links and the doc tree both work.
 */
export const normalizeRenderPath = (requestedPath: string): string => {
  const normalized = requestedPath.replace(/\\/g, '/');
  if (
    normalized === 'initiatives' ||
    normalized.startsWith('initiatives/')
  ) {
    return requestedPath;
  }
  return path.join('initiatives', requestedPath);
};
