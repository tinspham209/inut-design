import sanityClient from "@sanity/client";
import { CreateOrderLighterInput, OrderLighter } from "@/models/cart";

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
	orderData: CreateOrderLighterInput
): Promise<OrderLighter> {
	const newOrder = {
		...orderData,
		_type: "ordersLighter",
		orderNumber: generateOrderNumber("LIGHTER"),
		orderDate: orderData.orderDate || new Date().toISOString(),
	};

	return (await serverClient.create(newOrder)) as OrderLighter;
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
