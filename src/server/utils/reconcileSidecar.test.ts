/**
 * reconcileSidecar.test.ts — new ideas infer In Review from brief artifacts.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { reconcile } from './reconcileSidecar.js';

const assert = (cond: boolean, msg: string) => {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
};

const main = async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'reconcile-test-'));
  const initDir = path.join(tmp, 'initiatives', 'TestInit', 'General', 'Test Idea');
  fs.mkdirSync(initDir, { recursive: true });

  fs.writeFileSync(
    path.join(initDir, '01_brief.md'),
    `# Test Idea\n\n**Status:** In Review\n**Captured:** 2026-05-29\n`
  );

  const sidecar = await reconcile(tmp);
  const idea = sidecar.initiatives['TestInit']?.projects['General']?.ideas['Test Idea'];
  assert(idea !== undefined, 'idea should exist after reconcile');
  assert(
    idea?.lifecycle === 'In Review',
    `expected In Review, got ${idea?.lifecycle}`
  );

  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('reconcileSidecar.test.ts: all assertions passed');
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
