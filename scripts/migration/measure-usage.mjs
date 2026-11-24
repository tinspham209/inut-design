import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const args = process.argv.slice(2);
const numberArg = (name, fallback) => {
	const raw = args.find((argument) => argument.startsWith(`--${name}=`))?.split("=")[1];
	const value = Number(raw);
	return Number.isFinite(value) && value >= 0 ? value : fallback;
};
const requestCount = numberArg("requests", 0);
const cpuMs = numberArg("cpu-ms", 0);
const logBytes = numberArg("log-bytes", 0);
const dayCount = numberArg("days", 30);
const modeled = {
	baseUsd: 5,
	approvedRangeUsd: [5, 6],
	requests: requestCount,
	cpuMs,
	logBytes,
	dayCount,
	workerPlan: "paid",
};
const report = {
	schemaVersion: 1,
	generatedAt: new Date().toISOString(),
	model: modeled,
	limits: {
		warningUsageUsd: 2,
		blockUsageUsd: 10,
	},
	notes: [
		"Vercel invocation counts are not used as a direct Cloudflare billing proxy.",
		"Usage values come from supplied Worker evidence; no cost is inferred from build or local traffic.",
	],
	status: requestCount > 0 || cpuMs > 0 || logBytes > 0 ? "evidence-present" : "blocked-no-usage-input",
};
const outputPath = path.join(root, "artifacts/migration/operations/usage.json");
await import("node:fs/promises").then(({ mkdir, writeFile }) =>
	mkdir(path.dirname(outputPath), { recursive: true }).then(() =>
		writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`),
	),
);
console.log(JSON.stringify(report, null, 2));
if (report.status !== "evidence-present") process.exitCode = 1;
