import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const config = readFileSync('cloudflare.config.ts', 'utf8');
const section = config.match(/runWorkerFirst:\s*\[([\s\S]*?)\]/)?.[1];
if (!section) throw new Error('Missing static routing rules');

const staticRules = [...section.matchAll(/"([^"]+)"/g)]
  .map((m) => m[1])
  .filter((r) => r.startsWith('/') || r.startsWith('!/'));

const hasConditionalProdSeo =
  section.includes('deploymentChannel === "production"') &&
  section.includes('!/robots.txt') &&
  section.includes('!/sitemap.xml');

if (!hasConditionalProdSeo) {
  throw new Error('cloudflare.config.ts must bypass /robots.txt and /sitemap.xml only in production');
}

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.posix.join(dir, e.name);
    return e.isDirectory() ? walk(p) : [p];
  });
const excluded = (p) =>
  /(?:^|\/)\.DS_Store$/.test(p) ||
  p === 'keychain/connectors/README.md' ||
  ['.assetsignore', '_headers', 'robots.txt', 'sitemap.xml'].includes(p);
const files = walk('public')
  .map((p) => p.slice('public/'.length))
  .filter((p) => !excluded(p));

const protectedPaths = [
  '/search',
  '/builder',
  '/builder/keychain',
  '/builder/lighters',
  '/cart/lighters',
  '/checkout/lighters',
  '/order-tracking',
  '/order-tracking/lighters/test',
  '/contact/form',
  '/creativa/cart',
  '/creativa/checkout',
  '/creativa/order-tracking',
  '/creativa/order-tracking/test',
  '/api/orders/lighters',
  '/_vinext/static-cache/index.json',
  '/_vinext/static-cache/x/_next/static/x',
  '/services/an-pham-bao-bi/decal-nhan-mac',
  '/policies-terms/thong-tin-thanh-toan',
];

function validateChannel(channel) {
  const production = channel !== 'preview';
  const rules = staticRules.filter((r) => production || !['!/robots.txt', '!/sitemap.xml'].includes(r));
  if (rules.length > 100 || rules.some((r) => r.length >= 100) || new Set(rules).size !== rules.length || !rules.includes('/*')) {
    throw new Error(`[${channel}] Invalid routing rule count, length, duplicates, or missing root rule`);
  }
  const negative = rules
    .filter((r) => r.startsWith('!'))
    .map((r) => new RegExp('^' + r.slice(1).split('*').map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('.*') + '$'));
  const bypass = (url) => negative.some((pattern) => pattern.test(url));

  for (const p of [...protectedPaths, ...(production ? [] : ['/robots.txt', '/sitemap.xml'])]) {
    if (bypass(p)) throw new Error(`[${channel}] Worker path is bypassed: ${p}`);
  }
  if (production && (!bypass('/robots.txt') || !bypass('/sitemap.xml'))) {
    throw new Error(`[${channel}] Production SEO assets are not eligible for bypass`);
  }
  const uncovered = files.filter((p) => !bypass('/' + p));
  if (uncovered.length) throw new Error(`[${channel}] Public files without bypass: ${uncovered.join(', ')}`);
  return rules.length;
}

const prodCount = validateChannel('production');
const previewCount = validateChannel('preview');
console.log(`Asset routing OK (production: ${prodCount} rules, preview: ${previewCount} rules; ${files.length} public files; protected path samples)`);
