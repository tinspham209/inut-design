import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";

const phase = process.argv[2] || "after";
assert.match(phase, /^(before|after)$/);
const endpoint = execFileSync("agent-browser", ["--session", "runtime-fonts", "get", "cdp-url"], { encoding: "utf8" }).trim();
const socket = new WebSocket(endpoint);
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
let sequence = 0;
const pending = new Map();
socket.onmessage = ({ data }) => {
	const message = JSON.parse(data);
	const waiter = pending.get(message.id);
	if (waiter) {
		pending.delete(message.id);
		if (message.error) waiter.reject(new Error(message.error.message));
		else waiter.resolve(message.result);
	}
};
function command(method, params = {}, sessionId) {
	const id = ++sequence;
	return new Promise((resolve, reject) => {
		const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 30000);
		pending.set(id, { resolve: (value) => { clearTimeout(timeout); resolve(value); }, reject });
		socket.send(JSON.stringify({ id, method, params, sessionId }));
	});
}
const results = [];
try {
	const { targetInfos } = await command("Target.getTargets");
	const page = targetInfos.find((target) => target.type === "page");
	assert.ok(page);
	const { sessionId } = await command("Target.attachToTarget", { targetId: page.targetId, flatten: true });
	const send = (method, params) => command(method, params, sessionId);
	await send("Page.enable");
	await send("Network.enable");
	await send("DOM.enable");
	await send("CSS.enable");
	await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
	// Keep third-party tracking and writes out of local page verification.
	await send("Network.setBlockedURLs", { urls: ["*google-analytics.com/*", "*googletagmanager.com/*", "*cloud.umami.is/*", "*facebook.net/*", "*/api/*"] });
	for (const javaScript of [false, true]) {
		await send("Emulation.setScriptExecutionDisabled", { value: !javaScript });
		for (const pathname of ["/", "/search"]) {
			await send("Network.clearBrowserCache");
			await send("Network.setCacheDisabled", { cacheDisabled: true });
			await send("Page.navigate", { url: `http://localhost:3001${pathname}` });
			await new Promise((resolve) => setTimeout(resolve, 2000));
			const { result, exceptionDetails } = await send("Runtime.evaluate", {
				expression: `(async () => {
					await document.fonts.ready;
					for (const [id, family] of [["font-roboto", "Roboto"], ["font-serif", "Roboto Serif"]]) {
						const sample = document.createElement("p"); sample.id = id;
						sample.textContent = "INUT Design – Tiếng Việt ấ ệ ộ ự"; sample.style.cssText = 'font: 24px "' + family + '"; position: fixed; top: 0; z-index: 999999; background: white; color: black';
						document.body.append(sample);
					}
					document.getElementById("font-roboto").getBoundingClientRect();
					document.getElementById("font-serif").getBoundingClientRect();
					await document.fonts.ready;
					return { title: document.title, links: [...document.querySelectorAll('link[rel=stylesheet]')].filter(l => l.href.includes('fonts.googleapis.com/css2')).map(l => ({media:l.media,href:l.href})), paint: performance.getEntriesByType('paint').map(p => ({name:p.name,startTime:p.startTime})), scrollWidth:document.documentElement.scrollWidth, viewport:innerWidth };
				})()`,
				awaitPromise: true, returnByValue: true,
			});
			assert.equal(exceptionDetails, undefined);
			const { root } = await send("DOM.getDocument");
			const fonts = {};
			for (const id of ["font-roboto", "font-serif"]) {
				const { nodeId } = await send("DOM.querySelector", { nodeId: root.nodeId, selector: `#${id}` });
				fonts[id] = (await send("CSS.getPlatformFontsForNode", { nodeId })).fonts;
			}
			results.push({ pathname, javaScript, ...result.value, fonts });
			if (phase === "after") {
				assert.equal(result.value.links.length, 1);
				assert.ok(["", "all", "screen"].includes(result.value.links[0].media));
				assert.ok(fonts["font-roboto"].some((font) => font.isCustomFont && font.familyName.startsWith("Roboto") && !font.familyName.includes("Serif")));
				assert.ok(fonts["font-serif"].some((font) => font.isCustomFont && font.familyName.startsWith("Roboto Serif")));
				assert.ok(result.value.scrollWidth <= result.value.viewport);
			}
		}
	}
	await send("Emulation.setScriptExecutionDisabled", { value: false });
} finally { socket.close(); }
await mkdir("artifacts/migration/runtime/worker-runtime", { recursive: true });
await writeFile(`artifacts/migration/runtime/worker-runtime/fonts-${phase}.json`, `${JSON.stringify({
	phase, generatedAt: new Date().toISOString(),
	method: "Owned agent-browser Chromium, 1280x900, fresh cache per navigation, actual CDP rendered font faces on Vietnamese samples; no API writes. First paint is local lab evidence, not production CWV.",
	results,
}, null, 2)}\n`);
console.log(`Font ${phase}: inspected ${results.length} prerender/SSR and JS/no-JS combinations.`);
