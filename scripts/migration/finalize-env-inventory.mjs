import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const baseline = JSON.parse(
	await readFile(path.join(root, "artifacts/migration/baseline/env-names.json"), "utf8"),
);
const records = baseline.records.map((record) => {
	let scope = record.scope;
	if (record.name === "SANITY_TOKEN") scope = "worker-secret";
	if (record.name.startsWith("SPX_SYNC_")) scope = "scheduler";
	if (/TELEGRAM|INTERNAL|API_KEY|TOKEN|SECRET/.test(record.name) && !record.name.startsWith("NEXT_PUBLIC_")) {
		scope = record.name.startsWith("SPX_SYNC_") ? "scheduler" : "worker-secret";
	}
	return {
		name: record.name,
		scope,
		requiredBy: record.callers,
		visibility: scope === "browser-build" ? "public" : "server-only",
		buildOrRuntime: scope === "browser-build" ? "build-and-browser" : "runtime",
		owner: scope === "scheduler" ? "scheduler-owner" : "platform-owner",
		rotationNotes:
			record.rotationRequired || record.scope === "legacy-public-secret"
				? "Owner rotation required; do not copy legacy exposed credential."
				: null,
		valuePresent: null,
	};
});
const output = {
	schemaVersion: 1,
	records: records.sort((left, right) => left.name.localeCompare(right.name)),
};
const outputPath = path.join(root, "artifacts/migration/operations/env-inventory.json");
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(`Finalized ${records.length} name-only environment scope records.`);
