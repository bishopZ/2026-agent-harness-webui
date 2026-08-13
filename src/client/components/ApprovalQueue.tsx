/**
 * ApprovalQueue — read-only table of ideas awaiting approval.
 *
 * `lifecycle` is the stage under review (Brief, Pressure Test, …), inferred
 * from reviewDocumentPath — not the registry "In Review" flag.
 *
 * Task 9 (Priority workspace read layer). No POST calls, no form controls.
 * Column sort is client-only; refresh restores the API order.
 */

import { useState } from 'react';
import { compareLifecycleStages } from '../utils/lifecycleStage.js';

export interface QueueItem {
  initiative: string;
  project: string;
  idea: string;
  /** Stage under review (Brief, Pressure Test, …). */
  lifecycle: string;
  lastUpdated: string;
  reviewDocumentPath?: string;
}

interface Props {
  items: QueueItem[];
}

type SortKey = 'initiative' | 'project' | 'idea' | 'lifecycle' | 'lastUpdated';

type SortDir = 'asc' | 'desc';

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'initiative', label: 'Initiative' },
  { key: 'project', label: 'Project' },
  { key: 'idea', label: 'Idea' },
  { key: 'lifecycle', label: 'Lifecycle' },
  { key: 'lastUpdated', label: 'Last Updated' },
];

const compareItems = (a: QueueItem, b: QueueItem, key: SortKey, dir: SortDir): number => {
  const left = a[key] ?? '';
  const right = b[key] ?? '';
  if (key === 'lifecycle') return compareLifecycleStages(left, right, dir);

  const cmp = left.localeCompare(right, undefined, { sensitivity: 'base' });
  if (dir === 'asc') return cmp;
  return -cmp;
};

export function ApprovalQueue({ items }: Props) {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDir('asc');
  };

  if (items.length === 0) {
    return (
      <p style={emptyStyle}>No ideas awaiting approval.</p>
    );
  }

  const displayItems =
    sortKey === null
      ? items
      : [...items].sort((a, b) => compareItems(a, b, sortKey, sortDir));

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {COLUMNS.map(col => {
              const active = sortKey === col.key;
              const indicator = active ? (sortDir === 'asc' ? ' ↑' : ' ↓') : '';
              return (
                <th key={col.key} style={thStyle}>
                  <button
                    type="button"
                    style={active ? { ...sortButtonStyle, ...sortButtonActiveStyle } : sortButtonStyle}
                    onClick={() => handleSort(col.key)}
                    aria-label={
                      active
                        ? `Sort by ${col.label}, currently ${sortDir === 'asc' ? 'ascending' : 'descending'}`
                        : `Sort by ${col.label}`
                    }
                  >
                    {col.label}{indicator}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {displayItems.map((item, i) => (
            <tr key={`${item.initiative}/${item.project}/${item.idea}`} style={i % 2 === 0 ? rowEvenStyle : rowOddStyle}>
              <td style={tdStyle}>{item.initiative}</td>
              <td style={tdStyle}>{item.project}</td>
              <td style={tdStyle}>
                {item.reviewDocumentPath ? (
                  <a
                    href={`/doc?path=${encodeURIComponent(item.reviewDocumentPath)}`}
                    style={reviewLinkStyle}
                  >
                    {item.idea}
                  </a>
                ) : (
                  item.idea
                )}
              </td>
              <td style={{ ...tdStyle, ...lifecycleStyle }}>{item.lifecycle}</td>
              <td style={{ ...tdStyle, ...monoStyle }}>{item.lastUpdated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const tableStyle: React.CSSProperties = {
  borderCollapse: 'collapse',
  width: '100%',
  fontSize: '0.875rem',
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.5rem 0.75rem',
  borderBottom: '2px solid #ddd',
  fontWeight: 600,
  color: '#333',
  whiteSpace: 'nowrap',
};

const sortButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 0,
  margin: 0,
  font: 'inherit',
  fontWeight: 600,
  color: 'inherit',
  cursor: 'pointer',
  textAlign: 'left',
};

const sortButtonActiveStyle: React.CSSProperties = {
  color: '#111',
};

const tdStyle: React.CSSProperties = {
  padding: '0.4rem 0.75rem',
  borderBottom: '1px solid #eee',
  verticalAlign: 'top',
};

const rowEvenStyle: React.CSSProperties = {
  backgroundColor: '#fff',
};

const rowOddStyle: React.CSSProperties = {
  backgroundColor: '#fafafa',
};

const lifecycleStyle: React.CSSProperties = {
  color: '#b45309',   // amber — signals "needs attention"
  fontWeight: 500,
};

const monoStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '0.8rem',
  color: '#666',
};

const reviewLinkStyle: React.CSSProperties = {
  color: '#2563eb',
  textDecoration: 'underline',
  cursor: 'pointer',
};

const emptyStyle: React.CSSProperties = {
  color: '#666',
  fontStyle: 'italic',
  padding: '0.5rem 0',
};
