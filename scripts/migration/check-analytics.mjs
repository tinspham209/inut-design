import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const report = JSON.parse(
	await readFile(path.join(root, "artifacts/migration/runtime/browser/report.json"), "utf8"),
);
const results = [];
const prohibitedProperties = [
	"customer",
	"phone",
	"email",
	"address",
	"upload",
	"asset",
	"design",
	"share",
	"secret",
	"token",
];

for (const viewport of report.viewports) {
	for (const page of viewport.pages) {
		const events = page.network
			.filter((request) => request.analyticsEvent)
			.map((request) => ({
				provider: request.analyticsProvider,
				event: request.analyticsEvent,
			}));
		const counts = new Map();
		for (const event of events) {
			const key = `${event.provider}:${event.event}`;
			counts.set(key, (counts.get(key) ?? 0) + 1);
		}
		const duplicates = [...counts]
			.filter(([, count]) => count > 1)
			.map(([event, count]) => ({ event, count }));
		const sensitiveFieldsInReport = Object.keys(page).filter((key) =>
			prohibitedProperties.some((property) => key.toLowerCase().includes(property)),
		);
		results.push({
			viewport: viewport.name,
			route: page.route,
			events,
			duplicates,
			sensitiveFieldsInReport,
			status: duplicates.length || sensitiveFieldsInReport.length ? "fail" : "pass",
		});
	}
}

const sourceFiles = [
	"utils/analytics.ts",
	"utils/umamiAnalytics.ts",
	"utils/creativa/analytics.ts",
	"pages/_app.tsx",
];
const wrapperEvidence = await Promise.all(
	sourceFiles.map(async (file) => ({
		file,
		present: (await readFile(path.join(root, file), "utf8")).length > 0,
	})),
);
const output = {
	schemaVersion: 1,
	generatedAt: new Date().toISOString(),
	wrapperEvidence,
	observedUmami:
		results.some((result) =>
			result.events.some((event) => event.provider === "umami"),
		) || "disabled-or-not-requested",
	results,
	status:
		results.every((result) => result.status === "pass") &&
		wrapperEvidence.every((result) => result.present)
			? "pass"
			: "fail",
};
const outputPath = path.join(root, "artifacts/migration/runtime/analytics/exact-once.json");
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
if (output.status !== "pass") {
	console.error(`Analytics exact-once audit failed. See ${path.relative(root, outputPath)}.`);
	process.exitCode = 1;
} else {
	console.log(`Analytics exact-once audit passed ${results.length} page/viewport sequences.`);
}
