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
const retiredOnly = process.argv.includes("--retired-only");
const singleBaseUrl = args.get("url") ?? vinextUrl;
const executeWrites =
	process.env.MIGRATION_SAFE_TEST === "1" && process.env.MIGRATION_MOCKS_READY === "1";
const manifest = JSON.parse(
	await readFile(path.join(root, "artifacts/migration/baseline/apis.json"), "utf8"),
);
const fixtures = await loadSafeApiFixtures();
const comparedHeaders = ["allow", "cache-control", "content-type", "location", "x-robots-tag"];
const retiredEndpoints = [
	{ path: "/api/costs/create", method: "POST", expectedStatus: 404 },
	{ path: "/api/income/create", method: "POST", expectedStatus: 404 },
	{ path: "/api/search?q=sticker", method: "GET", expectedStatus: 404 },
	{ path: "/api/creativa/orders/analytics-claim", method: "POST", expectedStatus: 405 },
];

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

async function request(baseUrl, fixture, safeRejection) {
	const headers = safeRejection
		? { ...fixture.headers, origin: "https://migration-invalid.example" }
		: fixture.headers;
	const response = await fetch(fixtureUrl(baseUrl, fixture), {
		method: fixture.method,
		headers,
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

async function checkRetiredEndpoint(baseUrl, endpoint) {
	const response = await fetch(new URL(endpoint.path, baseUrl), {
		method: endpoint.method,
		headers: endpoint.method === "GET" ? undefined : { "content-type": "application/json" },
		body: endpoint.method === "GET" ? undefined : JSON.stringify({}),
		redirect: "manual",
		signal: AbortSignal.timeout(15_000),
	});
	await response.arrayBuffer();
	return {
		status: response.status,
		allow: response.headers.get("allow"),
		pass: response.status === endpoint.expectedStatus,
	};
}

if (retiredOnly) {
	const retiredOutputPath = path.join(root, "artifacts/migration/runtime/retired-apis-check.json");
	const retiredResults = [];
	for (const endpoint of retiredEndpoints) {
		try {
			const actual = await checkRetiredEndpoint(singleBaseUrl, endpoint);
			retiredResults.push({
				path: endpoint.path,
				method: endpoint.method,
				expectedStatus: endpoint.expectedStatus,
				status: actual.pass ? "pass" : "fail",
				actual,
			});
		} catch (error) {
			retiredResults.push({
				path: endpoint.path,
				method: endpoint.method,
				expectedStatus: endpoint.expectedStatus,
				status: "fail",
				error: String(error.message).slice(0, 500),
			});
		}
	}
	const retiredReport = {
		schemaVersion: 1,
		generatedAt: new Date().toISOString(),
		origin: new URL(singleBaseUrl).origin,
		results: retiredResults,
		status: retiredResults.every((item) => item.status === "pass") ? "pass" : "fail",
	};
	await mkdir(path.dirname(retiredOutputPath), { recursive: true });
	await writeFile(retiredOutputPath, `${JSON.stringify(retiredReport, null, 2)}\n`);
	if (retiredReport.status !== "pass") {
		console.error(`Retired API negative check failed. See ${path.relative(root, retiredOutputPath)}.`);
		process.exitCode = 1;
	} else {
		console.log(`Verified ${retiredResults.length} retired API endpoints return expected 404/405.`);
	}
	process.exit();
}

const results = [];
for (const fixture of fixtures) {
	const contract = manifest.apis.find((entry) => entry.path === fixture.path);
	if (!contract) throw new Error(`${fixture.path}: missing baseline API contract.`);
	const safeRejection = fixture.method !== "GET" && !executeWrites;

	try {
		const [next, vinext] = await Promise.all([
			request(nextUrl, fixture, safeRejection),
			request(vinextUrl, fixture, safeRejection),
		]);
		const equal = JSON.stringify(next) === JSON.stringify(vinext);
		const safe =
			!safeRejection ||
			(next.status === 403 && vinext.status === 403) ||
			(fixture.path === "/api/cron/sync-spx-orders" && next.status === 401 && vinext.status === 401);
		results.push({
			path: fixture.path,
			method: fixture.method,
			mode: safeRejection ? "safe-rejection" : "mock-write",
			sideEffects: 0,
			status: equal && safe ? "pass" : "fail",
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

const retiredResults = [];
for (const endpoint of retiredEndpoints) {
	try {
		const [next, vinext] = await Promise.all([
			checkRetiredEndpoint(nextUrl, endpoint),
			checkRetiredEndpoint(vinextUrl, endpoint),
		]);
		retiredResults.push({
			path: endpoint.path,
			method: endpoint.method,
			expectedStatus: endpoint.expectedStatus,
			status: next.pass && vinext.pass ? "pass" : "fail",
			next,
			vinext,
		});
	} catch (error) {
		retiredResults.push({
			path: endpoint.path,
			method: endpoint.method,
			expectedStatus: endpoint.expectedStatus,
			status: "fail",
			error: String(error.message).slice(0, 500),
		});
	}
}

const report = {
	schemaVersion: 1,
	generatedAt: new Date().toISOString(),
	nextOrigin: new URL(nextUrl).origin,
	vinextOrigin: new URL(vinextUrl).origin,
	writeFixturesExecuted: executeWrites,
	results,
	retiredResults,
	status:
		results.length === 18 &&
		results.every((result) => result.status === "pass") &&
		retiredResults.every((result) => result.status === "pass")
			? "pass"
			: "fail",
};

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);

if (report.status !== "pass") {
	console.error(`Runtime API contract comparison failed or made no safe comparisons. See ${path.relative(root, outputPath)}.`);
	process.exitCode = 1;
} else {
	console.log(`Compared ${results.length} safe API contracts and ${retiredResults.length} retired APIs across both runtimes.`);
}
