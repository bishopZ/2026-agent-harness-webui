/**
 * writePriorities.ts
 *
 * Handles validated, atomic writes to priorities.json.
 *
 * Rules (ADR-AHWUI-04):
 *   - Only the last path segment `tier` or `priority` may be written.
 *   - All other suffixes (lifecycle, lastWork, notes, lastUpdated, …) are rejected with 400.
 *   - The resolved key must already exist in the current priorities.json (no new key creation).
 *   - Value type is validated before write:
 *       tier     → integer (number with no fractional part)
 *       priority → one of "High" | "Medium" | "Low"
 *   - Writes are performed via write-file-atomic (ADR-AHWUI-05).
 */

import path from 'path';
import writeFileAtomic from 'write-file-atomic';
import { loadCurrentSidecar, sidecarPath } from './reconcileSidecar.js';
import type { PrioritiesFile } from './sidecarTypes.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type WriteResult =
  | { ok: true }
  | { ok: false; status: 400; message: string };

const ALLOWED_SUFFIXES = ['tier', 'priority'] as const;
type AllowedSuffix = (typeof ALLOWED_SUFFIXES)[number];

const PRIORITY_VALUES = ['High', 'Medium', 'Low'] as const;
type PriorityValue = (typeof PRIORITY_VALUES)[number];

// ─── Path navigation helpers ──────────────────────────────────────────────────

/**
 * Navigate a nested object by an array of key segments.
 * Returns `undefined` if any segment is missing or the current node is not
 * an object.  Does not throw.
 */
function getAtPath(obj: unknown, segments: string[]): unknown {
  let current: unknown = obj;
  for (const seg of segments) {
    if (current === null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[seg];
  }
  return current;
}

/**
 * Set a value at the nested path given by `segments` inside `obj`.
 * Assumes every intermediate segment already exists and is an object
 * (caller must verify with getAtPath first).
 */
function setAtPath(
  obj: Record<string, unknown>,
  segments: string[],
  value: unknown
): void {
  let current: Record<string, unknown> = obj;
  for (let i = 0; i < segments.length - 1; i++) {
    current = current[segments[i]] as Record<string, unknown>;
  }
  current[segments[segments.length - 1]] = value;
}

// ─── Validation ───────────────────────────────────────────────────────────────

type SuffixResult =
  | { ok: true; suffix: AllowedSuffix }
  | { ok: false; message: string };

function validateSuffix(segments: string[]): SuffixResult {
  const last = segments[segments.length - 1];
  if ((ALLOWED_SUFFIXES as readonly string[]).includes(last)) {
    return { ok: true, suffix: last as AllowedSuffix };
  }
  return {
    ok: false,
    message: `Path suffix "${last}" is not writable via the API. Only "tier" and "priority" may be set.`,
  };
}

function validateValue(suffix: AllowedSuffix, value: unknown): string | null {
  if (suffix === 'tier') {
    if (typeof value !== 'number' || !Number.isInteger(value)) {
      return `"tier" must be an integer, got: ${JSON.stringify(value)}`;
    }
    return null;
  }
  // suffix === 'priority'
  if (!(PRIORITY_VALUES as readonly unknown[]).includes(value)) {
    return `"priority" must be one of ${PRIORITY_VALUES.map((v) => `"${v}"`).join(', ')}, got: ${JSON.stringify(value)}`;
  }
  return null;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Apply a validated priority update to priorities.json atomically.
 *
 * @param harnessRoot  Absolute path to the harness root directory.
 * @param dotPath      Dot-separated key path, e.g. "initiatives.Time2Magic.tier"
 * @param value        The new value (type is validated per suffix rules).
 * @returns            WriteResult — `{ ok: true }` or `{ ok: false, status, message }`.
 */
export async function applyPriorityUpdate(
  harnessRoot: string,
  dotPath: string,
  value: unknown
): Promise<WriteResult> {
  // 1. Parse path into segments
  const segments = dotPath.split('.');
  if (segments.length < 2) {
    return {
      ok: false,
      status: 400,
      message: `Path too short: "${dotPath}". Expected at least two segments.`,
    };
  }

  // 2. Validate suffix (last segment must be "tier" or "priority")
  const suffixResult = validateSuffix(segments);
  if (!suffixResult.ok) {
    return { ok: false, status: 400, message: suffixResult.message };
  }
  const suffix: AllowedSuffix = suffixResult.suffix;

  // 3. Load current sidecar
  const sidecar: PrioritiesFile = loadCurrentSidecar(harnessRoot);

  // 4. Verify the path exists in the current sidecar (no new key creation)
  //    Check the parent object exists, and the field itself exists.
  const parentSegments = segments.slice(0, -1);
  const parent = getAtPath(sidecar, parentSegments);
  if (parent === undefined || parent === null || typeof parent !== 'object') {
    return {
      ok: false,
      status: 400,
      message: `Path "${dotPath}" does not resolve to an existing key in priorities.json.`,
    };
  }
  const fieldKey = segments[segments.length - 1];
  if (!Object.prototype.hasOwnProperty.call(parent, fieldKey)) {
    return {
      ok: false,
      status: 400,
      message: `Path "${dotPath}" does not resolve to an existing key in priorities.json.`,
    };
  }

  // 5. Validate value type
  const typeError = validateValue(suffix, value);
  if (typeError !== null) {
    return { ok: false, status: 400, message: typeError };
  }

  // 6. Apply update in-memory and write atomically
  setAtPath(sidecar as unknown as Record<string, unknown>, segments, value);

  const filePath = sidecarPath(harnessRoot);
  await writeFileAtomic(filePath, JSON.stringify(sidecar, null, 2) + '\n');

  return { ok: true };
}
