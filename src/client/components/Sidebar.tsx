import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/**
 * Sidebar — Doc reader file tree (read-only navigation).
 *
 * F-07 compliance: zero <input>, <select>, or <textarea> elements.
 * All interaction is via <button> elements only.
 */
export function Sidebar() {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPath = searchParams.get('path') ?? '';

  useEffect(() => {
    fetch('/api/files')
      .then((r) => r.json())
      .then((data: string[]) => {
        setFiles(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  }, []);

  function handleClick(filePath: string) {
    navigate(`/doc?path=${encodeURIComponent(filePath)}`);
  }

  return (
    <aside style={sidebarStyle} aria-label="File tree">
      <div style={headerStyle}>
        <span style={{ fontWeight: 600, fontSize: '0.8rem', color: '#374151' }}>
          Harness Files
        </span>
      </div>
      {loading && (
        <p style={{ padding: '0.5rem', color: '#888', fontSize: '0.8rem' }}>
          Loading…
        </p>
      )}
      {error && (
        <p style={{ padding: '0.5rem', color: 'red', fontSize: '0.8rem' }}>
          Error: {error}
        </p>
      )}
      <ul style={listStyle} role="list">
        {files.map((filePath) => (
          <li key={filePath} style={{ listStyle: 'none' }}>
            <button
              onClick={() => handleClick(filePath)}
              style={{
                ...fileButtonStyle,
                background:
                  currentPath === filePath ? '#dbeafe' : 'transparent',
                fontWeight: currentPath === filePath ? '600' : '400',
              }}
              title={filePath}
              aria-current={currentPath === filePath ? 'page' : undefined}
            >
              {filePath}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const sidebarStyle: React.CSSProperties = {
  width: '260px',
  minWidth: '180px',
  maxWidth: '320px',
  height: '100vh',
  overflowY: 'auto',
  borderRight: '1px solid #e5e7eb',
  background: '#f9fafb',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
};

const headerStyle: React.CSSProperties = {
  padding: '0.75rem',
  borderBottom: '1px solid #e5e7eb',
  background: '#f3f4f6',
};

const listStyle: React.CSSProperties = {
  margin: 0,
  padding: '0 0 1rem 0',
  overflowY: 'auto',
  flex: 1,
};

const fileButtonStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  textAlign: 'left',
  padding: '0.25rem 0.75rem',
  fontSize: '0.75rem',
  fontFamily: 'monospace',
  border: 'none',
  cursor: 'pointer',
  color: '#374151',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};
