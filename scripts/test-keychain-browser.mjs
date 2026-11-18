import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const browser = "agent-browser";
const session = execFileSync(browser, ["session", "id", "--scope", "worktree", "--prefix", "keychain-qa"], { encoding: "utf8" }).trim();
const run = (...args) => execFileSync(browser, ["--session", session, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
const evaluate = (expression) => run("eval", expression);
const selectDialogOption = (index, label) => {
	evaluate(`(() => { const dialog=document.querySelector('[role=dialog]'); const control=dialog?.querySelectorAll('[role=combobox]')[${index}]; if(!control)return false;control.click();return true; })()`);
	run("wait", "150");
	evaluate(`(() => { const option=Array.from(document.querySelectorAll('[role=option]')).find(e=>e.innerText.trim()===${JSON.stringify(label)});if(!option)return false;option.click();return true; })()`);
	run("wait", "150");
};
const assertBrowser = (expression, message) => {
	const result = evaluate(expression);
	assert.match(result, /true/i, `${message}; browser returned ${result}`);
};

try {
	run("open", process.env.KEYCHAIN_BASE_URL || "http://localhost:3000/builder/keychain");
	run("wait", "3000");
	const viewports = [[320, 780], [360, 800], [390, 844], [430, 900], [844, 390], [1280, 800]];
	const results = [];
	for (const [width, height] of viewports) {
		run("set", "viewport", String(width), String(height));
		assertBrowser("document.documentElement.scrollWidth <= window.innerWidth", `${width}x${height} has no horizontal page overflow`);
		assertBrowser("document.querySelector('[aria-label=\\\"Bản xem trước móc khóa\\\"]') !== null", `${width}x${height} exposes the preview region`);
		assertBrowser("Array.from(document.querySelectorAll('h6')).filter(e => /0[1-5] ·/.test(e.textContent)).map(e => e.textContent.trim()).join('|') === '01 · Hình dáng & móc|02 · Ảnh mặt trước|03 · Mặt sau|04 · Màu mica|05 · Xuất PNG'", `${width}x${height} keeps the five control groups in order`);
		assertBrowser("Array.from(document.querySelectorAll('main button')).every(e => e.getBoundingClientRect().height >= 44)", `${width}x${height} has 44px builder button targets`);
		assertBrowser("Array.from(document.querySelectorAll('main input:not([type=file])')).every(e => parseFloat(getComputedStyle(e).fontSize) >= 16)", `${width}x${height} has 16px form input text`);
		if (width < 600) assertBrowser("document.querySelector('[aria-label=\\\"Bản xem trước móc khóa\\\"]').getBoundingClientRect().top < document.querySelector('h6').getBoundingClientRect().top", `${width}x${height} places preview before controls`);
		if (width >= 900) assertBrowser("getComputedStyle(document.querySelector('[aria-label=\\\"Bản xem trước móc khóa\\\"]').parentElement).gridTemplateColumns.split(' ').length >= 2", `${width}x${height} uses desktop columns`);
		assertBrowser("(() => { const canvas = document.querySelector('canvas'); if (!canvas || canvas.tabIndex !== 0) return false; canvas.focus(); canvas.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })); return document.activeElement === canvas; })()", `${width}x${height} keeps keyboard controls focusable`);
		results.push({ width, height, noHorizontalOverflow: true, controlsInOrder: true, minButtonHeight: 44, minInputFont: 16 });
	}
	run("set", "viewport", "390", "844");
	const assetUrl = `${new URL(process.env.KEYCHAIN_BASE_URL || "http://localhost:3000").origin}/keychain/fixtures/transparent-blob.png`;
	run("network", "route", "**/api/keychain/uploads", "--body", JSON.stringify({ image: { _type: "image", asset: { _ref: "image-a1b2c3-64x64-png", _type: "reference" } }, url: assetUrl }));
	run("network", "route", "**/api/keychain/designs", "--body", JSON.stringify({ id: "bf9ab3f4-64b2-4f1c-b66d-0a272c7cce6d", url: "/builder/keychain?design=bf9ab3f4-64b2-4f1c-b66d-0a272c7cce6d" }));
	run("upload", "input[type=file]", `${process.cwd()}/public/keychain/fixtures/transparent-blob.png`);
	run("wait", "1800");
	run("find", "role", "button", "click", "--name", "Theo viền ảnh");
	run("wait", "3000");
	assertBrowser("!document.body.innerText.includes('Không tạo được đường cắt') && !document.body.innerText.includes('nhiều mảnh rời')", "synthetic upload produces a valid die-cut geometry");
	assertBrowser("Array.from(document.querySelectorAll('main button')).some(e => e.innerText.toLowerCase().includes('xuất png') && !e.disabled)", "PNG export unlocks after the current geometry is ready");
	evaluate("window.__keychainDownloads=[];HTMLAnchorElement.prototype.click=function(){if(this.download)window.__keychainDownloads.push(this.download)};true");
	evaluate("Array.from(document.querySelectorAll('button')).filter(e=>e.innerText.toLowerCase().includes('xuất png')&&e.getBoundingClientRect().height>0).at(-1).click();true");
	run("wait", "500");
	const variants = [];
	for (const scope of ["Móc khóa đầy đủ", "Chỉ mặt móc"]) for (const scale of ["1× · 100 px/cm", "2× · 200 px/cm", "3× · 300 px/cm"]) {
		selectDialogOption(0, scope);
		selectDialogOption(1, scale);
		evaluate("Array.from(document.querySelectorAll('button')).filter(e=>e.innerText.toLowerCase().includes('xuất png')&&e.getBoundingClientRect().height>0).at(-1).click();true");
		run("wait", "500");
		assertBrowser("document.body.innerText.includes('Đã lưu snapshot')", `mock snapshot succeeds for ${scope} at ${scale}`);
		variants.push({ scope, scale });
	}
	assertBrowser("window.__keychainDownloads.length === 6", "all six browser PNG variants complete");
	assertBrowser("document.scrollingElement.scrollHeight > window.innerHeight", "page content remains vertically scrollable");
	assertBrowser("Array.from(document.querySelectorAll('main div')).some(e=>parseFloat(getComputedStyle(e).paddingBottom)>=24)", "builder retains bottom safe-area spacing");
	evaluate("Array.from(document.querySelector('[role=dialog]')?.querySelectorAll('button')||[]).find(e=>e.innerText.toLowerCase().includes('đóng'))?.click();true");
	run("wait", "500");
	evaluate("window.__originalCanvasGetContext=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/i.test(type)?null:window.__originalCanvasGetContext.call(this,type,...args)};true");
	run("find", "role", "button", "click", "--name", "Xem 3D");
	run("wait", "2500");
	assertBrowser("document.body.innerText.includes('WebGL') || document.body.innerText.includes('Quay lại 2D')", "forced WebGL creation failure returns a usable 2D fallback");
	run("set", "media", "light", "reduced-motion");
	assertBrowser("matchMedia('(prefers-reduced-motion: reduce)').matches", "reduced-motion preference is emulated");
	console.log(JSON.stringify({ session, route: process.env.KEYCHAIN_BASE_URL || "http://localhost:3000/builder/keychain", viewports: results, mockUpload: "synthetic local PNG", mockSnapshot: true, browserExportVariants: variants, webglFallback: "forced context creation failure rendered a 2D return path", reducedMotionEmulated: true, note: "API routes were mocked; no Sanity asset or snapshot was created." }, null, 2));
} finally {
	try { run("close"); } catch {}
}
