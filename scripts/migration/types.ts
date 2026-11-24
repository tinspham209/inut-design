export type RenderMode = "static" | "ssg" | "isr" | "ssr";
export type VerificationStatus = "not_run" | "pass" | "fail" | "blocked" | "waived";
export type CandidateState =
	| "building"
	| "local_next_pass"
	| "local_vinext_pass"
	| "contract_pass"
	| "preview_pass"
	| "release_approved"
	| "production_active"
	| "superseded"
	| "blocked";
export type DomainState =
	| "preview_only"
	| "dns_prepared"
	| "authoritative_dns_cutover"
	| "stabilizing"
	| "stable_on_cloudflare"
	| "registrar_transfer_deferred"
	| "transfer_eligibility_review"
	| "transfer_submitted"
	| "transfer_approved"
	| "registrar_on_cloudflare";
export type SearchState =
	| "generated"
	| "schema_validated"
	| "privacy_validated"
	| "result_parity_passed"
	| "published";

export interface RouteRecord {
	path: string;
	file?: string;
	renderMode: RenderMode;
	getStaticPathsMode?: "none" | "blocking" | "false" | "true";
	status: number;
	headers?: Record<string, string>;
	canonicalUrl: string | null;
	requiresData: boolean;
}

export interface ApiContractRecord {
	path: string;
	file: string;
	methods: string[];
	authMode: string;
	bodyLimit: string;
	inputSchema: string;
	successShape: string;
	errorShape: string;
	rateLimit: string;
	idempotency: string;
	sideEffects: string[];
	allowedTestMode: string;
	expectedCache: string;
}

export interface VerificationResult {
	gateId: string;
	scope: string;
	status: VerificationStatus;
	evidenceRef: string;
	measuredAt: string;
	measurement: string | number | boolean | Record<string, unknown>;
	expected: string | number | boolean | Record<string, unknown>;
	owner: string;
	waiverRationale?: string;
}

export interface DependencyDecision {
	package: string;
	declaredVersion: string;
	resolvedVersion: string | null;
	license: string | null;
	peerConstraints: Record<string, string>;
	consumers: string[];
	scope: string[];
	migrationAction: string;
	ownerDecision: string | null;
}

export interface ProductionBaseline {
	schemaVersion: 1;
	commitSha: string;
	capturedAt: string;
	routes: RouteRecord[];
	apis: ApiContractRecord[];
	lockfileHash: string;
	timings: Array<{ route: string; p50Ms: number; p95Ms: number; sampleCount: number }>;
	analytics: Array<{ provider: string; source: string; event: string; exactOnce: boolean }>;
	seo: Array<{ path: string; canonical: string | null; robots: string | null }>;
}

export interface UploadRequest {
	data: string;
	contentType: "image/png" | "image/jpeg" | "image/webp" | string;
	filename: string;
	originalByteLength?: number;
	clientTransformVersion?: string;
}

export interface ValidatedUpload {
	mime: "image/png" | "image/jpeg" | "image/webp";
	byteLength: number;
	signature: string;
	width: number;
	height: number;
	pixelCount: number;
	safeFilename: string;
	sanityAssetRef: string;
	publicUrl: string;
	resultStatus: "accepted" | "rejected";
}

export interface ReleaseGate {
	gateId: string;
	group: string;
	mandatory: boolean;
	status: VerificationStatus;
	evidenceRef: string | null;
	owner: string;
	checkedAt: string | null;
}

export interface RollbackEvidence {
	cloudflareVersion: string;
	verifiedAt: string;
	coverage: string[];
	restoreTarget: "cloudflare-version" | "dns-state";
	maxRestoreMinutes: 15;
}

export interface MigrationManifest {
	schemaVersion: 1;
	sourceCommit: string;
	lockfileHash: string;
	publicRoutes: string[];
	apiRoutes: string[];
	dynamicSlugs: string[];
	redirects: string[];
	sitemapUrls: string[];
	searchIndexHash: string;
	envNames: string[];
	workerModules: string[];
	assetSummary: Record<string, number>;
	previewVersion: string | null;
	productionVersion: string | null;
	generatedAt: string;
}

export interface SecretMigrationRecord {
	legacyName: string;
	replacementName: string | null;
	scope: "public" | "build" | "worker-secret" | "scheduler";
	callerClass: "browser" | "worker" | "scheduler" | "build";
	rotationRequired: boolean;
	consumers: string[];
	removalEvidence: string[];
}

export interface ReleaseReport {
	kind: "release-report";
	schemaVersion: 1;
	commitSha: string;
	candidateState: CandidateState;
	gates: ReleaseGate[];
	rollback: RollbackEvidence | null;
	generatedAt: string;
}

export interface SearchIndexManifest {
	kind: "search-index";
	schemaVersion: 1;
	state: SearchState;
	documentsHash: string;
	documentCount: number;
	generatedAt: string;
}

export type MigrationArtifact =
	| ReleaseReport
	| SearchIndexManifest
	| MigrationManifest
	| VerificationResult
	| DependencyDecision
	| ValidatedUpload;
