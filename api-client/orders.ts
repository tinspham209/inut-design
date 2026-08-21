import { client } from "./sanity-browser";
import { OrderLighter } from "@/models/cart";

const ORDER_FIELDS = `{
	_id,
	_type,
	orderNumber,
	orderDate,
	status,
	customerName,
	customerPhone,
	customerEmail,
	deliveryAddress,
	totalAmount,
	shippingFee,
	discount,
	finalAmount,
	notes,
	paymentMethod,
	paymentStatus,
	adminNotes,
	trackingNumber,
	orderItems[]{
		_key,
		productName,
		lighterTypeName,
		quantity,
		unitPrice,
		subtotal,
		designImage,
		designPreview,
		builderPreviewUrl,
		designSourceUrl,
		"product": product->{
			_id,
			name,
			image[0...1]{
				_key,
				_type,
				asset,
				crop,
				hotspot
			}
		},
		"lighterType": lighterType->{
			_id,
			_type,
			name,
			slug{current},
			priceTiers[]{quantity, price}
		}
	}
}`;

export async function getOrderByNumber(orderNumber: string): Promise<OrderLighter | null> {
	try {
		return await client.fetch(
			`*[_type == "ordersLighter" && orderNumber == $orderNumber][0]${ORDER_FIELDS}`,
			{ orderNumber }
		);
	} catch (error) {
		console.error("Error fetching order:", error);
		return null;
	}
}
