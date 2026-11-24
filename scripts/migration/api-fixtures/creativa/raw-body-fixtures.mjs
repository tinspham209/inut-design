import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

const manifestPath = path.join(
	process.cwd(),
	"scripts/migration/api-fixtures/creativa/manifest.json",
);

function exactJson(byteLength) {
	const prefix = '{"fixture":"';
	const suffix = '"}';
	const fillerLength = byteLength - Buffer.byteLength(prefix) - Buffer.byteLength(suffix);
	if (fillerLength < 0) throw new Error(`Cannot construct JSON of ${byteLength} bytes.`);
	return Buffer.from(`${prefix}${"x".repeat(fillerLength)}${suffix}`, "utf8");
}

const chunkedBody = Buffer.from('{"fixture":"chunked","value":1}', "utf8");

export async function loadRawBodyFixtures() {
	const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
	const bodies = {
		empty: Buffer.alloc(0),
		"one-byte": Buffer.from("{"),
		"valid-json-65535": exactJson(65_535),
		"valid-json-65536": exactJson(65_536),
		"valid-json-65537": exactJson(65_537),
		"malformed-json": Buffer.from('{"fixture":', "utf8"),
		"malformed-utf8": Buffer.concat([
			Buffer.from('{"fixture":"', "utf8"),
			Buffer.from([0xc3, 0x28]),
			Buffer.from('"}', "utf8"),
		]),
		"chunked-valid-json": chunkedBody,
		"declared-length-too-small": Buffer.from('{"fixture":"length-small"}', "utf8"),
		"declared-length-too-large": Buffer.from('{"fixture":"length-large"}', "utf8"),
	};

	return manifest.cases.map((fixture) => {
		const body = bodies[fixture.name];
		if (!body) throw new Error(`Missing body generator for ${fixture.name}.`);
		if (fixture.byteLength !== undefined && body.length !== fixture.byteLength) {
			throw new Error(`${fixture.name}: expected ${fixture.byteLength} bytes, got ${body.length}.`);
		}
		const transport =
			fixture.kind === "chunked"
				? {
						transferEncoding: "chunked",
						chunks: [body.subarray(0, 9), body.subarray(9, 21), body.subarray(21)],
					}
				: fixture.name === "declared-length-too-small"
					? { contentLength: body.length - 1 }
					: fixture.name === "declared-length-too-large"
						? { contentLength: body.length + 1 }
						: { contentLength: body.length };
		return { ...fixture, body, transport };
	});
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
	const fixtures = await loadRawBodyFixtures();
	console.log(
		`Loaded ${fixtures.length} raw-body fixtures; boundary sizes: ${fixtures
			.filter((fixture) => fixture.byteLength !== undefined)
			.map((fixture) => fixture.byteLength)
			.join(", ")}.`,
	);
}
