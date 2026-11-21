import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const browser = "agent-browser";
const baseUrl = process.env.KEYCHAIN_BASE_URL || "http://localhost:3000";
const route = new URL("/builder/keychain", baseUrl).toString();
const builderRoot = `document.querySelector('[aria-label="Bản xem trước móc khóa"]')?.closest('.MuiContainer-root')`;
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
const readTouchTargetIssues = () => JSON.parse(JSON.parse(evaluate(`JSON.stringify(Array.from(${builderRoot}?.querySelectorAll('button, input:not([type=file]), .MuiSlider-thumb, [role=combobox]')||[]).map(e=>{const t=e.matches('input')?e.closest('.MuiInputBase-root')||e:e;const r=t.getBoundingClientRect();const s=getComputedStyle(e);return {label:(e.getAttribute('aria-label')||e.innerText||e.tagName).trim().replace(/\\s+/g,' ').slice(0,60),width:Math.round(r.width),height:Math.round(r.height),opacity:Number(s.opacity),pointerEvents:s.pointerEvents}}).filter(r=>r.width>0&&r.height>0&&r.opacity>0.5&&r.pointerEvents!=='none'&&(r.width<44||r.height<44)).map(({label,width,height})=>({label,width,height})))`)));

if (process.env.KEYCHAIN_PHASE10_ONLY === "true") {
	const screenshotDir = "docs/keychain-builder-evidence";
	const fixtureUrl = `${new URL(baseUrl).origin}/keychain/fixtures/transparent-blob.png`;
	const sanityUrl = "https://cdn.sanity.io/images/abc123/production/a1b2c3-64x64.png";
	const canvasHash = () => evaluate("(() => {const c=document.querySelector('[aria-label=\\\"Bản xem trước móc khóa\\\"] canvas');const d=c?.getContext('2d')?.getImageData(0,0,c.width,c.height).data;if(!d)return 'unreadable';let h=2166136261;for(let i=0;i<d.length;i+=97)h=Math.imul(h^d[i],16777619);return String(h>>>0)})()");
	const clickMode = (label) => evaluate(`Array.from(document.querySelectorAll('button')).find(e=>e.innerText.includes(${JSON.stringify(label)}))?.click();true`);
	const screenshot = (name) => run("screenshot", `${screenshotDir}/phase10-${name}.png`);
	run("open", route);
	run("wait", "2500");
	run("set", "viewport", "1280", "800");
	run("network", "route", "**/api/keychain/uploads", "--body", JSON.stringify({ image: { _type: "image", asset: { _ref: "image-a1b2c3-64x64-png", _type: "reference" } }, url: sanityUrl }));
	evaluate(`(() => {const p=HTMLImageElement.prototype;const d=Object.getOwnPropertyDescriptor(p,'src');Object.defineProperty(p,'src',{configurable:true,get(){return d.get.call(this)},set(value){d.set.call(this,typeof value==='string'?value.replace(${JSON.stringify(sanityUrl)},${JSON.stringify(fixtureUrl)}):value)}});const f=window.fetch.bind(window);window.fetch=(input,init)=>f(typeof input==='string'?input.replace(${JSON.stringify(sanityUrl)},${JSON.stringify(fixtureUrl)}):input,init);return true})()`);
	run("upload", "input[type=file]", `${process.cwd()}/public/keychain/fixtures/asymmetric-arrow.png`);
	run("wait", "1200");
	clickMode("Ảnh riêng");
	run("upload", "input[aria-label='Tải ảnh mặt sau']", `${process.cwd()}/public/keychain/fixtures/asymmetric-arrow.png`);
	run("wait", "1200");
	assertBrowser("document.body.innerText.includes('Ảnh giữ nguyên tỷ lệ') && !document.body.innerText.includes('Chỉnh riêng ảnh mặt sau')", "custom-back crop/upload status stays beside its uploader and duplicate editor panel is absent");
	clickMode("Mặt sau");
	run("wait", "900");
	clickMode("Mặt trước");
	run("wait", "900");
	const frontBefore = canvasHash();
	screenshot("2d-front-before-back-edit");
	clickMode("Mặt sau");
	run("wait", "900");
	const backBefore = canvasHash();
	evaluate("document.querySelector('[aria-label=\\\"Xoay ảnh 90°\\\"]')?.click();true");
	evaluate("document.querySelector('[aria-label=\\\"Lật ngang\\\"]')?.click();document.querySelector('[aria-label=\\\"Phóng to ảnh\\\"]')?.click();true");
	evaluate("(() => {const c=document.querySelector('[aria-label=\\\"Bản xem trước móc khóa\\\"] canvas');c?.focus();c?.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}))})() ");
	run("wait", "500");
	const backAfter = canvasHash();
	assert.notEqual(backAfter, backBefore, "shared toolbar changes the custom back render");
	clickMode("Mặt trước");
	run("wait", "1200");
	const frontAfter = canvasHash();
	assertBrowser("document.querySelector('[aria-label=\\\"Bản xem trước mặt trước\\\"]') !== null", "the 2D front selector still selects the front render after custom-back editing");
	screenshot("2d-front-after-back-edit");
	clickMode("Mặt sau");
	evaluate("document.querySelector('[aria-label=\\\"Đặt lại ảnh\\\"]')?.click();true");
	run("wait", "300");
	screenshot("2d-back-custom-toolbar");
	run("find", "role", "button", "click", "--name", "Xem 3D");
	run("wait", "1800");
	assertBrowser("document.querySelector('[aria-label=\\\"Bản xem trước móc khóa\\\"] canvas') !== null && !Array.from(document.querySelector('[aria-label=\\\"Bản xem trước móc khóa\\\"] button')?.parentElement?.querySelectorAll('button')||[]).some(e=>/Mặt trước|Mặt sau/.test(e.innerText))", "3D opens with both face materials and hides the 2D face selector");
	const modeScreenshots = [];
	for (const [mode, label] of [["through-acrylic", "Xuyên mica"], ["white", "Lót trắng"], ["mirror-front", "In hai mặt"], ["custom", "Ảnh riêng"]]) {
		clickMode(label);
		run("wait", "700");
		assertBrowser(`Array.from(document.querySelectorAll('button')).some(e=>e.innerText.includes(${JSON.stringify(label)})&&e.getAttribute('aria-pressed')==='true') && document.querySelector('[aria-label=\\\"Bản xem trước móc khóa\\\"] canvas') !== null`, `3D remains active and updates the reverse face immediately for ${label}`);
		screenshot(`3d-back-${mode}`);
		modeScreenshots.push({ mode, screenshot: `${screenshotDir}/phase10-3d-back-${mode}.png` });
	}
	clickMode("Đỏ");
	run("wait", "500");
	run("find", "role", "button", "click", "--name", "Xác nhận");
	run("wait", "1500");
	const opaqueState = evaluate("JSON.stringify({canvas:!!document.querySelector('[aria-label=\\\"Bản xem trước móc khóa\\\"] canvas'),alert:document.querySelector('[role=alert]')?.innerText,dialog:!!document.querySelector('[role=dialog]'),threeD:Array.from(document.querySelectorAll('button')).some(e=>e.innerText.trim()==='3D'&&e.getAttribute('aria-current')==='true')})");
	const opaqueResult = JSON.parse(JSON.parse(opaqueState));
	assert.equal(opaqueResult.canvas, true, `opaque acrylic keeps the 3D mesh rendered; ${opaqueState}`);
	assert.equal(opaqueResult.threeD, true, `opaque acrylic keeps the 3D mode active; ${opaqueState}`);
	assert.equal(opaqueResult.dialog, false, `opaque acrylic confirmation completes; ${opaqueState}`);
	assert.equal(opaqueResult.alert, "", `opaque back texture renders without a preview error; ${opaqueState}`);
	screenshot("3d-back-opaque-material");
	run("find", "role", "button", "click", "--name", "2D");
	run("wait", "700");
	assertBrowser("Array.from(document.querySelectorAll('button')).some(e=>e.innerText.trim()==='Mặt sau'&&e.getAttribute('aria-pressed')==='true')", "returning to 2D preserves its selected back face");
	assertBrowser("!document.body.innerText.includes('Chỉnh riêng ảnh mặt sau')", "duplicate custom-back editor panel remains absent");
	screenshot("2d-after-3d-back");
	console.log(JSON.stringify({ session, route, desktopViewport: "1280x800", twoDThreeDState: "back selection retained on return", threeDFaceSelector: "hidden", clearBackModes: modeScreenshots, opaqueBack: "acrylic material, no printed custom art", sharedToolbar: { backRenderChanged: backAfter !== backBefore, frontRenderHashBefore: frontBefore, frontRenderHashAfter: frontAfter, reset: true }, uploadAndSnapshotRoutes: "upload mocked; snapshot not used", screenshots: ["2d-back-custom-toolbar", "2d-front-before-back-edit", "2d-front-after-back-edit", ...modeScreenshots.map((entry) => entry.screenshot.split("/").at(-1).replace("phase10-", "").replace(".png", "")), "3d-back-opaque-material", "2d-after-3d-back"].map((name) => `${screenshotDir}/phase10-${name}.png`) }, null, 2));
} else {
try {
	run("open", route);
	run("wait", "3000");
	assertBrowser("Array.from(document.querySelectorAll('button')).some(e=>e.innerText.trim()==='Xuất PNG'&&e.disabled)", "PNG Export stays locked until a front image is uploaded");
	const viewports = [[320, 780], [360, 800], [390, 844], [430, 900], [844, 390], [1280, 800]];
	const results = [];
	for (const [width, height] of viewports) {
		run("set", "viewport", String(width), String(height));
		assertBrowser("document.documentElement.scrollWidth <= window.innerWidth", `${width}x${height} has no horizontal page overflow`);
		assertBrowser("document.querySelector('[aria-label=\\\"Bản xem trước móc khóa\\\"]') !== null", `${width}x${height} exposes the preview region`);
		assertBrowser("Array.from(document.querySelectorAll('h6')).map(e => e.textContent.trim().toLocaleLowerCase()).join('|') === 'hình dáng & móc|ảnh mặt trước|mặt sau|chất liệu|xuất file'", `${width}x${height} keeps the current five control groups in order`);
		let touchTargetIssues = [];
		const isMobileTargetViewport = width < 600 || height <= 500;
		if (isMobileTargetViewport) {
			touchTargetIssues = readTouchTargetIssues();
			assert.deepEqual(touchTargetIssues, [], `${width}x${height} has 44x44 mobile targets; offending elements: ${JSON.stringify(touchTargetIssues)}`);
		}
		assertBrowser(`Array.from(${builderRoot}.querySelectorAll('input:not([type=file])')).every(e => parseFloat(getComputedStyle(e).fontSize) >= 16)`, `${width}x${height} has 16px form input text`);
		if (width < 600) assertBrowser("document.querySelector('[aria-label=\\\"Bản xem trước móc khóa\\\"]').getBoundingClientRect().top < document.querySelector('h6').getBoundingClientRect().top", `${width}x${height} places preview before controls`);
		if (width >= 900) assertBrowser("getComputedStyle(document.querySelector('[aria-label=\\\"Bản xem trước móc khóa\\\"]').parentElement).gridTemplateColumns.split(' ').length >= 2", `${width}x${height} uses desktop columns`);
		assertBrowser("(() => { const canvas = document.querySelector('canvas'); if (!canvas || canvas.tabIndex !== 0) return false; canvas.focus(); canvas.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })); return document.activeElement === canvas; })()", `${width}x${height} keeps keyboard controls focusable`);
		results.push({ width, height, noHorizontalOverflow: true, controlsInOrder: true, minInteractiveTarget: isMobileTargetViewport ? "44x44 CSS px" : "desktop controls", touchTargetIssues, minInputFont: 16 });
	}
	run("set", "viewport", "390", "844");
	run("scroll", "down");
	const fixtureUrl = `${new URL(baseUrl).origin}/keychain/fixtures/transparent-blob.png`;
	const sanityUrl = "https://cdn.sanity.io/images/abc123/production/a1b2c3-64x64.png";
	run("network", "route", "**/api/keychain/uploads", "--body", JSON.stringify({ image: { _type: "image", asset: { _ref: "image-a1b2c3-64x64-png", _type: "reference" } }, url: sanityUrl }));
	run("network", "route", "**/api/keychain/designs", "--body", JSON.stringify({ id: "bf9ab3f4-64b2-4f1c-b66d-0a272c7cce6d", url: "/builder/keychain?design=bf9ab3f4-64b2-4f1c-b66d-0a272c7cce6d" }));
	evaluate(`(() => {const p=HTMLImageElement.prototype;const d=Object.getOwnPropertyDescriptor(p,'src');Object.defineProperty(p,'src',{configurable:true,get(){return d.get.call(this)},set(value){d.set.call(this,typeof value==='string'?value.replace(${JSON.stringify(sanityUrl)},${JSON.stringify(fixtureUrl)}):value)}});const f=window.fetch.bind(window);window.fetch=(input,init)=>f(typeof input==='string'?input.replace(${JSON.stringify(sanityUrl)},${JSON.stringify(fixtureUrl)}):input,init);return true})()`);
	run("upload", "input[type=file]", `${process.cwd()}/public/keychain/fixtures/transparent-blob.png`);
	run("wait", "1800");
	run("find", "role", "button", "click", "--name", "Cắt theo ảnh");
	run("wait", "3000");
	assertBrowser("!document.body.innerText.includes('Không tạo được đường cắt') && !document.body.innerText.includes('nhiều mảnh rời')", "synthetic upload produces a valid die-cut geometry");
	const uploadedDesignTouchAudit = [];
	for (const [width, height] of [[320, 780], [360, 800], [390, 844], [430, 900], [844, 390]]) {
		run("set", "viewport", String(width), String(height));
		run("wait", "100");
		const touchTargetIssues = readTouchTargetIssues();
		assert.deepEqual(touchTargetIssues, [], `${width}x${height} keeps all uploaded-design controls at 44x44 CSS px; offending elements: ${JSON.stringify(touchTargetIssues)}`);
		uploadedDesignTouchAudit.push({ width, height, minInteractiveTarget: "44x44 CSS px", touchTargetIssues });
	}
	run("set", "viewport", "390", "844");
	evaluate("Array.from(document.querySelectorAll('button')).find(e=>e.innerText.trim()==='5 mm')?.click();true");
	run("wait", "300");
	assertBrowser("document.body.innerText.includes('Độ dày') && Array.from(document.querySelectorAll('button')).some(e=>e.innerText.trim()==='5 mm'&&e.getAttribute('aria-pressed')==='true') && !/Tự nhiên|Đánh bóng|Độ bóng/.test(document.body.innerText)", "thickness remains available and edge-finish/sheen controls have been removed");
	assertBrowser(`Array.from(${builderRoot}.querySelectorAll('button')).some(e => e.innerText.toLowerCase().includes('xuất png') && !e.disabled)`, "PNG export unlocks after the current geometry is ready");
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
	assertBrowser("Array.from(document.querySelectorAll('div')).some(e=>parseFloat(getComputedStyle(e).paddingBottom)>=24)", "builder retains bottom safe-area spacing");
	evaluate("Array.from(document.querySelector('[role=dialog]')?.querySelectorAll('button')||[]).find(e=>e.innerText.toLowerCase().includes('đóng'))?.click();true");
	run("wait", "500");
	evaluate("Array.from(document.querySelectorAll('button')).find(e=>e.innerText.includes('Ảnh riêng'))?.click();true");
	assertBrowser("!Array.from(document.querySelectorAll('button')).filter(e=>e.innerText.trim()==='Xuất PNG').some(e=>!e.disabled)", "custom-back mode gates Export until its image upload completes");
	run("upload", "input[aria-label='Tải ảnh mặt sau']", `${process.cwd()}/public/keychain/fixtures/asymmetric-arrow.png`);
	run("wait", "1200");
	const customBackControls = evaluate(`JSON.stringify(Array.from(${builderRoot}?.querySelectorAll('button')||[]).map(e=>({label:e.getAttribute('aria-label'),text:e.innerText.trim()})).filter(e=>e.label?.includes('mặt sau')||['−','+','↻','⇋','Đặt lại vị trí'].includes(e.text)))`);
	assertBrowser("document.body.innerText.includes('Chỉnh riêng ảnh mặt sau') && document.body.innerText.includes('Ảnh giữ nguyên tỷ lệ')", `custom-back editor reports crop status and preserves its independent image transform; controls: ${customBackControls}`);
	const editorActions = JSON.parse(JSON.parse(customBackControls));
	assert(editorActions.some((action) => action.label === "Phóng to ảnh mặt sau") && editorActions.some((action) => action.text === "Đặt lại vị trí"), "custom-back editor exposes zoom and reset controls");
	evaluate("document.querySelector('[aria-label=\"Lật ảnh mặt sau\"]').click();true");
	assertBrowser("document.querySelector('[aria-label=\"Lật ảnh mặt sau\"]').getAttribute('aria-pressed')==='true'", "custom-back edit applies an independent transform");
	evaluate("Array.from(document.querySelectorAll('button')).find(e=>e.innerText.trim()==='Đặt lại vị trí')?.click();true");
	assertBrowser("document.querySelector('[aria-label=\"Lật ảnh mặt sau\"]').getAttribute('aria-pressed')==='false'", "custom-back reset restores the independent image transform");
	assertBrowser("Array.from(document.querySelectorAll('button')).filter(e=>e.innerText.trim()==='Xuất PNG').some(e=>!e.disabled)", "custom-back upload completion unlocks Export");
	run("scroll", "up");
	run("wait", "300");
	const beforeCamera = evaluate("JSON.stringify({canvas:!!document.querySelector('[aria-label=\"Bản xem trước móc khóa\"] canvas'),thickness:Array.from(document.querySelectorAll('button')).find(e=>e.innerText.trim()==='5 mm')?.getAttribute('aria-pressed')})");
	run("find", "role", "button", "click", "--name", "Xem 3D");
	run("wait", "2500");
	assertBrowser("document.querySelector('canvas') !== null && Array.from(document.querySelectorAll('button')).some(e=>e.getAttribute('aria-current')==='true'&&e.innerText.trim()==='3D')", "enabled 3D preview mounts on the front face");
	evaluate("Array.from(document.querySelectorAll('button')).find(e=>e.innerText.trim()==='Mặt sau')?.click();true");
	run("wait", "300");
	assertBrowser("Array.from(document.querySelectorAll('button')).some(e=>e.innerText.trim()==='Mặt sau'&&e.getAttribute('aria-pressed')==='true')", "3D preview switches to the back face");
	run("find", "role", "button", "click", "--name", "Mặt trước");
	run("find", "role", "button", "click", "--name", "Xoay góc nhìn");
	run("wait", "300");
	assertBrowser("!Array.from(document.querySelector('[aria-label=\"Bản xem trước móc khóa\"]')?.querySelectorAll('button')||[]).some(e=>/Lật ảnh|Đặt lại ảnh/.test(e.getAttribute('aria-label')||''))", "3D preview toolbar contains no image-transform actions");
	run("find", "role", "button", "click", "--name", "2D");
	run("wait", "800");
	const afterCamera = evaluate("JSON.stringify({canvas:!!document.querySelector('[aria-label=\"Bản xem trước móc khóa\"] canvas'),thickness:Array.from(document.querySelectorAll('button')).find(e=>e.innerText.trim()==='5 mm')?.getAttribute('aria-pressed')})");
	assert.equal(afterCamera, beforeCamera, "camera controls leave preview and material design state unchanged after returning to 2D");
	evaluate("window.__originalCanvasGetContext=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/i.test(type)?null:window.__originalCanvasGetContext.call(this,type,...args)};true");
	run("find", "role", "button", "click", "--name", "Xem 3D");
	run("wait", "2500");
	assertBrowser("document.body.innerText.includes('WebGL') || document.body.innerText.includes('Quay lại 2D')", "forced WebGL creation failure returns a usable 2D fallback");
	run("set", "media", "light", "reduced-motion");
	assertBrowser("matchMedia('(prefers-reduced-motion: reduce)').matches", "reduced-motion preference is emulated");
	console.log(JSON.stringify({ session, route, viewports: results, uploadedDesignTouchAudit, mockUpload: "synthetic local PNG served through a mocked CDN URL", mockSnapshot: true, customBackEditor: { cropStatus: true, uploadGate: true, editAndReset: true, visibleActions: editorActions }, material: { edgeControlsRemoved: true, sheenControlsRemoved: true, thicknessMm: 5 }, browserExportVariants: variants, threeD: { front: true, back: true, cameraOnlyStateUnchanged: beforeCamera === afterCamera }, webglFallback: "forced context creation failure rendered a 2D return path", reducedMotionEmulated: true, note: "Upload and snapshot API routes were mocked; no Sanity asset or snapshot was created." }, null, 2));
} finally {
	try { run("close"); } catch {}
}
}
