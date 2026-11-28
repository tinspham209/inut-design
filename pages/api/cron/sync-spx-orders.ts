import type { NextApiRequest, NextApiResponse } from "next";
import { createSpxRepository, type SpxOrderPatcher } from "@/api-client/spx-sync";
import {
	advanceSpxCursor, createSpxBudget, startSpxCursor,
	SPX_DRAFT_BATCH_SIZE, SPX_ORDER_BATCH_SIZE, type SpxCheckpoint,
} from "@/utils/spx/checkpoint";
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
	mapWithConcurrency,
	SANITY_DRAFT_PUBLISH_CONCURRENCY,
	SPX_SYNC_CONCURRENCY,
} from "@/utils/spx/sync";
import { fetchSpxTracking } from "@/utils/spx/tracking";
import { formatSpxSyncErrorMessage } from "@/utils/telegram/formatSpxSyncErrorMessage";
import { TelegramClient, sendWithRetry } from "@/utils/telegram";
import { validateTelegramCredentials } from "@/utils/telegram/validateTelegramEnv";
import { getDeploymentChannel } from "@/utils/deployment-channel";
import { timingSafeTextEqual } from "@/utils/worker-crypto";
import { requireServerEnv } from "@/utils/server-env";

const CRON_JOB_TIMEOUT_MS = 30000;
const DEFAULT_FUNCTION_TIMEOUT_MS = 30000;
const RESPONSE_RESERVE_MS = 750;
const TELEGRAM_RESERVE_MS = 4000;
const CHECKPOINT_RESERVE_MS = 1500;
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
	hasMore?: boolean;
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
	cancelled: number;
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
	hasMore: boolean;
};

type AuthorizedRunDependencies = ReturnType<typeof createSpxRepository> & {
	processEligibleOrder: (order: EligibleSpxOrder, deadline: number) => Promise<ProcessedOrder>;
	sendAlert: typeof sendFailureAlert;
};

