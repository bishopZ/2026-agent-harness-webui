/**
 * priorityLevels.test.ts — five priority levels (Very High … Very Low) are
 * accepted by the write layer and the legacy markdown importer.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import { applyPriorityUpdate } from './writePriorities.js';
import { normalisePriority } from './legacyImport.js';

const assert = (cond: boolean, msg: string) => {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
};

const main = async () => {
  // Legacy import: words and numeric aliases 1–5.
  const cases: [string, string][] = [
    ['Very High', 'Very High'], ['very-high', 'Very High'], ['1', 'Very High'],
    ['High', 'High'], ['2', 'High'],
    ['Medium', 'Medium'], ['3', 'Medium'],
    ['Low', 'Low'], ['4', 'Low'],
    ['Very Low', 'Very Low'], ['VERY  LOW', 'Very Low'], ['5', 'Very Low'],
    ['', 'Medium'], ['nonsense', 'Medium'],
  ];
  for (const [raw, want] of cases) {
    const got = normalisePriority(raw);
    assert(got === want, `normalisePriority(${JSON.stringify(raw)}) → ${got}, want ${want}`);
  }

  // Write layer: all five values accepted, anything else rejected.
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'priority-levels-test-'));
  fs.writeFileSync(
    path.join(tmp, 'priorities.json'),
    JSON.stringify({
      version: 3,
      updated: '2026-10-09',
      initiatives: {
        Acme: {
          tier: 5,
          lastWork: '',
          projects: {
            General: {
              priority: 'Medium',
              ideas: { One: { priority: 'Medium', lifecycle: 'Backlog', lastUpdated: '2026-10-09', notes: '' } },
            },
          },
        },
      },
    }, null, 2),
  );

  const projPath = 'initiatives.Acme.projects.General.priority';
  const ideaPath = 'initiatives.Acme.projects.General.ideas.One.priority';
  for (const v of ['Very High', 'High', 'Medium', 'Low', 'Very Low']) {
    for (const p of [projPath, ideaPath]) {
      const r = await applyPriorityUpdate(tmp, p, v);
      assert(r.ok, `expected ${v} to be accepted at ${p}`);
      const saved = JSON.parse(fs.readFileSync(path.join(tmp, 'priorities.json'), 'utf-8'));
      const val = p === projPath
        ? saved.initiatives.Acme.projects.General.priority
        : saved.initiatives.Acme.projects.General.ideas.One.priority;
      assert(val === v, `expected ${p} saved as ${v}, got ${val}`);
    }
  }
  for (const bad of ['VeryHigh', 'very high', 'Critical', 1]) {
    const r = await applyPriorityUpdate(tmp, ideaPath, bad);
    assert(!r.ok, `expected ${JSON.stringify(bad)} to be rejected`);
  }

  fs.rmSync(tmp, { recursive: true, force: true });
  console.log('priorityLevels.test: ok');
};

void main();
