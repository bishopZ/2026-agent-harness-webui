import { useSearchParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar.js';
import { MarkdownView } from '../components/MarkdownView.js';

/**
 * Doc reader route — /doc
 *
 * Layout: sidebar (collapsible file tree) + main content area (rendered markdown).
 * In-app .md links navigate via React Router (no full page reload).
 * Zero <input>, <select>, or <textarea> elements appear in this DOM (F-07).
 */
export function DocReader() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentPath = searchParams.get('path');

  // Handle in-app link clicks within the rendered markdown:
  // The server rewrites .md hrefs to /doc?path=..., which React Router handles.
  // We intercept anchor clicks on the article element and use navigate() instead
  // of a full page reload.
  function handleArticleClick(e: React.MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href) return;
    // Only intercept in-app /doc?path= links
    if (href.startsWith('/doc?path=')) {
      e.preventDefault();
      navigate(href);
    }
    // External links open normally (default browser behavior)
  }

  return (
    <div style={outerStyle}>
      <header style={docHeaderStyle}>
        <a href="/" style={homeLink}>← Home</a>
      </header>
      <div style={layoutStyle}>
        <Sidebar />
        {/* Capture link clicks so React Router handles /doc?path= without reload */}
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
        <div style={{ flex: 1, overflowY: 'auto' }} onClick={handleArticleClick}>
          <MarkdownView filePath={currentPath} />
        </div>
      </div>
    </div>
  );
}

const outerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  overflow: 'hidden',
};

const docHeaderStyle: React.CSSProperties = {
  padding: '0.4rem 0.75rem',
  borderBottom: '1px solid #e5e7eb',
  background: '#f9fafb',
  flexShrink: 0,
};

const homeLink: React.CSSProperties = {
  fontSize: '0.8rem',
  color: '#2563eb',
  textDecoration: 'none',
};

const layoutStyle: React.CSSProperties = {
  display: 'flex',
  flex: 1,
  overflow: 'hidden',
};
