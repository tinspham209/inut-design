import { timingSafeEqual } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import {
	getDraftLighterOrders,
	getEligibleSpxOrders,
	patchSpxOrder,
	publishDraftLighterOrder,
} from "@/api-client/sanity-server";
import {
	type DraftOrderDocument,
	type DraftPublishingSummary,
	SPX_SYNC_ERROR_CODES,
	type EligibleSpxOrder,
	type SpxFailureRecord,
	type SpxOrderSyncResult,
	type SpxPatchDecision,
	type SpxPersistedErrorCode,
	type SpxProviderResult,
	type SpxSyncErrorCode,
	type SpxSyncSummary,
} from "@/models/spxTracking";
import {
	decideFailedSpxSync,
	decideSuccessfulSpxSync,
} from "@/utils/spx/admin-notes";
import {
	authorizeSpxCronRequest,
	classifySanityError,
	getPublishedOrderId,
	getSpxSyncHttpStatus,
	hasSpxCapacityOverflow,
	mapWithConcurrency,
	SANITY_DRAFT_PUBLISH_CONCURRENCY,
	SPX_SYNC_CONCURRENCY,
} from "@/utils/spx/sync";
import { fetchSpxTracking } from "@/utils/spx/tracking";
import { formatSpxSyncErrorMessage } from "@/utils/telegram/formatSpxSyncErrorMessage";
import { TelegramClient, sendWithRetry } from "@/utils/telegram";
import { validateTelegramCredentials } from "@/utils/telegram/validateTelegramEnv";

const CRON_JOB_TIMEOUT_MS = 30000;
const DEFAULT_FUNCTION_TIMEOUT_MS = 30000;
const RESPONSE_RESERVE_MS = 750;
const TELEGRAM_RESERVE_MS = 4000;
const SPX_PHASE_RESERVE_MS = 12000;
const MAX_DRAFT_PUBLISH_PHASE_MS = 8000;
const MAX_SANITY_TIMEOUT_MS = 5000;
const MAX_DRAFT_PUBLISH_TIMEOUT_MS = 3500;
const MAX_SPX_TIMEOUT_MS = 4500;

type TelegramAlertStatus = "not_required" | "sent" | "failed" | "not_configured";

type CronResponse = {
	success: boolean;
	error?: string;
	startedAt?: string;
	finishedAt?: string;
	summary?: SpxSyncSummary;
	publishing?: DraftPublishingSummary;
	telegramAlert: TelegramAlertStatus;
	telegramAlertErrorCode?: string;
	results?: SpxOrderSyncResult[];
};

type MutationOutcome =
	| { kind: "not_needed" }
	| { kind: "mutated" }
	| {
			kind: "revision_conflict" | "error";
			errorCode: SpxSyncErrorCode;
	  };

type DraftPublishOutcome =
	| { kind: "published"; publishedId: string }
	| {
			kind: "revision_conflict" | "error";
			publishedId: string;
			errorCode: SpxSyncErrorCode;
	  };

type ProcessedOrder = {
	result: SpxOrderSyncResult;
	checked: number;
	changed: number;
	completed: number;
	unchanged: number;
	skipped: number;
	failed: number;
	attentionRequired: number;
	transientProviderFailure: boolean;
	sanityFailure: boolean;
	failures: SpxFailureRecord[];
};

type AlertResult = { status: TelegramAlertStatus; errorCode?: string };

type AuthorizedRunResult = {
	httpStatus: number;
	error?: string;
	summary: SpxSyncSummary;
	publishing: DraftPublishingSummary;
	results: SpxOrderSyncResult[];
	alert: AlertResult;
};

type AuthorizedRunDependencies = {
	getDraftOrders: typeof getDraftLighterOrders;
	publishDraftOrder: typeof publishDraftLighterOrder;
	getEligibleOrders: typeof getEligibleSpxOrders;
	processEligibleOrder: typeof processOrder;
	sendAlert: typeof sendFailureAlert;
};

function createEmptySummary(queried = 0): SpxSyncSummary {
	return {
		queried,
		checked: 0,
		changed: 0,
		completed: 0,
		unchanged: 0,
		skipped: 0,
		failed: 0,
		attentionRequired: 0,
	};
}

function createEmptyPublishingSummary(): DraftPublishingSummary {
	return {
		queried: 0,
		attempted: 0,
		published: 0,
		failed: 0,
	};
}

