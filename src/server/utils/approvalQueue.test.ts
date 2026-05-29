/**
 * approvalQueue.test.ts — queue built from priorities.json In Review ideas.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import writeFileAtomic from 'write-file-atomic';
import { loadCurrentSidecar } from './reconcileSidecar.js';

const assert = (cond: boolean, msg: string) => {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
};

const buildQueue = (harnessRoot: string) => {
  const sidecar = loadCurrentSidecar(harnessRoot);
  const queue: { initiative: string; project: string; idea: string }[] = [];
  for (const [initName, initEntry] of Object.entries(sidecar.initiatives)) {
    for (const [projName, projEntry] of Object.entries(initEntry.projects)) {
      for (const [ideaName, ideaEntry] of Object.entries(projEntry.ideas)) {
        if (ideaEntry.lifecycle === 'In Review') {
          queue.push({ initiative: initName, project: projName, idea: ideaName });
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
  assert(queue.length === 1, `expected 1 queue item, got ${queue.length}`);
  assert(queue[0].idea === 'Queue Idea', 'wrong idea name');

  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('approvalQueue.test.ts: all assertions passed');
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
