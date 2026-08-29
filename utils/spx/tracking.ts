import {
	SPX_SYNC_ERROR_CODES,
	type SpxProviderResult,
	type SpxTrackingInputResult,
	type SpxTrackingSnapshot,
} from "@/models/spxTracking";

export const SPX_TRACKING_ENDPOINT =
	"https://spx.vn/shipment/order/open/order/get_order_info";
export const SPX_MAX_CODE_LENGTH = 37;
export const SPX_MAX_INPUT_LENGTH = 2048;
export const SPX_MAX_RESPONSE_BYTES = 256 * 1024;
export const SPX_MAX_TRACKING_RECORDS = 200;

const SPX_CODE_PATTERN = /^SPXVN\d{1,32}$/i;
const SPX_CODE_CANDIDATE_PATTERN = /SPXVN\d+/gi;
const MIN_EVENT_TIMESTAMP = 946684800; // 2000-01-01T00:00:00Z
const MAX_EVENT_TIMESTAMP = 4102444800; // 2100-01-01T00:00:00Z
const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_MAX_ATTEMPTS = 2;
const MIN_RETRY_BUDGET_MS = 250;

type SpxUpstreamRecord = {
	tracking_code?: unknown;
	tracking_name?: unknown;
	description?: unknown;
	seller_description?: unknown;
	milestone_name?: unknown;
	actual_time?: unknown;
};

type SpxFetchOptions = {
	fetchImpl?: typeof fetch;
	timeoutMs?: number;
	maxAttempts?: number;
	deadlineAt?: number;
	now?: () => number;
};

function getSkipReason(value: string): "not_spx" | "invalid_spx" {
	return /^SPXVN/i.test(value) ? "invalid_spx" : "not_spx";
}

function collectCodes(value: string): string[] {
	const matches = value.match(SPX_CODE_CANDIDATE_PATTERN) || [];
	return matches.map((match) => match.toUpperCase());
}

export function parseSpxTrackingInput(input: unknown): SpxTrackingInputResult {
	if (typeof input !== "string") {
		return { kind: "skip", reason: "not_spx" };
	}

	const value = input.trim();
	if (!value || value.length > SPX_MAX_INPUT_LENGTH) {
		return { kind: "skip", reason: getSkipReason(value) };
	}

	if (!value.includes("://")) {
		if (!SPX_CODE_PATTERN.test(value) || value.length > SPX_MAX_CODE_LENGTH) {
			return { kind: "skip", reason: getSkipReason(value) };
		}
		return { kind: "valid", trackingNumber: value.toUpperCase() };
	}

	let parsedUrl: URL;
	try {
		parsedUrl = new URL(value);
	} catch {
		return { kind: "skip", reason: "not_spx" };
	}

	if (
		parsedUrl.protocol !== "https:" ||
		!["spx.vn", "www.spx.vn"].includes(parsedUrl.hostname.toLowerCase())
	) {
		return { kind: "skip", reason: "not_spx" };
	}

	const candidates: string[] = [];
	parsedUrl.searchParams.forEach((parameterValue, parameterKey) => {
		candidates.push(...collectCodes(parameterKey), ...collectCodes(parameterValue));
	});

	const uniqueCodes = Array.from(new Set(candidates));
	if (uniqueCodes.length === 0) {
		return { kind: "skip", reason: "invalid_spx" };
	}
	if (uniqueCodes.length > 1) {
		return { kind: "skip", reason: "ambiguous_spx" };
	}
	if (
		!SPX_CODE_PATTERN.test(uniqueCodes[0]) ||
		uniqueCodes[0].length > SPX_MAX_CODE_LENGTH
	) {
		return { kind: "skip", reason: "invalid_spx" };
	}

	return { kind: "valid", trackingNumber: uniqueCodes[0] };
}

function singleLine(value: unknown, maxLength: number): string {
	if (typeof value !== "string") return "";
	return Array.from(
		Array.from(value)
			.map((character) => {
				const code = character.charCodeAt(0);
				return code <= 31 || (code >= 127 && code <= 159) ? " " : character;
			})
			.join("")
			.replace(/\s+/g, " ")
			.trim()
	)
		.slice(0, maxLength)
		.join("");
}

function statusToken(value: unknown): string {
	return singleLine(value, 80)
		.toLowerCase()
		.replace(/[\s_-]+/g, "");
}