function secretsMatch(configured: string, provided: string): boolean {
	const configuredBuffer = Buffer.from(configured);
	const providedBuffer = Buffer.from(provided);
	return (
		configuredBuffer.length === providedBuffer.length &&
		timingSafeEqual(configuredBuffer, providedBuffer)
	);
}

function getHeaderValue(value: string | string[] | undefined): string | undefined {
	return typeof value === "string" ? value : undefined;
}

function getFunctionTimeoutMs(): number {
	const configured = Number(process.env.SPX_SYNC_FUNCTION_TIMEOUT_MS);
	if (Number.isFinite(configured) && configured >= 5000) {
		return Math.min(configured, CRON_JOB_TIMEOUT_MS);
	}
	return Math.min(DEFAULT_FUNCTION_TIMEOUT_MS, CRON_JOB_TIMEOUT_MS);
}

function getRemainingTimeout(deadlineAt: number, maximumMs: number): number {
	return Math.max(1, Math.min(maximumMs, deadlineAt - Date.now() - 100));
}

function getDraftPublishDeadlineAt(workDeadlineAt: number): number {
	return Math.min(
		Date.now() + MAX_DRAFT_PUBLISH_PHASE_MS,
		workDeadlineAt - SPX_PHASE_RESERVE_MS
	);
}

async function publishDraft(
	draft: DraftOrderDocument,
	publishDeadlineAt: number,
	publishDraftOrder: typeof publishDraftLighterOrder
): Promise<DraftPublishOutcome> {
	const publishedId = getPublishedOrderId(draft._id) || draft._id;
	if (Date.now() + 250 >= publishDeadlineAt) {
		return {
			kind: "error",
			publishedId,
			errorCode: SPX_SYNC_ERROR_CODES.SANITY_DRAFT_PUBLISH_TIMEOUT,
		};
	}

	try {
		await publishDraftOrder(
			draft,
			getRemainingTimeout(publishDeadlineAt, MAX_DRAFT_PUBLISH_TIMEOUT_MS)
		);
		return { kind: "published", publishedId };
	} catch (error) {
		const errorCode = classifySanityError(error, "draft_publish");
		return {
			kind:
				errorCode === SPX_SYNC_ERROR_CODES.SANITY_DRAFT_REVISION_CONFLICT
					? "revision_conflict"
					: "error",
			publishedId,
			errorCode,
		};
	}
}

function aggregateDraftPublishing(
	drafts: DraftOrderDocument[],
	outcomes: DraftPublishOutcome[]
): {
	publishing: DraftPublishingSummary;
	results: SpxOrderSyncResult[];
	failures: SpxFailureRecord[];
} {
	const failures: SpxFailureRecord[] = [];
	const results: SpxOrderSyncResult[] = [];

	outcomes.forEach((outcome, index) => {
		if (outcome.kind === "published") return;
		const draft = drafts[index];
		failures.push({
			phase: "sanity_publish",
			errorCode: outcome.errorCode,
			orderId: outcome.publishedId,
			orderNumber: draft.orderNumber,
		});
		results.push({
			orderId: outcome.publishedId,
			result:
				outcome.kind === "revision_conflict"
					? "draft_publish_conflict"
					: "draft_publish_error",
			errorCode: outcome.errorCode,
		});
	});

	return {
		publishing: {
			queried: drafts.length,
			attempted: outcomes.length,
			published: outcomes.filter((outcome) => outcome.kind === "published").length,
			failed: failures.length,
		},
		results,
		failures,
	};
}

async function applyDecision(
	order: EligibleSpxOrder,
	decision: SpxPatchDecision,
	workDeadlineAt: number
): Promise<MutationOutcome> {
	if (!decision.shouldMutate) return { kind: "not_needed" };
	if (Date.now() + 250 >= workDeadlineAt) {
		return {
			kind: "error",
			errorCode: SPX_SYNC_ERROR_CODES.SANITY_UPDATE_TIMEOUT,
		};
	}

	try {
		await patchSpxOrder(
			order,
			decision,
			getRemainingTimeout(workDeadlineAt, MAX_SANITY_TIMEOUT_MS)
		);
		return { kind: "mutated" };
	} catch (error) {
		const errorCode = classifySanityError(error, "update");
		return {
			kind:
				errorCode === SPX_SYNC_ERROR_CODES.SANITY_REVISION_CONFLICT
					? "revision_conflict"
					: "error",
			errorCode,
		};
	}
}

