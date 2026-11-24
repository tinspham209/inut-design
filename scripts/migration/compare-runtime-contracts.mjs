import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import { loadSafeApiFixtures } from "./api-fixtures/fixture-loader.mjs";

const root = process.cwd();
const outputPath = path.join(root, "artifacts/migration/runtime/api-contract-comparison.json");
const args = new Map(
	process.argv.slice(2).map((argument) => {
		const [key, ...value] = argument.replace(/^--/, "").split("=");
		return [key, value.join("=")];
	}),
);
const nextUrl = args.get("next-url") ?? "http://127.0.0.1:3000";
const vinextUrl = args.get("vinext-url") ?? "http://127.0.0.1:3001";
const executeWrites =
	process.env.MIGRATION_SAFE_TEST === "1" && process.env.MIGRATION_MOCKS_READY === "1";
const manifest = JSON.parse(
	await readFile(path.join(root, "artifacts/migration/baseline/apis.json"), "utf8"),
);
const fixtures = await loadSafeApiFixtures();
const comparedHeaders = ["allow", "cache-control", "content-type", "location", "x-robots-tag"];

function fixtureUrl(baseUrl, fixture) {
	let pathname = fixture.path;
	for (const [name, value] of Object.entries(fixture.pathParameters ?? {})) {
		pathname = pathname.replace(`[${name}]`, encodeURIComponent(value));
	}
	const url = new URL(pathname, baseUrl);
	for (const [key, value] of Object.entries(fixture.query ?? {})) url.searchParams.set(key, value);
	return url;
}

function normalize(value) {
	if (Array.isArray(value)) return value.map(normalize);
	if (!value || typeof value !== "object") return value;
	return Object.fromEntries(
		Object.entries(value)
			.filter(([key]) => !["_rev", "_createdAt", "_updatedAt", "timestamp", "requestId"].includes(key))
			.sort(([left], [right]) => left.localeCompare(right))
			.map(([key, item]) => [key, normalize(item)]),
	);
}

async function request(baseUrl, fixture) {
	const response = await fetch(fixtureUrl(baseUrl, fixture), {
		method: fixture.method,
		headers: fixture.headers,
		body: fixture.method === "GET" ? undefined : JSON.stringify(fixture.body ?? {}),
		redirect: "manual",
		signal: AbortSignal.timeout(30_000),
	});
	const rawBody = await response.text();
	let body = rawBody;
	try {
		body = JSON.parse(rawBody);
	} catch {
		// Non-JSON error/proxy bodies are compared as text.
	}
	return {
		status: response.status,
		headers: Object.fromEntries(
			comparedHeaders.filter((name) => response.headers.has(name)).map((name) => [name, response.headers.get(name)]),
		),
		body: normalize(body),
	};
}

const results = [];
for (const fixture of fixtures) {
	const contract = manifest.apis.find((entry) => entry.path === fixture.path);
	if (!contract) throw new Error(`${fixture.path}: missing baseline API contract.`);
	if (fixture.method !== "GET" && !executeWrites) {
		results.push({
			path: fixture.path,
			method: fixture.method,
			status: "skipped",
			reason: "Write fixtures require MIGRATION_SAFE_TEST=1 and MIGRATION_MOCKS_READY=1.",
		});
		continue;
	}

	try {
		const [next, vinext] = await Promise.all([request(nextUrl, fixture), request(vinextUrl, fixture)]);
		const equal = JSON.stringify(next) === JSON.stringify(vinext);
		results.push({
			path: fixture.path,
			method: fixture.method,
			status: equal ? "pass" : "fail",
			next,
			vinext,
		});
	} catch (error) {
		results.push({
			path: fixture.path,
			method: fixture.method,
			status: "fail",
			error: String(error.message).slice(0, 500),
		});
	}
}

const compared = results.filter((result) => result.status !== "skipped");
const report = {
	schemaVersion: 1,
	generatedAt: new Date().toISOString(),
	nextOrigin: new URL(nextUrl).origin,
	vinextOrigin: new URL(vinextUrl).origin,
	writeFixturesExecuted: executeWrites,
	results,
	status: compared.length > 0 && compared.every((result) => result.status === "pass") ? "pass" : "fail",
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);

if (report.status !== "pass") {
	console.error(`Runtime API contract comparison failed or made no safe comparisons. See ${path.relative(root, outputPath)}.`);
	process.exitCode = 1;
} else {
	console.log(`Compared ${compared.length} safe API contracts; ${results.length - compared.length} writes skipped.`);
}
