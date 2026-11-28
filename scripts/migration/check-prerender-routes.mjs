import { readFileSync, readdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { assertPrerenderVersion } from './prerender-version.mjs';

const version = JSON.parse(readFileSync(path.join(path.dirname(fileURLToPath(import.meta.resolve('vinext'))), '../package.json'), 'utf8')).version;
assertPrerenderVersion(version);
const { classifyPagesRoute } = await import('../../node_modules/vinext/dist/build/report.js');
const temp = mkdtempSync(path.join(tmpdir(), 'inut-prerender-check-'));
try {
  const fixture = path.join(temp, 'fixture.tsx');
  writeFileSync(fixture, 'export default function Page() { return null }');
  if (classifyPagesRoute(fixture).type !== 'static') throw new Error('Unexpected Vinext static classification');
  writeFileSync(fixture, 'export const getServerSideProps = async () => ({ props: {} }); export default function Page() { return null }');
  if (classifyPagesRoute(fixture).type !== 'ssr') throw new Error('Unexpected Vinext SSR classification');
} finally { rmSync(temp, { recursive: true, force: true }); }

const inventory = JSON.parse(readFileSync('scripts/migration/prerender-route-inventory.json', 'utf8'));
const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const p = path.posix.join(dir, entry.name);
  return entry.isDirectory() ? walk(p) : /\.(tsx?|jsx?)$/.test(p) && !/^pages\/(?:_app|_document|_error)\.[^.]+$/.test(p) ? [p] : [];
});
const actual = walk('pages').sort();
const all = [...inventory.publicPages, ...inventory.requestDependentPages, ...inventory.apiRoutes];
if (new Set(all).size !== all.length || JSON.stringify([...all].sort()) !== JSON.stringify(actual)) throw new Error('Route inventory differs from Pages files; review all additions and removals');
const sensitive = /^pages\/(?:api(?:\/|\.)|(?:builder|cart|checkout|order-tracking|search)(?:\/|\.)|contact\/form(?:\/|\.)|creativa\/(?:cart|checkout|order-tracking)(?:\/|\.))/;
for (const file of inventory.publicPages) {
  if (sensitive.test(file)) throw new Error(`Sensitive page is in public allowlist: ${file}`);
  if (!['static', 'isr'].includes(classifyPagesRoute(file).type)) throw new Error(`Public allowlisted page is not classified static: ${file}`);
}
for (const file of inventory.requestDependentPages) {
  if (classifyPagesRoute(file).type !== 'ssr') throw new Error(`Non-public page is not SSR: ${file}`);
}
for (const file of inventory.apiRoutes) if (!file.startsWith('pages/api/')) throw new Error(`Non-API route in API list: ${file}`);
console.log(`Prerender route inventory OK: ${inventory.publicPages.length} public, ${inventory.requestDependentPages.length} SSR, ${inventory.apiRoutes.length} API`);
