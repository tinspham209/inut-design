import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const startedAt = Date.now();
const output = execFileSync("pnpm", ["regression:spx"], {
	cwd: root,
	encoding: "utf8",
	stdio: ["ignore", "pipe", "pipe"],
});
const matrix = JSON.parse(
	await readFile(path.join(root, "artifacts/migration/runtime/api-contract-comparison.json"), "utf8"),
);
const route = matrix.results.find((result) => result.path === "/api/cron/sync-spx-orders");
const report = {
	schemaVersion: 1,
	generatedAt: new Date().toISOString(),
	durationMs: Date.now() - startedAt,
	pureChecks: {
		status: output.includes("SPX regression passed: 42 deterministic checks") ? "pass" : "fail",
		coverage: [
			"auth",
			"timeout",
			"idempotency",
			"concurrency",
			"partial-failure",
			"response",
			"notification-mock",
		],
	},
	runtime: route
		? {
				nextStatus: route.next.status,
				vinextStatus: route.vinext.status,
				sideEffects: route.sideEffects,
				status: route.status,
			}
		: null,
	status: route?.status === "pass" && /SPX regression passed: 42/.test(output) ? "pass" : "fail",
};
const outputPath = path.join(root, "artifacts/migration/operations/spx/comparison.json");
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
if (report.status !== "pass") {
	console.error(`SPX operations evidence failed. See ${path.relative(root, outputPath)}.`);
	process.exitCode = 1;
} else {
	console.log("SPX operations parity passed 42 pure checks and both runtime auth comparisons.");
}
