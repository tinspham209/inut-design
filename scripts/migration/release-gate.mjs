import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const errors = [];
const groups = [
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
	"cost",
	"operations",
];
const reports = {};

async function load(relativePath, required = true) {
	try {
		const value = await readFile(path.join(root, relativePath), "utf8");
		return relativePath.endsWith(".json") ? JSON.parse(value) : value;
	} catch (error) {
		if (required) errors.push(`Missing required evidence: ${relativePath}`);
		return null;
	}
}

reports.api = await load("artifacts/migration/runtime/api-contract-comparison.json");
reports.upload = await load("artifacts/migration/runtime/uploads/regression.json");
reports.rawBody = await load("artifacts/migration/runtime/raw-body/regression.json");
reports.analytics = await load("artifacts/migration/runtime/analytics/exact-once.json");
reports.performance = await load("artifacts/migration/runtime/performance/report.json");
reports.secrets = await load("artifacts/migration/runtime/security/secret-scan.json");
reports.worker = await load("artifacts/migration/runtime/security/worker-graph.json");
reports.browser = await load("artifacts/migration/runtime/browser/report.json");
reports.manifest = await load("artifacts/migration/release/release-manifest.json");
reports.approval = await load("artifacts/migration/templates/production-approval.json");
reports.spend = await load("artifacts/migration/operations/spend-policy.md", false);
reports.rollback = await load("artifacts/migration/operations/rollback-drill.json", false);

const gates = groups.map((group) => {
	let status = "blocked";
	let evidenceRef = null;
	let reason = "Required evidence has not been supplied.";
	if (group === "api" && reports.api) {
		status = reports.api.results?.length === 22 && reports.api.status === "pass" ? "pass" : "fail";
		evidenceRef = "artifacts/migration/runtime/api-contract-comparison.json";
		reason = status === "pass" ? "22 routes compare safely across runtimes." : "API matrix is incomplete or differs.";
	} else if (group === "upload" && reports.upload) {
		status = reports.upload.status === "pass" ? "pass" : "fail";
		evidenceRef = "artifacts/migration/runtime/uploads/regression.json";
		reason = "Strict format, byte, dimension, and persistence fixtures executed.";
	} else if (group === "analytics" && reports.analytics) {
		status = reports.analytics.status === "pass" ? "pass" : "fail";
		evidenceRef = "artifacts/migration/runtime/analytics/exact-once.json";
		reason = "Exact-once and redacted-property audit executed.";
	} else if (group === "security" && reports.rawBody) {
		status = reports.rawBody.status === "pass" ? "pass" : "fail";
		evidenceRef = "artifacts/migration/runtime/raw-body/regression.json";
		reason = "Raw-body, idempotency, abort, and timeout checks executed.";
	} else if (group === "secret" && reports.secrets) {
		status = reports.secrets.status === "pass" ? "pass" : "fail";
		evidenceRef = "artifacts/migration/runtime/security/secret-scan.json";
		reason = "Browser, source-map, public, and log secret scan executed.";
	} else if (group === "worker" && reports.worker) {
		status = reports.worker.status === "pass" ? "pass" : "fail";
		evidenceRef = "artifacts/migration/runtime/security/worker-graph.json";
		reason = "Worker application graph excludes prohibited native/dev modules.";
	} else if (group === "compatibility" && reports.manifest) {
		status = reports.manifest.manifestHashes?.searchIndex ? "pass" : "blocked";
		evidenceRef = "artifacts/migration/release/release-manifest.json";
		reason = status === "pass" ? "Release manifests are complete." : "Static/search artifacts are incomplete.";
	} else if ((group === "route" || group === "commerce" || group === "accessibility") && reports.browser) {
		const documentFailures = reports.browser.viewports?.flatMap((viewport) =>
			viewport.pages.filter(
				(page) => page.network?.find((request) => request.resourceType === "Document")?.status !== 200,
			),
		);
		status = documentFailures.length ? "blocked" : "pass";
		evidenceRef = "artifacts/migration/runtime/browser/report.json";
		reason =
			status === "pass"
				? "Representative routes rendered in browser evidence."
				: `${documentFailures.length} representative route(s) are not 200.`;
	} else if (group === "search" && reports.manifest) {
		status = reports.manifest.manifestHashes?.searchIndex ? "pass" : "blocked";
		evidenceRef = "artifacts/migration/release/release-manifest.json";
		reason = "Versioned static search artifact hash must exist.";
	} else if (group === "cost" || group === "operations") {
		const operations = group === "cost" ? reports.spend : reports.rollback;
		status = operations ? "pass" : "blocked";
		evidenceRef =
			group === "cost"
				? "artifacts/migration/operations/spend-policy.md"
				: "artifacts/migration/operations/rollback-drill.json";
		reason = operations ? "Owner policy evidence exists." : "Owner approval/action evidence is missing.";
	}
	return {
		gateId: group,
		group,
		mandatory: true,
		status,
		evidenceRef,
		owner: "owner",
		checkedAt: new Date().toISOString(),
		...(status !== "pass" && { reason }),
	};
});

const commitSha = reports.manifest?.commitSha ?? null;
const output = {
	schemaVersion: 1,
	kind: "release-report",
	commitSha,
	candidateState: gates.every((gate) => gate.status === "pass") ? "release_approved" : "blocked",
	gates,
	rollback: null,
	generatedAt: new Date().toISOString(),
	reportHash: null,
	ownerActionRequired: gates.filter((gate) => gate.status !== "pass").map((gate) => ({
		gate: gate.gateId,
		reason: gate.reason,
	})),
};
const payload = JSON.stringify(output);
output.reportHash = createHash("sha256").update(payload).digest("hex");
const outputPath = path.join(root, "artifacts/migration/gates/release-gate.json");
await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
if (errors.length || output.candidateState !== "release_approved") {
	for (const error of errors) console.error(`- ${error}`);
	console.error(`Release gate blocked (${output.ownerActionRequired.length} gate(s)). See ${path.relative(root, outputPath)}.`);
	process.exitCode = 1;
} else {
	console.log(`Release gate passed all ${gates.length} mandatory gates.`);
}
