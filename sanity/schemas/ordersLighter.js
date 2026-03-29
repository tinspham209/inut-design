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
			options: {
				list: [
					{ title: "⏳ Pending", value: "pending" },
					{ title: "✅ Confirmed", value: "confirmed" },
					{ title: "🔄 Processing", value: "processing" },
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
					],
					preview: {
						select: {
							productName: "product.name",
							typeName: "lighterType.name",
							quantity: "quantity",
							subtotal: "subtotal",
						},
						prepare(selection) {
							const { productName, typeName, quantity, subtotal } = selection;
							return {
								title: `${productName || "Unknown Product"} - ${typeName || "Unknown Type"}`,
								subtitle: `Qty: ${quantity} × ${
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
			description: "Full delivery address",
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
				"Final amount after shipping and discount (totalAmount + shippingFee - discount)",
			validation: (Rule) => Rule.required().min(0),
		},

		// Additional Information
		{
			name: "notes",
			title: "Order Notes",
			type: "text",
			description: "Customer notes or special instructions",
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
			initialValue: "cod",
		},

		// Internal Admin Fields
		{
			name: "adminNotes",
			title: "Admin Notes",
			type: "text",
			description: "Internal notes (not visible to customer)",
		},
		{
			name: "trackingNumber",
			title: "Tracking Number",
			type: "string",
			description: "Shipping tracking number",
		},
	],

	// Preview Configuration
	preview: {
		select: {
			orderNumber: "orderNumber",
			customerName: "customerName",
			totalAmount: "totalAmount",
			status: "status",
			orderDate: "orderDate",
		},
		prepare(selection) {
			const { orderNumber, customerName, totalAmount, status, orderDate } = selection;

			// Format date
			const date = orderDate ? new Date(orderDate).toLocaleDateString("vi-VN") : "N/A";

			// Status emoji mapping
			const statusEmoji = {
				pending: "⏳",
				confirmed: "✅",
				processing: "🔄",
				completed: "📦",
				cancelled: "❌",
			};

			return {
				title: `${statusEmoji[status] || ""} ${orderNumber || "New Order"}`,
				subtitle: `${customerName || "Unknown"} | ${date} | ${
					totalAmount ? totalAmount.toLocaleString() : 0
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
