import { useState, useEffect } from 'react';

interface MarkdownViewProps {
  filePath: string | null;
}

export function MarkdownView({ filePath }: MarkdownViewProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!filePath) {
      setHtml(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/api/render?path=${encodeURIComponent(filePath)}`)
      .then(async (r) => {
        if (!r.ok) {
          const body = await r.json().catch(() => ({ error: r.statusText }));
          throw new Error(body.error ?? r.statusText);
        }
        return r.json() as Promise<{ html: string }>;
      })
      .then(({ html }) => {
        setHtml(html);
        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  }, [filePath]);

  if (!filePath) {
    return (
      <div style={emptyStyle}>
        <p>Select a file from the sidebar to read it.</p>
      </div>
    );
  }

  if (loading) {
    return <div style={emptyStyle}><p>Loading…</p></div>;
  }

  if (error) {
    return (
      <div style={emptyStyle}>
        <p style={{ color: 'red' }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <article
      style={articleStyle}
      // F-07: dangerouslySetInnerHTML is read-only rendered HTML from marked;
      // no form controls are injected by the server.
      dangerouslySetInnerHTML={{ __html: html ?? '' }}
    />
  );
}

const emptyStyle: React.CSSProperties = {
  padding: '2rem',
  color: '#6b7280',
  fontFamily: 'sans-serif',
};

const articleStyle: React.CSSProperties = {
  padding: '2rem',
  maxWidth: '860px',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '0.95rem',
  lineHeight: '1.65',
  color: '#111827',
  overflowY: 'auto',
  height: '100vh',
  boxSizing: 'border-box',
};
