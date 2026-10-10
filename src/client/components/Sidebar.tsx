import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ancestorDirPaths,
  buildFileTree,
  normalizeSidebarPath,
  type FileTreeNode,
} from '../utils/fileTree.js';

const EXPANDED_STORAGE_KEY = 'harness-sidebar-expanded';

/** Tree paths are relative to initiatives/; copied paths are relative to HARNESS_ROOT. */
const toHarnessPath = (treePath: string): string => `initiatives/${treePath}`;

/**
 * Sidebar — Doc reader file tree (read-only navigation).
 *
 * F-07 compliance: zero <input>, <select>, or <textarea> elements.
 * All interaction is via <button> elements only.
 *
 * Hovering a row shows two actions on the right: copy the path (relative to
 * HARNESS_ROOT) and open in Finder (a file opens its containing folder).
 * repo / repos / sources folders are single rows that open in Finder, with no
 * hover actions.
 */

const readExpandedFromStorage = (): Set<string> => {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(EXPANDED_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((p): p is string => typeof p === 'string'));
  } catch {
    return new Set();
  }
};

const writeExpandedToStorage = (expanded: Set<string>): void => {
  localStorage.setItem(EXPANDED_STORAGE_KEY, JSON.stringify([...expanded]));
};

export function Sidebar() {
  const [files, setFiles] = useState<string[]>([]);
  const [linkFolders, setLinkFolders] = useState<string[]>([]);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(readExpandedFromStorage);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPath = searchParams.get('path') ?? '';
  const selectedPath = normalizeSidebarPath(currentPath);
  const selectedRef = useRef<HTMLButtonElement | null>(null);
  const tree = buildFileTree(files, linkFolders);

  const [sidebarWidth, setSidebarWidth] = useState<number>(() => {
    if (typeof window === 'undefined' || window.innerWidth <= 768) return 260;
    const stored = localStorage.getItem('harness-sidebar-width');
    if (stored) {
      const n = parseInt(stored, 10);
      const maxAllowed = window.innerWidth * 0.6;
      if (!isNaN(n) && n >= 180 && n <= maxAllowed) return n;
    }
    return 260;
  });

  const isDesktop = typeof window !== 'undefined' && window.innerWidth > 768;

  function handleDragStart(e: React.MouseEvent) {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = sidebarWidth;

    function onMouseMove(ev: MouseEvent) {
      const newWidth = Math.min(
        Math.max(startWidth + (ev.clientX - startX), 180),
        window.innerWidth * 0.5
      );
      setSidebarWidth(newWidth);
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      setSidebarWidth((prev) => {
        localStorage.setItem('harness-sidebar-width', String(prev));
        return prev;
      });
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

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
    fetch('/api/files/folders')
      .then((r) => (r.ok ? r.json() : []))
      .then((data: string[]) => setLinkFolders(Array.isArray(data) ? data : []))
      .catch(() => setLinkFolders([]));
  }, []);

  // Clear transient action feedback.
  useEffect(() => {
    if (!copiedPath) return;
    const t = window.setTimeout(() => setCopiedPath(null), 1200);
    return () => window.clearTimeout(t);
  }, [copiedPath]);
  useEffect(() => {
    if (!actionError) return;
    const t = window.setTimeout(() => setActionError(null), 3000);
    return () => window.clearTimeout(t);
  }, [actionError]);

  // Deep link / selection: expand ancestors and persist so revisit keeps them open.
  useEffect(() => {
    if (!selectedPath || loading) return;
    const ancestors = ancestorDirPaths(selectedPath);
    if (ancestors.length === 0) return;

    setExpanded((prev) => {
      let changed = false;
      const next = new Set(prev);
      for (const dir of ancestors) {
        if (!next.has(dir)) {
          next.add(dir);
          changed = true;
        }
      }
      if (!changed) return prev;
      writeExpandedToStorage(next);
      return next;
    });
  }, [selectedPath, loading]);

  // Scroll selected file into view after expand/render.
  useEffect(() => {
    if (!selectedPath || loading) return;
    // Wait a frame so expanded ancestors have rendered the file row.
    const id = requestAnimationFrame(() => {
      selectedRef.current?.scrollIntoView({ block: 'nearest' });
    });
    return () => cancelAnimationFrame(id);
  }, [selectedPath, loading, expanded]);

  function toggleDir(dirPath: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(dirPath)) next.delete(dirPath);
      else next.add(dirPath);
      writeExpandedToStorage(next);
      return next;
    });
  }

  function handleFileClick(filePath: string) {
    navigate(`/doc?path=${encodeURIComponent(filePath)}`);
  }

  async function copyPath(treePath: string) {
    try {
      await navigator.clipboard.writeText(toHarnessPath(treePath));
      setCopiedPath(treePath);
    } catch {
      setActionError('Could not copy to clipboard');
    }
  }

  async function revealInFinder(treePath: string) {
    try {
      const res = await fetch('/api/files/reveal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: treePath }),
      });
      if (!res.ok) throw new Error(String(res.status));
    } catch {
      setActionError('Could not open in Finder');
    }
  }

  /** Copy + Finder buttons, right-aligned, shown on row hover / focus. */
  function rowActions(node: FileTreeNode) {
    const copied = copiedPath === node.path;
    return (
      <span className="sb-actions" style={actionsStyle}>
        <button
          type="button"
          style={iconButtonStyle}
          onClick={() => copyPath(node.path)}
          title={copied ? 'Copied' : `Copy path: ${toHarnessPath(node.path)}`}
          aria-label={`Copy path of ${node.name}`}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
        <button
          type="button"
          style={iconButtonStyle}
          onClick={() => revealInFinder(node.path)}
          title={node.type === 'file' ? 'Show in Finder' : 'Open in Finder'}
          aria-label={`Open ${node.name} in Finder`}
        >
          <ExternalLinkIcon />
        </button>
      </span>
    );
  }

  function renderNodes(nodes: FileTreeNode[], depth: number): React.ReactNode {
    return nodes.map((node) => {
      const padLeft = `calc(0.75rem + ${depth * 0.85}rem)`;

      if (node.type === 'link') {
        return (
          <li key={`link:${node.path}`} style={{ listStyle: 'none' }}>
            <div className="sb-row" style={rowWrapStyle}>
              <button
                type="button"
                onClick={() => revealInFinder(node.path)}
                style={{ ...rowButtonStyle, paddingLeft: padLeft }}
                title={`Open ${toHarnessPath(node.path)} in Finder`}
              >
                <span style={twirlSpacerStyle} aria-hidden="true" />
                <span style={labelStyle}>{node.name}</span>
                <span style={inlineLinkIconStyle} aria-hidden="true">
                  <ExternalLinkIcon />
                </span>
              </button>
            </div>
          </li>
        );
      }

      if (node.type === 'dir') {
        const isOpen = expanded.has(node.path);
        return (
          <li key={`dir:${node.path}`} style={{ listStyle: 'none' }}>
            <div className="sb-row" style={rowWrapStyle}>
              <button
                type="button"
                onClick={() => toggleDir(node.path)}
                style={{ ...rowButtonStyle, paddingLeft: padLeft }}
                aria-expanded={isOpen}
                title={node.path}
              >
                <span style={twirlStyle} aria-hidden="true">
                  {isOpen ? '▼' : '▶'}
                </span>
                <span style={labelStyle}>{node.name}</span>
              </button>
              {rowActions(node)}
            </div>
            {isOpen && (
              <ul style={nestedListStyle} role="list">
                {renderNodes(node.children, depth + 1)}
              </ul>
            )}
          </li>
        );
      }

      const isSelected = node.path === selectedPath;
      return (
        <li key={`file:${node.path}`} style={{ listStyle: 'none' }}>
          <div className="sb-row" data-selected={isSelected ? 'true' : undefined} style={rowWrapStyle}>
            <button
              type="button"
              ref={isSelected ? selectedRef : undefined}
              onClick={() => handleFileClick(node.path)}
              style={{
                ...rowButtonStyle,
                paddingLeft: padLeft,
                fontWeight: isSelected ? '600' : '400',
              }}
              title={node.path}
              aria-current={isSelected ? 'page' : undefined}
              data-path={node.path}
            >
              <span style={twirlSpacerStyle} aria-hidden="true" />
              <span style={labelStyle}>{node.name}</span>
            </button>
            {rowActions(node)}
          </div>
        </li>
      );
    });
  }

  return (
    <aside style={{ ...sidebarStyle, width: `${sidebarWidth}px` }} aria-label="File tree">
      <style>{rowHoverCss}</style>
      <div style={headerStyle}>
        <span style={{ fontWeight: 600, fontSize: '0.8rem', color: '#374151' }}>
          Harness Files
        </span>
        {actionError && (
          <span role="status" style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: '#b91c1c' }}>
            {actionError}
          </span>
        )}
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
        {renderNodes(tree, 0)}
      </ul>
      {isDesktop && (
        <div
          style={dragHandleStyle}
          onMouseDown={handleDragStart}
          aria-hidden="true"
        />
      )}
    </aside>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────────

