import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const baseUrl = process.env.MIGRATION_BASE_URL ?? "http://127.0.0.1:3000";
const outputDir = process.env.MIGRATION_BROWSER_OUTPUT
	? path.resolve(process.env.MIGRATION_BROWSER_OUTPUT)
	: path.join(root, "artifacts/migration/baseline/browser");
const session = `inut-migration-${process.pid}`;
const routes = [
	"/",
	"/blog",
	"/blog/tai-sao-nen-dan-skin-cho-laptop",
	"/blog/huong-dan-xem-doi-may-ten-model-may-tinh-laptop",
	"/san-pham/lighters",
	"/builder/keychain",
	"/builder/lighters",
	"/creativa",
	"/creativa/skin-laptop/daisy-quilt-macbook-skin",
	"/creativa/cart",
	"/creativa/checkout",
	"/cart/lighters",
	"/checkout/lighters",
	"/contact/form",
	"/search?q=sticker",
];
const viewports = [
	{ name: "desktop", width: 1440, height: 1000 },
	{ name: "mobile", width: 390, height: 844 },
];

function browser(command, allowFailure = false) {
	try {
		return execFileSync(
			"agent-browser",
			["--session", session, ...command, "--json"],
			{ cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 60_000 },
		).trim();
	} catch (error) {
		if (allowFailure) return "";
		const stderr = error.stderr?.toString().trim();
		throw new Error(`agent-browser ${command.join(" ")} failed${stderr ? `: ${stderr}` : "."}`);
	}
}

function parse(command, allowFailure = false) {
	const output = browser(command, allowFailure);
	if (!output) return null;
	try {
		return JSON.parse(output);
	} catch {
		return { raw: output };
	}
}

function safeUrl(value) {
	try {
		const url = new URL(value);
		return { origin: url.origin, path: url.pathname, method: null };
	} catch {
		return null;
	}
}

function sanitizeText(value) {
	return String(value ?? "")
		.replace(/([?&](?:token|key|secret|auth|email|phone|query)=)[^&\s]+/gi, "$1<redacted>")
		.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "<redacted-email>")
		.replace(/\b(?:[0-9]{9,15})\b/g, "<redacted-number>")
		.slice(0, 500);
}

function sanitizeConsole(value) {
	const entries = Array.isArray(value?.data) ? value.data : Array.isArray(value) ? value : [];
	return entries
		.map((entry) => ({
			type: entry.type ?? entry.level ?? "log",
			text: sanitizeText(entry.text ?? entry.message ?? entry.raw),
		}))
		.filter((entry) => ["error", "warning"].includes(String(entry.type).toLowerCase()) || entry.text);
}

function sanitizeNetwork(value) {
	const entries = Array.isArray(value?.data?.requests)
		? value.data.requests
		: Array.isArray(value?.data)
			? value.data
			: Array.isArray(value)
				? value
				: [];
	return entries.flatMap((entry) => {
		const rawUrl = entry.url ?? entry.request?.url;
		const requestUrl = safeUrl(rawUrl);
		if (!requestUrl) return [];
		let analyticsEvent = null;
		let analyticsProvider = null;
		try {
			const parsed = new URL(rawUrl);
			const endpoint = `${parsed.origin}${parsed.pathname}`;
			if (/google-analytics|googletagmanager/i.test(endpoint)) {
				analyticsProvider = "ga4-gtm";
				analyticsEvent = parsed.searchParams.get("en");
			} else if (/umami/i.test(endpoint) || parsed.pathname.endsWith("/api/send")) {
				analyticsProvider = "umami";
				analyticsEvent = "send";
			}
		} catch {
			// Invalid URLs are already omitted above.
		}
		const method = entry.method ?? entry.request?.method ?? "GET";
		const resourceType = entry.resourceType ?? entry.type ?? null;
		return [
			{
				origin: requestUrl.origin,
				path: requestUrl.path,
				method,
				resourceType,
				status: entry.status ?? entry.response?.status ?? null,
				analytics: Boolean(analyticsProvider),
				analyticsProvider,
				analyticsEvent,
			},
		];
	});
}

