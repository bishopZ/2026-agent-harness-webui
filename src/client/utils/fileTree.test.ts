/**
 * Tests for Doc Reader file tree helpers.
 * Run with: npx tsx src/client/utils/fileTree.test.ts
 */

import {
  ancestorDirPaths,
  buildFileTree,
  normalizeSidebarPath,
  type FileTreeDir,
  type FileTreeFile,
} from './fileTree.js';

let passed = 0;
let failed = 0;

const assert = (condition: boolean, label: string): void => {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}`);
    failed++;
  }
};

console.log('\nfileTree.test.ts\n');

// ── normalizeSidebarPath ──────────────────────────────────────────────────────

assert(
  normalizeSidebarPath('Art of War/Pre-writing/01_brief.md') ===
    'Art of War/Pre-writing/01_brief.md',
  'sidebar-style path unchanged'
);

assert(
  normalizeSidebarPath(
    'initiatives/Art of War/Pre-writing/01_brief.md'
  ) === 'Art of War/Pre-writing/01_brief.md',
  'strips leading initiatives/'
);

assert(
  normalizeSidebarPath('initiatives\\Art of War\\01_brief.md') ===
    'Art of War/01_brief.md',
  'normalizes backslashes and strips initiatives/'
);

assert(normalizeSidebarPath('initiatives') === '', 'bare initiatives → empty');

assert(
  normalizeSidebarPath('/Art of War/01_brief.md') === 'Art of War/01_brief.md',
  'strips leading slash'
);

// ── ancestorDirPaths ──────────────────────────────────────────────────────────

assert(
  JSON.stringify(ancestorDirPaths('Art of War/Pre-writing/Voice/01_brief.md')) ===
    JSON.stringify(['Art of War', 'Art of War/Pre-writing', 'Art of War/Pre-writing/Voice']),
  'returns all parent folder keys'
);

assert(
  JSON.stringify(
    ancestorDirPaths('initiatives/Art of War/Pre-writing/01_brief.md')
  ) === JSON.stringify(['Art of War', 'Art of War/Pre-writing']),
  'ancestors work after normalizing initiatives/ prefix'
);

assert(
  JSON.stringify(ancestorDirPaths('readme.md')) === '[]',
  'root-level file has no ancestors'
);

// ── buildFileTree ─────────────────────────────────────────────────────────────

const tree = buildFileTree([
  'Time2Magic/wiki/index.md',
  'Art of War/Pre-writing/Voice/01_brief.md',
  'Art of War/Pre-writing/Voice/02_pressure_test.md',
  'Art of War/history/notes.md',
  'zeta.md',
]);

assert(tree.length === 3, 'top level has 3 nodes (2 dirs + 1 file)');
assert(tree[0].type === 'dir' && tree[0].name === 'Art of War', 'dirs sort before files; Art of War first');
assert(tree[1].type === 'dir' && tree[1].name === 'Time2Magic', 'Time2Magic second');
assert(tree[2].type === 'file' && tree[2].name === 'zeta.md', 'root file last');

const art = tree[0] as FileTreeDir;
assert(art.children.length === 2, 'Art of War has 2 children');
assert(art.children[0].type === 'dir' && art.children[0].name === 'history', 'history before Pre-writing (locale)');
assert(art.children[1].type === 'dir' && art.children[1].name === 'Pre-writing', 'Pre-writing present');

const voice = (art.children[1] as FileTreeDir).children[0] as FileTreeDir;
assert(voice.name === 'Voice' && voice.path === 'Art of War/Pre-writing/Voice', 'Voice folder path');
assert(voice.children.length === 2, 'Voice has 2 files');
assert(
  (voice.children[0] as FileTreeFile).path ===
    'Art of War/Pre-writing/Voice/01_brief.md',
  'file path is full relative path'
);
assert(
  (voice.children[0] as FileTreeFile).name === '01_brief.md',
  'file label is basename only'
);

const withPrefix = buildFileTree([
  'initiatives/Art of War/doc.md',
]);
assert(
  withPrefix[0]?.type === 'dir' &&
    withPrefix[0].name === 'Art of War' &&
    (withPrefix[0] as FileTreeDir).children[0]?.name === 'doc.md',
  'buildFileTree normalizes initiatives/ inputs'
);

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
