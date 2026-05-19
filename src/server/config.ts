import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Resolve .env relative to the repo root (one level up from src/server)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');
dotenv.config({ path: path.join(repoRoot, '.env') });

export interface Config {
  HARNESS_ROOT: string;
  PORT: number;
}

/**
 * Validates required environment variables and the harness directory.
 * Throws a descriptive error and exits if validation fails.
 */
export function validateConfig(): Config {
  const rawRoot = process.env.HARNESS_ROOT;

  if (!rawRoot || rawRoot.trim() === '') {
    console.error(
      '[agent-harness-webui] ERROR: HARNESS_ROOT is not set in .env or environment.\n' +
        '  Copy .env.example to .env and set HARNESS_ROOT to the absolute path of your harness folder.\n' +
        '  That folder must contain SYSTEM_OVERVIEW.md.'
    );
    process.exit(1);
  }

  const harnessRoot = path.resolve(rawRoot.trim());

  if (!fs.existsSync(harnessRoot)) {
    console.error(
      `[agent-harness-webui] ERROR: HARNESS_ROOT does not exist: ${harnessRoot}\n` +
        '  Update HARNESS_ROOT in .env to point to an existing directory containing SYSTEM_OVERVIEW.md.'
    );
    process.exit(1);
  }

  const stat = fs.statSync(harnessRoot);
  if (!stat.isDirectory()) {
    console.error(
      `[agent-harness-webui] ERROR: HARNESS_ROOT is not a directory: ${harnessRoot}\n` +
        '  HARNESS_ROOT must be a folder containing SYSTEM_OVERVIEW.md.'
    );
    process.exit(1);
  }

  const systemOverview = path.join(harnessRoot, 'SYSTEM_OVERVIEW.md');
  if (!fs.existsSync(systemOverview)) {
    console.error(
      `[agent-harness-webui] ERROR: HARNESS_ROOT exists but does not contain SYSTEM_OVERVIEW.md.\n` +
        `  Expected: ${systemOverview}\n` +
        `  HARNESS_ROOT must point to a valid agent harness root that contains SYSTEM_OVERVIEW.md.`
    );
    process.exit(1);
  }

  const rawPort = process.env.PORT;
  const port = rawPort ? parseInt(rawPort, 10) : 3747;
  if (isNaN(port) || port < 1 || port > 65535) {
    console.error(
      `[agent-harness-webui] ERROR: PORT is not a valid port number: ${rawPort}\n` +
        '  Set PORT to a number between 1 and 65535 in .env, or omit it to use the default (3747).'
    );
    process.exit(1);
  }

  return { HARNESS_ROOT: harnessRoot, PORT: port };
}
