import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = mkdtempSync(path.join(tmpdir(), 'inut-current-slugs-'));
const manifestScript = fileURLToPath(new URL('./generate-static-manifest.mjs', import.meta.url));
const seoScript = fileURLToPath(new URL('./generate-seo-artifacts.mjs', import.meta.url));
const save = (file, value) => { const target = path.join(root, file); mkdirSync(path.dirname(target), { recursive: true }); writeFileSync(target, JSON.stringify(value)); };
const run = (script) => spawnSync(process.execPath, [script], { cwd: root, encoding: 'utf8', env: { ...process.env, NEXT_PUBLIC_SITE_URL: 'https://example.test' } });
try {
  const oldPath = '/san-pham/skin-laptop/old';
  const newPath = '/san-pham/skin-laptop/new';
  save('artifacts/migration/baseline/routes.json', { routes: [{ path: '/' }, { path: '/san-pham/skin-laptop/[slug]' }] });
  save('artifacts/migration/baseline/slugs.json', { paths: [oldPath], validation: { status: 'pass' } });
  save('artifacts/migration/runtime/current-slugs.json', { paths: [newPath], validation: { status: 'pass' } });
  save('.next/server/pages-manifest.json', { '/': 'index.js' });
  save('.next/prerender-manifest.json', { routes: { [newPath]: {} } });
  if (run(manifestScript).status !== 0 || run(seoScript).status !== 0) throw new Error('Current added/removed slug was not accepted');
  const sitemap = readFileSync(path.join(root, 'public/sitemap.xml'), 'utf8');
  if (!sitemap.includes(newPath) || sitemap.includes(oldPath)) throw new Error('SEO used the stale baseline');
  save('.next/prerender-manifest.json', { routes: { [oldPath]: {} } });
  if (run(manifestScript).status === 0) throw new Error('Stale build passed reconciliation');
  save('artifacts/migration/runtime/current-slugs.json', { paths: [newPath], validation: { status: 'fail' } });
  if (run(manifestScript).status === 0 || run(seoScript).status === 0) throw new Error('Invalid inventory was accepted');
  console.log('Current slug fixtures passed: added, removed, stale build and invalid inventory');
} finally { rmSync(root, { recursive: true, force: true }); }
