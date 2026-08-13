/**
 * BuildCheckpoints — flat "which checkpoint is each build on?" panel.
 *
 * The initiative tree answers this too, but only after two expand clicks. This
 * panel is the at-a-glance version: one row per in-flight build, owner-blocked
 * gates first.
 *
 * Finished and abandoned builds never reach here — when a build completes or
 * its plan is superseded, the `checkpoint` object is removed from that idea in
 * `priorities.json`. Absence is the filter, so there is nothing to hide and no
 * toggle to maintain.
 *
 * Read-only. Column sort is client-only; refresh restores the default order
 * (most-blocking gate first), same as ApprovalQueue.
 */
import { useState } from 'react';
import type { DiscoverData } from './InitiativeTable.js';
import {
  CHECKPOINT_STATUS_ORDER,
  compareCheckpointProgress,
  compareCheckpointStatus,
  compareDates,
  compareNatural,
  isOwnerBlocked,
  type SortDirection,
} from '../utils/checkpointSort.js';

export interface CheckpointRow {
  initiative: string;
  project: string;
  idea: string;
  lifecycle: string;
  current: string;
  index: number;
  total: number;
  status: string;
  label?: string;
  reason?: string;
  asOf?: string;
  buildPlanPath?: string;
}

/** Owner-blocked first, then in-flight, then settled. Shared with the sort util. */
const STATUS_ORDER: Record<string, number> = Object.fromEntries(
  CHECKPOINT_STATUS_ORDER.map((status, index) => [status, index]),
);

type SortKey = 'idea' | 'project' | 'current' | 'progress' | 'status' | 'asOf';

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'idea', label: 'Idea' },
  { key: 'project', label: 'Project' },
  { key: 'current', label: 'Checkpoint' },
  { key: 'progress', label: 'Progress' },
  { key: 'status', label: 'Gate' },
  { key: 'asOf', label: 'As of' },
];

const compareRows = (
  a: CheckpointRow,
  b: CheckpointRow,
  key: SortKey,
  dir: SortDirection,
): number => {
  switch (key) {
    case 'status':
      return compareCheckpointStatus(a.status, b.status, dir);
    case 'progress':
      return compareCheckpointProgress(a, b, dir);
    case 'asOf':
      return compareDates(a.asOf, b.asOf, dir);
    case 'project':
      return compareNatural(`${a.initiative} ${a.project}`, `${b.initiative} ${b.project}`, dir);
    default:
      return compareNatural(a[key], b[key], dir);
  }
};

const STATUS_COLORS: Record<string, string> = {
  'In Review': '#b45309',  // amber — needs you, same signal as the approval queue
  Ready: '#0369a1',        // blue — agent loop can take it
};

export function collectCheckpointRows(data: DiscoverData): CheckpointRow[] {
  const rows: CheckpointRow[] = [];

  for (const [initiative, init] of Object.entries(data.initiatives ?? {})) {
    for (const [project, proj] of Object.entries(init.projects ?? {})) {
      for (const [idea, entry] of Object.entries(proj.ideas ?? {})) {
        const cp = entry.checkpoint;
        if (!cp) continue;
        rows.push({
          initiative,
          project,
          idea,
          lifecycle: entry.lifecycle,
          current: cp.current,
          index: cp.index,
          total: cp.total,
          status: cp.status,
          label: cp.label,
          reason: cp.reason,
          asOf: cp.asOf,
          buildPlanPath: cp.buildPlanPath,
        });
      }
    }
  }

  return rows.sort((a, b) => {
    const byStatus =
      (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99);
    if (byStatus !== 0) return byStatus;
    return a.idea.localeCompare(b.idea);
  });
}