function isDeliveredSignal(value: unknown): boolean {
	return statusToken(value) === "delivered";
}

function isReturnSignal(value: unknown): boolean {
	const token = statusToken(value);
	return token === "return" || token === "returning" || token === "returned";
}

function isValidTimestamp(value: unknown): value is number {
	return (
		typeof value === "number" &&
		Number.isInteger(value) &&
		value > 0 &&
		value >= MIN_EVENT_TIMESTAMP &&
		value < MAX_EVENT_TIMESTAMP
	);
}

function createFingerprint(snapshot: Omit<SpxTrackingSnapshot, "fingerprint">): string {
	return JSON.stringify([
		snapshot.trackingNumber,
		snapshot.group,
		snapshot.subgroup,
		snapshot.eventCode,
		snapshot.eventTimestamp,
		snapshot.description,
	]);
}

export function normalizeSpxProviderResponse(
	payload: unknown,
	trackingNumber: string
): SpxProviderResult {
	if (!payload || typeof payload !== "object") {
		return { kind: "invalid_response", errorCode: SPX_SYNC_ERROR_CODES.INVALID_RESPONSE };
	}

	const response = payload as {
		retcode?: unknown;
		data?: {
			order_info?: {
				tracking_code_group_name?: unknown;
				tracking_code_subgroup_name?: unknown;
			};
			sls_tracking_info?: { records?: unknown };
		};
	};

	if (typeof response.retcode !== "number") {
		return { kind: "invalid_response", errorCode: SPX_SYNC_ERROR_CODES.INVALID_RESPONSE };
	}
	if (response.retcode !== 0) {
		return { kind: "data_error", errorCode: SPX_SYNC_ERROR_CODES.NOT_FOUND };
	}

	const orderInfo = response.data?.order_info;
	const records = response.data?.sls_tracking_info?.records;
	const group = singleLine(orderInfo?.tracking_code_group_name, 80);
	const subgroup = singleLine(orderInfo?.tracking_code_subgroup_name, 80);

	if (
		!group ||
		!subgroup ||
		!Array.isArray(records) ||
		records.length === 0 ||
		records.length > SPX_MAX_TRACKING_RECORDS
	) {
		return { kind: "invalid_response", errorCode: SPX_SYNC_ERROR_CODES.INVALID_RESPONSE };
	}

	const typedRecords = records as SpxUpstreamRecord[];
	if (typedRecords.some((record) => !isValidTimestamp(record?.actual_time))) {
		return { kind: "invalid_response", errorCode: SPX_SYNC_ERROR_CODES.INVALID_RESPONSE };
	}
	const validRecords = typedRecords as Array<SpxUpstreamRecord & { actual_time: number }>;

	const newestTimestamp = Math.max(
		...validRecords.map((record) => record.actual_time as number)
	);
	const newestRecords = validRecords.filter(
		(record) => record.actual_time === newestTimestamp
	);
	const latest = [...newestRecords].sort((left, right) => {
		const leftKey = [
			left.tracking_code,
			left.tracking_name,
			left.milestone_name,
			left.seller_description,
			left.description,
		]
			.map((value) => singleLine(value, 240))
			.join("\u0000");
		const rightKey = [
			right.tracking_code,
			right.tracking_name,
			right.milestone_name,
			right.seller_description,
			right.description,
		]
			.map((value) => singleLine(value, 240))
			.join("\u0000");
		return leftKey.localeCompare(rightKey);
	})[newestRecords.length - 1];
	const eventCode = singleLine(latest.tracking_code, 40);
	const description = singleLine(
		latest.seller_description ||
			latest.description ||
			latest.tracking_name ||
			latest.milestone_name,
		240
	);

	if (!eventCode || !description) {
		return { kind: "invalid_response", errorCode: SPX_SYNC_ERROR_CODES.INVALID_RESPONSE };
	}

	const structuredSignals = [
		group,
		subgroup,
		...newestRecords.flatMap((record) => [
			record.tracking_name,
			record.milestone_name,
		]),
	];
	const hasDeliveredSignal = structuredSignals.some(isDeliveredSignal);
	const hasReturnSignal = structuredSignals.some(isReturnSignal);

	if (hasDeliveredSignal && hasReturnSignal) {
		return { kind: "data_error", errorCode: SPX_SYNC_ERROR_CODES.STATUS_CONFLICT };
	}

	const eventTimestamp = latest.actual_time as number;
	const status = group === subgroup ? group : `${group} / ${subgroup}`;
	const snapshotWithoutFingerprint: Omit<SpxTrackingSnapshot, "fingerprint"> = {
		trackingNumber,
		group,
		subgroup,
		status,
		eventCode,
		eventTimestamp,
		eventAt: new Date(eventTimestamp * 1000).toISOString(),
		description,
		shouldComplete:
			isDeliveredSignal(group) && isDeliveredSignal(subgroup) && !hasReturnSignal,
	};

	return {
		kind: "success",
		snapshot: {
			...snapshotWithoutFingerprint,
			fingerprint: createFingerprint(snapshotWithoutFingerprint),
		},
	};
}

