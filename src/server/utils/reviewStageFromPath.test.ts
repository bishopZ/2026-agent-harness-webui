/**
 * reviewStageFromPath.test.ts — map reviewDocumentPath → stage label.
 */

import { reviewStageFromPath, lifecycleDisplayForIdea } from './reviewStageFromPath.js';

const assert = (cond: boolean, msg: string) => {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
};

const cases: [string | undefined, string | null][] = [
  [undefined, null],
  ['', null],
  [
    'initiatives/Time2Magic/Company website/UT Lectures page update/01_brief.md',
    'Brief',
  ],
  [
    'initiatives/Time2Magic/Agent Harness Web UI/Harness platform strategy/02_pressure_test.md',
    'Pressure Test',
  ],
  [
    'initiatives/Time2Magic/LoveStreetApp/Export without password/02_market_research.md',
    'Research',
  ],
  [
    'initiatives/X/Y/Z/02b_customer_discovery.md',
    'Research',
  ],
  ['initiatives/X/Y/Z/03_prd.md', 'PRD'],
  ['initiatives/X/Y/Z/04_design.md', 'Design'],
  [
    'initiatives/Time2Magic/Company website/Agent Harness comparison article/05_build_plan.md',
    'Build',
  ],
  [
    'initiatives/X/Y/Z/05_build/verification_log.md',
    'Build',
  ],
  ['initiatives/X/Y/Z/06_evaluation.md', 'Evaluation'],
  ['initiatives/X/Y/Z/07_launch_plan.md', 'Launch'],
  ['initiatives/X/Y/Z/08_marketing_pack.md', 'Marketing'],
  ['initiatives/X/Y/Z/09_growth_log.md', 'Growth'],
  ['initiatives/X/Y/Z/README.md', null],
];

for (const [input, expected] of cases) {
  const got = reviewStageFromPath(input);
  assert(
    got === expected,
    `reviewStageFromPath(${JSON.stringify(input)}) → ${JSON.stringify(got)}, expected ${JSON.stringify(expected)}`
  );
}

assert(
  lifecycleDisplayForIdea({ lifecycle: 'Build', notes: '' }) === 'Build',
  'non-review lifecycle unchanged'
);
assert(
  lifecycleDisplayForIdea({ lifecycle: 'In Review', notes: 'no path' }) === 'In Review',
  'In Review without path falls back'
);
assert(
  lifecycleDisplayForIdea({
    lifecycle: 'In Review',
    notes: 'reviewDocumentPath: initiatives/X/Y/Z/03_prd.md',
  }) === 'PRD',
  'In Review with path → stage label'
);

console.log('reviewStageFromPath.test.ts: all assertions passed');
