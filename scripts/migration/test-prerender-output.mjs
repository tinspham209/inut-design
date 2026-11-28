import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { checkPrerenderOutput } from './check-prerender-output.mjs';
const root = mkdtempSync(path.join(tmpdir(), 'inut-output-gate-'));
try {
  const cache = path.join(root, '.cloudflare/output/v1/workers/default/assets/_vinext/static-cache');
  mkdirSync(cache, { recursive: true });
  mkdirSync(path.join(root, 'dist/server'), { recursive: true });
  mkdirSync(path.join(root, 'scripts/migration'), { recursive: true });
  mkdirSync(path.join(root, 'artifacts/migration/runtime'), { recursive: true });
  const id = 'a'.repeat(64), buildId = 'fixture';
  const save = (file, value) => writeFileSync(file, JSON.stringify(value));
  const manifest = { buildId, routes: [{ router: 'pages', status: 'rendered', route: '/', revalidate: false }] };
  save(path.join(root, 'dist/server/vinext-prerender.json'), manifest);
  save(path.join(root, 'scripts/migration/prerender-route-inventory.json'), { publicPages: ['pages/index.tsx'] });
  save(path.join(root, 'artifacts/migration/runtime/current-slugs.json'), { paths: [], validation: { status: 'pass' } });
  save(path.join(cache, 'index.json'), { [id]: { kind: 'pages' } });
  const next = { buildId, page: '/', props: { pageProps: {} } };
  const data = { html: `<script id="__NEXT_DATA__">${JSON.stringify(next)}</script>`, pageData: next.props };
  save(path.join(cache, `${id}.pages`), data);
  if (checkPrerenderOutput(root) !== 1) throw new Error('Valid fixture failed');
  manifest.routes[0].route = '/checkout/lighters';
  save(path.join(root, 'dist/server/vinext-prerender.json'), manifest);
  let rejected = false;
  try { checkPrerenderOutput(root); } catch { rejected = true; }
  if (!rejected) throw new Error('Prohibited route fixture was accepted');
  console.log('Prerender output gate fixtures passed');
} finally { rmSync(root, { recursive: true, force: true }); }