function canRetry(attempt: number, maxAttempts: number, deadlineAt: number, now: () => number) {
	return attempt < maxAttempts && deadlineAt - now() > MIN_RETRY_BUDGET_MS;
}

async function readBoundedJsonResponse(response: Response): Promise<unknown> {
	const contentLength = Number(response.headers?.get("content-length"));
	if (Number.isFinite(contentLength) && contentLength > SPX_MAX_RESPONSE_BYTES) {
		throw new Error("SPX_RESPONSE_TOO_LARGE");
	}

	if (typeof response.text === "function") {
		const responseText = await response.text();
		if (responseText.length > SPX_MAX_RESPONSE_BYTES) {
			throw new Error("SPX_RESPONSE_TOO_LARGE");
		}
		return JSON.parse(responseText);
	}

	return response.json();
}

export async function fetchSpxTracking(
	input: unknown,
	options: SpxFetchOptions = {}
): Promise<SpxProviderResult> {
	const parsed = parseSpxTrackingInput(input);
	if (parsed.kind === "skip") return parsed;

	const fetchImpl = options.fetchImpl || fetch;
	const now = options.now || Date.now;
	const timeoutMs = Math.max(1, options.timeoutMs || DEFAULT_TIMEOUT_MS);
	const maxAttempts = Math.max(
		1,
		Math.min(DEFAULT_MAX_ATTEMPTS, options.maxAttempts || DEFAULT_MAX_ATTEMPTS)
	);
	const deadlineAt = options.deadlineAt || now() + timeoutMs * maxAttempts + 1000;
	const requestUrl = new URL(SPX_TRACKING_ENDPOINT);
	requestUrl.searchParams.set("spx_tn", parsed.trackingNumber);
	requestUrl.searchParams.set("language_code", "vi");

	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
		const remainingMs = deadlineAt - now();
		if (remainingMs <= MIN_RETRY_BUDGET_MS) {
			return { kind: "transient_error", errorCode: SPX_SYNC_ERROR_CODES.TIMEOUT };
		}

		const controller = new AbortController();
		const requestTimeoutMs = Math.max(1, Math.min(timeoutMs, remainingMs - 100));
		const timeoutHandle = setTimeout(() => controller.abort(), requestTimeoutMs);

		try {
			const response = await fetchImpl(requestUrl.toString(), {
				method: "GET",
				headers: { Accept: "application/json" },
				signal: controller.signal,
			});

			if (!response.ok) {
				if (
					response.status >= 500 &&
					canRetry(attempt, maxAttempts, deadlineAt, now)
				) {
					continue;
				}
				return { kind: "transient_error", errorCode: SPX_SYNC_ERROR_CODES.HTTP_ERROR };
			}

			let payload: unknown;
			try {
				payload = await readBoundedJsonResponse(response);
			} catch {
				return {
					kind: "invalid_response",
					errorCode: SPX_SYNC_ERROR_CODES.INVALID_RESPONSE,
				};
			}

			return normalizeSpxProviderResponse(payload, parsed.trackingNumber);
		} catch (error) {
			const isTimeout =
				controller.signal.aborted ||
				(error instanceof Error && error.name === "AbortError");
			const errorCode = isTimeout
				? SPX_SYNC_ERROR_CODES.TIMEOUT
				: SPX_SYNC_ERROR_CODES.NETWORK_ERROR;

			if (canRetry(attempt, maxAttempts, deadlineAt, now)) {
				continue;
			}
			return { kind: "transient_error", errorCode };
		} finally {
			clearTimeout(timeoutHandle);
		}
	}

	return { kind: "transient_error", errorCode: SPX_SYNC_ERROR_CODES.NETWORK_ERROR };
}