function createEmptySummary(queried = 0): SpxSyncSummary {
	return {
		queried,
		checked: 0,
		changed: 0,
		completed: 0,
		cancelled: 0,
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
	return timingSafeTextEqual(configured, provided);
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
	publishDraftOrder: AuthorizedRunDependencies["publishDraftOrder"]
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
	workDeadlineAt: number,
	patchOrder: SpxOrderPatcher,
): Promise<MutationOutcome> {
	if (!decision.shouldMutate) return { kind: "not_needed" };
	if (Date.now() + 250 >= workDeadlineAt) {
		return {
			kind: "error",
			errorCode: SPX_SYNC_ERROR_CODES.SANITY_UPDATE_TIMEOUT,
		};
	}

	try {
		await patchOrder(
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
		cancelled: 0,
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
	workDeadlineAt: number,
	patchOrder: SpxOrderPatcher,
): Promise<ProcessedOrder> {
	const processed = createBaseProcessedOrder(order._id);
	const errorCode = providerResult.errorCode as SpxPersistedErrorCode;
	const decision = decideFailedSpxSync(order, errorCode);
	const mutation = await applyDecision(order, decision, workDeadlineAt, patchOrder);

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
	workDeadlineAt: number,
	patchOrder: SpxOrderPatcher,
): Promise<ProcessedOrder> {
	const processed = createBaseProcessedOrder(order._id);
	const decision = decideSuccessfulSpxSync(order, providerResult.snapshot);
	const mutation = await applyDecision(order, decision, workDeadlineAt, patchOrder);

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
	processed.cancelled = decision.type === "cancel_order" ? 1 : 0;
	processed.result = {
		orderId: order._id,
		result:
			decision.type === "complete_order"
				? "completed"
				: decision.type === "cancel_order"
				? "cancelled"
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
	workDeadlineAt: number,
	patchOrder: SpxOrderPatcher,
	fetchImpl: typeof fetch,
): Promise<ProcessedOrder> {
	try {
		const providerResult = await fetchSpxTracking(order.trackingNumber, {
			fetchImpl,
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
			return processSuccessfulLookup(order, providerResult, workDeadlineAt, patchOrder);
		}
		return processProviderError(order, providerResult, workDeadlineAt, patchOrder);
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
		summary.cancelled += processed.cancelled;
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
	responseDeadlineAt: number,
	fetchImpl?: typeof fetch,
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
		environment: getDeploymentChannel(),
		summary,
		publishing,
		failures,
	});
	const telegram = new TelegramClient(botToken, fetchImpl);
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
	hasMore: boolean,
	error?: string
) {
	return res.status(httpStatus).json({
		success: httpStatus === 200,
		...(error ? { error } : {}),
		startedAt: startedAt.toISOString(),
		finishedAt: new Date().toISOString(),
		summary,
		publishing,
		hasMore,
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
	fetchImpl?: typeof fetch;
}): Promise<AuthorizedRunResult> {
	const budget = createSpxBudget(input.fetchImpl);
	const repository = createSpxRepository(budget.fetch);
	const dependencies: AuthorizedRunDependencies = {
		...repository,
		processEligibleOrder: (order, deadline) => processOrder(order, deadline, repository.patchOrder, budget.fetch),
		sendAlert: (failures, summary, publishing, startedAt, deadline) =>
			sendFailureAlert(failures, summary, publishing, startedAt, deadline, budget.fetch),
		...input.dependencies,
	};
	const processingDeadlineAt = input.workDeadlineAt - CHECKPOINT_RESERVE_MS;
	const publishDeadlineAt = getDraftPublishDeadlineAt(processingDeadlineAt);
	let checkpoint: SpxCheckpoint | undefined;
	let summary = createEmptySummary();
	let publishing = createEmptyPublishingSummary();
	let results: SpxOrderSyncResult[] = [];
	const failures: SpxFailureRecord[] = [];
	let hasMore = false;
	let sanityFailure = false;
	let transientProviderFailure = false;
	let error: string | undefined;

	async function finish(): Promise<AuthorizedRunResult> {
		if (checkpoint) {
			try {
				await dependencies.saveCheckpoint(checkpoint, getRemainingTimeout(input.workDeadlineAt, CHECKPOINT_RESERVE_MS));
			} catch {
				sanityFailure = true;
				error = "checkpoint_failed";
				summary.failed += 1;
				summary.attentionRequired += 1;
				failures.push({ phase: "orchestration", errorCode: SPX_SYNC_ERROR_CODES.CHECKPOINT_ERROR });
			}
		}
		const alert = await dependencies.sendAlert(
			failures, summary, publishing, input.startedAt, input.responseDeadlineAt
		);
		return {
			httpStatus: getSpxSyncHttpStatus({ sanityFailure, transientProviderFailure }),
			error, summary, publishing, results, alert, hasMore,
		};
	}

	try {
		checkpoint = await dependencies.readCheckpoint(getRemainingTimeout(publishDeadlineAt, MAX_SANITY_TIMEOUT_MS));
	} catch {
		sanityFailure = true;
		error = "checkpoint_failed";
		summary.failed = 1;
		summary.attentionRequired = 1;
		failures.push({ phase: "orchestration", errorCode: SPX_SYNC_ERROR_CODES.CHECKPOINT_ERROR });
		return finish();
	}

	const draftCursor = startSpxCursor(checkpoint.drafts, input.startedAt);
	try {
		if (Date.now() + 250 >= publishDeadlineAt) {
			hasMore = true;
		} else {
			const drafts = await dependencies.getDraftOrders(
				getRemainingTimeout(publishDeadlineAt, MAX_SANITY_TIMEOUT_MS), draftCursor,
			);
			const selected = drafts.slice(0, SPX_DRAFT_BATCH_SIZE);
			const outcomes = await mapWithConcurrency(selected, SANITY_DRAFT_PUBLISH_CONCURRENCY, (draft) =>
				Date.now() + 250 >= publishDeadlineAt
					? Promise.resolve(null)
					: publishDraft(draft, publishDeadlineAt, dependencies.publishDraftOrder)
			);
			const attempted = outcomes.findIndex((outcome) => outcome === null);
			const prefix = attempted < 0 ? outcomes.length : attempted;
			const aggregated = aggregateDraftPublishing(
				selected.filter((_, index) => outcomes[index] !== null),
				outcomes.filter((outcome): outcome is DraftPublishOutcome => outcome !== null),
			);
			publishing = { ...aggregated.publishing, queried: drafts.length };
			results = aggregated.results;
			failures.push(...aggregated.failures);
			summary.failed += publishing.failed;
			summary.attentionRequired += publishing.failed;
			sanityFailure = publishing.failed > 0;
			if (sanityFailure) error = "sanity_publish_failed";
			hasMore ||= drafts.length > prefix;
			checkpoint = { ...checkpoint, drafts: advanceSpxCursor(draftCursor, drafts, prefix) };
		}
	} catch (cause) {
		sanityFailure = true;
		error = "sanity_draft_query_failed";
		summary.failed += 1;
		summary.attentionRequired += 1;
		failures.push({ phase: "sanity_publish", errorCode: classifySanityError(cause, "draft_query") });
		return finish();
	}

	if (Date.now() + 250 >= processingDeadlineAt) {
		hasMore = true;
		return finish();
	}
	const orderCursor = startSpxCursor(checkpoint.orders, input.startedAt);
	let orders: EligibleSpxOrder[];
	try {
		orders = await dependencies.getEligibleOrders(
			getRemainingTimeout(processingDeadlineAt, MAX_SANITY_TIMEOUT_MS), orderCursor,
		);
	} catch (cause) {
		sanityFailure = true;
		error = "sanity_query_failed";
		summary.failed += 1;
		summary.attentionRequired += 1;
		failures.push({ phase: "sanity_query", errorCode: classifySanityError(cause, "query") });
		return finish();
	}
	try {
		const processedOrders = await mapWithConcurrency(
			orders.slice(0, SPX_ORDER_BATCH_SIZE),
			SPX_SYNC_CONCURRENCY,
			(order) => Date.now() + 250 >= processingDeadlineAt
				? Promise.resolve(null)
				: dependencies.processEligibleOrder(order, processingDeadlineAt)
		);
		const attempted = processedOrders.findIndex((result) => result === null);
		const prefix = attempted < 0 ? processedOrders.length : attempted;
		const aggregated = aggregateProcessedOrders(
			orders.length, processedOrders.filter((result): result is ProcessedOrder => result !== null),
		);
		aggregated.summary.failed += publishing.failed;
		aggregated.summary.attentionRequired += publishing.failed;
		summary = aggregated.summary;
		results.push(...aggregated.results);
		failures.push(...aggregated.failures);
		sanityFailure ||= aggregated.sanityFailure;
		transientProviderFailure = aggregated.transientProviderFailure;
		error = sanityFailure
			? publishing.failed > 0
				? aggregated.sanityFailure ? "sanity_publish_and_update_failed" : "sanity_publish_failed"
				: "sanity_update_failed"
			: transientProviderFailure ? "spx_provider_failed" : undefined;
		hasMore ||= orders.length > prefix;
		checkpoint = { ...checkpoint, orders: advanceSpxCursor(orderCursor, orders, prefix) };
	} catch {
		sanityFailure = true;
		error = "orchestration_failed";
		summary.failed += 1;
		summary.attentionRequired += 1;
		failures.push({ phase: "orchestration", errorCode: SPX_SYNC_ERROR_CODES.ORCHESTRATION_ERROR });
	}
	return finish();
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
		process.env.SPX_SYNC_SECRET ? requireServerEnv("SPX_SYNC_SECRET") : undefined,
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
		result.hasMore,
		result.error
	);
}
