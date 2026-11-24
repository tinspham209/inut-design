import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const baseline = JSON.parse(
	await readFile(path.join(root, "artifacts/migration/baseline/browser/report.json"), "utf8"),
);
const runtime = JSON.parse(
	await readFile(path.join(root, "artifacts/migration/runtime/browser/report.json"), "utf8"),
);
const api = JSON.parse(
	await readFile(path.join(root, "artifacts/migration/runtime/api-contract-comparison.json"), "utf8"),
);
const baselineByRoute = new Map();
for (const viewport of baseline.viewports) {
	for (const page of viewport.pages) {
		const duration = Number(page.timing?.data?.result?.match(/"durationMs":(\d+)/)?.[1] ?? 0);
		if (duration > 0 && !baselineByRoute.has(page.route)) baselineByRoute.set(page.route, duration);
	}
}
const pages = [];
for (const viewport of runtime.viewports) {
	for (const page of viewport.pages) {
		const status = page.network?.find((request) => request.resourceType?.toLowerCase() === "document")?.status;
		const duration = Number(page.timing?.data?.result?.match(/"durationMs":(\d+)/)?.[1] ?? 0);
		const baselineMs = baselineByRoute.get(page.route);
		pages.push({
			viewport: viewport.name,
			route: page.route,
			status,
			durationMs: duration,
			baselineMs: baselineMs ?? null,
			withinTenPercent: baselineMs ? duration <= baselineMs * 1.1 : null,
		});
	}
}
const comparable = pages.filter((page) => page.withinTenPercent !== null);
const timedPass = comparable.filter((page) => page.withinTenPercent).length / Math.max(1, comparable.length);
const apiFailures = api.results.filter(
	(result) => result.status !== "pass" || result.next?.status >= 500 || result.vinext?.status >= 500,
);
const report = {
	schemaVersion: 1,
	generatedAt: new Date().toISOString(),
	pages,
	comparablePageCount: comparable.length,
	withinTenPercentRatio: timedPass,
	pageTimeouts: pages.filter((page) => !page.durationMs || page.durationMs >= 30_000).length,
	apiFailures,
	workerMemory: {
		measurement: null,
		limitBytes: 128 * 1024 * 1024,
		status: "blocked",
		reason: "Local Miniflare evidence does not expose peak isolate memory; preview gate must measure it.",
	},
	status:
		pages.length > 0 &&
		comparable.length > 0 &&
		timedPass >= 0.95 &&
		apiFailures.length === 0 &&
		pages.every((page) => page.durationMs < 30_000)
			? "pass-local"
			: "fail",
};
const outputPath = path.join(root, "artifacts/migration/runtime/performance/report.json");
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
if (report.status !== "pass-local") {
	console.error(`Performance gate failed or blocked. See ${path.relative(root, outputPath)}.`);
	process.exitCode = 1;
} else {
	console.log(`Local performance passed ${(timedPass * 100).toFixed(1)}% within baseline +10%; memory remains preview-blocked.`);
}
