/**
 * ApprovalQueue — read-only table of ideas with lifecycle "In Review".
 *
 * Task 9 (Priority workspace read layer). No POST calls, no form controls.
 */

export interface QueueItem {
  initiative: string;
  project: string;
  idea: string;
  lifecycle: string;
  lastUpdated: string;
  reviewDocumentPath?: string;
}

interface Props {
  items: QueueItem[];
}

export function ApprovalQueue({ items }: Props) {
  if (items.length === 0) {
    return (
      <p style={emptyStyle}>No ideas awaiting approval.</p>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Initiative</th>
            <th style={thStyle}>Project</th>
            <th style={thStyle}>Idea</th>
            <th style={thStyle}>Lifecycle</th>
            <th style={thStyle}>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i} style={i % 2 === 0 ? rowEvenStyle : rowOddStyle}>
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
