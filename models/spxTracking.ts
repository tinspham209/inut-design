export const SPX_SYNC_ERROR_CODES = {
	NOT_FOUND: "SPX_NOT_FOUND",
	TIMEOUT: "SPX_TIMEOUT",
	HTTP_ERROR: "SPX_HTTP_ERROR",
	NETWORK_ERROR: "SPX_NETWORK_ERROR",
	INVALID_RESPONSE: "SPX_INVALID_RESPONSE",
	STATUS_CONFLICT: "SPX_STATUS_CONFLICT",
	MARKER_ERROR: "SPX_MARKER_ERROR",
	CAPACITY_EXCEEDED: "SPX_CAPACITY_EXCEEDED",
	SANITY_DRAFT_QUERY_TIMEOUT: "SANITY_DRAFT_QUERY_TIMEOUT",
	SANITY_DRAFT_QUERY_ERROR: "SANITY_DRAFT_QUERY_ERROR",
	SANITY_DRAFT_PUBLISH_TIMEOUT: "SANITY_DRAFT_PUBLISH_TIMEOUT",
	SANITY_DRAFT_PUBLISH_ERROR: "SANITY_DRAFT_PUBLISH_ERROR",
	SANITY_DRAFT_REVISION_CONFLICT: "SANITY_DRAFT_REVISION_CONFLICT",
	SANITY_QUERY_TIMEOUT: "SANITY_QUERY_TIMEOUT",
	SANITY_QUERY_ERROR: "SANITY_QUERY_ERROR",
	SANITY_UPDATE_TIMEOUT: "SANITY_UPDATE_TIMEOUT",
	SANITY_UPDATE_ERROR: "SANITY_UPDATE_ERROR",
	SANITY_REVISION_CONFLICT: "SANITY_REVISION_CONFLICT",
	ORCHESTRATION_ERROR: "SPX_ORCHESTRATION_ERROR",
} as const;

export type SpxSyncErrorCode =
	(typeof SPX_SYNC_ERROR_CODES)[keyof typeof SPX_SYNC_ERROR_CODES];

export type SpxPersistedErrorCode =
	| typeof SPX_SYNC_ERROR_CODES.NOT_FOUND
	| typeof SPX_SYNC_ERROR_CODES.TIMEOUT
	| typeof SPX_SYNC_ERROR_CODES.HTTP_ERROR
	| typeof SPX_SYNC_ERROR_CODES.NETWORK_ERROR
	| typeof SPX_SYNC_ERROR_CODES.INVALID_RESPONSE
	| typeof SPX_SYNC_ERROR_CODES.STATUS_CONFLICT
	| typeof SPX_SYNC_ERROR_CODES.MARKER_ERROR;

export type SpxTrackingSkipReason = "not_spx" | "invalid_spx" | "ambiguous_spx";

export type SpxTrackingInputResult =
	| { kind: "valid"; trackingNumber: string }
	| {
			kind: "skip";
			reason: SpxTrackingSkipReason;
	  };

export type SpxTrackingSnapshot = {
	trackingNumber: string;
	group: string;
	subgroup: string;
	status: string;
	eventCode: string;
	eventTimestamp: number;
	eventAt: string;
	description: string;
	fingerprint: string;
	// Mutually exclusive terminal outcomes. Both are computed defensively so that
	// they can never be true at the same time (see utils/spx/tracking.ts).
	shouldComplete: boolean;
	shouldCancel: boolean;
};

export type SpxProviderResult =
	| { kind: "success"; snapshot: SpxTrackingSnapshot }
	| { kind: "skip"; reason: SpxTrackingSkipReason }
	| {
			kind: "data_error";
			errorCode:
				| typeof SPX_SYNC_ERROR_CODES.NOT_FOUND
				| typeof SPX_SYNC_ERROR_CODES.STATUS_CONFLICT;
	  }
	| {
			kind: "transient_error";
			errorCode:
				| typeof SPX_SYNC_ERROR_CODES.TIMEOUT
				| typeof SPX_SYNC_ERROR_CODES.HTTP_ERROR
				| typeof SPX_SYNC_ERROR_CODES.NETWORK_ERROR;
	  }
	| {
			kind: "invalid_response";
			errorCode: typeof SPX_SYNC_ERROR_CODES.INVALID_RESPONSE;
	  };

export type EligibleSpxOrder = {
	_id: string;
	_rev: string;
	orderNumber?: string;
	status: "in_transit";
	trackingNumber: string;
	adminNotes?: string;
	spxSyncNote?: string;
	spxTrackingNumber?: string;
	spxTrackingStatus?: string;
	spxTrackingEventCode?: string;
	spxTrackingEventAt?: string;
	spxSyncError?: SpxPersistedErrorCode | string;
};

export type DraftOrderDocument = Record<string, unknown> & {
	_id: string;
	_rev: string;
	_type: "ordersLighter";
	_createdAt?: string;
	_updatedAt?: string;
	orderNumber?: string;
};

export type SpxPatchValues = {
	adminNotes?: string;
	spxSyncNote?: string;
	spxTrackingNumber?: string;
	spxTrackingStatus?: string;
	spxTrackingEventCode?: string;
	spxTrackingEventAt?: string;
	spxSyncError?: SpxPersistedErrorCode;
	status?: "completed" | "cancelled";
};

export type SpxPatchDecision =
	| {
			type: "no_change";
			shouldMutate: false;
			set: Record<string, never>;
			unset: [];
			attentionErrorCode?: typeof SPX_SYNC_ERROR_CODES.MARKER_ERROR;
	  }
	| {
			type: "status_changed" | "complete_order" | "cancel_order";
			shouldMutate: true;
			set: SpxPatchValues;
			unset: string[];
			attentionErrorCode?: typeof SPX_SYNC_ERROR_CODES.MARKER_ERROR;
	  }
	| {
			type: "set_error";
			shouldMutate: boolean;
			set: { spxSyncError: SpxPersistedErrorCode };
			unset: [];
			attentionErrorCode?: never;
	  }
	| {
			type: "clear_error";
			shouldMutate: true;
			set: Record<string, never>;
			unset: ["spxSyncError"];
			attentionErrorCode?: typeof SPX_SYNC_ERROR_CODES.MARKER_ERROR;
	  };

export type SpxFailurePhase =
	| "spx_api"
	| "sanity_publish"
	| "sanity_query"
	| "sanity_update"
	| "orchestration";

export type SpxFailureRecord = {
	phase: SpxFailurePhase;
	errorCode: SpxSyncErrorCode;
	orderId?: string;
	orderNumber?: string;
};

export type SpxOrderResultCategory =
	| "completed"
	| "cancelled"
	| "updated"
	| "error_cleared"
	| "error_recorded"
	| "unchanged"
	| "skipped"
	| "provider_error"
	| "marker_error"
	| "draft_publish_conflict"
	| "draft_publish_error"
	| "revision_conflict"
	| "sanity_update_error";

export type SpxOrderSyncResult = {
	orderId: string;
	result: SpxOrderResultCategory;
	spxStatus?: string;
	errorCode?: SpxSyncErrorCode;
};

export type SpxSyncSummary = {
	queried: number;
	checked: number;
	changed: number;
	completed: number;
	cancelled: number;
	unchanged: number;
	skipped: number;
	failed: number;
	attentionRequired: number;
};

export type DraftPublishingSummary = {
	queried: number;
	attempted: number;
	published: number;
	failed: number;
};
