import {
	SPX_SYNC_ERROR_CODES,
	type DraftPublishingSummary,
	type SpxFailureRecord,
	type SpxSyncSummary,
} from "@/models/spxTracking";

const MAX_MESSAGE_LENGTH = 3500;
const MAX_AFFECTED_ORDERS = 10;
const SANITY_STUDIO_BASE_URL = "https://inut-design.sanity.studio/desk/ordersLighter";

function escapeHtml(value: unknown): string {
	return String(value ?? "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function boundedText(value: unknown, maxLength: number): string {
	const withoutControls = Array.from(String(value ?? ""))
		.map((character) => {
			const code = character.charCodeAt(0);
			return code <= 31 || (code >= 127 && code <= 159) ? " " : character;
		})
		.join("");
	return Array.from(withoutControls)
		.slice(0, maxLength)
		.join("");
}

function formatRunTimeGmt7(timestamp: Date): string {
	const shifted = new Date(timestamp.getTime() + 7 * 60 * 60 * 1000);
	return `${shifted.toISOString().slice(0, 19)}+07:00`;
}

type GroupedFailure = {
	orderId?: string;
	orderNumber?: string;
	errorCodes: string[];
};

function groupFailures(failures: SpxFailureRecord[]): GroupedFailure[] {
	const groups = new Map<string, GroupedFailure>();

	failures.forEach((failure) => {
		const key = failure.orderId ? `order:${failure.orderId}` : "run";
		const existing = groups.get(key) || {
			orderId: failure.orderId,
			orderNumber: failure.orderNumber,
			errorCodes: [],
		};
		if (!existing.errorCodes.includes(failure.errorCode)) {
			existing.errorCodes.push(failure.errorCode);
		}
		if (!existing.orderNumber && failure.orderNumber) {
			existing.orderNumber = failure.orderNumber;
		}
		groups.set(key, existing);
	});

	return Array.from(groups.values());
}

function formatFailure(failure: GroupedFailure): string {
	const identifier = boundedText(failure.orderNumber || failure.orderId || "run", 80);
	const errorCodes = failure.errorCodes
		.map((errorCode) => boundedText(errorCode, 64))
		.join(", ");

	if (failure.orderId) {
		const url = `${SANITY_STUDIO_BASE_URL};${encodeURIComponent(
			boundedText(failure.orderId, 100)
		)}`;
		return `  - <a href="${escapeHtml(url)}">${escapeHtml(identifier)}</a> — ${escapeHtml(
			errorCodes
		)}`;
	}
	return `  - ${escapeHtml(identifier)} — ${escapeHtml(errorCodes)}`;
}

export function formatSpxSyncErrorMessage(input: {
	runTime: Date;
	environment: string;
	summary: SpxSyncSummary;
	publishing?: DraftPublishingSummary;
	failures: SpxFailureRecord[];
}): string {
	const phases = Array.from(new Set(input.failures.map((failure) => failure.phase))).join(" | ");
	const environment = boundedText(input.environment || "unknown", 40);
	const includesPublishingFailure = input.failures.some(
		(failure) => failure.phase === "sanity_publish"
	);
	const onlyLegacyMarkerAttention = input.failures.every(
		(failure) => failure.errorCode === SPX_SYNC_ERROR_CODES.MARKER_ERROR
	);
	const action = onlyLegacyMarkerAttention
		? "Repair the malformed legacy SPX marker block in Admin Notes; automated SPX updates continue in the dedicated field."
		: includesPublishingFailure
		? "Resolve Sanity draft conflicts or write access, review other affected phases, then retry the cron."
		: "Review the affected order and SPX/Sanity availability, then retry on the next safe run.";
	const groupedFailures = groupFailures(input.failures);
	let visibleCount = Math.min(MAX_AFFECTED_ORDERS, groupedFailures.length);

	const buildMessage = (count: number) => {
		const visibleFailures = groupedFailures.slice(0, count);
		const omittedCount = groupedFailures.length - visibleFailures.length;
		const affectedLines = visibleFailures.map(formatFailure);
		if (omittedCount > 0) {
			affectedLines.push(`  - ${omittedCount} additional affected order(s) omitted`);
		}

		return [
			"🚨 <b>SPX ORDER SYNC ERROR / ATTENTION</b>",
			`run_time: ${escapeHtml(formatRunTimeGmt7(input.runTime))}`,
			`environment: ${escapeHtml(environment)}`,
			`phases: ${escapeHtml(phases || "orchestration")}`,
			...(input.publishing
				? [
						`publishing: ${input.publishing.queried} queried / ${input.publishing.attempted} attempted / ${input.publishing.published} published / ${input.publishing.failed} failed`,
				  ]
				: []),
			`summary: ${input.summary.checked} checked / ${input.summary.changed} updated / ${input.summary.completed} completed / ${input.summary.failed} failed / ${input.summary.attentionRequired} attention required`,
			"affected_orders:",
			...(affectedLines.length ? affectedLines : ["  - run — SPX_ORCHESTRATION_ERROR"]),
			`action: ${escapeHtml(action)}`,
		].join("\n");
	};

	let message = buildMessage(visibleCount);
	while (message.length > MAX_MESSAGE_LENGTH && visibleCount > 0) {
		visibleCount -= 1;
		message = buildMessage(visibleCount);
	}

	return message;
}
