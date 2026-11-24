import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const outputPath = path.join(root, "artifacts/migration/baseline/call-sites.json");
const ignoredDirectories = new Set([".git", ".next", ".vinext", "artifacts", "dist", "node_modules", "public", "specs"]);
const sourceExtensions = new Set([".js", ".jsx", ".mjs", ".cjs", ".ts", ".tsx"]);

async function walk(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		if (ignoredDirectories.has(entry.name)) continue;
		const absolutePath = path.join(directory, entry.name);
		if (entry.isDirectory()) files.push(...(await walk(absolutePath)));
		else if (sourceExtensions.has(path.extname(entry.name))) files.push(absolutePath);
	}
	return files;
}

const definitions = {
	nextImage: {
		pattern: /<(?:Image|NextImage)\b/g,
		risk: "Next 15 legacy prop, dimensions, layout and priority behavior",
	},
	nextImageLegacyProps: {
		pattern: /\b(layout|objectFit|objectPosition)=/g,
		risk: "Legacy next/image layout prop migration",
	},
	nextLink: {
		pattern: /<Link\b/g,
		risk: "Nested anchor, href, focus, prefetch and click-tracking semantics",
	},
	nextLinkLegacyProps: {
		pattern: /\b(passHref|legacyBehavior)(?:\s|=|\})/g,
		risk: "Next 15 Link child-clone and anchor composition",
	},
	carousel: {
		pattern: /react-material-ui-carousel|<Carousel\b/g,
		risk: "React 19 peer compatibility and shared accessible controls",
	},
	reactThree: {
		pattern: /@react-three\/(?:fiber|drei)|\bCanvas\b|THREE\./g,
		risk: "Fiber/Drei/Three peers, SSR boundary, WebGL fallback",
	},
	buffer: {
		pattern: /\bBuffer\b|from\s+["'](?:node:)?buffer["']/g,
		risk: "Worker-safe byte handling",
	},
	nodeCrypto: {
		pattern: /from\s+["'](?:node:)?crypto["']|require\(["'](?:node:)?crypto["']\)|\bcrypto\./g,
		risk: "Worker-safe Web Crypto or server-only boundary",
	},
	nodeFilesystem: {
		pattern: /from\s+["'](?:node:)?fs(?:\/promises)?["']|require\(["'](?:node:)?fs["']\)/g,
		risk: "Request-time filesystem dependency",
	},
	nodePath: {
		pattern: /from\s+["'](?:node:)?path["']|require\(["'](?:node:)?path["']\)/g,
		risk: "Request-time path module dependency",
	},
	rawBody: {
		pattern: /bodyParser:\s*false|for\s+await\s*\(\s*const\s+\w+\s+of\s+req|readableStream|raw-body/g,
		risk: "Worker raw-byte, malformed UTF-8 and 64 KiB body parity",
	},
	publicSecrets: {
		pattern: /NEXT_PUBLIC_(?:TELEGRAM_BOT_TOKEN|TELEGRAM_CHAT_ID|X_API_KEY)/g,
		risk: "Existing public credential exposure requiring removal and rotation",
	},
};

const files = await walk(root);
const categories = Object.fromEntries(Object.keys(definitions).map((key) => [key, []]));

for (const file of files) {
	const source = await readFile(file, "utf8");
	const relative = path.relative(root, file).replaceAll(path.sep, "/");
	for (const [name, definition] of Object.entries(definitions)) {
		const matches = [...source.matchAll(definition.pattern)];
		if (!matches.length) continue;
		const lines = [...new Set(matches.map((match) => source.slice(0, match.index).split("\n").length))].sort(
			(left, right) => left - right,
		);
		categories[name].push({
			file: relative,
			matches: matches.length,
			lines,
		});
	}
}

for (const records of Object.values(categories)) records.sort((left, right) => left.file.localeCompare(right.file));

const summary = Object.fromEntries(
	Object.entries(categories).map(([name, records]) => [
		name,
		{
			files: records.length,
			occurrences: records.reduce((count, record) => count + record.matches, 0),
			risk: definitions[name].risk,
		},
	]),
);

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(
	outputPath,
	`${JSON.stringify(
		{
			schemaVersion: 1,
			summary,
			categories,
		},
		null,
		2,
	)}\n`,
);

console.log(
	`Inventoried ${Object.keys(summary).length} migration call-site categories across ${new Set(
		Object.values(categories).flatMap((records) => records.map((record) => record.file)),
	).size} files.`,
);
