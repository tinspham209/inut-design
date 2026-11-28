import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";

const cfRequire = createRequire(import.meta.resolve("cf/package.json"));
const viteRequire = createRequire(import.meta.resolve("vite/package.json"));
const { Miniflare, convertV4MiniflareOptions } = await import(pathToFileURL(cfRequire.resolve("miniflare")));
const { rolldown } = await import(pathToFileURL(viteRequire.resolve("rolldown")));
const root = process.cwd();
const vinextCompat = path.join(root, "node_modules/vinext/dist/server/pages-node-compat.js");

export async function createRuntimeApiHarness({ platform = "worker" } = {}) {
	const bundle = await rolldown({
		input: "runtime-api-entry",
		platform: "neutral",
		external: [/^node:/],
		resolve: { alias: { "@": root }, conditionNames: ["workerd", "browser", "import", "default"] },
		plugins: [{
			name: "isolated-api-fixtures",
			resolveId(id) {
				if (id === "runtime-api-entry" || id === "runtime-api-state") return `\0${id}`;
				if (id === "@/api-client/sanity-server" || id === "@/api-client/sanity-image" || id === "@/utils/zalo") return `\0mock:${id}`;
			},
			load(id) {
				if (id === "\0runtime-api-state") return `
					export const state = { writes: 0, probes: 0, bytes: 0, fail: false, digest: null };
				`;
				if (id === "\0mock:@/api-client/sanity-server") return `
					import { state } from "runtime-api-state";
					export async function uploadImageAssetToSanity(blob) {
						state.writes++;
						state.bytes = blob.size;
						state.digest = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", await blob.arrayBuffer())), b => b.toString(16).padStart(2, "0")).join("");
						if (state.fail) throw new Error("SYNTHETIC_PERSISTENCE_FAILURE");
						return { _type: "image", asset: { _type: "reference", _ref: "image-fixture-64x32-png" } };
					}
				`;
				if (id === "\0mock:@/api-client/sanity-image") return `export const sanityImageUrl = () => "https://cdn.sanity.io/fixture.png";`;
				if (id === "\0mock:@/utils/zalo") return `import { state } from "runtime-api-state"; export async function checkZaloRegistered() { state.probes++; return true; }`;
				if (id === "\0runtime-api-entry") return `
					import keychain from ${JSON.stringify(path.join(root, "pages/api/keychain/uploads.ts"))};
					import general from ${JSON.stringify(path.join(root, "pages/api/sanity/upload-image.ts"))};
					import phone from ${JSON.stringify(path.join(root, "pages/api/validate-phone.ts"))};
					import { createPagesApiReqRes, parsePagesApiBody } from ${JSON.stringify(vinextCompat)};
					import { state } from "runtime-api-state";
					export default { async fetch(request) {
						state.writes = state.probes = state.bytes = 0; state.digest = null;
						state.fail = request.headers.get("x-fixture-fail") === "true";
						const url = new URL(request.url);
						try {
							const isPhone = url.pathname === "/api/validate-phone";
							const body = await parsePagesApiBody(request, isPhone ? 1024 * 1024 : 14 * 1024 * 1024);
							const { req, res, responsePromise } = createPagesApiReqRes({ request, url: url.pathname, query: {}, body });
							if (request.headers.has("x-fixture-socket")) req.socket = { remoteAddress: request.headers.get("x-fixture-socket") };
							await (isPhone ? phone : url.pathname.includes("keychain") ? keychain : general)(req, res);
							const response = await responsePromise;
							return Response.json({ status: response.status, body: await response.json(), writes: state.writes, probes: state.probes, bytes: state.bytes, digest: state.digest });
						} catch (error) {
							return Response.json({ status: error.statusCode || 500, error: error.name, writes: state.writes, probes: state.probes });
						}
					}};
				`;
			},
		}],
	});
	if (platform === "node") {
		const directory = await mkdtemp(path.join(tmpdir(), "inut-api-harness-"));
		try {
			await bundle.write({ format: "es", codeSplitting: false, file: path.join(directory, "worker.mjs") });
			const { default: handler } = await import(pathToFileURL(path.join(directory, "worker.mjs")));
			return { fetch: (request) => handler.fetch(request), dispose: () => rm(directory, { recursive: true }) };
		} catch (error) {
			await rm(directory, { recursive: true });
			throw error;
		} finally { await bundle.close(); }
	}
	const { output } = await bundle.generate({ format: "es", codeSplitting: false });
	await bundle.close();
	const code = output.find((item) => item.type === "chunk").code;
	const mf = new Miniflare(convertV4MiniflareOptions({
		modules: true,
		script: code,
		compatibilityDate: "2026-11-24",
		compatibilityFlags: ["nodejs_compat"],
		bindings: { DEPLOYMENT_CHANNEL: "test", NEXT_PUBLIC_ALLOWED_ORIGINS: "https://fixture.test" },
		cf: false,
		outboundService: () => { throw new Error("Unexpected external request in isolated API test"); },
	}));
	return {
		fetch: (request) => mf.dispatchFetch(request.url, {
			method: request.method, headers: Object.fromEntries(request.headers),
			body: request.body, duplex: "half",
		}),
		dispose: () => mf.dispose(),
	};
}
