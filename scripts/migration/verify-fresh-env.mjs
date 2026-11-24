import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const example = await readFile(path.join(root, ".env.example"), "utf8");
const cloudflare = await readFile(path.join(root, "cloudflare.config.ts"), "utf8");
const names = example
	.split("\n")
	.map((line) => line.trim())
	.filter((line) => line && !line.startsWith("#") && line.includes("="))
	.map((line) => line.slice(0, line.indexOf("=")));
const errors = [];
const requiredServer = [
	"SANITY_TOKEN",
	"TELEGRAM_BOT_TOKEN",
	"TELEGRAM_CHAT_ID",
	"SPX_SYNC_SECRET",
	"SPX_SYNC_TELEGRAM_BOT_TOKEN",
	"SPX_SYNC_TELEGRAM_CHAT_ID",
	"CREATIVA_TELEGRAM_BOT_TOKEN",
];
const forbiddenPublic = [
	"NEXT_PUBLIC_TELEGRAM_BOT_TOKEN",
	"NEXT_PUBLIC_TELEGRAM_CHAT_ID",
	"NEXT_PUBLIC_X_API_KEY",
];
for (const name of requiredServer) {
	if (!names.includes(name)) errors.push(`.env.example is missing ${name}.`);
	if (!cloudflare.includes(`"${name}"`) && !cloudflare.includes(`${name}: bindings.secret()`)) {
		errors.push(`cloudflare.config.ts is missing secret binding ${name}.`);
	}
}
for (const name of forbiddenPublic) {
	if (names.includes(name)) errors.push(`.env.example still exposes ${name}.`);
}
const output = {
	schemaVersion: 1,
	generatedAt: new Date().toISOString(),
	mode: "name-only",
	names,
	serverBindings: requiredServer,
	valuesInspected: false,
	status: errors.length ? "fail" : "pass",
	errors,
};
const outputPath = path.join(root, "artifacts/migration/operations/fresh-environment.json");
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
if (errors.length) {
	for (const error of errors) console.error(`- ${error}`);
	process.exitCode = 1;
} else {
	console.log(`Fresh environment name-only contract passed for ${requiredServer.length} Worker secrets.`);
}