function createBaseProcessedOrder(orderId: string): ProcessedOrder {
	return {
		result: { orderId, result: "unchanged" },
		checked: 0,
		changed: 0,
		completed: 0,
		unchanged: 0,
		skipped: 0,
		failed: 0,
		attentionRequired: 0,
		transientProviderFailure: false,
		sanityFailure: false,
		failures: [],
	};
}

function addMutationFailure(
	processed: ProcessedOrder,
	order: EligibleSpxOrder,
	mutation: MutationOutcome
) {
	if (mutation.kind !== "revision_conflict" && mutation.kind !== "error") return;

	processed.result = {
		orderId: order._id,
		result: mutation.kind === "revision_conflict" ? "revision_conflict" : "sanity_update_error",
		errorCode: mutation.errorCode,
	};
	processed.failed = 1;
	processed.attentionRequired = 1;
	processed.sanityFailure = mutation.kind === "error";
	processed.failures.push({
		phase: "sanity_update",
		errorCode: mutation.errorCode,
		orderId: order._id,
		orderNumber: order.orderNumber,
	});
}

async function processProviderError(
	order: EligibleSpxOrder,
	providerResult: Exclude<SpxProviderResult, { kind: "success" } | { kind: "skip" }>,
	workDeadlineAt: number
): Promise<ProcessedOrder> {
	const processed = createBaseProcessedOrder(order._id);
	const errorCode = providerResult.errorCode as SpxPersistedErrorCode;
	const decision = decideFailedSpxSync(order, errorCode);
	const mutation = await applyDecision(order, decision, workDeadlineAt);

	processed.checked = 1;
	processed.failed = 1;
	processed.attentionRequired = 1;
	processed.transientProviderFailure =
		providerResult.kind === "transient_error" ||
		providerResult.kind === "invalid_response";
	processed.result = {
		orderId: order._id,
		result: mutation.kind === "mutated" ? "error_recorded" : "provider_error",
		errorCode,
	};
	processed.failures.push({
		phase: "spx_api",
		errorCode,
		orderId: order._id,
		orderNumber: order.orderNumber,
	});

	if (mutation.kind === "mutated") processed.changed = 1;
	addMutationFailure(processed, order, mutation);
	return processed;
}

async function processSuccessfulLookup(
	order: EligibleSpxOrder,
	providerResult: Extract<SpxProviderResult, { kind: "success" }>,
	workDeadlineAt: number
): Promise<ProcessedOrder> {
	const processed = createBaseProcessedOrder(order._id);
	const decision = decideSuccessfulSpxSync(order, providerResult.snapshot);
	const mutation = await applyDecision(order, decision, workDeadlineAt);

	processed.checked = 1;
	processed.result.spxStatus = providerResult.snapshot.status;

	if (decision.attentionErrorCode) {
		processed.attentionRequired = 1;
		processed.failures.push({
			phase: "orchestration",
			errorCode: decision.attentionErrorCode,
			orderId: order._id,
			orderNumber: order.orderNumber,
		});
	}

	if (mutation.kind === "revision_conflict" || mutation.kind === "error") {
		addMutationFailure(processed, order, mutation);
		return processed;
	}

	if (decision.type === "no_change") {
		processed.result = {
			orderId: order._id,
			result: "unchanged",
			spxStatus: providerResult.snapshot.status,
			...(decision.attentionErrorCode
				? { errorCode: decision.attentionErrorCode }
				: {}),
		};
		processed.unchanged = 1;
		return processed;
	}

	processed.changed = mutation.kind === "mutated" ? 1 : 0;
	processed.completed = decision.type === "complete_order" ? 1 : 0;
	processed.result = {
		orderId: order._id,
		result:
			decision.type === "complete_order"
				? "completed"
				: decision.type === "clear_error"
				? "error_cleared"
				: "updated",
		spxStatus: providerResult.snapshot.status,
		...(decision.attentionErrorCode
			? { errorCode: decision.attentionErrorCode }
			: {}),
	};
	return processed;
}

