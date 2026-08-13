import {
  CHECKPOINT_STATUS_ORDER,
  compareCheckpointProgress,
  compareCheckpointStatus,
  compareDates,
  compareNatural,
  isOwnerBlocked,
} from './checkpointSort.js';

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
};

// ─── Gate status ──────────────────────────────────────────────────────────────

// Exactly two states. A build is either waiting on the owner or available to
// the agent loop; a finished build carries no checkpoint object at all, so
// there is no "done" status to represent.
assert(
  CHECKPOINT_STATUS_ORDER.length === 2,
  'two gate statuses only — finished builds drop the checkpoint object entirely',
);

const shuffledStatuses = ['Ready', 'In Review'];

assert(
  [...shuffledStatuses].sort((l, r) => compareCheckpointStatus(l, r, 'asc')).join('|') ===
    CHECKPOINT_STATUS_ORDER.join('|'),
  'ascending gate sort puts In Review before Ready',
);

assert(
  [...shuffledStatuses].sort((l, r) => compareCheckpointStatus(l, r, 'desc')).join('|') ===
    [...CHECKPOINT_STATUS_ORDER].reverse().join('|'),
  'descending gate sort reverses the blocking order',
);

// A stale "Complete" left in the registry must not sort above live work.
const withUnknownStatus = ['Complete', 'In Review', 'Ready'];
assert(
  [...withUnknownStatus].sort((l, r) => compareCheckpointStatus(l, r, 'asc')).join('|') ===
    'In Review|Ready|Complete',
  'retired or unknown gate labels sort last ascending',
);
assert(
  [...withUnknownStatus].sort((l, r) => compareCheckpointStatus(l, r, 'desc')).join('|') ===
    'Ready|In Review|Complete',
  'retired or unknown gate labels sort last descending too',
);

// ─── Owner-blocked ────────────────────────────────────────────────────────────

assert(isOwnerBlocked('In Review'), 'In Review is the one blocking state');
assert(!isOwnerBlocked('Ready'), 'Ready does not block the agent loop');

// ─── Progress ─────────────────────────────────────────────────────────────────

// The regression this guards: sorting on raw `index` would rank 2-of-2 (done)
// below 3-of-8 (barely started). Fraction is what "further along" means.
const done2of2 = { index: 2, total: 2 };
const early3of8 = { index: 3, total: 8 };
assert(
  compareCheckpointProgress(done2of2, early3of8, 'asc') > 0,
  '2/2 sorts above 3/8 ascending — fraction complete, not raw index',
);

const progressRows = [
  { index: 0, total: 3 },
  { index: 3, total: 4 },
  { index: 1, total: 2 },
  { index: 2, total: 2 },
];
assert(
  [...progressRows]
    .sort((l, r) => compareCheckpointProgress(l, r, 'asc'))
    .map(r => `${r.index}/${r.total}`)
    .join('|') === '0/3|1/2|3/4|2/2',
  'ascending progress runs 0.00, 0.50, 0.75, 1.00',
);

assert(
  compareCheckpointProgress({ index: 5, total: 10 }, { index: 1, total: 2 }, 'asc') > 0,
  'equal fractions break toward the longer plan (5/10 over 1/2)',
);

assert(
  compareCheckpointProgress({ index: 0, total: 0 }, { index: 0, total: 3 }, 'asc') < 0,
  'total = 0 does not divide by zero and sorts before a real plan',
);

// ─── Checkpoint label (natural) ───────────────────────────────────────────────

assert(
  ['10', '2', '1'].sort((l, r) => compareNatural(l, r, 'asc')).join('|') === '1|2|10',
  'numeric checkpoint labels sort naturally, so 10 lands after 2',
);
assert(
  ['C', 'A', 'B'].sort((l, r) => compareNatural(l, r, 'asc')).join('|') === 'A|B|C',
  'letter checkpoint labels sort alphabetically',
);
assert(
  compareNatural('b', 'B', 'asc') === 0,
  'checkpoint label compare is case-insensitive',
);

// ─── Dates ────────────────────────────────────────────────────────────────────

const dates = ['2026-08-07', undefined, '2026-06-15'];
assert(
  [...dates].sort((l, r) => compareDates(l, r, 'asc')).join('|') ===
    ['2026-06-15', '2026-08-07', undefined].join('|'),
  'missing dates sort last ascending',
);
assert(
  [...dates].sort((l, r) => compareDates(l, r, 'desc')).join('|') ===
    ['2026-08-07', '2026-06-15', undefined].join('|'),
  'missing dates sort last descending too — unknown is never "earliest"',
);

console.log('checkpointSort.test.ts: all assertions passed');
