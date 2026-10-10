/**
 * Tests for the sidebar file listing and reveal command.
 * Run with: npx tsx src/server/routes/files.test.ts
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { collectHarnessTree, revealCommand } from './files.js';

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

console.log('\nfiles.test.ts\n');

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'files-test-'));
const touch = (rel: string) => {
  const p = path.join(tmp, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, '# x\n');
};
touch('Init/Proj/Idea/01_idea.md');
touch('Init/Proj/repo/README.md');
touch('Init/Proj/repos/a/README.md');
touch('Init/sources/notes.md');
touch('Init/Proj/node_modules/pkg/README.md');
touch('Init/.hidden/x.md');
fs.mkdirSync(path.join(tmp, 'Init/Other/sources'), { recursive: true });

const listing = collectHarnessTree(tmp, tmp);
assert(
  JSON.stringify(listing.files) === JSON.stringify(['Init/Proj/Idea/01_idea.md']),
  'files exclude repo, repos, sources, node_modules and hidden dirs'
);
assert(
  JSON.stringify(listing.folders) ===
    JSON.stringify(['Init/Other/sources', 'Init/Proj/repo', 'Init/Proj/repos', 'Init/sources']),
  'folders lists repo / repos / sources, including empty ones'
);
fs.rmSync(tmp, { recursive: true, force: true });

const macFile = revealCommand('/a/b/c.md', false, 'darwin');
assert(macFile.cmd === 'open' && macFile.args.join(' ') === '-R /a/b/c.md', 'macOS file: open -R');
const macDir = revealCommand('/a/b', true, 'darwin');
assert(macDir.cmd === 'open' && macDir.args.join(' ') === '/a/b', 'macOS folder: open');
const linuxFile = revealCommand('/a/b/c.md', false, 'linux');
assert(linuxFile.cmd === 'xdg-open' && linuxFile.args[0] === '/a/b', 'linux file: parent folder');

console.log(`\n${passed} passed, ${failed} failed\n`);
if (failed > 0) process.exit(1);
