import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { validateConfig } from './config.js';
import { createFilesRouter } from './routes/files.js';
import { createRenderRouter } from './routes/render.js';
import { createDiscoverRouter } from './routes/discover.js';
import { createApprovalQueueRouter } from './routes/approvalQueue.js';
import { createPrioritiesRouter } from './routes/priorities.js';
import { reconcile } from './utils/reconcileSidecar.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');

const config = validateConfig();

// ── Startup: reconcile filesystem tree with priorities.json ───────────────────
await reconcile(config.HARNESS_ROOT);

const app = express();

app.use(express.json());

// ── API routes ────────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    harnessRoot: config.HARNESS_ROOT,
    prioritiesPath: config.PRIORITIES_PATH,
  });
});

// Task 2: file tree
app.use('/api/files', createFilesRouter(config.HARNESS_ROOT));

// Task 3: markdown render
app.use('/api/render', createRenderRouter(config.HARNESS_ROOT));

// Task 6: discover harness + reconcile sidecar
app.use('/api/discover', createDiscoverRouter(config.HARNESS_ROOT));

// Task 7: approval queue (In Review ideas)
app.use('/api/approval-queue', createApprovalQueueRouter(config.HARNESS_ROOT));

// Task 10: priority write-back (POST /api/priorities)
app.use('/api/priorities', createPrioritiesRouter(config.HARNESS_ROOT));

// ── Static / SPA serving ──────────────────────────────────────────────────────
const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  const clientDist = path.join(repoRoot, 'dist', 'client');
  app.use(express.static(clientDist));
  // Express 5 requires a named wildcard; use app.use as SPA fallback
  app.use((_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    root: repoRoot,
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

// ── Bind to localhost only (NF-03) ────────────────────────────────────────────
app.listen(config.PORT, '127.0.0.1', () => {
  console.log(
    `[agent-harness-webui] Server running at http://127.0.0.1:${config.PORT}`
  );
  console.log(`[agent-harness-webui] HARNESS_ROOT: ${config.HARNESS_ROOT}`);
  console.log(`[agent-harness-webui] PRIORITIES_PATH: ${config.PRIORITIES_PATH}`);
  if (!isProd) {
    console.log('[agent-harness-webui] Mode: development (Vite HMR active)');
  }
});
