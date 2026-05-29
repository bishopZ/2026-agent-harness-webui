/**
 * Toast — lightweight success/error notification.
 *
 * Task 11 (Priority workspace write layer).
 * ToastContainer is fixed bottom-right; each toast auto-dismisses after 2 s.
 * Used only in the Priority workspace route — never imported by the Doc reader (F-07 safe).
 */
import { useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
}

interface Props {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ToastContainer({ toasts, onDismiss }: Props) {
  // Auto-dismiss the oldest undismissed toast after 2 s.
  useEffect(() => {
    if (toasts.length === 0) return;
    const t = toasts[0];
    const timer = window.setTimeout(() => onDismiss(t.id), 2000);
    return () => window.clearTimeout(timer);
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div style={containerStyle} aria-live="polite" aria-atomic="true">
      {toasts.map(t => (
        <div
          key={t.id}
          style={t.type === 'success' ? successStyle : errorStyle}
          role="status"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const containerStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '1.25rem',
  right: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.4rem',
  zIndex: 9999,
  pointerEvents: 'none',
};

const baseToastStyle: React.CSSProperties = {
  padding: '0.45rem 0.85rem',
  borderRadius: '5px',
  fontSize: '0.8rem',
  fontWeight: 500,
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  opacity: 0.95,
  whiteSpace: 'nowrap',
};

const successStyle: React.CSSProperties = {
  ...baseToastStyle,
  backgroundColor: '#166534',
  color: '#fff',
};

const errorStyle: React.CSSProperties = {
  ...baseToastStyle,
  backgroundColor: '#991b1b',
  color: '#fff',
};
