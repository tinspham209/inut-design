export default {
	name: "lighterType",
	title: "Lighter Type",
	type: "document",
	fields: [
		{
			name: "name",
			title: "Name",
			type: "string",
			validation: (Rule) => Rule.required(),
		},
		{
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "name",
				maxLength: 96,
			},
		},
		{
			name: "description",
			title: "Description",
			type: "blockContent",
			description: "Category description (e.g., Cricket Thường, Cricket Mini). Supports rich text.",
		},
		{
			name: "priceTiers",
			title: "Price Tiers",
			type: "array",
			description: "Quantity-based pricing (e.g., 1pc, 5pcs, 10pcs, etc.)",
			of: [
				{
					type: "object",
					fields: [
						{
							name: "quantity",
							title: "Quantity",
							type: "number",
							description: "Minimum quantity for this price tier",
							validation: (Rule) => Rule.required().min(1),
						},
						{
							name: "price",
							title: "Price",
							type: "number",
							description: "Price in VND (thousands) per unit",
							validation: (Rule) => Rule.required().min(0),
						},
					],
					preview: {
						select: {
							quantity: "quantity",
							price: "price",
						},
						prepare(selection) {
							const { quantity, price } = selection;
							return {
								title: `${quantity}${quantity === 1 ? "pc" : "pcs"}`,
								subtitle: `${price.toLocaleString()} VND`,
							};
						},
					},
				},
			],
		},
	],
	preview: {
		select: {
			name: "name",
			tierCount: "priceTiers",
		},
		prepare({ name, tierCount }) {
			return {
				title: name || "Untitled",
				subtitle: tierCount?.length > 0 ? `${tierCount.length} price tiers` : "No pricing set",
			};
		},
	},
};
