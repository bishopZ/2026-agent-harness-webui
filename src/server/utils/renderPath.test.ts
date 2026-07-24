/**
 * Tests for normalizeRenderPath — both harness-root and initiatives-relative forms.
 * Run with: npx tsx src/server/utils/renderPath.test.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { normalizeRenderPath } from './renderPath.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const harnessRoot = path.resolve(__dirname, '../../..');

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

assert(
  normalizeRenderPath(sidebarStyle) === path.join('initiatives', sidebarStyle),
  'sidebar-style path gets initiatives/ prepended'
);

assert(
  normalizeRenderPath(harnessRootStyle) === harnessRootStyle,
  'harness-root reviewDocumentPath is left unchanged'
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

console.log(`\n${passed} passed, ${failed} failed\n`);
process.exit(failed > 0 ? 1 : 0);
