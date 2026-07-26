/**
 * approvalQueue.test.ts — queue built from priorities.json In Review ideas.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import writeFileAtomic from 'write-file-atomic';
import { loadCurrentSidecar } from './reconcileSidecar.js';
import { lifecycleDisplayForIdea } from './reviewStageFromPath.js';

const assert = (cond: boolean, msg: string) => {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
};

const buildQueue = (harnessRoot: string) => {
  const sidecar = loadCurrentSidecar(harnessRoot);
  const queue: {
    initiative: string;
    project: string;
    idea: string;
    lifecycle: string;
  }[] = [];
  for (const [initName, initEntry] of Object.entries(sidecar.initiatives)) {
    for (const [projName, projEntry] of Object.entries(initEntry.projects)) {
      for (const [ideaName, ideaEntry] of Object.entries(projEntry.ideas)) {
        if (ideaEntry.lifecycle === 'In Review') {
          queue.push({
            initiative: initName,
            project: projName,
            idea: ideaName,
            lifecycle: lifecycleDisplayForIdea(ideaEntry),
          });
        }
      }
    }
  }
  return queue;
};

const main = async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'approval-queue-test-'));
  const priorities = {
    version: 3,
    updated: '2026-05-29',
    initiatives: {
      Acme: {
        tier: 5,
        lastWork: '',
        projects: {
          General: {
            priority: 'Medium',
            ideas: {
              'Queue Idea': {
                priority: 'Medium',
                lifecycle: 'In Review',
                lastUpdated: '2026-05-29',
                notes: 'test',
              },
              'Brief Idea': {
                priority: 'High',
                lifecycle: 'In Review',
                lastUpdated: '2026-05-29',
                notes:
                  'Awaiting approval.\nreviewDocumentPath: initiatives/Acme/General/Brief Idea/01_brief.md',
              },
              'Pressure Idea': {
                priority: 'Medium',
                lifecycle: 'In Review',
                lastUpdated: '2026-05-29',
                notes:
                  'reviewDocumentPath: initiatives/Acme/General/Pressure Idea/02_pressure_test.md',
              },
            },
          },
        },
      },
    },
  };

  await writeFileAtomic(
    path.join(tmp, 'priorities.json'),
    JSON.stringify(priorities, null, 2) + '\n'
  );

  const queue = buildQueue(tmp);
  assert(queue.length === 3, `expected 3 queue items, got ${queue.length}`);

  const byIdea = Object.fromEntries(queue.map((q) => [q.idea, q]));
  assert(byIdea['Queue Idea']?.lifecycle === 'In Review', 'missing path falls back to In Review');
  assert(byIdea['Brief Idea']?.lifecycle === 'Brief', 'brief path → Brief');
  assert(byIdea['Pressure Idea']?.lifecycle === 'Pressure Test', 'pressure path → Pressure Test');

  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('approvalQueue.test.ts: all assertions passed');
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
