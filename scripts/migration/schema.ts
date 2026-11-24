import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

import type {
	CandidateState,
	DependencyDecision,
	DomainState,
	MigrationManifest,
	ReleaseReport,
	SearchState,
	ValidatedUpload,
	VerificationResult,
	VerificationStatus,
} from "./types";

type StateFamily = "candidate" | "domain" | "search";
type StringMap = Record<string, unknown>;

const candidateTransitions: Record<CandidateState, CandidateState[]> = {
	building: ["local_next_pass", "blocked"],
	local_next_pass: ["local_vinext_pass", "blocked"],
	local_vinext_pass: ["contract_pass", "blocked"],
	contract_pass: ["preview_pass", "blocked"],
	preview_pass: ["release_approved", "blocked"],
	release_approved: ["production_active", "blocked"],
	production_active: ["superseded"],
	superseded: [],
	blocked: ["building"],
};
const domainTransitions: Record<DomainState, DomainState[]> = {
	preview_only: ["dns_prepared"],
	dns_prepared: ["authoritative_dns_cutover"],
	authoritative_dns_cutover: ["stabilizing"],
	stabilizing: ["stable_on_cloudflare", "dns_prepared"],
	stable_on_cloudflare: ["registrar_transfer_deferred"],
	registrar_transfer_deferred: ["transfer_eligibility_review"],
	transfer_eligibility_review: ["transfer_submitted"],
	transfer_submitted: ["transfer_approved", "stable_on_cloudflare"],
	transfer_approved: ["registrar_on_cloudflare", "stable_on_cloudflare"],
	registrar_on_cloudflare: [],
};
const searchTransitions: Record<SearchState, SearchState[]> = {
	generated: ["schema_validated"],
	schema_validated: ["privacy_validated"],
	privacy_validated: ["result_parity_passed"],
	result_parity_passed: ["published"],
	published: [],
};
const statuses = new Set<VerificationStatus>(["not_run", "pass", "fail", "blocked", "waived"]);
const dangerousKeys = new Set([
	"authCode",
	"credentialValue",
	"privateKey",
	"rawBody",
	"secretValue",
	"telegramBotToken",
	"tokenValue",
	"uploadBytes",
]);

function isRecord(value: unknown): value is StringMap {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}

function fail(message: string): never {
	throw new Error(message);
}

function requireRecord(value: unknown, label: string): StringMap {
	if (!isRecord(value)) fail(`${label}: expected an object.`);
	return value;
}

function requireString(value: unknown, label: string): asserts value is string {
	if (typeof value !== "string" || value.length === 0) fail(`${label}: expected a non-empty string.`);
}

function requireArray(value: unknown, label: string): asserts value is unknown[] {
	if (!Array.isArray(value)) fail(`${label}: expected an array.`);
}

export function validateNoSensitiveFields(value: unknown, location = "artifact"): void {
	if (Array.isArray(value)) {
		value.forEach((item, index) => validateNoSensitiveFields(item, `${location}[${index}]`));
		return;
	}
	if (!isRecord(value)) return;
	for (const [key, item] of Object.entries(value)) {
		if (dangerousKeys.has(key)) fail(`${location}.${key}: retained secret or raw payload field is forbidden.`);
		validateNoSensitiveFields(item, `${location}.${key}`);
	}
}

export function validateSortedUnique(values: string[], label: string): void {
	const sorted = [...values].sort((left, right) => left.localeCompare(right));
	if (JSON.stringify(values) !== JSON.stringify(sorted)) fail(`${label}: values must be sorted.`);
	if (new Set(values).size !== values.length) fail(`${label}: duplicate value is not allowed.`);
}

export function validateStateTransition(family: StateFamily, previous: string, next: string): void {
	const transitions =
		family === "candidate"
			? candidateTransitions[previous as CandidateState]
			: family === "domain"
				? domainTransitions[previous as DomainState]
				: searchTransitions[previous as SearchState];
	if (!transitions || !(transitions as string[]).includes(next)) {
		fail(`${family}: unsupported state transition ${previous} -> ${next}.`);
	}
}

export function validateVerificationResult(value: unknown): asserts value is VerificationResult {
	const record = requireRecord(value, "verification-result");
	requireString(record.gateId, "verification-result.gateId");
	requireString(record.scope, "verification-result.scope");
	requireString(record.evidenceRef, "verification-result.evidenceRef");
	requireString(record.measuredAt, "verification-result.measuredAt");
	requireString(record.owner, "verification-result.owner");
	if (!statuses.has(record.status as VerificationStatus)) fail("verification-result.status is unsupported.");
	if (record.status === "waived") requireString(record.waiverRationale, "verification-result.waiverRationale");
	validateNoSensitiveFields(record);
}

