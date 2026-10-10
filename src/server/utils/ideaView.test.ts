/**
 * ideaView.test.ts — the view derives display data from a simple registry.
 */

import fs from 'fs';
import os from 'os';
import path from 'path';
import {
  deriveIdeaView,
  extractNext,
  normaliseCheckpointId,
  parseCheckpoints,
} from './ideaView.js';

const assert = (cond: boolean, msg: string) => {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
};

// ─── parseCheckpoints ─────────────────────────────────────────────────────────

const plan = `# Build Plan

## Task 1
- [x] something

## Checkpoint A — Pure codec green — **APPROVED 2026-08-12**

### Closure checklist (Checkpoint A)

## Checkpoint B — Codec complete (no RN yet)

\`\`\`markdown
## Checkpoint X — [Short milestone name]
\`\`\`

### Checkpoint c: Owner gate
## Checkpoint B — duplicate heading later in the file
`;

const parsed = parseCheckpoints(plan);
assert(
  parsed.map(c => c.id).join('|') === 'A|B|C',
  `ids from headings, fenced template and duplicates skipped (got ${parsed.map(c => c.id).join('|')})`,
);
assert(parsed[0]!.name === 'Pure codec green', `status decoration stripped (got "${parsed[0]!.name}")`);
assert(parsed[1]!.name === 'Codec complete (no RN yet)', 'plain name kept');
assert(parsed[2]!.name === 'Owner gate', 'colon separator and lower-case id handled');
assert(
  parseCheckpoints('## Checkpoint A, Structure and copy')[0]!.name === 'Structure and copy',
  'comma separator',
);
assert(
  parseCheckpoints('## Checkpoint 1 — One\n## Checkpoint 10 — Ten').map(c => c.id).join('|') === '1|10',
  'numeric ids',
);

// ─── normaliseCheckpointId ────────────────────────────────────────────────────

assert(normaliseCheckpointId('C') === 'C', 'plain id');
assert(normaliseCheckpointId('Checkpoint c') === 'C', '"Checkpoint c" → C');
assert(normaliseCheckpointId(8) === '8', 'numbers accepted');
assert(normaliseCheckpointId({ current: 'D', index: 3 }) === 'D', 'retired object form tolerated');
assert(normaliseCheckpointId('') === undefined, 'blank → undefined');
assert(normaliseCheckpointId(undefined) === undefined, 'missing → undefined');

// ─── extractNext ──────────────────────────────────────────────────────────────

assert(extractNext('Done S3.\nNext: owner runs the smoke test.') === 'owner runs the smoke test.', 'Next: line');
assert(extractNext('S4 done. **Next:** Task 5.') === 'Task 5.', 'bold Next:');
assert(
  extractNext('Finding mitigated. Next (OWNER, S5, ~15 min): delete _to_delete/.') === 'delete _to_delete/.',
  'Next (qualifier): form',
);
assert(extractNext('Moved to Next.js app router.') === undefined, '"Next.js" is not a next step');
assert(extractNext('') === undefined, 'empty notes');

// ─── deriveIdeaView (filesystem) ──────────────────────────────────────────────

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'idea-view-test-'));
const ideaDir = (name: string) => {
  const dir = path.join(tmp, 'initiatives', 'Acme', 'General', name);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
};

// In Review at Brief: stage + review doc come from the folder, not from notes.
fs.writeFileSync(path.join(ideaDir('Brief Idea'), '01_brief.md'), '# Brief\n');
const brief = deriveIdeaView(tmp, 'Acme', 'General', 'Brief Idea', {
  lifecycle: 'In Review',
  notes: 'Awaiting approval.',
});
assert(brief.inReview, 'In Review flag');
assert(brief.stage === 'Brief', `stage Brief (got ${brief.stage})`);
assert(
  brief.reviewDocumentPath === 'initiatives/Acme/General/Brief Idea/01_brief.md',
  `review doc derived (got ${brief.reviewDocumentPath})`,
);
assert(brief.build === undefined, 'no build view before Build');

// Latest artifact wins.
const pt = ideaDir('PT Idea');
fs.writeFileSync(path.join(pt, '01_brief.md'), '# Brief\n');
fs.writeFileSync(path.join(pt, '02_pressure_test.md'), '# PT\n');
const ptView = deriveIdeaView(tmp, 'Acme', 'General', 'PT Idea', { lifecycle: 'In Review', notes: '' });
assert(ptView.stage === 'Pressure Test', 'latest artifact → Pressure Test');

// In Review with no artifacts falls back to the raw flag.
ideaDir('Empty Idea');
const empty = deriveIdeaView(tmp, 'Acme', 'General', 'Empty Idea', { lifecycle: 'In Review', notes: '' });
assert(empty.stage === 'In Review' && empty.reviewDocumentPath === undefined, 'no artifacts → In Review, no link');

// Build idea gated at a checkpoint: one stored string → full checkpoint view.
const build = ideaDir('Build Idea');
fs.writeFileSync(path.join(build, '01_brief.md'), '# Brief\n');
fs.writeFileSync(
  path.join(build, '05_build_plan.md'),
  '## Checkpoint A — One\n## Checkpoint B — Two\n## Checkpoint C — Three\n',
);
const gated = deriveIdeaView(tmp, 'Acme', 'General', 'Build Idea', {
  lifecycle: 'In Review',
  notes: 'Next: owner approves B.',
  checkpoint: 'B',
});
assert(gated.stage === 'Build', 'build plan → Build stage');
assert(gated.build?.planPath === 'initiatives/Acme/General/Build Idea/05_build_plan.md', 'plan link derived');
assert(gated.build?.checkpoints.length === 3, 'total derived from headings');
assert(gated.build?.index === 1 && gated.build?.name === 'Two', 'index + name derived from current');
assert(gated.next === 'owner approves B.', 'next derived from notes');

// Build idea working (not In Review): still a build view; owner-blocked is just !inReview.
const working = deriveIdeaView(tmp, 'Acme', 'General', 'Build Idea', {
  lifecycle: 'Build',
  notes: '',
  checkpoint: 'C',
});
assert(!working.inReview && working.build?.index === 2, 'Build lifecycle → ready, index 2');

// Checkpoint not recorded, or not in the plan: still listed, index -1.
const unrecorded = deriveIdeaView(tmp, 'Acme', 'General', 'Build Idea', { lifecycle: 'Build', notes: '' });
assert(unrecorded.build?.current === undefined && unrecorded.build?.index === -1, 'missing checkpoint → index -1');
const stray = deriveIdeaView(tmp, 'Acme', 'General', 'Build Idea', { lifecycle: 'Build', notes: '', checkpoint: 'Z' });
assert(stray.build?.current === 'Z' && stray.build?.index === -1, 'unknown checkpoint id → index -1');

// Registry spelling mapped for display.
assert(
  deriveIdeaView(tmp, 'Acme', 'General', 'PT Idea', { lifecycle: 'PressureTest', notes: '' }).stage === 'Pressure Test',
  'PressureTest → Pressure Test',
);

fs.rmSync(tmp, { recursive: true, force: true });
console.log('ideaView.test.ts: all assertions passed');
