/**
 * Task 12 — pathGuard.test.ts
 *
 * Tests for:
 *   NF-01  path traversal guard (guardPath)
 *   NF-03  server binds only to 127.0.0.1 (source assertion)
 *   NF-05  startup error messages include the invalid path + SYSTEM_OVERVIEW.md
 *
 * Run with:  npx tsx src/server/utils/pathGuard.test.ts
 */

import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { guardPath } from './pathGuard.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string): void {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}`);
    failed++;
  }
}

function assertThrows(fn: () => unknown, expectedMessage: string, label: string): void {
  try {
    fn();
    console.error(`  ✗ ${label} — expected throw but none occurred`);
    failed++;
  } catch (err: unknown) {
    const ok = err instanceof Error && err.message === expectedMessage;
    if (ok) {
      console.log(`  ✓ ${label}`);
      passed++;
    } else {
      console.error(`  ✗ ${label} — threw "${err instanceof Error ? err.message : String(err)}", expected "${expectedMessage}"`);
      failed++;
    }
  }
}

// ── NF-01: guardPath unit tests ───────────────────────────────────────────────

console.log('\n[NF-01] guardPath — traversal attacks must throw PATH_TRAVERSAL');

assertThrows(
  () => guardPath('/safe/root', '../../etc/passwd'),
  'PATH_TRAVERSAL',
  'throws PATH_TRAVERSAL on ../../etc/passwd'
);

assertThrows(
  () => guardPath('/safe/root', '../sibling'),
  'PATH_TRAVERSAL',
  'throws PATH_TRAVERSAL on ../sibling'
);

assertThrows(
  () => guardPath('/safe/root', '/etc/passwd'),
  'PATH_TRAVERSAL',
  'throws PATH_TRAVERSAL on absolute path /etc/passwd'
);

assertThrows(
  () => guardPath('/safe/root', '..'),
  'PATH_TRAVERSAL',
  'throws PATH_TRAVERSAL on ".."'
);

console.log('\n[NF-01] guardPath — safe paths must resolve correctly');

const resolved1 = guardPath('/safe/root', 'subdir/file.md');
assert(resolved1 === '/safe/root/subdir/file.md', 'returns /safe/root/subdir/file.md for safe path');

const resolved2 = guardPath('/safe/root', '.');
assert(resolved2 === '/safe/root', 'returns root for "."');

const resolved3 = guardPath('/safe/root', 'SYSTEM_OVERVIEW.md');
assert(resolved3 === '/safe/root/SYSTEM_OVERVIEW.md', 'returns joined path for root-level file');

// ── NF-03: server binds only to 127.0.0.1 ────────────────────────────────────

console.log('\n[NF-03] index.ts — server must bind to 127.0.0.1 only');

const indexSrc = readFileSync(path.join(__dirname, '../index.ts'), 'utf8');

assert(
  indexSrc.includes("'127.0.0.1'") || indexSrc.includes('"127.0.0.1"'),
  'app.listen passes "127.0.0.1" as the host'
);

assert(
  !indexSrc.includes("'0.0.0.0'") && !indexSrc.includes('"0.0.0.0"'),
  'app.listen does NOT bind to 0.0.0.0'
);

// Belt-and-suspenders: confirm the listen call is present and well-formed
assert(
  /app\.listen\([^)]*['"]127\.0\.0\.1['"]/.test(indexSrc),
  'app.listen call contains 127.0.0.1 in the argument list'
);

// ── NF-05: startup error messages are actionable ──────────────────────────────

console.log('\n[NF-05] config.ts — startup errors include path and SYSTEM_OVERVIEW.md');

const configSrc = readFileSync(path.join(__dirname, '../config.ts'), 'utf8');

assert(
  configSrc.includes('SYSTEM_OVERVIEW.md'),
  'config.ts error messages reference SYSTEM_OVERVIEW.md'
);

assert(
  configSrc.includes('${harnessRoot}') || configSrc.includes('${rawRoot}') || configSrc.includes('${rawPort}'),
  'config.ts error messages embed the bad value via template literal'
);

assert(
  configSrc.includes('process.exit(1)'),
  'config.ts calls process.exit(1) on validation failure'
);

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n[pathGuard.test] ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
