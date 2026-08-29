import {
	SPX_SYNC_ERROR_CODES,
	type EligibleSpxOrder,
	type SpxPatchDecision,
	type SpxPersistedErrorCode,
	type SpxTrackingSnapshot,
} from "@/models/spxTracking";

export const SPX_NOTES_START_MARKER = "--- SPX_SYNC_START ---";
export const SPX_NOTES_END_MARKER = "--- SPX_SYNC_END ---";
export const SPX_DESCRIPTION_MAX_LENGTH = 240;

type MarkerInspection =
	| { kind: "none" }
	| { kind: "valid"; startIndex: number; endIndex: number }
	| { kind: "malformed" };

function countOccurrences(value: string, token: string): number {
	let count = 0;
	let offset = 0;
	while (offset < value.length) {
		const index = value.indexOf(token, offset);
		if (index === -1) break;
		count += 1;
		offset = index + token.length;
	}
	return count;
}

function isStandaloneMarker(notes: string, index: number, marker: string): boolean {
	const before = index === 0 ? "" : notes[index - 1];
	const afterIndex = index + marker.length;
	const after = afterIndex === notes.length ? "" : notes[afterIndex];
	return (
		(!before || before === "\n" || before === "\r") &&
		(!after || after === "\n" || after === "\r")
	);
}

export function inspectSpxAdminNotesMarkers(adminNotes?: string): MarkerInspection {
	const notes = adminNotes || "";
	const startCount = countOccurrences(notes, SPX_NOTES_START_MARKER);
	const endCount = countOccurrences(notes, SPX_NOTES_END_MARKER);

	if (startCount === 0 && endCount === 0) return { kind: "none" };
	if (startCount !== 1 || endCount !== 1) return { kind: "malformed" };

	const startIndex = notes.indexOf(SPX_NOTES_START_MARKER);
	const endIndex = notes.indexOf(SPX_NOTES_END_MARKER);
	if (
		startIndex < 0 ||
		endIndex < startIndex + SPX_NOTES_START_MARKER.length ||
		!isStandaloneMarker(notes, startIndex, SPX_NOTES_START_MARKER) ||
		!isStandaloneMarker(notes, endIndex, SPX_NOTES_END_MARKER)
	) {
		return { kind: "malformed" };
	}

	return {
		kind: "valid",
		startIndex,
		endIndex: endIndex + SPX_NOTES_END_MARKER.length,
	};
}

export function sanitizeSpxDescription(description: unknown): string {
	if (typeof description !== "string") return "";

	const sanitized = Array.from(description)
		.map((character) => {
			const code = character.charCodeAt(0);
			return code <= 31 || (code >= 127 && code <= 159) ? " " : character;
		})
		.join("")
		.replace(/---\s*SPX_SYNC_(?:START|END)\s*---/gi, " ")
		.replace(/\s+/g, " ")
		.trim();

	return Array.from(sanitized).slice(0, SPX_DESCRIPTION_MAX_LENGTH).join("");
}

function sanitizeStatusPart(value: string): string {
	return Array.from(
		Array.from(value)
			.map((character) => {
				const code = character.charCodeAt(0);
				return code <= 31 || (code >= 127 && code <= 159) ? " " : character;
			})
			.join("")
			.replace(/---\s*SPX_SYNC_(?:START|END)\s*---/gi, " ")
			.replace(/\s+/g, " ")
			.trim()
	)
		.slice(0, 80)
		.join("");
}

export function formatSpxEventTimeGmt7(eventTimestamp: number): string {
	const shifted = new Date((eventTimestamp + 7 * 60 * 60) * 1000);
	return `${shifted.toISOString().slice(0, 19)}+07:00`;
}

export function buildSpxSyncNote(snapshot: SpxTrackingSnapshot): string {
	const group = sanitizeStatusPart(snapshot.group);
	const subgroup = sanitizeStatusPart(snapshot.subgroup);
	const status = group === subgroup ? group : `${group} / ${subgroup}`;
	const description = sanitizeSpxDescription(snapshot.description);

	return [
		`tracking order status: ${status}${description ? ` - ${description}` : ""}`,
		`updated_time: ${formatSpxEventTimeGmt7(snapshot.eventTimestamp)}`,
		"updated_by: spx-cron-job",
	].join("\n");
}

