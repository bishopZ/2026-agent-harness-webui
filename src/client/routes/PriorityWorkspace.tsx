/**
 * PriorityWorkspace — the / route.
 *
 * Task 9  (read layer)  — fetch + display initiatives, projects, ideas.
 * Task 11 (write layer) — add Toast, usePriorityUpdate hook, pass edit
 *                          callbacks to InitiativeTable.
 *
 * No <input>, <select>, or <textarea> in the Doc reader (/doc) route (F-07).
 * This file is only mounted at / — form controls here are intentional.
 */
import { useState, useEffect, useCallback } from 'react';
import { ApprovalQueue, type QueueItem } from '../components/ApprovalQueue.js';
import { InitiativeTable, type DiscoverData } from '../components/InitiativeTable.js';
import { ToastContainer, type Toast } from '../components/Toast.js';
import { usePriorityUpdate } from '../hooks/usePriorityUpdate.js';

// ─── Component ────────────────────────────────────────────────────────────────

export function PriorityWorkspace() {
  const [discoverData, setDiscoverData] = useState<DiscoverData | null>(null);
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Toast state ───────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = String(Date.now() + Math.random());
    setToasts(prev => [...prev, { ...t, id }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Keep local discover tree in sync after a successful save so expand/collapse
  // remounts PrioritySelect / TierInput from the latest values (not the fetch snapshot).
  const applyLocalUpdate = useCallback((path: string, value: unknown) => {
    setDiscoverData(prev => (prev ? setAtDotPath(prev, path, value) : prev));
  }, []);

  // ── Priority update hook ──────────────────────────────────────────────────
  const { update, saving } = usePriorityUpdate(addToast, applyLocalUpdate);

  // ── Data fetch on mount ───────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      fetch('/api/discover').then(r => {
        if (!r.ok) throw new Error(`/api/discover returned ${r.status}`);
        return r.json() as Promise<DiscoverData>;
      }),
      fetch('/api/approval-queue').then(r => {
        if (!r.ok) throw new Error(`/api/approval-queue returned ${r.status}`);
        return r.json() as Promise<QueueItem[]>;
      }),
    ])
      .then(([discover, queue]) => {
        setDiscoverData(discover);
        setQueueItems(queue);
        setLoading(false);
      })
      .catch(err => {
        setError((err as Error).message ?? String(err));
        setLoading(false);
      });
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={pageStyle}>
        <header style={headerStyle}>
          <h1 style={h1Style}>Agent Harness — Priority Workspace</h1>
        </header>
        <p style={{ color: '#6b7280', padding: '1rem 0' }}>Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageStyle}>
        <header style={headerStyle}>
          <h1 style={h1Style}>Agent Harness — Priority Workspace</h1>
        </header>
        <p style={{ color: '#dc2626', padding: '1rem 0' }}>
          Error loading data: {error}
        </p>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
          Make sure the server is running with a valid <code>HARNESS_ROOT</code>.
        </p>
      </div>
    );
  }

  return (
    <>
      <div style={pageStyle}>
        <header style={headerStyle}>
          <h1 style={h1Style}>Agent Harness — Priority Workspace</h1>
          <nav style={navStyle}>
            <a href="/doc" style={navLinkStyle}>Doc Reader →</a>
          </nav>
        </header>

        {/* ── Initiative List ──────────────────────────────────────────── */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>Initiatives</h2>
          {discoverData && (
            <InitiativeTable
              data={discoverData}
              onUpdate={update}
              saving={saving}
            />
          )}
        </section>

        <hr style={dividerStyle} />

        {/* ── Approval Queue ───────────────────────────────────────────── */}
        <section style={sectionStyle}>
          <h2 style={h2Style}>
            Awaiting Approval
            {queueItems.length > 0 && (
              <span style={badgeStyle}>{queueItems.length}</span>
            )}
          </h2>
          <ApprovalQueue items={queueItems} />
        </section>
      </div>

      {/* ── Toast notifications (fixed, outside page flow) ───────────── */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Immutable deep set for dot-paths like `initiatives.X.projects.Y.priority`. */
function setAtDotPath<T extends object>(root: T, path: string, value: unknown): T {
  const parts = path.split('.');
  const clone = structuredClone(root) as Record<string, unknown>;
  let cur: Record<string, unknown> = clone;

  for (let i = 0; i < parts.length - 1; i++) {
    cur = cur[parts[i]!] as Record<string, unknown>;
  }

  cur[parts[parts.length - 1]!] = value;
  return clone as T;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  maxWidth: '960px',
  margin: '0 auto',
  padding: '1.5rem 1rem',
  color: '#111827',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  marginBottom: '1.5rem',
  flexWrap: 'wrap',
  gap: '0.5rem',
};

const h1Style: React.CSSProperties = {
  fontSize: '1.25rem',
  fontWeight: 700,
  margin: 0,
};

const h2Style: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 600,
  marginBottom: '0.75rem',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
};

const navStyle: React.CSSProperties = {
  fontSize: '0.875rem',
};

const navLinkStyle: React.CSSProperties = {
  color: '#2563eb',
  textDecoration: 'none',
};

const sectionStyle: React.CSSProperties = {
  marginBottom: '1.5rem',
};

const dividerStyle: React.CSSProperties = {
  border: 'none',
  borderTop: '1px solid #e5e7eb',
  margin: '1.5rem 0',
};

const badgeStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: '1.25rem',
  height: '1.25rem',
  padding: '0 0.35rem',
  borderRadius: '999px',
  backgroundColor: '#b45309',
  color: '#fff',
  fontSize: '0.7rem',
  fontWeight: 700,
};