const iconProps = {
  width: 12,
  height: 12,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function CopyIcon() {
  return (
    <svg {...iconProps}>
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg {...iconProps}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg {...iconProps}>
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

/** Hover/focus rules can't be inline styles, so they live here. */
const rowHoverCss = `
.sb-row { --sb-row-bg: #f9fafb; background: transparent; }
.sb-row:hover { --sb-row-bg: #eef1f5; background: var(--sb-row-bg); }
.sb-row[data-selected="true"] { --sb-row-bg: #dbeafe; background: var(--sb-row-bg); }
.sb-row .sb-actions { opacity: 0; pointer-events: none; background: var(--sb-row-bg); }
.sb-row:hover .sb-actions,
.sb-row:has(:focus-visible) .sb-actions { opacity: 1; pointer-events: auto; }
.sb-actions button:hover { color: #111827; background: rgba(0, 0, 0, 0.06); }
`;

const rowWrapStyle: React.CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
};

const actionsStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  display: 'flex',
  alignItems: 'center',
  gap: '0.1rem',
  paddingLeft: '0.35rem',
  paddingRight: '0.35rem',
};

const iconButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1.25rem',
  height: '1.25rem',
  padding: 0,
  border: 'none',
  borderRadius: '3px',
  background: 'transparent',
  color: '#6b7280',
  cursor: 'pointer',
};

