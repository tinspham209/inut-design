import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { loadSafeApiFixtures } from "./api-fixtures/fixture-loader.mjs";

const root = process.cwd();
const outputPath = path.join(root, "artifacts/migration/runtime/safe-regression.json");
const fixtures = await loadSafeApiFixtures();
const flows = [
	{
		name: "order",
		paths: ["/api/orders/lighters", "/api/keychain/designs", "/api/creativa/orders"],
	},
	{
		name: "quote",
		paths: ["/api/quote-request", "/api/creativa/quote"],
	},
	{
		name: "contact",
		paths: ["/api/validate-phone"],
	},
	{
		name: "upload",
		paths: ["/api/keychain/uploads", "/api/sanity/upload-image"],
	},
	{
		name: "notification",
		paths: [
			"/api/telegram/send-abandoned-checkout-notification",
			"/api/telegram/send-order-notification",
			"/api/telegram/send-quote-notification",
		],
	},
	{
		name: "design",
		paths: ["/api/keychain/designs", "/api/keychain/designs/[id]"],
	},
	{
		name: "spx",
		paths: ["/api/cron/sync-spx-orders"],
	},
];

for (const fixture of fixtures) {
	if (
		fixture.expectedSideEffects !== 0 ||
		!fixture.mockAdapters.every((adapter) => ["mock", "no-op", "fixture", "read-only"].includes(adapter.mode))
	) {
		throw new Error(`${fixture.path}: unsafe fixture or adapter mode.`);
	}
}

const pureChecks = [
	{
		name: "worker-runtime-apis",
		command: ["node", "--import", "./scripts/register-typescript-loader.mjs", "--test",
			"scripts/tests/keychain-image-validation.test.mjs", "scripts/tests/worker-api.test.mjs"],
	},
	{
		name: "spx-regression",
		command: ["pnpm", "regression:spx"],
	},
	{
		name: "creativa-notification",
		command: ["pnpm", "regression:creativa-notification"],
	},
];
const results = [];

for (const check of pureChecks) {
	const startedAt = Date.now();
	try {
		const output = execFileSync(check.command[0], check.command.slice(1), {
			cwd: root,
			encoding: "utf8",
			stdio: ["ignore", "pipe", "pipe"],
			env: { ...process.env, MIGRATION_SAFE_TEST: "1" },
		});
		results.push({
			name: check.name,
			status: "pass",
			durationMs: Date.now() - startedAt,
			outputLines: output.split("\n").filter(Boolean).length,
		});
	} catch (error) {
		results.push({
			name: check.name,
			status: "fail",
			durationMs: Date.now() - startedAt,
			error: String(error.stderr || error.message)
				.split("\n")
				.filter(Boolean)
				.slice(0, 12),
		});
	}
}

const report = {
	schemaVersion: 1,
	generatedAt: new Date().toISOString(),
	mode: "mock-and-pure-only",
	productionSideEffects: 0,
	flows: flows.map((flow) => ({
		...flow,
		fixtures: flow.paths.map((fixturePath) => fixtures.find((fixture) => fixture.path === fixturePath)),
	})),
	pureChecks: results,
	status: results.every((result) => result.status === "pass") ? "pass" : "fail",
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);

if (report.status !== "pass") {
	console.error(`Safe regression failed. See ${path.relative(root, outputPath)}.`);
	process.exitCode = 1;
} else {
	console.log(`Safe regression passed for ${fixtures.length} fixtures and ${pureChecks.length} pure checks.`);
}
