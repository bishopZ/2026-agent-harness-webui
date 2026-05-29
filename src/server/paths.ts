import path from 'path';

/** Filename for the priority/lifecycle sidecar (lives at HARNESS_ROOT). */
export const PRIORITIES_FILENAME = 'priorities.json';

/**
 * Absolute path to priorities.json for the configured harness root.
 * With default setup, HARNESS_ROOT is this repo root and the file is
 * `<repo>/priorities.json`.
 */
export const prioritiesPath = (harnessRoot: string): string =>
  path.join(harnessRoot, PRIORITIES_FILENAME);
