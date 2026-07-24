/**
 * usePriorityUpdate — manages POST /api/priorities calls for the Priority workspace.
 *
 * Task 11 (Priority workspace write layer).
 * Returns:
 *   update(path, value) — sends a POST and adds a toast on success or failure.
 *   saving               — Set of dot-paths currently in flight (used for unsaved indicators).
 *
 * onSuccess is called after a successful save so the caller can keep local
 * discover data in sync (PrioritySelect remounts from that data on expand).
 */
import { useState, useCallback } from 'react';
import { type Toast } from '../components/Toast.js';

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function usePriorityUpdate(
  addToast: (t: Omit<Toast, 'id'>) => void,
  onSuccess?: (path: string, value: unknown) => void,
) {
  const [saving, setSaving] = useState<Set<string>>(new Set());

  const update = useCallback(
    async (path: string, value: unknown): Promise<void> => {
      setSaving(prev => new Set([...prev, path]));

      try {
        const res = await fetch('/api/priorities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path, value }),
        });

        if (!res.ok) {
          let msg = `Save failed (${res.status})`;
          try {
            const body = (await res.json()) as { message?: string };
            if (body.message) msg = body.message;
          } catch {
            // ignore parse failure — use default message
          }
          addToast({ message: msg, type: 'error' });
        } else {
          onSuccess?.(path, value);
          addToast({ message: 'Saved', type: 'success' });
        }
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : String(err) || 'Network error';
        addToast({ message: msg, type: 'error' });
      } finally {
        setSaving(prev => {
          const next = new Set(prev);
          next.delete(path);
          return next;
        });
      }
    },
    [addToast, onSuccess],
  );

  return { update, saving };
}
