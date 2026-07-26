/**
 * Client-side file tree helpers for the Doc Reader sidebar.
 *
 * /api/files returns flat paths relative to initiatives/ (no prefix).
 * Approval Queue deep links often include initiatives/ — normalize before compare.
 */

export type FileTreeDir = {
  type: 'dir';
  name: string;
  path: string;
  children: FileTreeNode[];
};

export type FileTreeFile = {
  type: 'file';
  name: string;
  path: string;
};

export type FileTreeNode = FileTreeDir | FileTreeFile;

/** Slash-normalize and strip a leading `initiatives/` so URL paths match /api/files. */
export const normalizeSidebarPath = (rawPath: string): string => {
  const normalized = rawPath.replace(/\\/g, '/').replace(/^\/+/, '');
  if (normalized === 'initiatives') return '';
  if (normalized.startsWith('initiatives/')) {
    return normalized.slice('initiatives/'.length);
  }
  return normalized;
};

/** Parent folder path keys for a file (e.g. `A`, `A/B` for `A/B/c.md`). */
export const ancestorDirPaths = (filePath: string): string[] => {
  const normalized = normalizeSidebarPath(filePath);
  const parts = normalized.split('/').filter(Boolean);
  if (parts.length <= 1) return [];
  const ancestors: string[] = [];
  for (let i = 1; i < parts.length; i++) {
    ancestors.push(parts.slice(0, i).join('/'));
  }
  return ancestors;
};

type MutableDir = {
  type: 'dir';
  name: string;
  path: string;
  children: Map<string, MutableNode>;
};

type MutableFile = {
  type: 'file';
  name: string;
  path: string;
};

type MutableNode = MutableDir | MutableFile;

const compareNodes = (a: FileTreeNode, b: FileTreeNode): number => {
  if (a.type !== b.type) return a.type === 'dir' ? -1 : 1;
  return a.name.localeCompare(b.name);
};

const freezeNode = (node: MutableNode): FileTreeNode => {
  if (node.type === 'file') {
    return { type: 'file', name: node.name, path: node.path };
  }
  const children = [...node.children.values()].map(freezeNode).sort(compareNodes);
  return { type: 'dir', name: node.name, path: node.path, children };
};

/** Build a nested folder/file tree from flat initiatives-relative paths. */
export const buildFileTree = (paths: string[]): FileTreeNode[] => {
  const root = new Map<string, MutableNode>();

  for (const raw of paths) {
    const filePath = normalizeSidebarPath(raw);
    if (!filePath) continue;
    const parts = filePath.split('/').filter(Boolean);
    if (parts.length === 0) continue;

    let level = root;
    let prefix = '';

    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      const isFile = i === parts.length - 1;
      prefix = prefix ? `${prefix}/${name}` : name;

      if (isFile) {
        level.set(name, { type: 'file', name, path: filePath });
        continue;
      }

      const existing = level.get(name);
      if (existing?.type === 'dir') {
        level = existing.children;
        continue;
      }

      const dir: MutableDir = {
        type: 'dir',
        name,
        path: prefix,
        children: new Map(),
      };
      level.set(name, dir);
      level = dir.children;
    }
  }

  return [...root.values()].map(freezeNode).sort(compareNodes);
};
