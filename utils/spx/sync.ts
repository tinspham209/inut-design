import {
	SPX_SYNC_ERROR_CODES,
	type DraftOrderDocument,
	type SpxSyncErrorCode,
} from "@/models/spxTracking";
import type { Mutation } from "@sanity/client";

export const SPX_MAX_ELIGIBLE_ORDERS = 25;
export const SPX_ELIGIBLE_ORDER_QUERY_LIMIT = 26;
export const SPX_SYNC_CONCURRENCY = 5;
export const SANITY_DRAFT_PUBLISH_CONCURRENCY = 3;

export const SANITY_DRAFT_ORDERS_QUERY = `*[
  _type == "ordersLighter" &&
  _id in path("drafts.**")
] | order(_id asc) {
  ...
}`;

export const SPX_ELIGIBLE_ORDERS_QUERY = `*[
  _type == "ordersLighter" &&
  !(_id in path("drafts.**")) &&
  status == "in_transit" &&
  defined(trackingNumber) &&
  trackingNumber != ""
] | order(_createdAt asc) [0...26] {
  _id,
  _rev,
  orderNumber,
  status,
  trackingNumber,
  adminNotes,
  spxSyncNote,
  spxTrackingNumber,
  spxTrackingStatus,
  spxTrackingEventCode,
  spxTrackingEventAt,
  spxSyncError
}`;

const SERVER_MANAGED_SPX_FIELDS = [
	"spxSyncNote",
	"spxTrackingNumber",
	"spxTrackingStatus",
	"spxTrackingEventCode",
	"spxTrackingEventAt",
	"spxSyncError",
] as const;

export function stripServerManagedSpxFields<T extends Record<string, unknown>>(input: T): T {
	const sanitized = { ...input };
	SERVER_MANAGED_SPX_FIELDS.forEach((field) => {
		delete sanitized[field];
	});
	return sanitized;
}

export function hasSpxCapacityOverflow(orderCount: number): boolean {
	return orderCount >= SPX_ELIGIBLE_ORDER_QUERY_LIMIT;
}

export function getPublishedOrderId(draftId: string): string | null {
	if (!draftId.startsWith("drafts.")) return null;
	const publishedId = draftId.slice("drafts.".length);
	return publishedId || null;
}

export function buildDraftPublishMutations(draft: DraftOrderDocument): Mutation[] {
	const publishedId = getPublishedOrderId(draft._id);
	if (!publishedId || draft._type !== "ordersLighter" || !draft._rev) {
		throw new Error("INVALID_ORDERS_LIGHTER_DRAFT");
	}

	const {
		_id: _draftId,
		_rev: _draftRevision,
		_updatedAt: _draftUpdatedAt,
		spxCronPublishGuard: _existingGuard,
		...documentFields
	} = draft;
	const publishedDocument = {
		...documentFields,
		_id: publishedId,
		_type: "ordersLighter" as const,
	};

	// Client v3.4.1 has no document publish action. This first patch is the
	// optimistic concurrency guard for the atomic mutation array. If the draft
	// revision changed after discovery, Sanity rejects the whole transaction, so
	// neither the published replacement nor draft deletion is committed. The
	// temporary guard never persists because the same transaction deletes the draft.
	return [
		{
			patch: {
				id: draft._id,
				ifRevisionID: draft._rev,
				set: { spxCronPublishGuard: draft._rev },
			},
		},
		{ createOrReplace: publishedDocument },
		{ delete: { id: draft._id } },
	];
}

export function authorizeSpxCronRequest(
	method: string | undefined,
	configuredSecret: string | undefined,
	providedSecret: string | undefined,
	secretsMatch: (configured: string, provided: string) => boolean
): "authorized" | "method_not_allowed" | "server_misconfigured" | "unauthorized" {
	if (method !== "POST") return "method_not_allowed";
	if (!configuredSecret) return "server_misconfigured";
	if (!providedSecret || !secretsMatch(configuredSecret, providedSecret)) return "unauthorized";
	return "authorized";
}

export async function mapWithConcurrency<T, R>(
	items: T[],
	concurrency: number,
	mapper: (item: T, index: number) => Promise<R>
): Promise<R[]> {
	const results = new Array<R>(items.length);
	let nextIndex = 0;
	const workerCount = Math.min(Math.max(1, concurrency), items.length);

	await Promise.all(
		Array.from({ length: workerCount }, async () => {
			while (nextIndex < items.length) {
				const index = nextIndex;
				nextIndex += 1;
				results[index] = await mapper(items[index], index);
			}
		})
	);

	return results;
}

export function getSpxSyncHttpStatus(input: {
	capacityOverflow?: boolean;
	sanityFailure?: boolean;
	transientProviderFailure?: boolean;
}): number {
	if (input.sanityFailure) return 500;
	if (input.capacityOverflow) return 409;
	if (input.transientProviderFailure) return 502;
	return 200;
}

export function classifySanityError(
	error: unknown,
	phase: "draft_query" | "draft_publish" | "query" | "update"
): SpxSyncErrorCode {
	const candidate = error as {
		statusCode?: number;
		response?: { statusCode?: number; status?: number };
		name?: string;
		message?: string;
		code?: string;
	};
	const statusCode =
		candidate?.statusCode || candidate?.response?.statusCode || candidate?.response?.status;
	const isTimeout =
		candidate?.name === "AbortError" ||
		["ESOCKETTIMEDOUT", "ETIMEDOUT"].includes(candidate?.code || "") ||
		(typeof candidate?.message === "string" &&
			(candidate.message.toLowerCase().includes("timeout") ||
				candidate.message.toLowerCase().includes("timed out")));

	if (phase === "draft_publish" && statusCode === 409) {
		return SPX_SYNC_ERROR_CODES.SANITY_DRAFT_REVISION_CONFLICT;
	}
	if (phase === "update" && statusCode === 409) {
		return SPX_SYNC_ERROR_CODES.SANITY_REVISION_CONFLICT;
	}
	if (phase === "draft_query") {
		return isTimeout
			? SPX_SYNC_ERROR_CODES.SANITY_DRAFT_QUERY_TIMEOUT
			: SPX_SYNC_ERROR_CODES.SANITY_DRAFT_QUERY_ERROR;
	}
	if (phase === "draft_publish") {
		return isTimeout
			? SPX_SYNC_ERROR_CODES.SANITY_DRAFT_PUBLISH_TIMEOUT
			: SPX_SYNC_ERROR_CODES.SANITY_DRAFT_PUBLISH_ERROR;
	}
	if (phase === "query") {
		return isTimeout
			? SPX_SYNC_ERROR_CODES.SANITY_QUERY_TIMEOUT
			: SPX_SYNC_ERROR_CODES.SANITY_QUERY_ERROR;
	}
	return isTimeout
		? SPX_SYNC_ERROR_CODES.SANITY_UPDATE_TIMEOUT
		: SPX_SYNC_ERROR_CODES.SANITY_UPDATE_ERROR;
}
