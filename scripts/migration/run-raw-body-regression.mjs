import { mkdir, writeFile } from "node:fs/promises";
import { register } from "node:module";
import { Readable } from "node:stream";
import { execFileSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

import { loadRawBodyFixtures } from "./api-fixtures/creativa/raw-body-fixtures.mjs";

register("./scripts/typescript-loader.mjs", pathToFileURL("./"));
const { readJsonBody } = await import("@/utils/creativa/api.server");
const { intentId } = await import("@/utils/creativa/records.server");
const fixtures = await loadRawBodyFixtures();
const results = [];

for (const fixture of fixtures) {
	const request = Readable.from(fixture.transport.chunks ?? [fixture.body]);
	request.headers = {
		"content-type": "application/json",
		...(fixture.transport.transferEncoding
			? { "transfer-encoding": fixture.transport.transferEncoding }
			: { "content-length": String(fixture.transport.contentLength) }),
	};
	let status = "accepted";
	let code = null;
	try {
		await readJsonBody(request);
	} catch (error) {
		status = "rejected";
		code = error?.code ?? null;
	}

	const expectedPass =
		(fixture.kind === "valid-json-exact-size" && fixture.byteLength <= 65_536) ||
		fixture.kind === "chunked";
	const pass = expectedPass ? status === "accepted" : status === "rejected";
	results.push({
		name: fixture.name,
		kind: fixture.kind,
		byteLength: fixture.body.byteLength,
		expected: expectedPass ? "accepted" : "rejected",
		status,
		code,
		pass,
	});
}

const abortStream = new Readable({
	read() {
		this.push(Buffer.from('{"fixture":'));
		this.destroy(new Error("fixture abort"));
	},
});
abortStream.headers = { "content-type": "application/json", "transfer-encoding": "chunked" };
let abortRejected = false;
try {
	await readJsonBody(abortStream);
} catch {
	abortRejected = true;
}
results.push({
	name: "aborted-stream",
	kind: "abort",
	expected: "rejected",
	status: abortRejected ? "rejected" : "accepted",
	pass: abortRejected,
});

const capability = "A".repeat(43);
let idempotencyPass = false;
try {
	idempotencyPass =
		intentId(capability) === intentId(capability) &&
		(() => {
			try {
				intentId();
				return false;
			} catch {
				return true;
			}
		})();
} catch {
	// Failure is retained below.
}
results.push({
	name: "idempotency-capability",
	kind: "idempotency",
	expected: "stable duplicate id; absent key rejected",
	status: idempotencyPass ? "accepted" : "rejected",
	pass: idempotencyPass,
});

let downstreamTimeoutPass = false;
try {
	const output = execFileSync("pnpm", ["regression:spx"], {
		cwd: process.cwd(),
		encoding: "utf8",
		stdio: ["ignore", "pipe", "pipe"],
	});
	downstreamTimeoutPass =
		output.includes("classifies timeout, network, HTTP, and invalid JSON failures deterministically") &&
		output.includes("SPX regression passed:");
} catch {
	downstreamTimeoutPass = false;
}
results.push({
	name: "downstream-timeout",
	kind: "timeout",
	expected: "deterministic timeout failure",
	status: downstreamTimeoutPass ? "covered" : "missing",
	pass: downstreamTimeoutPass,
});

const report = {
	schemaVersion: 1,
	generatedAt: new Date().toISOString(),
	sideEffects: 0,
	results,
	status: results.every((result) => result.pass) ? "pass" : "fail",
};
const outputPath = path.join(process.cwd(), "artifacts/migration/runtime/raw-body/regression.json");
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
if (report.status !== "pass") {
	console.error(`Raw-body regression failed. See ${path.relative(process.cwd(), outputPath)}.`);
	process.exitCode = 1;
} else {
	console.log(`Raw-body regression passed ${results.length} boundary and transport fixtures.`);
}