export function BuildCheckpoints({ data }: { data: DiscoverData }) {
  const rows = collectCheckpointRows(data);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortKey(key);
    setSortDir('asc');
  };

  if (rows.length === 0) {
    return <p style={emptyStyle}>No builds are in flight.</p>;
  }

  const blocked = rows.filter(r => isOwnerBlocked(r.status)).length;

  // sortKey === null keeps collectCheckpointRows' default: most-blocking first.
  const displayRows =
    sortKey === null ? rows : [...rows].sort((a, b) => compareRows(a, b, sortKey, sortDir));

  return (
    <>
      {blocked > 0 && (
        <p style={blockedNoteStyle}>
          {blocked} build{blocked !== 1 ? 's are' : ' is'} waiting on your review.
        </p>
      )}
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
                      style={
                        active
                          ? { ...sortButtonStyle, ...sortButtonActiveStyle }
                          : sortButtonStyle
                      }
                      onClick={() => handleSort(col.key)}
                      aria-label={
                        active
                          ? `Sort by ${col.label}, currently ${
                              sortDir === 'asc' ? 'ascending' : 'descending'
                            }`
                          : `Sort by ${col.label}`
                      }
                    >
                      {col.label}
                      {indicator}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {displayRows.map((r, idx) => {
              const color = STATUS_COLORS[r.status] ?? '#374151';
              const blocking = isOwnerBlocked(r.status);

              return (
                <tr
                  key={`${r.initiative}/${r.project}/${r.idea}`}
                  style={idx % 2 === 0 ? rowEvenStyle : rowOddStyle}
                >
                  <td style={tdStyle}>
                    {r.buildPlanPath ? (
                      <a
                        href={`/doc?path=${encodeURIComponent(r.buildPlanPath)}`}
                        style={planLinkStyle}
                        title={`Open build plan — ${r.buildPlanPath}`}
                      >
                        {r.idea}
                      </a>
                    ) : (
                      // No link rather than a guessed one: the plan is missing
                      // from disk, which is itself worth noticing.
                      <span style={{ fontWeight: 500 }}>{r.idea}</span>
                    )}
                    {/* Once status is binary, "what has to happen next" carries
                        more than the milestone name. Fall back to the label. */}
                    {(r.reason ?? r.label) && (
                      <div style={labelStyle}>{r.reason ?? r.label}</div>
                    )}
                  </td>
                  <td style={{ ...tdStyle, color: '#6b7280' }}>
                    {r.initiative} › {r.project}
                  </td>
                  <td style={tdStyle}>
                    <span style={chipStyle}>{r.current}</span>
                  </td>
                  <td style={tdStyle}>
                    <ProgressBar index={r.index} total={r.total} color={color} />
                  </td>
                  <td style={{ ...tdStyle, color, fontWeight: blocking ? 600 : 400 }}>
                    {blocking ? '⏸ ' : ''}
                    {r.status}
                  </td>
                  <td style={{ ...tdStyle, ...monoStyle }}>{r.asOf ?? '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

/** Segmented bar — one segment per checkpoint in the build plan. */
function ProgressBar({
  index,
  total,
  color,
}: {
  index: number;
  total: number;
  color: string;
}) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
      <span style={{ display: 'inline-flex', gap: '2px' }}>
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            style={{
              width: '10px',
              height: '6px',
              borderRadius: '1px',
              backgroundColor: i < index ? color : '#e5e7eb',
            }}
          />
        ))}
      </span>
      <span style={monoStyle}>
        {index}/{total}
      </span>
    </span>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const tableStyle: React.CSSProperties = {
  borderCollapse: 'collapse',
  width: '100%',
  fontSize: '0.8rem',
};

const thStyle: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.35rem 0.5rem',
  borderBottom: '2px solid #e5e7eb',
  fontWeight: 600,
  color: '#374151',
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
  whiteSpace: 'nowrap',
};

const sortButtonActiveStyle: React.CSSProperties = {
  color: '#111827',
};

const tdStyle: React.CSSProperties = {
  padding: '0.4rem 0.5rem',
  borderBottom: '1px solid #f3f4f6',
  verticalAlign: 'top',
};

const rowEvenStyle: React.CSSProperties = { backgroundColor: '#fff' };
const rowOddStyle: React.CSSProperties = { backgroundColor: '#fafafa' };

const monoStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontSize: '0.7rem',
  color: '#9ca3af',
};

const chipStyle: React.CSSProperties = {
  fontFamily: 'monospace',
  fontWeight: 700,
  fontSize: '0.75rem',
  color: '#111827',
  backgroundColor: '#f3f4f6',
  border: '1px solid #e5e7eb',
  borderRadius: '3px',
  padding: '0 0.35rem',
};

const planLinkStyle: React.CSSProperties = {
  color: '#2563eb',
  textDecoration: 'underline',
  fontWeight: 500,
  cursor: 'pointer',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  color: '#9ca3af',
  marginTop: '0.1rem',
};

const blockedNoteStyle: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#b45309',
  margin: '0 0 0.5rem',
};

const emptyStyle: React.CSSProperties = {
  color: '#9ca3af',
  fontStyle: 'italic',
  fontSize: '0.8rem',
  margin: '0.25rem 0',
};
