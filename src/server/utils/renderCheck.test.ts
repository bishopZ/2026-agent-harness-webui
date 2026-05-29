/**
 * Task 12 — renderCheck.test.ts
 *
 * Tests for:
 *   F-07  Doc reader renders zero <input>, <select>, <textarea> elements
 *
 * Uses cheerio to parse rendered HTML.
 * Run with:  npx tsx src/server/utils/renderCheck.test.ts
 * Set HARNESS_ROOT to also test against the real SYSTEM_OVERVIEW.md.
 */

import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { marked } from 'marked';
import { load } from 'cheerio';
import { rewriteMarkdownLinks } from './linkRewrite.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string): void {
  if (condition) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.error(`  ✗ ${label}`);
    failed++;
  }
}

function checkNoFormControls(html: string, source: string): void {
  const $ = load(html);
  const inputCount = $('input').length;
  const selectCount = $('select').length;
  const textareaCount = $('textarea').length;

  assert(inputCount === 0, `[${source}] <input> count = 0 (found ${inputCount})`);
  assert(selectCount === 0, `[${source}] <select> count = 0 (found ${selectCount})`);
  assert(textareaCount === 0, `[${source}] <textarea> count = 0 (found ${textareaCount})`);
}

// ── F-07: fixture Markdown (no HARNESS_ROOT required) ────────────────────────

console.log('\n[F-07] Rendered Markdown must contain zero form controls');

// Fixture 1: standard prose
const fixture1 = `
# Heading

Some paragraph text with **bold** and _italic_.

## Sub-heading

- item one
- item two

[Link](https://example.com) and [internal](./other.md).

\`\`\`typescript
const x = 1;
\`\`\`

| Col A | Col B |
|-------|-------|
| foo   | bar   |
`;

const html1 = rewriteMarkdownLinks(marked(fixture1) as string);
checkNoFormControls(html1, 'fixture-prose');

// Fixture 2: empty document
const html2 = rewriteMarkdownLinks(marked('') as string);
checkNoFormControls(html2, 'fixture-empty');

// Fixture 3: headings and blockquotes only
const fixture3 = `
# Title

> This is a blockquote.
>
> With multiple lines.

## Another heading

Paragraph with a [link](./relative.md).
`;

const html3 = rewriteMarkdownLinks(marked(fixture3) as string);
checkNoFormControls(html3, 'fixture-blockquote');

// ── F-07: real SYSTEM_OVERVIEW.md (if HARNESS_ROOT is set) ───────────────────

const harnessRoot = process.env['HARNESS_ROOT'];

if (harnessRoot) {
  const sysOverviewPath = path.join(harnessRoot, 'SYSTEM_OVERVIEW.md');
  if (existsSync(sysOverviewPath)) {
    console.log('\n[F-07] SYSTEM_OVERVIEW.md from HARNESS_ROOT');
    const content = readFileSync(sysOverviewPath, 'utf8');
    const html = rewriteMarkdownLinks(marked(content) as string);
    checkNoFormControls(html, 'SYSTEM_OVERVIEW.md');
  } else {
    console.log('\n[F-07] SYSTEM_OVERVIEW.md not found at HARNESS_ROOT — skipping live file check');
  }
} else {
  // Fall back to the repo-local SYSTEM_OVERVIEW.md (which exists in the demo harness)
  const repoRoot = path.resolve(__dirname, '..', '..', '..');
  const localSysOverview = path.join(repoRoot, 'SYSTEM_OVERVIEW.md');
  if (existsSync(localSysOverview)) {
    console.log('\n[F-07] SYSTEM_OVERVIEW.md from repo root (HARNESS_ROOT not set)');
    const content = readFileSync(localSysOverview, 'utf8');
    const html = rewriteMarkdownLinks(marked(content) as string);
    checkNoFormControls(html, 'SYSTEM_OVERVIEW.md (repo root)');
  } else {
    console.log('\n[F-07] No HARNESS_ROOT and no local SYSTEM_OVERVIEW.md — skipping live file check');
  }
}

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n[renderCheck.test] ${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
