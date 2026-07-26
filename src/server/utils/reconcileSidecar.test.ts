/**
 * reconcileSidecar.test.ts — new ideas infer In Review from brief artifacts.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { buildDiscoverResponse, reconcile } from './reconcileSidecar.js';
import type { PrioritiesFile } from './sidecarTypes.js';

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

  // Discover response should surface the stage under review, not "In Review"
  idea!.notes =
    'reviewDocumentPath: initiatives/TestInit/General/Test Idea/01_brief.md';
  const discover = buildDiscoverResponse({
    version: 3,
    updated: '2026-05-29',
    initiatives: {
      TestInit: {
        tier: 5,
        lastWork: '',
        projects: {
          General: {
            priority: 'Medium',
            ideas: { 'Test Idea': { ...idea! } },
          },
        },
      },
    },
  } satisfies PrioritiesFile);
  const display =
    discover.initiatives['TestInit']?.projects['General']?.ideas['Test Idea']
      ?.lifecycle;
  assert(display === 'Brief', `discover lifecycle should be Brief, got ${display}`);
  assert(
    idea?.lifecycle === 'In Review',
    'buildDiscoverResponse must not mutate the sidecar idea'
  );

  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('reconcileSidecar.test.ts: all assertions passed');
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