await mkdir(outputDir, { recursive: true });
const report = {
	schemaVersion: 1,
	baseUrl: new URL(baseUrl).origin,
	capturedAt: new Date().toISOString(),
	routes,
	viewports: [],
};

try {
	parse(["open", baseUrl], false);
	for (const viewport of viewports) {
		browser(["set", "viewport", String(viewport.width), String(viewport.height)]);
		const viewportReport = { ...viewport, pages: [] };
		for (const route of routes) {
			const slug = route.replace(/[/?=&]/g, "-").replace(/^-+|-+$/g, "") || "home";
			const pageUrl = new URL(route, baseUrl).href;
			browser(["console", "--clear"]);
			browser(["network", "requests", "--clear"]);
			const openResult = parse(["open", pageUrl], true);
			browser(["wait", "1500"]);
			browser(["press", "Tab"], true);
			const activeElement = parse([
				"eval",
				`JSON.stringify({tag:document.activeElement?.tagName||null,role:document.activeElement?.getAttribute("role"),label:document.activeElement?.getAttribute("aria-label"),text:(document.activeElement?.textContent||"").trim().slice(0,100)})`,
			]);
			const surface = parse([
				"eval",
				`JSON.stringify({canvases:document.querySelectorAll("canvas").length,images:document.querySelectorAll("img").length,buttons:document.querySelectorAll("button").length,carouselRegions:document.querySelectorAll('[aria-roledescription="carousel"]').length})`,
			]);
			const contextLoss = parse(
				[
					"eval",
					`JSON.stringify((()=>{const canvas=document.querySelector("canvas");if(!canvas)return null;const gl=canvas.getContext("webgl2")||canvas.getContext("webgl");const extension=gl?.getExtension("WEBGL_lose_context");if(extension){extension.loseContext();return {supported:true,lost:gl?.isContextLost?.()??true,method:"extension"}}const event=new Event("webglcontextlost",{cancelable:true});const dispatched=canvas.dispatchEvent(event);return {supported:true,lost:dispatched,method:"event"}})())`,
				],
				true,
			);
			if (contextLoss) browser(["wait", "500"], true);
			const timing = parse([
				"eval",
				`JSON.stringify((()=>{const n=performance.getEntriesByType("navigation")[0];return n?{domContentLoadedMs:Math.round(n.domContentLoadedEventEnd),loadMs:Math.round(n.loadEventEnd),responseStartMs:Math.round(n.responseStart),durationMs:Math.round(n.duration)}:null})())`,
			]);
			const domSummary = parse([
				"eval",
				`JSON.stringify({title:document.title||"",canonical:document.querySelector('link[rel="canonical"]')?.getAttribute("href")||null,robots:document.querySelector('meta[name="robots"]')?.getAttribute("content")||null,headings:[...document.querySelectorAll("h1,h2,h3,h4")].map(h=>({tag:h.tagName.toLowerCase(),id:h.id||null,text:(h.textContent||"").trim().slice(0,120)})),codeBlocks:document.querySelectorAll("pre code").length,tables:document.querySelectorAll("table").length,mainTextLength:(document.querySelector("main")?.textContent||document.body?.textContent||"").trim().length})`,
			]);
			const screenshot = path.join(outputDir, `${viewport.name}-${slug}.png`);
			browser(["screenshot", "--full", screenshot]);
			const network = sanitizeNetwork(parse(["network", "requests"], true));
			viewportReport.pages.push({
				route,
				url: { ...safeUrl(pageUrl), method: "GET" },
				navigationOk: Boolean(openResult),
				screenshot: path.relative(root, screenshot),
				keyboard: {
					tabPressed: true,
					activeElement,
				},
				timing,
				surface,
				domSummary,
				contextLoss,
				console: sanitizeConsole(parse(["console"], true)),
				network,
				analytics: network.filter((request) => request.analytics),
			});
		}
		report.viewports.push(viewportReport);
	}

	await writeFile(path.join(outputDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
	console.log(`Captured browser baseline for ${routes.length} routes at ${viewports.length} viewports.`);
} finally {
	browser(["close"], true);
}
