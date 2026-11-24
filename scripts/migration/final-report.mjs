import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const spec = await readFile(
	path.join(root, "specs/004-migrate-vinext-cloudflare/spec.md"),
	"utf8",
);
const gate = JSON.parse(
	await readFile(path.join(root, "artifacts/migration/gates/release-gate.json"), "utf8"),
);
const manifest = JSON.parse(
	await readFile(path.join(root, "artifacts/migration/release/release-manifest.json"), "utf8"),
);
const requirements = [...new Set(spec.match(/\b(?:FR|SC)-\d+\b/g) ?? [])].sort((left, right) =>
	left.localeCompare(right, undefined, { numeric: true }),
);
const blockerMessages = gate.gates
	.filter((item) => item.status !== "pass")
	.map((item) => `${item.gateId}: ${item.reason ?? item.status}`);
const results = requirements.map((requirement) => ({
	requirement,
	status: blockerMessages.length ? "blocked" : "pass",
	evidenceRef: "artifacts/migration/gates/release-gate.json",
	owner: "owner",
	blockers: blockerMessages,
}));
const report = {
	schemaVersion: 1,
	kind: "final-release-report",
	commitSha: manifest.commitSha,
	lockfileHash: manifest.lockfileHash,
	cloudflareRollbackVersion: null,
	requirementResults: results,
	gates: gate.gates,
	ownerActions: gate.ownerActionRequired,
	registrarActions: "absent-by-implementation; public RDAP currently reports pending transfer and requires owner review",
	securityDataWaiver: false,
	status: blockerMessages.length ? "blocked" : "release-approved",
	generatedAt: new Date().toISOString(),
};
const outputPath = path.join(root, "artifacts/migration/release/final-report.json");
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(
	`Final report captured ${results.length} requirements; status=${report.status}, blockers=${blockerMessages.length}.`,
);
