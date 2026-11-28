import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { crc32 } from "node:zlib";
import sharp from "sharp";
import { createRuntimeApiHarness } from "./runtime-api-harness.mjs";

export async function pngOfSize(size) {
	const image = await sharp({ create: { width: 64, height: 32, channels: 4, background: "#345678" } }).png().toBuffer();
	const extra = size - image.length;
	if (extra < 12) return image;
	const chunk = Buffer.alloc(extra);
	chunk.writeUInt32BE(extra - 12);
	chunk.write("tEXt", 4);
	chunk.write("padding", 8);
	chunk.writeUInt32BE(crc32(chunk.subarray(4, -4)), extra - 4);
	return Buffer.concat([image.subarray(0, -12), chunk, image.subarray(-12)]);
}

export function uploadRequest(route, data, options = {}) {
	return new Request(`https://fixture.test${route}`, {
		method: "POST",
		headers: {
			host: "fixture.test", origin: "https://fixture.test", "content-type": "application/json",
			"cf-connecting-ip": options.ip || crypto.randomUUID(),
			...options.headers,
		},
		body: JSON.stringify({ data: data.toString("base64"), contentType: "image/png", filename: "fixture.png", ...options.body }),
	});
}

if (process.argv[1]?.endsWith("measure-worker-uploads.mjs")) {
	const phase = process.argv[2] || "after";
	assert.match(phase, /^(before|after)$/);
	const runtime = await createRuntimeApiHarness();
	const samples = [];
	try {
		assert.equal((await (await runtime.fetch(uploadRequest("/api/keychain/uploads", await pngOfSize(1024)))).json()).status, 200);
		for (const size of [1024, 1024 * 1024, 10 * 1024 * 1024]) {
			const png = await pngOfSize(size);
			for (const route of ["/api/keychain/uploads", "/api/sanity/upload-image"]) {
				for (let iteration = 0; iteration < 3; iteration++) {
					const request = uploadRequest(route, png);
					const start = performance.now();
					const result = await (await runtime.fetch(request)).json();
					samples.push({ route, bytes: png.length, iteration, wallMs: performance.now() - start, status: result.status });
					if (phase === "after") {
						assert.equal(result.status, 200);
						assert.equal(result.bytes, png.length);
						assert.equal(result.digest, createHash("sha256").update(png).digest("hex"));
					}
				}
			}
		}
	} finally { await runtime.dispose(); }
	const report = {
		phase, generatedAt: new Date().toISOString(), runtime: "local workerd, installed Vinext parser + API adapter",
		method: "Three sequential requests per size/route. Client wall time includes parse, request guard, decode, Blob, mock digest/persistence and response. Body construction is outside timer. No external service calls.",
		limitations: "Wall time is not Worker CPU. Peak isolate memory and deployed Free-limit enforcement are not measured; no CPU/RAM safety claim.",
		samples,
	};
	await mkdir("artifacts/migration/runtime/worker-runtime", { recursive: true });
	await writeFile(`artifacts/migration/runtime/worker-runtime/uploads-${phase}.json`, `${JSON.stringify(report, null, 2)}\n`);
	console.log(JSON.stringify(report, null, 2));
}