function leadingLineBreakLength(value: string): number {
	if (value.startsWith("\r\n")) return 2;
	return value.startsWith("\n") || value.startsWith("\r") ? 1 : 0;
}

function trailingLineBreakLength(value: string): number {
	if (value.endsWith("\r\n")) return 2;
	return value.endsWith("\n") || value.endsWith("\r") ? 1 : 0;
}

function stripBoundaryLineBreaks(value: string, boundary: "start" | "end"): string {
	let result = value;
	for (let index = 0; index < 2; index += 1) {
		const length =
			boundary === "start"
				? leadingLineBreakLength(result)
				: trailingLineBreakLength(result);
		if (!length) break;
		result =
			boundary === "start"
				? result.slice(length)
				: result.slice(0, result.length - length);
	}
	return result;
}

export function removeLegacySpxAdminNotesBlock(
	adminNotes: string | undefined
):
	| { kind: "none" }
	| { kind: "removed"; adminNotes: string }
	| { kind: "malformed" } {
	const notes = adminNotes || "";
	const markers = inspectSpxAdminNotesMarkers(notes);

	if (markers.kind === "malformed") return { kind: "malformed" };
	if (markers.kind === "none") return { kind: "none" };

	let prefix = notes.slice(0, markers.startIndex);
	let suffix = notes.slice(markers.endIndex);
	const prefixBreakLength = trailingLineBreakLength(prefix);
	const suffixBreakLength = leadingLineBreakLength(suffix);

	if (prefix && suffix && prefixBreakLength && suffixBreakLength) {
		suffix = suffix.slice(suffixBreakLength);
	} else if (!suffix) {
		prefix = stripBoundaryLineBreaks(prefix, "end");
	} else if (!prefix) {
		suffix = stripBoundaryLineBreaks(suffix, "start");
	}

	return { kind: "removed", adminNotes: prefix + suffix };
}

export function decideSuccessfulSpxSync(
	order: EligibleSpxOrder,
	snapshot: SpxTrackingSnapshot
): SpxPatchDecision {
	const spxSyncNote = buildSpxSyncNote(snapshot);
	const legacyNotes = removeLegacySpxAdminNotesBlock(order.adminNotes);
	const attentionErrorCode =
		legacyNotes.kind === "malformed"
			? SPX_SYNC_ERROR_CODES.MARKER_ERROR
			: undefined;

	const metadataChanged =
		order.spxTrackingNumber !== snapshot.trackingNumber ||
		order.spxTrackingStatus !== snapshot.status ||
		order.spxTrackingEventCode !== snapshot.eventCode ||
		order.spxTrackingEventAt !== snapshot.eventAt;
	const noteChanged = order.spxSyncNote !== spxSyncNote;
	const legacyNotesChanged = legacyNotes.kind === "removed";
	const successfulStateChanged =
		metadataChanged || noteChanged || legacyNotesChanged || snapshot.shouldComplete;

	if (!successfulStateChanged) {
		if (order.spxSyncError) {
			return {
				type: "clear_error",
				shouldMutate: true,
				set: {},
				unset: ["spxSyncError"],
				...(attentionErrorCode ? { attentionErrorCode } : {}),
			};
		}
		return {
			type: "no_change",
			shouldMutate: false,
			set: {},
			unset: [],
			...(attentionErrorCode ? { attentionErrorCode } : {}),
		};
	}

	const set = {
		...(legacyNotes.kind === "removed"
			? { adminNotes: legacyNotes.adminNotes }
			: {}),
		spxSyncNote,
		spxTrackingNumber: snapshot.trackingNumber,
		spxTrackingStatus: snapshot.status,
		spxTrackingEventCode: snapshot.eventCode,
		spxTrackingEventAt: snapshot.eventAt,
		...(snapshot.shouldComplete ? { status: "completed" as const } : {}),
	};

	return {
		type: snapshot.shouldComplete ? "complete_order" : "status_changed",
		shouldMutate: true,
		set,
		unset: order.spxSyncError ? ["spxSyncError"] : [],
		...(attentionErrorCode ? { attentionErrorCode } : {}),
	};
}

export function decideFailedSpxSync(
	order: EligibleSpxOrder,
	errorCode: SpxPersistedErrorCode
): SpxPatchDecision {
	return {
		type: "set_error",
		shouldMutate: order.spxSyncError !== errorCode,
		set: { spxSyncError: errorCode },
		unset: [],
	};
}
