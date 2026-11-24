import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const targets = [
	"docs/operations",
	"artifacts/migration/templates",
	"artifacts/migration/release",
];
const patterns = [
	{ name: "private-key", regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
	{ name: "telegram-token", regex: /\b\d{8,12}:[A-Za-z0-9_-]{20,}\b/ },
	{ name: "bearer-token", regex: /\bBearer\s+[A-Za-z0-9._~+/=-]{24,}\b/i },
	{ name: "auth-code-field", regex: /"authCode"\s*:\s*"(?!PROHIBITED$)[^"]+"/i },
	{ name: "email-address", regex: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i },
	{ name: "upload-bytes", regex: /data:image\/[^;]+;base64,[A-Za-z0-9+/=]{100,}/ },
];
const findings = [];
async function walk(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = [];
	for (const entry of entries) {
		const file = path.join(directory, entry.name);
		if (entry.isDirectory()) files.push(...(await walk(file)));
		else if (/\.(json|md|txt|log|ya?ml)$/.test(entry.name)) files.push(file);
	}
	return files;
}
for (const target of targets) {
	const directory = path.join(root, target);
	if (!existsSync(directory)) continue;
	for (const file of await walk(directory)) {
		const content = await readFile(file, "utf8");
		for (const pattern of patterns) {
			if (pattern.regex.test(content)) {
				findings.push({ file: path.relative(root, file), type: pattern.name });
			}
		}
	}
}
if (findings.length) {
	console.error(`Release redaction failed (${findings.length}):`);
	for (const finding of findings) console.error(`- ${finding.file}: ${finding.type}`);
	process.exitCode = 1;
} else {
	console.log("Release and operations documentation passed redaction checks.");
}
