import type { DraftOrderDocument, EligibleSpxOrder, SpxPatchDecision } from "@/models/spxTracking";
import { requireServerEnv } from "@/utils/server-env";
import {
	SPX_CHECKPOINT_ID, type SpxCheckpoint, type SpxCursor, validateSpxCheckpoint,
} from "@/utils/spx/checkpoint";
import {
	buildDraftPublishMutations, SANITY_DRAFT_ORDERS_QUERY, SPX_ELIGIBLE_ORDERS_QUERY,
} from "@/utils/spx/sync";

export type SpxOrderPatcher = (order: EligibleSpxOrder, decision: SpxPatchDecision, timeoutMs: number) => Promise<unknown>;

export function createSpxRepository(fetchImpl: typeof fetch) {
	// A cron-only transport: no SDK retry loop or shared client policy changes.
	async function request<T>(endpoint: string, timeoutMs: number, body?: unknown): Promise<T> {
		const project = requireServerEnv("NEXT_PUBLIC_SANITY_PROJECT_ID");
		const dataset = requireServerEnv("NEXT_PUBLIC_SANITY_DATASET");
		const response = await fetchImpl(`https://${project}.api.sanity.io/v2022-09-19/data/${endpoint.replace("{dataset}", encodeURIComponent(dataset))}`, {
			method: body === undefined ? "GET" : "POST",
			headers: { Authorization: `Bearer ${requireServerEnv("SANITY_TOKEN")}`, "Content-Type": "application/json" },
			body: body === undefined ? undefined : JSON.stringify(body),
			signal: AbortSignal.timeout(Math.max(1, Math.min(timeoutMs, 10000))),
		});
		if (!response.ok) {
			await response.body?.cancel();
			throw Object.assign(new Error("SPX_SANITY_REQUEST_FAILED"), { statusCode: response.status });
		}
		return await response.json() as T;
	}

	async function query<T>(queryText: string, params: Record<string, unknown>, timeoutMs: number): Promise<T> {
		const search = new URLSearchParams({ query: queryText });
		for (const [key, value] of Object.entries(params)) search.set(`$${key}`, JSON.stringify(value));
		return (await request<{ result: T }>(`query/{dataset}?${search}`, timeoutMs)).result;
	}
	const mutate = (mutations: unknown[], timeoutMs: number, returnDocuments = false) =>
		request<{ results?: { document?: unknown }[] }>(`mutate/{dataset}?returnDocuments=${returnDocuments}&visibility=sync`, timeoutMs, { mutations });

	return {
		async readCheckpoint(timeoutMs: number): Promise<SpxCheckpoint> {
			let checkpoint = await query("*[_id == $id][0]", { id: SPX_CHECKPOINT_ID }, timeoutMs);
			if (checkpoint === null) {
				const created = await mutate([{ create: {
					_id: SPX_CHECKPOINT_ID, _type: "spxSyncCheckpoint", version: 1, drafts: null, orders: null,
				} }], timeoutMs, true);
				checkpoint = created.results?.[0]?.document;
			}
			validateSpxCheckpoint(checkpoint);
			return checkpoint;
		},
		async saveCheckpoint(checkpoint: SpxCheckpoint, timeoutMs: number) {
			return mutate([{ patch: {
				id: SPX_CHECKPOINT_ID, ifRevisionID: checkpoint._rev,
				set: { version: 1, drafts: checkpoint.drafts, orders: checkpoint.orders },
			} }], timeoutMs);
		},
		getDraftOrders: (timeoutMs: number, cursor: SpxCursor): Promise<DraftOrderDocument[]> =>
			query(SANITY_DRAFT_ORDERS_QUERY, cursor, timeoutMs),
		getEligibleOrders: (timeoutMs: number, cursor: SpxCursor): Promise<EligibleSpxOrder[]> =>
			query(SPX_ELIGIBLE_ORDERS_QUERY, cursor, timeoutMs),
		publishDraftOrder: (draft: DraftOrderDocument, timeoutMs: number) =>
			mutate(buildDraftPublishMutations(draft), timeoutMs),
		patchOrder: ((order, decision, timeoutMs) => {
			if (!decision.shouldMutate) return Promise.resolve(null);
			return mutate([{ patch: {
				id: order._id, ifRevisionID: order._rev,
				...(Object.keys(decision.set).length ? { set: decision.set } : {}),
				...(decision.unset.length ? { unset: decision.unset } : {}),
			} }], timeoutMs);
		}) as SpxOrderPatcher,
	};
}