async function processOrder(
	order: EligibleSpxOrder,
	workDeadlineAt: number
): Promise<ProcessedOrder> {
	try {
		const providerResult = await fetchSpxTracking(order.trackingNumber, {
			timeoutMs: MAX_SPX_TIMEOUT_MS,
			maxAttempts: 2,
			deadlineAt: workDeadlineAt,
		});

		if (providerResult.kind === "skip") {
			const processed = createBaseProcessedOrder(order._id);
			processed.result = { orderId: order._id, result: "skipped" };
			processed.skipped = 1;
			return processed;
		}
		if (providerResult.kind === "success") {
			return processSuccessfulLookup(order, providerResult, workDeadlineAt);
		}
		return processProviderError(order, providerResult, workDeadlineAt);
	} catch {
		const processed = createBaseProcessedOrder(order._id);
		processed.result = {
			orderId: order._id,
			result: "provider_error",
			errorCode: SPX_SYNC_ERROR_CODES.ORCHESTRATION_ERROR,
		};
		processed.failed = 1;
		processed.attentionRequired = 1;
		processed.sanityFailure = true;
		processed.failures.push({
			phase: "orchestration",
			errorCode: SPX_SYNC_ERROR_CODES.ORCHESTRATION_ERROR,
			orderId: order._id,
			orderNumber: order.orderNumber,
		});
		return processed;
	}
}

function aggregateProcessedOrders(
	queried: number,
	processedOrders: ProcessedOrder[]
): {
	summary: SpxSyncSummary;
	results: SpxOrderSyncResult[];
	failures: SpxFailureRecord[];
	sanityFailure: boolean;
	transientProviderFailure: boolean;
} {
	const summary = createEmptySummary(queried);
	const failures: SpxFailureRecord[] = [];

	processedOrders.forEach((processed) => {
		summary.checked += processed.checked;
		summary.changed += processed.changed;
		summary.completed += processed.completed;
		summary.unchanged += processed.unchanged;
		summary.skipped += processed.skipped;
		summary.failed += processed.failed;
		summary.attentionRequired += processed.attentionRequired;
		failures.push(...processed.failures);
	});

	return {
		summary,
		results: processedOrders.map((processed) => processed.result),
		failures,
		sanityFailure: processedOrders.some((processed) => processed.sanityFailure),
		transientProviderFailure: processedOrders.some(
			(processed) => processed.transientProviderFailure
		),
	};
}

async function sendFailureAlert(
	failures: SpxFailureRecord[],
	summary: SpxSyncSummary,
	publishing: DraftPublishingSummary,
	runTime: Date,
	responseDeadlineAt: number
): Promise<AlertResult> {
	if (failures.length === 0) return { status: "not_required" };

	const botToken = process.env.SPX_SYNC_TELEGRAM_BOT_TOKEN;
	const chatId = process.env.SPX_SYNC_TELEGRAM_CHAT_ID;
	const validation = validateTelegramCredentials(botToken, chatId, {
		botToken: "SPX_SYNC_TELEGRAM_BOT_TOKEN",
		chatId: "SPX_SYNC_TELEGRAM_CHAT_ID",
	});

	if (!botToken || !chatId || !validation.isValid) {
		return {
			status: "not_configured",
			errorCode:
				!botToken || !chatId
					? "TELEGRAM_NOT_CONFIGURED"
					: "TELEGRAM_INVALID_CONFIG",
		};
	}

	const remainingMs = responseDeadlineAt - Date.now();
	if (remainingMs < 500) {
		return { status: "failed", errorCode: "TELEGRAM_BUDGET_EXHAUSTED" };
	}

	const message = formatSpxSyncErrorMessage({
		runTime,
		environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "development",
		summary,
		publishing,
		failures,
	});
	const telegram = new TelegramClient(botToken);
	const result = await sendWithRetry(telegram, chatId, message, {
		parseMode: "HTML",
		disableWebPagePreview: true,
		maxRetries: remainingMs >= 2500 ? 2 : 1,
		baseDelayMs: 250,
		requestTimeoutMs: Math.max(250, Math.min(1200, remainingMs - 250)),
		deadlineAt: responseDeadlineAt,
		suppressErrorLogs: true,
	});

	if (result.success) return { status: "sent" };
	return {
		status: "failed",
		errorCode:
			result.error === "TELEGRAM_BUDGET_EXHAUSTED"
				? "TELEGRAM_BUDGET_EXHAUSTED"
				: "TELEGRAM_SEND_FAILED",
	};
}

