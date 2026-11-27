import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

import { apiContracts } from "../api-contracts.mjs";

const fixturePath = path.join(process.cwd(), "scripts/migration/api-fixtures/fixtures.json");

export async function loadSafeApiFixtures() {
	const manifest = JSON.parse(await readFile(fixturePath, "utf8"));
	const expectedPaths = apiContracts.map((contract) => contract.path).sort();
	const fixturePaths = manifest.fixtures.map((fixture) => fixture.path).sort();
	if (JSON.stringify(fixturePaths) !== JSON.stringify(expectedPaths)) {
		throw new Error("Safe API fixture paths differ from the approved 18-route contract.");
	}
	for (const fixture of manifest.fixtures) {
		if (fixture.expectedSideEffects !== 0) {
			throw new Error(`${fixture.path}: expectedSideEffects must be zero.`);
		}
		if (!Array.isArray(fixture.mockAdapters) || fixture.mockAdapters.length === 0) {
			throw new Error(`${fixture.path}: at least one explicit mock/no-op adapter is required.`);
		}
		if (
			fixture.mockAdapters.some(
				(adapter) => !["mock", "no-op", "fixture", "read-only"].includes(adapter.mode),
			)
		) {
			throw new Error(`${fixture.path}: unsafe adapter mode is not allowed.`);
		}
	}
	return manifest.fixtures;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
	const fixtures = await loadSafeApiFixtures();
	console.log(`Loaded ${fixtures.length} safe API fixtures.`);
}
