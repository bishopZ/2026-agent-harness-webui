/**
 * approvalQueue.test.ts — queue built from priorities.json In Review ideas.
 * Stage under review comes from the idea folder, not from anything in notes.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import writeFileAtomic from 'write-file-atomic';
import { loadCurrentSidecar } from './reconcileSidecar.js';
import { deriveIdeaView } from './ideaView.js';

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
            lifecycle: deriveIdeaView(harnessRoot, initName, projName, ideaName, ideaEntry).stage,
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
                notes: 'Awaiting approval.',
              },
              'Pressure Idea': {
                priority: 'Medium',
                lifecycle: 'In Review',
                lastUpdated: '2026-05-29',
                notes: '',
              },
            },
          },
        },
      },
    },
  };

  const ideaDir = (name: string) => {
    const dir = path.join(tmp, 'initiatives', 'Acme', 'General', name);
    fs.mkdirSync(dir, { recursive: true });
    return dir;
  };
  ideaDir('Queue Idea');
  fs.writeFileSync(path.join(ideaDir('Brief Idea'), '01_brief.md'), '# Brief\n');
  const pressure = ideaDir('Pressure Idea');
  fs.writeFileSync(path.join(pressure, '01_brief.md'), '# Brief\n');
  fs.writeFileSync(path.join(pressure, '02_pressure_test.md'), '# PT\n');

  await writeFileAtomic(
    path.join(tmp, 'priorities.json'),
    JSON.stringify(priorities, null, 2) + '\n'
  );

  const queue = buildQueue(tmp);
  assert(queue.length === 3, `expected 3 queue items, got ${queue.length}`);

  const byIdea = Object.fromEntries(queue.map((q) => [q.idea, q]));
  assert(byIdea['Queue Idea']?.lifecycle === 'In Review', 'no artifacts falls back to In Review');
  assert(byIdea['Brief Idea']?.lifecycle === 'Brief', 'brief on disk → Brief');
  assert(byIdea['Pressure Idea']?.lifecycle === 'Pressure Test', 'latest artifact on disk → Pressure Test');

  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('approvalQueue.test.ts: all assertions passed');
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
