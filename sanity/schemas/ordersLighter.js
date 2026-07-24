import StatusSelectWithGuide from "../components/StatusSelectWithGuide";

export default {
	name: "ordersLighter",
	title: "Orders - Lighters 🔥",
	type: "document",
	fields: [
		// Order Information
		{
			name: "orderNumber",
			title: "Order Number",
			type: "string",
			description: "Auto-generated order number (LIGHTER-xxxxx)",
			readOnly: true,
		},
		{
			name: "orderDate",
			title: "Order Date",
			type: "datetime",
			description: "Date and time when order was placed",
			initialValue: () => new Date().toISOString(),
			validation: (Rule) => Rule.required(),
		},
		{
			name: "status",
			title: "Order Status",
			type: "string",
			inputComponent: StatusSelectWithGuide,
			options: {
				list: [
					{ title: "⏳ Pending", value: "pending" },
					{ title: "✅ Confirmed", value: "confirmed" },
					{ title: "🔄 Processing", value: "processing" },
					{ title: "🚚 In transit", value: "in_transit" },
					{ title: "📦 Completed", value: "completed" },
					{ title: "❌ Cancelled", value: "cancelled" },
				],
				// layout: "radio",
			},
			initialValue: "pending",
			validation: (Rule) => Rule.required(),
		},
		{
			name: "paymentStatus",
			title: "Payment Status",
			type: "string",
			hidden: ({ document }) => document?.paymentMethod === "cod",
			options: {
				list: [
					{ title: "⏳ Pending", value: "pending" },
					{ title: "✅ Paid", value: "paid" },
					{ title: "❌ Failed", value: "failed" },
					{ title: "🔄 Refunded", value: "refunded" },
				],
			},
			initialValue: "pending",
		},

		// Order Items
		{
			name: "orderItems",
			title: "Order Items",
			type: "array",
			description: "List of lighter products in this order",
			of: [
				{
					type: "object",
					name: "orderItem",
					fields: [
						{
							name: "product",
							title: "Product",
							type: "reference",
							to: [{ type: "lighterProducts" }],
							validation: (Rule) => Rule.required(),
						},
						{
							name: "lighterType",
							title: "Lighter Type",
							type: "reference",
							to: [{ type: "lighterType" }],
							validation: (Rule) => Rule.required(),
						},
						{
							name: "quantity",
							title: "Quantity",
							type: "number",
							validation: (Rule) => Rule.required().min(1),
						},
						{
							name: "unitPrice",
							title: "Unit Price",
							type: "number",
							description: "Price per unit in VND (based on quantity tier)",
							validation: (Rule) => Rule.required().min(0),
						},
						{
							name: "subtotal",
							title: "Subtotal",
							type: "number",
							description: "Total for this item (unitPrice × quantity)",
							validation: (Rule) => Rule.required().min(0),
						},
						{
							name: "designImage",
							title: "Design Image",
							type: "image",
							description: "Customer's custom design image",
							options: { hotspot: false },
						},
						{
							name: "builderPreviewUrl",
							title: "Builder Preview URL",
							type: "string",
							description:
								"Open this URL to reproduce exactly how the customer design appears in 3D builder",
						},
						{
							name: "designSourceUrl",
							title: "Design Source URL",
							type: "string",
							description: "Source image URL used for 3D preview reconstruction",
						},
						{
							name: "designPreview",
							title: "Design Preview Transform",
							type: "object",
							description: "Saved transform values for 3D builder preview",
							fields: [
								{
									name: "previewUrl",
									title: "Preview URL",
									type: "string",
								},
								{
									name: "rot",
									title: "Rotation (rot)",
									type: "number",
								},
								{
									name: "scale",
									title: "Scale",
									type: "number",
								},
								{
									name: "x",
									title: "Position X",
									type: "number",
								},
								{
									name: "y",
									title: "Position Y",
									type: "number",
								},
							],
						},
					],
					preview: {
						select: {
							productName: "product.name",
							typeName: "lighterType.name",
							quantity: "quantity",
							subtotal: "subtotal",
							hasPreviewUrl: "builderPreviewUrl",
						},
						prepare(selection) {
							const { productName, typeName, quantity, subtotal, hasPreviewUrl } = selection;
							return {
								title: `${productName || "Unknown Product"} - ${typeName || "Unknown Type"}`,
								subtitle: `${hasPreviewUrl ? "🔗 " : ""}Qty: ${quantity} × ${
									subtotal ? (subtotal / quantity).toLocaleString() : 0
								}₫ = ${subtotal ? subtotal.toLocaleString() : 0}₫`,
							};
						},
					},
				},
			],
			validation: (Rule) => Rule.required().min(1),
		},

		// Customer Information
		{
			name: "customerName",
			title: "Customer Name",
			type: "string",
			validation: (Rule) => Rule.required(),
		},
		{
			name: "customerPhone",
			title: "Customer Phone",
			type: "string",
			validation: (Rule) => Rule.required(),
		},
		{
			name: "customerEmail",
			title: "Customer Email",
			type: "string",
			validation: (Rule) => Rule.email(),
		},

		// Delivery Information
		{
			name: "deliveryAddress",
			title: "Delivery Address",
			type: "text",
			rows: 2,
		},
		{
			name: "paymentMethod",
			title: "Payment Method",
			type: "string",
			options: {
				list: [
					{ title: "💵 Cash on Delivery (COD)", value: "cod" },
					{ title: "🏦 Bank Transfer", value: "bank_transfer" },
				],
			},
			initialValue: "bank_transfer",
		},

		// Pricing
		{
			name: "totalAmount",
			title: "Total Amount",
			type: "number",
			description: "Total order amount in VND",
			validation: (Rule) => Rule.required().min(0),
		},
		{
			name: "shippingFee",
			title: "Shipping Fee",
			type: "number",
			description: "Shipping cost in VND",
			initialValue: 0,
		},
		{
			name: "discount",
			title: "Discount",
			type: "number",
			description: "Discount amount in VND",
			initialValue: 0,
		},
		{
			name: "finalAmount",
			title: "Final Amount",
			type: "number",
			description:
				"(total_amount + shipping_fee - discount), If manual change any value of these 3 field above, please recalculate this field manually to avoid missing values.",
			validation: (Rule) => Rule.required().min(0),
		},

		// Additional Information
		{
			name: "notes",
			title: "Order Notes",
			type: "text",
			rows: 2,
			description: "Customer notes or special instructions",
		},

		// Internal Admin Fields
		{
			name: "adminNotes",
			title: "Admin Notes",
			type: "text",
			rows: 2,
			description: "Internal notes (not visible to customer)",
		},
		{
			name: "trackingNumber",
			title: "Tracking Number",
			type: "string",
			description: "Link to tracking page or tracking number for shipped orders",
		},
	],

	// Preview Configuration
	preview: {
		select: {
			orderNumber: "orderNumber",
			customerName: "customerName",
			finalAmount: "finalAmount",
			status: "status",
			orderDate: "orderDate",
		},
		prepare(selection) {
			const { orderNumber, customerName, finalAmount, status, orderDate } = selection;

			// Format date
			const date = orderDate ? new Date(orderDate).toLocaleDateString("vi-VN") : "N/A";

			// Status emoji mapping
			const statusEmoji = {
				pending: "⏳",
				confirmed: "✅",
				processing: "🔄",
				in_transit: "🚚",
				completed: "📦",
				cancelled: "❌",
			};

			return {
				title: `${statusEmoji[status] || ""} ${orderNumber || "New Order"}`,
				subtitle: `${customerName || "Unknown"} | ${date} | ${
					finalAmount ? finalAmount.toLocaleString() : 0
				}₫`,
			};
		},
	},

	// Ordering (most recent first)
	orderings: [
		{
			title: "Order Date (Newest First)",
			name: "orderDateDesc",
			by: [{ field: "orderDate", direction: "desc" }],
		},
		{
			title: "Order Date (Oldest First)",
			name: "orderDateAsc",
			by: [{ field: "orderDate", direction: "asc" }],
		},
		{
			title: "Total Amount (High to Low)",
			name: "totalAmountDesc",
			by: [{ field: "totalAmount", direction: "desc" }],
		},
	],
};
