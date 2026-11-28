import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { Readable } from "node:stream";
import { createRequire } from "node:module";
import test from "node:test";
import sharp from "sharp";
import { createRuntimeApiHarness } from "../migration/runtime-api-harness.mjs";
import { pngOfSize, uploadRequest } from "../migration/measure-worker-uploads.mjs";

const require = createRequire(import.meta.url);
const { parseBody } = require("next/dist/server/api-utils/node/parse-body.js");
const routes = ["/api/keychain/uploads", "/api/sanity/upload-image"];
const send = async (runtime, request) => (await runtime.fetch(request)).json();

test("Worker upload handlers retain format, exact bytes, error and request-guard contracts", async () => {
	const runtime = await createRuntimeApiHarness();
	try {
		for (const route of routes) {
			for (const [format, contentType] of [["png", "image/png"], ["jpeg", "image/jpeg"], ["webp", "image/webp"]]) {
				const bytes = await sharp({ create: { width: 64, height: 32, channels: 4, background: "#345678" } })[format]().toBuffer();
				const result = await send(runtime, uploadRequest(route, bytes, { body: { contentType } }));
				assert.equal(result.status, 200);
				assert.equal(result.writes, 1);
				assert.equal(result.digest, createHash("sha256").update(bytes).digest("hex"));
				assert.deepEqual(Object.keys(result.body).sort(), route.includes("keychain") ? ["image", "url"] : ["_type", "asset"]);
			}
			for (const data of ["", "%%%", "AB==", "AAB=", "AA==\n", "__=="]) {
				const result = await send(runtime, uploadRequest(route, Buffer.alloc(0), { body: { data } }));
				assert.equal(result.status, 400, data);
				assert.equal(result.writes, 0);
			}
			const png = await pngOfSize(1024);
			const failed = await send(runtime, uploadRequest(route, png, { headers: { "x-fixture-fail": "true" } }));
			assert.equal(failed.status, 500);
			assert.equal(failed.writes, 1);
			for (const [headers, status] of [
				[{ origin: "https://not-allowed.test" }, 403],
				[{ "content-type": "text/plain" }, 415],
			]) {
				const result = await send(runtime, uploadRequest(route, png, { headers }));
				assert.equal(result.status, status);
				assert.equal(result.writes, 0);
			}
			const oversized = await send(runtime, uploadRequest(route, Buffer.alloc(0), { body: { data: "A".repeat(14 * 1024 * 1024) } }));
			assert.equal(oversized.status, 413);
			assert.equal(oversized.writes, 0);
		}
		const over10 = await pngOfSize(10 * 1024 * 1024 + 1);
		assert.equal((await send(runtime, uploadRequest(routes[0], over10))).status, 413);
		assert.equal((await send(runtime, uploadRequest(routes[1], over10))).status, 200);
		const bigDimensions = await sharp({ create: { width: 2049, height: 1, channels: 4, background: "#123456" } }).png().toBuffer();
		assert.equal((await send(runtime, uploadRequest(routes[0], bigDimensions))).status, 400);
		const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>');
		assert.equal((await send(runtime, uploadRequest(routes[1], svg, { body: { contentType: "image/svg+xml" } }))).status, 200);
		assert.equal((await send(runtime, uploadRequest(routes[0], svg, { body: { contentType: "image/svg+xml" } }))).status, 415);
	} finally { await runtime.dispose(); }
});

test("Next's actual API parser enforces 14 MiB without Content-Length", async () => {
	const req = Readable.from([JSON.stringify({ data: "A".repeat(14 * 1024 * 1024) })]);
	req.headers = { "content-type": "application/json" };
	await assert.rejects(parseBody(req, "14mb"), (error) => error.statusCode === 413);
});

for (const platform of ["worker", "node"]) {
	test(`${platform} phone handler isolates only trusted connecting IPs and keeps advisory responses`, async () => {
		const runtime = await createRuntimeApiHarness({ platform });
		try {
			const request = (ip) => new Request("https://fixture.test/api/validate-phone", {
				method: "POST",
				headers: {
					host: "fixture.test", origin: "https://fixture.test", "content-type": "application/json",
					"cf-connecting-ip": ip, "x-forwarded-for": "203.0.113.10", "x-fixture-socket": "203.0.113.11",
				},
				body: JSON.stringify({ phone: "0901234567" }),
			});
			for (let i = 0; i < 19; i++) assert.equal((await send(runtime, request("198.51.100.1"))).probes, 1);
			const limited = await send(runtime, request("198.51.100.1"));
			assert.equal(limited.status, 200);
			assert.equal(limited.probes, 0);
			assert.equal(limited.body.zaloRegistered, null);
			assert.equal((await send(runtime, request("198.51.100.2"))).probes, platform === "worker" ? 1 : 0);
		} finally { await runtime.dispose(); }
	});
}
