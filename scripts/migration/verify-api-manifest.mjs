import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { apiContracts } from "./api-contracts.mjs";

const root = process.cwd();
const artifactPath = path.join(root, "artifacts/migration/baseline/apis.json");
const errors = [];
const manifest = JSON.parse(await readFile(artifactPath, "utf8"));
const requiredFields = [
	"path",
	"file",
	"methods",
	"authMode",
	"bodyLimit",
	"inputSchema",
	"successShape",
	"errorShape",
	"rateLimit",
	"idempotency",
	"sideEffects",
	"allowedTestMode",
	"expectedCache",
];

if (manifest.count !== 18) errors.push(`Expected count 18; found ${manifest.count}.`);
if (!Array.isArray(manifest.apis) || manifest.apis.length !== 18) {
	errors.push(`Expected exactly 18 API records; found ${manifest.apis?.length ?? 0}.`);
	process.exitCode = 1;
} else {
	const paths = manifest.apis.map((record) => record.path);
	const duplicates = paths.filter((record, index) => paths.indexOf(record) !== index);
	for (const duplicate of new Set(duplicates)) errors.push(`Duplicate API path ${duplicate}.`);

	const sorted = [...paths].sort((left, right) => left.localeCompare(right));
	if (JSON.stringify(paths) !== JSON.stringify(sorted)) errors.push("API records must be sorted by path.");

	for (const record of manifest.apis) {
		for (const field of requiredFields) {
			const value = record[field];
			if (value === undefined || value === null || value === "") errors.push(`${record.path ?? "unknown"}: missing ${field}.`);
		}
		const expected = apiContracts.find((contract) => contract.path === record.path);
		if (!expected) {
			errors.push(`Unexpected API path ${record.path}.`);
			continue;
		}
		for (const field of Object.keys(expected)) {
			if (JSON.stringify(record[field]) !== JSON.stringify(expected[field])) {
				errors.push(`${record.path}: ${field} differs from the approved source contract.`);
			}
		}
		await readFile(path.join(root, record.file), "utf8").catch(() => {
			errors.push(`${record.path}: source file ${record.file} does not exist.`);
		});
	}

	for (const expected of apiContracts) {
		if (!paths.includes(expected.path)) errors.push(`Missing API path ${expected.path}.`);
	}
}

if (errors.length) {
	console.error(`API manifest verification failed (${errors.length}):`);
	for (const error of errors) console.error(`- ${error}`);
	process.exitCode = 1;
} else {
	console.log("Verified 18 API contracts with method, auth, body, side-effect, and safe-test metadata.");
}