const inlineLinkIconStyle: React.CSSProperties = {
  display: 'inline-flex',
  flexShrink: 0,
  color: '#6b7280',
};

const sidebarStyle: React.CSSProperties = {
  width: '260px',
  minHeight: 0,
  overflow: 'hidden',
  borderRight: '1px solid #e5e7eb',
  background: '#f9fafb',
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
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

const nestedListStyle: React.CSSProperties = {
  margin: 0,
  padding: 0,
};

const dragHandleStyle: React.CSSProperties = {
  position: 'absolute',
  right: 0,
  top: 0,
  bottom: 0,
  width: '5px',
  cursor: 'col-resize',
  zIndex: 10,
};

const rowButtonStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.35rem',
  width: '100%',
  textAlign: 'left',
  paddingTop: '0.25rem',
  paddingRight: '0.75rem',
  paddingBottom: '0.25rem',
  fontSize: '0.75rem',
  fontFamily: 'monospace',
  border: 'none',
  cursor: 'pointer',
  color: '#374151',
  background: 'transparent',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const twirlStyle: React.CSSProperties = {
  flexShrink: 0,
  width: '0.75rem',
  fontSize: '0.55rem',
  lineHeight: 1,
  color: '#6b7280',
};

const twirlSpacerStyle: React.CSSProperties = {
  flexShrink: 0,
  width: '0.75rem',
};

const labelStyle: React.CSSProperties = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};
