import {
  compareLifecycleStages,
  REVIEW_LIFECYCLE_STAGES,
} from './lifecycleStage.js';

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
};

const shuffledStages = [
  'Build',
  'Growth',
  'Research',
  'Brief',
  'Marketing',
  'PRD',
  'Launch',
  'Pressure Test',
  'Evaluation',
  'Design',
];

const ascending = [...shuffledStages].sort((left, right) =>
  compareLifecycleStages(left, right, 'asc'),
);
assert(
  ascending.join('|') === REVIEW_LIFECYCLE_STAGES.join('|'),
  'ascending sort follows lifecycle order from Brief to Growth',
);

const descending = [...shuffledStages].sort((left, right) =>
  compareLifecycleStages(left, right, 'desc'),
);
assert(
  descending.join('|') === [...REVIEW_LIFECYCLE_STAGES].reverse().join('|'),
  'descending sort follows lifecycle order from Growth to Brief',
);

const withUnknown = ['In Review', 'Growth', 'Brief'];
assert(
  [...withUnknown].sort((left, right) =>
    compareLifecycleStages(left, right, 'asc'),
  ).join('|') === 'Brief|Growth|In Review',
  'unknown lifecycle labels sort after known stages ascending',
);
assert(
  [...withUnknown].sort((left, right) =>
    compareLifecycleStages(left, right, 'desc'),
  ).join('|') === 'Growth|Brief|In Review',
  'unknown lifecycle labels sort after known stages descending',
);

console.log('lifecycleStage.test.ts: all assertions passed');
