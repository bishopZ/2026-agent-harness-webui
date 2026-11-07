import { buildApprovalQueue, collectBacklogItems, type QueueItem } from './approvalQueue.js';
import type { DiscoverData } from '../components/InitiativeTable.js';

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exit(1);
  }
};

const idea = (lifecycle: string, lastUpdated = '2026-10-01') => ({
  priority: 'Medium',
  lifecycle,
  lastUpdated,
  notes: '',
  view: { stage: lifecycle, inReview: lifecycle === 'In Review' },
});

const data: DiscoverData = {
  initiatives: {
    Acme: {
      tier: 5,
      lastWork: '',
      projects: {
        Site: {
          priority: 'High',
          ideas: {
            'Captured idea': idea('Backlog', '2026-10-05'),
            'Reviewed idea': idea('In Review'),
            'Working idea': idea('Brief'),
            'Lowercase idea': idea(' backlog '),
          },
        },
      },
    },
  },
};

const backlog = collectBacklogItems(data);
assert(backlog.length === 2, 'collects Backlog ideas only (case/space tolerant)');
assert(backlog.every(item => item.lifecycle === 'Backlog'), 'Backlog rows read "Backlog"');
assert(backlog[0]!.lastUpdated === '2026-10-05', 'carries lastUpdated');
assert(backlog.every(item => item.reviewDocumentPath === undefined), 'no review document for Backlog');

const server: QueueItem[] = [
  { initiative: 'Acme', project: 'Site', idea: 'Reviewed idea', lifecycle: 'Brief', lastUpdated: '2026-10-01' },
];
const merged = buildApprovalQueue(server, data);
assert(merged.length === 3, 'merges server In Review rows with Backlog rows');
assert(merged[0]!.idea === 'Reviewed idea', 'In Review rows come first');

const dupe = buildApprovalQueue(
  [...server, { initiative: 'Acme', project: 'Site', idea: 'Captured idea', lifecycle: 'Backlog', lastUpdated: '' }],
  data,
);
assert(dupe.length === 3, 'does not duplicate an idea the server already returned');

assert(buildApprovalQueue(server, null) === server, 'no discover data → server rows unchanged');

console.log('approvalQueue (client): all assertions passed');
