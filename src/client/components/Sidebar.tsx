import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ancestorDirPaths,
  buildFileTree,
  normalizeSidebarPath,
  type FileTreeNode,
} from '../utils/fileTree.js';

const EXPANDED_STORAGE_KEY = 'harness-sidebar-expanded';

/**
 * Sidebar — Doc reader file tree (read-only navigation).
 *
 * F-07 compliance: zero <input>, <select>, or <textarea> elements.
 * All interaction is via <button> elements only.
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(readExpandedFromStorage);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentPath = searchParams.get('path') ?? '';
  const selectedPath = normalizeSidebarPath(currentPath);
  const selectedRef = useRef<HTMLButtonElement | null>(null);
  const tree = buildFileTree(files);

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
  }, []);

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

  function renderNodes(nodes: FileTreeNode[], depth: number): React.ReactNode {
    return nodes.map((node) => {
      const padLeft = `calc(0.75rem + ${depth * 0.85}rem)`;

      if (node.type === 'dir') {
        const isOpen = expanded.has(node.path);
        return (
          <li key={`dir:${node.path}`} style={{ listStyle: 'none' }}>
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
          <button
            type="button"
            ref={isSelected ? selectedRef : undefined}
            onClick={() => handleFileClick(node.path)}
            style={{
              ...rowButtonStyle,
              paddingLeft: padLeft,
              background: isSelected ? '#dbeafe' : 'transparent',
              fontWeight: isSelected ? '600' : '400',
            }}
            title={node.path}
            aria-current={isSelected ? 'page' : undefined}
            data-path={node.path}
          >
            <span style={twirlSpacerStyle} aria-hidden="true" />
            <span style={labelStyle}>{node.name}</span>
          </button>
        </li>
      );
    });
  }

  return (
    <aside style={{ ...sidebarStyle, width: `${sidebarWidth}px` }} aria-label="File tree">
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

// ── Styles ─────────────────────────────────────────────────────────────────────

const sidebarStyle: React.CSSProperties = {
  width: '260px',
  height: '100vh',
  overflowY: 'auto',
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
