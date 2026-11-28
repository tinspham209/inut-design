import assert from 'node:assert/strict';
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('./scripts/typescript-loader.mjs', pathToFileURL('./'));
const { isUndeployedProductPath } = await import('../../worker/deployed-paths.ts');

const deployed = new Set([
  '/san-pham/lighters/existing-lighter',
  '/san-pham/skin-laptop/dave-the-diver',
  '/san-pham/skin-nut-phim/existing-keycap',
  '/creativa/skin-laptop/existing-creativa',
  '/creativa/skin-laptop/huong-dan-su-dung',
  '/creativa/skin-laptop/huong-dan-su-dung/cach-tu-dan-skin-macbook-tai-nha',
]);

for (const path of [
  '/san-pham/lighters/new-lighter',
  '/san-pham/lighters/new-lighter/',
  '/_next/data/build/san-pham/lighters/new-lighter.json',
  '/san-pham/skin-laptop/new-slug',
  '/san-pham/skin-laptop/new-slug/',
  '/_next/data/build/san-pham/skin-laptop/new-slug.json',
  '/san-pham/skin-nut-phim/missing',
  '/_next/data/build/san-pham/skin-nut-phim/missing.json',
  '/creativa/skin-laptop/unknown',
  '/_next/data/build/creativa/skin-laptop/unknown.json',
  '/san-pham/skin-laptop/new%2Fslug',
]) {
  assert.equal(isUndeployedProductPath(path, deployed), true, `Expected undeployed path to be blocked: ${path}`);
}

for (const path of [
  '/san-pham/lighters/existing-lighter',
  '/_next/data/build/san-pham/lighters/existing-lighter.json',
  '/san-pham/skin-laptop/dave-the-diver',
  '/san-pham/skin-laptop/dave-the-diver/',
  '/_next/data/build/san-pham/skin-laptop/dave-the-diver.json',
  '/san-pham/skin-nut-phim/existing-keycap',
  '/_next/data/build/san-pham/skin-nut-phim/existing-keycap.json',
  '/creativa/skin-laptop/existing-creativa',
  '/creativa/skin-laptop/huong-dan-su-dung',
  '/_next/data/build/creativa/skin-laptop/huong-dan-su-dung.json',
  '/creativa/skin-laptop/huong-dan-su-dung/cach-tu-dan-skin-macbook-tai-nha',
  '/api/creativa/products/missing',
  '/creativa/cart',
  '/creativa/checkout',
  '/cart/lighters',
  '/checkout/lighters',
  '/search',
  '/builder/keychain',
  '/services/a/missing',
  '/san-pham/skin-laptop',
]) {
  assert.equal(isUndeployedProductPath(path, deployed), false, `Expected allowed/non-product path to pass: ${path}`);
}

assert.equal(isUndeployedProductPath('/san-pham/skin-laptop/new-slug', null), false);
console.log('Deployed-path guard fixtures passed across all 4 product families');
