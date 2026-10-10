/**
 * Tests for normalizeRenderPath — both harness-root and initiatives-relative forms.
 * Run with: npx tsx src/server/utils/renderPath.test.ts
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { normalizeRenderPath } from './renderPath.js';

// Self-contained fixture harness root, so the test doesn't depend on whatever
// initiative docs happen to exist in the real repo.
const harnessRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'renderPath-test-'));

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

console.log('\nrenderPath.test.ts\n');

const sidebarStyle =
  'Time2Magic/Agent Harness Web UI/Harness platform strategy/02_pressure_test.md';
const harnessRootStyle =
  'initiatives/Time2Magic/Agent Harness Web UI/Harness platform strategy/02_pressure_test.md';

const fixtureFile = path.join(harnessRoot, harnessRootStyle);
fs.mkdirSync(path.dirname(fixtureFile), { recursive: true });
fs.writeFileSync(fixtureFile, '# fixture\n');

assert(
  normalizeRenderPath(sidebarStyle) === path.join('initiatives', sidebarStyle),
  'sidebar-style path gets initiatives/ prepended'
);

assert(
  normalizeRenderPath(harnessRootStyle) === harnessRootStyle,
  'harness-root review link is left unchanged'
);

assert(
  normalizeRenderPath('initiatives') === 'initiatives',
  'bare initiatives segment is left unchanged'
);

const resolvedSidebar = path.join(harnessRoot, normalizeRenderPath(sidebarStyle));
const resolvedHarness = path.join(harnessRoot, normalizeRenderPath(harnessRootStyle));

assert(fs.existsSync(resolvedSidebar), `sidebar-style resolves on disk: ${resolvedSidebar}`);
assert(fs.existsSync(resolvedHarness), `harness-root style resolves on disk: ${resolvedHarness}`);
assert(
  resolvedSidebar === resolvedHarness,
  'both forms resolve to the same absolute path'
);

// Double-prefix regression: old bug would look for initiatives/initiatives/...
const buggy = path.join(harnessRoot, 'initiatives', harnessRootStyle);
assert(!fs.existsSync(buggy), 'double-prefixed path must not exist (regression guard)');

fs.rmSync(harnessRoot, { recursive: true, force: true });

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