export function validateDependencyDecision(value: unknown): asserts value is DependencyDecision {
	const record = requireRecord(value, "dependency-decision");
	requireString(record.package, "dependency-decision.package");
	requireString(record.declaredVersion, "dependency-decision.declaredVersion");
	requireArray(record.consumers, "dependency-decision.consumers");
	requireArray(record.scope, "dependency-decision.scope");
	validateSortedUnique(record.consumers as string[], "dependency-decision.consumers");
}

export function validateUpload(value: unknown): asserts value is ValidatedUpload {
	const record = requireRecord(value, "validated-upload");
	requireString(record.mime, "validated-upload.mime");
	requireString(record.safeFilename, "validated-upload.safeFilename");
	requireString(record.sanityAssetRef, "validated-upload.sanityAssetRef");
	requireString(record.publicUrl, "validated-upload.publicUrl");
	for (const field of ["byteLength", "width", "height", "pixelCount"]) {
		if (!Number.isFinite(record[field]) || Number(record[field]) < 0) fail(`validated-upload.${field} is invalid.`);
	}
	if (!["accepted", "rejected"].includes(String(record.resultStatus))) {
		fail("validated-upload.resultStatus is unsupported.");
	}
	validateNoSensitiveFields(record);
}

export function validateReleaseReport(value: unknown): asserts value is ReleaseReport {
	const record = requireRecord(value, "release-report");
	requireString(record.commitSha, "release-report.commitSha");
	requireString(record.generatedAt, "release-report.generatedAt");
	requireArray(record.gates, "release-report.gates");
	if (!Object.hasOwn(candidateTransitions, String(record.candidateState))) {
		fail("release-report.candidateState is unsupported.");
	}
	const gateIds = record.gates.map((gate) => requireRecord(gate, "release-report.gate").gateId as string);
	validateSortedUnique(gateIds, "release-report gate IDs");
	for (const gate of record.gates) {
		const item = requireRecord(gate, "release-report.gate");
		requireString(item.evidenceRef, "release-report.gate.evidenceRef");
		requireString(item.owner, "release-report.gate.owner");
		if (!statuses.has(item.status as VerificationStatus)) fail("release-report.gate.status is unsupported.");
		if (item.status === "waived" && item.mandatory) fail("Mandatory security/data gate cannot be waived.");
	}
	validateNoSensitiveFields(record);
}

export function validateMigrationManifest(value: unknown): asserts value is MigrationManifest {
	const record = requireRecord(value, "migration-manifest");
	for (const field of [
		"sourceCommit",
		"lockfileHash",
		"searchIndexHash",
		"generatedAt",
	]) {
		requireString(record[field], `migration-manifest.${field}`);
	}
	for (const field of [
		"publicRoutes",
		"apiRoutes",
		"dynamicSlugs",
		"redirects",
		"sitemapUrls",
		"envNames",
		"workerModules",
	]) {
		requireArray(record[field], `migration-manifest.${field}`);
		validateSortedUnique(record[field] as string[], `migration-manifest.${field}`);
	}
	validateNoSensitiveFields(record);
}

export function validateArtifact(kind: string, value: unknown): void {
	switch (kind) {
		case "release-report":
			return validateReleaseReport(value);
		case "migration-manifest":
			return validateMigrationManifest(value);
		case "verification-result":
			return validateVerificationResult(value);
		case "dependency-decision":
			return validateDependencyDecision(value);
		case "validated-upload":
			return validateUpload(value);
		default:
			fail(`Unsupported artifact kind ${kind}.`);
	}
}

async function main() {
	const artifactIndex = process.argv.indexOf("--artifact");
	const kindIndex = process.argv.indexOf("--kind");
	if (artifactIndex < 0 || kindIndex < 0 || !process.argv[artifactIndex + 1] || !process.argv[kindIndex + 1]) {
		fail("Usage: schema.ts --kind <kind> --artifact <path>");
	}
	const artifactPath = path.resolve(process.cwd(), process.argv[artifactIndex + 1]);
	const kind = process.argv[kindIndex + 1];
	validateArtifact(kind, JSON.parse(await readFile(artifactPath, "utf8")));
	console.log(`Validated ${kind} artifact: ${path.relative(process.cwd(), artifactPath)}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
	main().catch((error) => {
		console.error(error.message);
		process.exitCode = 1;
	});
}