function finishResponse(
	res: NextApiResponse<CronResponse>,
	httpStatus: number,
	startedAt: Date,
	summary: SpxSyncSummary,
	publishing: DraftPublishingSummary,
	results: SpxOrderSyncResult[],
	alert: AlertResult,
	error?: string
) {
	return res.status(httpStatus).json({
		success: httpStatus === 200,
		...(error ? { error } : {}),
		startedAt: startedAt.toISOString(),
		finishedAt: new Date().toISOString(),
		summary,
		publishing,
		telegramAlert: alert.status,
		...(alert.errorCode ? { telegramAlertErrorCode: alert.errorCode } : {}),
		results,
	});
}

export async function runAuthorizedSpxSync(input: {
	startedAt: Date;
	responseDeadlineAt: number;
	workDeadlineAt: number;
	dependencies?: Partial<AuthorizedRunDependencies>;
}): Promise<AuthorizedRunResult> {
	const dependencies: AuthorizedRunDependencies = {
		getDraftOrders: getDraftLighterOrders,
		publishDraftOrder: publishDraftLighterOrder,
		getEligibleOrders: getEligibleSpxOrders,
		processEligibleOrder: processOrder,
		sendAlert: sendFailureAlert,
		...input.dependencies,
	};
	const publishDeadlineAt = getDraftPublishDeadlineAt(input.workDeadlineAt);
	let drafts: DraftOrderDocument[];

	try {
		if (Date.now() + 250 >= publishDeadlineAt) {
			const timeoutError = new Error("Draft discovery deadline exhausted");
			timeoutError.name = "AbortError";
			throw timeoutError;
		}
		drafts = await dependencies.getDraftOrders(
			getRemainingTimeout(publishDeadlineAt, MAX_SANITY_TIMEOUT_MS)
		);
	} catch (error) {
		const errorCode = classifySanityError(error, "draft_query");
		const summary = createEmptySummary();
		const publishing = createEmptyPublishingSummary();
		summary.failed = 1;
		summary.attentionRequired = 1;
		const failures: SpxFailureRecord[] = [
			{ phase: "sanity_publish", errorCode },
		];
		const alert = await dependencies.sendAlert(
			failures,
			summary,
			publishing,
			input.startedAt,
			input.responseDeadlineAt
		);
		console.error("[SPX Sync] Sanity draft discovery failed:", errorCode);
		return {
			httpStatus: 500,
			error: "sanity_draft_query_failed",
			summary,
			publishing,
			results: [],
			alert,
		};
	}

	const draftOutcomes = await mapWithConcurrency(
		drafts,
		SANITY_DRAFT_PUBLISH_CONCURRENCY,
		(draft) => publishDraft(draft, publishDeadlineAt, dependencies.publishDraftOrder)
	);
	const draftPublishing = aggregateDraftPublishing(drafts, draftOutcomes);

	let orders: EligibleSpxOrder[];
	try {
		if (Date.now() + 250 >= input.workDeadlineAt) {
			const timeoutError = new Error("SPX discovery deadline exhausted");
			timeoutError.name = "AbortError";
			throw timeoutError;
		}
		orders = await dependencies.getEligibleOrders(
			getRemainingTimeout(input.workDeadlineAt, MAX_SANITY_TIMEOUT_MS)
		);
	} catch (error) {
		const errorCode = classifySanityError(error, "query");
		const summary = createEmptySummary();
		summary.failed = draftPublishing.publishing.failed + 1;
		summary.attentionRequired = draftPublishing.publishing.failed + 1;
		const failures: SpxFailureRecord[] = [
			...draftPublishing.failures,
			{ phase: "sanity_query", errorCode },
		];
		const alert = await dependencies.sendAlert(
			failures,
			summary,
			draftPublishing.publishing,
			input.startedAt,
			input.responseDeadlineAt
		);
		console.error("[SPX Sync] Sanity SPX discovery failed:", errorCode);
		return {
			httpStatus: 500,
			error: "sanity_query_failed",
			summary,
			publishing: draftPublishing.publishing,
			results: draftPublishing.results,
			alert,
		};
	}

	if (hasSpxCapacityOverflow(orders.length)) {
		const summary = createEmptySummary(orders.length);
		summary.failed = draftPublishing.publishing.failed + 1;
		summary.attentionRequired = draftPublishing.publishing.failed + 1;
		const failures: SpxFailureRecord[] = [
			...draftPublishing.failures,
			{
				phase: "orchestration",
				errorCode: SPX_SYNC_ERROR_CODES.CAPACITY_EXCEEDED,
			},
		];
		const alert = await dependencies.sendAlert(
			failures,
			summary,
			draftPublishing.publishing,
			input.startedAt,
			input.responseDeadlineAt
		);
		const hasDraftFailures = draftPublishing.publishing.failed > 0;
		return {
			httpStatus: getSpxSyncHttpStatus({
				capacityOverflow: true,
				sanityFailure: hasDraftFailures,
			}),
			error: hasDraftFailures
				? "draft_publish_failed_and_capacity_exceeded"
				: "capacity_exceeded",
			summary,
			publishing: draftPublishing.publishing,
			results: draftPublishing.results,
			alert,
		};
	}

	try {
		const processedOrders = await mapWithConcurrency(
			orders,
			SPX_SYNC_CONCURRENCY,
			(order) => dependencies.processEligibleOrder(order, input.workDeadlineAt)
		);
		const aggregated = aggregateProcessedOrders(orders.length, processedOrders);
		aggregated.summary.failed += draftPublishing.publishing.failed;
		aggregated.summary.attentionRequired += draftPublishing.publishing.failed;
		const failures = [...draftPublishing.failures, ...aggregated.failures];
		const hasDraftFailures = draftPublishing.publishing.failed > 0;
		const httpStatus = getSpxSyncHttpStatus({
			sanityFailure: hasDraftFailures || aggregated.sanityFailure,
			transientProviderFailure: aggregated.transientProviderFailure,
		});
		const alert = await dependencies.sendAlert(
			failures,
			aggregated.summary,
			draftPublishing.publishing,
			input.startedAt,
			input.responseDeadlineAt
		);

		return {
			httpStatus,
			error:
				httpStatus === 500
					? hasDraftFailures
						? aggregated.sanityFailure
							? "sanity_publish_and_update_failed"
							: "sanity_publish_failed"
						: "sanity_update_failed"
					: httpStatus === 502
					? "spx_provider_failed"
					: undefined,
			summary: aggregated.summary,
			publishing: draftPublishing.publishing,
			results: [...draftPublishing.results, ...aggregated.results],
			alert,
		};
	} catch {
		const summary = createEmptySummary(orders.length);
		summary.failed = draftPublishing.publishing.failed + 1;
		summary.attentionRequired = draftPublishing.publishing.failed + 1;
		const failures: SpxFailureRecord[] = [
			...draftPublishing.failures,
			{
				phase: "orchestration",
				errorCode: SPX_SYNC_ERROR_CODES.ORCHESTRATION_ERROR,
			},
		];
		const alert = await dependencies.sendAlert(
			failures,
			summary,
			draftPublishing.publishing,
			input.startedAt,
			input.responseDeadlineAt
		);
		console.error(
			"[SPX Sync] Orchestration failed:",
			SPX_SYNC_ERROR_CODES.ORCHESTRATION_ERROR
		);
		return {
			httpStatus: 500,
			error: "orchestration_failed",
			summary,
			publishing: draftPublishing.publishing,
			results: draftPublishing.results,
			alert,
		};
	}
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<CronResponse>
) {
	const startedAt = new Date();
	const responseDeadlineAt =
		startedAt.getTime() + getFunctionTimeoutMs() - RESPONSE_RESERVE_MS;
	const workDeadlineAt = responseDeadlineAt - TELEGRAM_RESERVE_MS;
	const authorization = authorizeSpxCronRequest(
		req.method,
		process.env.SPX_SYNC_SECRET,
		getHeaderValue(req.headers["x-cron-secret"]),
		secretsMatch
	);

	if (authorization === "method_not_allowed") {
		res.setHeader("Allow", "POST");
		return res.status(405).json({
			success: false,
			error: "method_not_allowed",
			telegramAlert: "not_required",
		});
	}
	if (authorization === "server_misconfigured") {
		return res.status(500).json({
			success: false,
			error: "server_misconfigured",
			telegramAlert: "not_required",
		});
	}
	if (authorization === "unauthorized") {
		return res.status(401).json({
			success: false,
			error: "unauthorized",
			telegramAlert: "not_required",
		});
	}

	const result = await runAuthorizedSpxSync({
		startedAt,
		responseDeadlineAt,
		workDeadlineAt,
	});

	return finishResponse(
		res,
		result.httpStatus,
		startedAt,
		result.summary,
		result.publishing,
		result.results,
		result.alert,
		result.error
	);
}
