import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const forbidden = /^\/(?:api|builder|cart|checkout|order-tracking|search)(?:\/|$)|^\/contact\/form(?:\/|$)|^\/creativa\/(?:cart|checkout|order-tracking)(?:\/|$)/;
export function checkPrerenderOutput(root) {
  const inventory = JSON.parse(readFileSync(path.join(root, 'scripts/migration/prerender-route-inventory.json'), 'utf8'));
  const allowed = new Set(inventory.publicPages.map((file) => {
    const page = file.replace(/^pages/, '').replace(/\.(?:tsx?|jsx?)$/, '').replace(/\/index$/, '');
    return page || '/';
  }));
  const manifest = JSON.parse(readFileSync(path.join(root, 'dist/server/vinext-prerender.json'), 'utf8'));
  const slugs = JSON.parse(readFileSync(path.join(root, 'artifacts/migration/runtime/current-slugs.json'), 'utf8'));
  if (slugs.validation?.status !== 'pass' || !Array.isArray(slugs.paths)) throw new Error('Current slug inventory is invalid');
  const cache = path.join(root, '.cloudflare/output/v1/workers/default/assets/_vinext/static-cache');
  const index = JSON.parse(readFileSync(path.join(cache, 'index.json'), 'utf8'));
  const rendered = manifest.routes.filter((route) => route.status === 'rendered');
  if (!manifest.buildId || rendered.length === 0) throw new Error('Missing build identity or rendered routes');
  const expectedPaths = new Set([...slugs.paths, ...inventory.publicPages.filter((file) => !file.includes('[')).map((file) => file.replace(/^pages/, '').replace(/\.(?:tsx?|jsx?)$/, '').replace(/\/index$/, '') || '/')]);
  const renderedPaths = new Set(rendered.map((route) => route.path ?? route.route));
  const missing = [...expectedPaths].filter((p) => !renderedPaths.has(p));
  const unexpected = [...renderedPaths].filter((p) => !expectedPaths.has(p));
  if (missing.length || unexpected.length) throw new Error(`Prerender paths differ from current inventory: ${missing.length} missing, ${unexpected.length} unexpected`);
  for (const route of rendered) {
    if (route.router !== 'pages' || forbidden.test(route.path ?? route.route)) throw new Error(`Prohibited or unexpected prerender route: ${route.path ?? route.route}`);
    if (typeof route.revalidate === 'number') throw new Error(`Finite revalidation in read-only cache: ${route.path ?? route.route}`);
  }
  const entries = Object.entries(index);
  if (entries.length !== rendered.length) throw new Error(`Cache entries ${entries.length} do not match rendered routes ${rendered.length}`);
  const files = new Set(readdirSync(cache));
  for (const [id, metadata] of entries) {
    if (!/^[a-f0-9]{64}$/.test(id) || metadata.kind !== 'pages') throw new Error(`Unexpected cache entry ${id}`);
    const file = `${id}.pages`;
    const data = JSON.parse(readFileSync(path.join(cache, file), 'utf8'));
    files.delete(file);
    const match = typeof data.html === 'string' && data.html.match(/<script[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
    if (!match) throw new Error(`Missing Next data in ${file}`);
    const next = JSON.parse(match[1]);
    if (typeof next.page !== 'string' || !allowed.has(next.page) || forbidden.test(next.page) || next.buildId !== manifest.buildId) throw new Error(`Prohibited or invalid HTML page in ${file}`);
    if (JSON.stringify(next.props) !== JSON.stringify(data.pageData)) throw new Error(`HTML and navigation data differ in ${file}`);
  }
  files.delete('index.json');
  if (files.size) throw new Error(`Unexpected cache artifacts: ${[...files].join(', ')}`);
  return rendered.length;
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(`Prerender output OK: ${checkPrerenderOutput(process.cwd())} public HTML/data entries`);
