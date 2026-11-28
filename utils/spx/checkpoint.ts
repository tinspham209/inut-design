export type SpxCursor = {
	cutoff: string;
	createdAt: string;
	id: string;
};

export type SpxCheckpoint = {
	_id: string;
	_rev: string;
	version: 1;
	drafts: SpxCursor | null;
	orders: SpxCursor | null;
};

export const SPX_CHECKPOINT_ID = "spxSync.checkpoint";
export const SPX_DRAFT_BATCH_SIZE = 8;
export const SPX_ORDER_BATCH_SIZE = 10;
export const SPX_SUBREQUEST_LIMIT = 45;

export function startSpxCursor(cursor: SpxCursor | null, now: Date): SpxCursor {
	return cursor || { cutoff: now.toISOString(), createdAt: "", id: "" };
}

export function advanceSpxCursor(
	cursor: SpxCursor,
	items: { _createdAt?: string; _id: string }[],
	attempted: number,
): SpxCursor | null {
	if (attempted === items.length) return null;
	if (attempted === 0) return cursor;
	const last = items[attempted - 1];
	if (!last._createdAt) throw new Error("INVALID_SPX_CURSOR_ITEM");
	return { ...cursor, createdAt: last._createdAt, id: last._id };
}

export function validateSpxCheckpoint(value: unknown): asserts value is SpxCheckpoint {
	const checkpoint = value as SpxCheckpoint;
	const validCursor = (cursor: SpxCursor | null) => cursor === null || (
		cursor && typeof cursor.id === "string" && cursor.id.length <= 128 &&
		typeof cursor.createdAt === "string" &&
		(cursor.createdAt === "" || Number.isFinite(Date.parse(cursor.createdAt))) &&
		typeof cursor.cutoff === "string" && Number.isFinite(Date.parse(cursor.cutoff))
	);
	if (
		!checkpoint || checkpoint._id !== SPX_CHECKPOINT_ID || !checkpoint._rev ||
		checkpoint.version !== 1 || !validCursor(checkpoint.drafts) || !validCursor(checkpoint.orders)
	) throw new Error("INVALID_SPX_CHECKPOINT");
}

export function createSpxBudget(fetchImpl: typeof fetch = fetch) {
	let used = 0;
	const budgetedFetch: typeof fetch = (input, init) => {
		if (used >= SPX_SUBREQUEST_LIMIT) throw new Error("SPX_SUBREQUEST_BUDGET_EXHAUSTED");
		used += 1;
		// Reject redirects: one dispatch must never hide extra network requests.
		return fetchImpl(input, { ...init, redirect: "error" });
	};
	return { fetch: budgetedFetch, get used() { return used; } };
}
