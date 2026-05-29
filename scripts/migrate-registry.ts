/**
 * One-shot migration: merge DASHBOARD.md + ideas.md into priorities.json, then reconcile.
 *
 * Usage: npm run migrate-registry
 * Requires HARNESS_ROOT in .env or defaults to repo root.
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { mergeMarkdownIntoSidecar } from '../src/server/utils/legacyImport.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

config({ path: path.join(repoRoot, '.env') });

const harnessRoot = process.env.HARNESS_ROOT
  ? path.resolve(process.env.HARNESS_ROOT)
  : repoRoot;

const main = async () => {
  console.log(`[migrate-registry] HARNESS_ROOT: ${harnessRoot}`);
  const result = await mergeMarkdownIntoSidecar(harnessRoot);
  const inReview: string[] = [];
  for (const [initName, init] of Object.entries(result.initiatives)) {
    for (const [projName, proj] of Object.entries(init.projects)) {
      for (const [ideaName, idea] of Object.entries(proj.ideas)) {
        if (idea.lifecycle === 'In Review') {
          inReview.push(`${initName} / ${projName} / ${ideaName}`);
        }
      }
    }
  }
  console.log(`[migrate-registry] Done. Ideas In Review: ${inReview.length}`);
  for (const row of inReview) {
    console.log(`  - ${row}`);
  }
};

main().catch((err) => {
  console.error('[migrate-registry] Failed:', err);
  process.exit(1);
});
