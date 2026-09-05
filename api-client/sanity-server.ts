import sanityClient from "@sanity/client";
import {
	CreateLighterOrderResponse,
	CreateOrderLighterInput,
	OrderLighter,
} from "@/models/cart";
import type {
	DraftOrderDocument,
	EligibleSpxOrder,
	SpxPatchDecision,
} from "@/models/spxTracking";
import {
	buildDraftPublishMutations,
	SANITY_DRAFT_ORDERS_QUERY,
	SPX_ELIGIBLE_ORDERS_QUERY,
	stripServerManagedSpxFields,
} from "@/utils/spx/sync";

const serverClient = sanityClient({
	projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET,
	token: process.env.SANITY_TOKEN,
	apiVersion: "2022-09-19",
	useCdn: false,
});

function generateOrderNumber(prefix: string): string {
	const currentTime = new Date();
	const dateStr =
		currentTime.getFullYear().toString() +
		(currentTime.getMonth() + 1).toString().padStart(2, "0") +
		currentTime.getDate().toString().padStart(2, "0") +
		currentTime.getHours().toString().padStart(2, "0") +
		currentTime.getMinutes().toString().padStart(2, "0") +
		currentTime.getSeconds().toString().padStart(2, "0");
	const randomDigit = Math.floor(Math.random() * 11);

	return `${prefix}-${dateStr}${randomDigit}`;
}

export async function createLighterOrder(
	orderData: CreateOrderLighterInput,
	idempotencyKey: string
): Promise<CreateLighterOrderResponse> {
	const customerOrderData = stripServerManagedSpxFields(
		orderData as unknown as Record<string, unknown>
	) as unknown as CreateOrderLighterInput;
	const orderNumber = generateOrderNumber("LIGHTER");
	const newOrder = {
		_id: `lighter-order-${idempotencyKey}`,
		...customerOrderData,
		_type: "ordersLighter",
		orderNumber,
		orderDate: customerOrderData.orderDate || new Date().toISOString(),
	};

	// Ask Sanity for the mutation result so concurrent requests can distinguish
	// the one that created the document from idempotent replays.
	const mutationResult = await serverClient.mutate(
		[{ createIfNotExists: newOrder }],
		{ returnDocuments: false, returnFirst: true, visibility: "sync" }
	);
	const order = (await serverClient.getDocument(newOrder._id)) as OrderLighter | undefined;
	if (!order) {
		throw new Error("Order was not available after idempotent create");
	}

	return {
		order,
		created: mutationResult.results?.[0]?.operation === "create",
	};
}

export async function getEligibleSpxOrders(timeoutMs: number): Promise<EligibleSpxOrder[]> {
	return serverClient.fetch(
		SPX_ELIGIBLE_ORDERS_QUERY,
		{},
		{ timeout: Math.max(250, Math.min(timeoutMs, 10000)) }
	);
}

export async function getDraftLighterOrders(
	timeoutMs: number
): Promise<DraftOrderDocument[]> {
	return serverClient.fetch(
		SANITY_DRAFT_ORDERS_QUERY,
		{},
		{ timeout: Math.max(250, Math.min(timeoutMs, 10000)) }
	);
}

export async function publishDraftLighterOrder(
	draft: DraftOrderDocument,
	timeoutMs: number
): Promise<unknown> {
	return serverClient.mutate(buildDraftPublishMutations(draft), {
		returnDocuments: false,
		visibility: "sync",
		timeout: Math.max(250, Math.min(timeoutMs, 10000)),
	});
}

export async function patchSpxOrder(
	order: EligibleSpxOrder,
	decision: SpxPatchDecision,
	timeoutMs: number
): Promise<unknown> {
	if (!decision.shouldMutate) return null;

	let patch = serverClient.patch(order._id).ifRevisionId(order._rev);
	if (Object.keys(decision.set).length > 0) {
		patch = patch.set(decision.set);
	}
	if (decision.unset.length > 0) {
		patch = patch.unset(decision.unset);
	}

	return patch.commit({
		returnDocuments: false,
		visibility: "async",
		timeout: Math.max(250, Math.min(timeoutMs, 10000)),
	});
}

export async function updateOrderStatus(
	orderId: string,
	status: OrderLighter["status"]
): Promise<unknown> {
	return serverClient.patch(orderId).set({ status }).commit();
}

export async function uploadImageAssetToSanity(
	file: Buffer,
	options: { filename?: string; contentType?: string } = {}
): Promise<{ _type: string; asset: { _ref: string; _type: string } }> {
	const asset = await serverClient.assets.upload("image", file, {
		filename: options.filename,
		contentType: options.contentType,
	});

	return {
		_type: "image",
		asset: {
			_ref: asset._id,
			_type: "reference",
		},
	};
}

export default serverClient;
