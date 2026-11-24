import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const gate = JSON.parse(
	await readFile(path.join(root, "artifacts/migration/gates/release-gate.json"), "utf8"),
);
const required = [
	"compatibility",
	"route",
	"api",
	"commerce",
	"search",
	"upload",
	"analytics",
	"accessibility",
	"worker",
	"security",
	"secret",
];
const selected = gate.gates.filter((item) => required.includes(item.gateId));
const blockers = selected.filter((item) => item.status !== "pass");
const report = `# User Story 1 Gate

| Gate | Status | Evidence |
|---|---|---|
${selected.map((item) => `| ${item.gateId} | ${item.status} | ${item.evidenceRef ?? "missing"} |`).join("\n")}

## Blocking Evidence

${blockers.length ? blockers.map((item) => `- **${item.gateId}**: ${item.reason ?? item.status}`).join("\n") : "- None"}

## Release Boundary

This report does not authorize deployment, DNS, registrar or a production write.
`;
const outputPath = path.join(root, "artifacts/migration/gates/us1.md");
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, report);
console.log(`US1 gate report captured ${selected.length} gates with ${blockers.length} blocker(s).`);
