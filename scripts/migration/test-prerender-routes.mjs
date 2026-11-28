import { cpSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { assertPrerenderVersion } from './prerender-version.mjs';

assertPrerenderVersion('1.4.6');
try {
  assertPrerenderVersion('1.4.7');
  throw new Error('Unsupported version was accepted');
} catch (error) {
  if (!String(error.message).startsWith('Re-review Vinext')) throw error;
}

const root = process.cwd();
const temp = mkdtempSync(path.join(tmpdir(), 'inut-route-gate-'));
const gate = fileURLToPath(new URL('./check-prerender-routes.mjs', import.meta.url));
const run = () => spawnSync(process.execPath, [gate], { cwd: temp, encoding: 'utf8' });
try {
  cpSync(path.join(root, 'pages'), path.join(temp, 'pages'), { recursive: true });
  mkdirSync(path.join(temp, 'scripts/migration'), { recursive: true });
  const inventoryPath = path.join(temp, 'scripts/migration/prerender-route-inventory.json');
  cpSync(path.join(root, 'scripts/migration/prerender-route-inventory.json'), inventoryPath);
  if (run().status !== 0) throw new Error('Valid fixture failed');
  const unknown = path.join(temp, 'pages/_unreviewed.tsx');
  writeFileSync(unknown, 'export default function Page() { return null }');
  if (run().status === 0) throw new Error('Unknown route was accepted');
  rmSync(unknown);
  const search = path.join(temp, 'pages/search/index.tsx');
  const originalSearch = readFileSync(search, 'utf8');
  writeFileSync(search, originalSearch.replace('export const getServerSideProps', 'const getServerSideProps'));
  if (run().status === 0) throw new Error('Non-public static route was accepted');
  writeFileSync(search, originalSearch);
  const inventory = JSON.parse(readFileSync(inventoryPath, 'utf8'));
  const sensitive = 'pages/search/index.tsx';
  inventory.requestDependentPages = inventory.requestDependentPages.filter((p) => p !== sensitive);
  inventory.publicPages.push(sensitive);
  writeFileSync(inventoryPath, JSON.stringify(inventory));
  if (run().status === 0) throw new Error('Sensitive allowlisted route was accepted');
  console.log('Prerender gate fixtures passed: reviewed, unknown and sensitive routes');
} finally { rmSync(temp, { recursive: true, force: true }); }
