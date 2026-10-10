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

/** A repo / repos / sources folder: shown as one row that opens in Finder. */
export type FileTreeLink = {
  type: 'link';
  name: string;
  path: string;
};

export type FileTreeNode = FileTreeDir | FileTreeFile | FileTreeLink;

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

type MutableNode = MutableDir | MutableFile | FileTreeLink;

/** Folders (including link folders) before files, then by name. */
const compareNodes = (a: FileTreeNode, b: FileTreeNode): number => {
  const rank = (n: FileTreeNode) => (n.type === 'file' ? 1 : 0);
  if (rank(a) !== rank(b)) return rank(a) - rank(b);
  return a.name.localeCompare(b.name);
};

const freezeNode = (node: MutableNode): FileTreeNode => {
  if (node.type === 'file' || node.type === 'link') {
    return { type: node.type, name: node.name, path: node.path };
  }
  const children = [...node.children.values()].map(freezeNode).sort(compareNodes);
  return { type: 'dir', name: node.name, path: node.path, children };
};

/**
 * Build a nested folder/file tree from flat initiatives-relative paths.
 * `linkPaths` are folders (repo / repos / sources) shown as single rows.
 */
export const buildFileTree = (paths: string[], linkPaths: string[] = []): FileTreeNode[] => {
  const root = new Map<string, MutableNode>();

  const insert = (raw: string, leafType: 'file' | 'link'): void => {
    const leafPath = normalizeSidebarPath(raw).replace(/\/+$/, '');
    if (!leafPath) return;
    const parts = leafPath.split('/').filter(Boolean);
    if (parts.length === 0) return;

    let level = root;
    let prefix = '';

    for (let i = 0; i < parts.length; i++) {
      const name = parts[i];
      const isLeaf = i === parts.length - 1;
      prefix = prefix ? `${prefix}/${name}` : name;

      if (isLeaf) {
        level.set(name, { type: leafType, name, path: leafPath });
        return;
      }

      const existing = level.get(name);
      if (existing?.type === 'dir') {
        level = existing.children;
        continue;
      }
      // Never nest anything under a link folder.
      if (existing?.type === 'link') return;

      const dir: MutableDir = {
        type: 'dir',
        name,
        path: prefix,
        children: new Map(),
      };
      level.set(name, dir);
      level = dir.children;
    }
  };

  for (const raw of linkPaths) insert(raw, 'link');
  for (const raw of paths) insert(raw, 'file');

  return [...root.values()].map(freezeNode).sort(compareNodes);
};
