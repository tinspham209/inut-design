export default {
	name: "products",
	title: "Skin Laptop",
	type: "document",
	fields: [
		{
			name: "image",
			title: "Image",
			type: "array",
			of: [{ type: "image" }],
			options: {
				hotspot: true,
			},
		},
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
				maxLength: 90,
			},
			validation: (Rule) => Rule.required(),
		},
		{
			name: "details",
			title: "Details",
			type: "string",
		},
		{
			name: "special",
			title: "Special",
			type: "boolean",
			description: "Highlight product in Homepage",
			initialValue: false,
		},
		{
			name: "productType",
			title: "Product Type",
			type: "reference",
			to: { type: "productType" },
			validation: (Rule) => Rule.required(),
		},
	],
	preview: {
		select: {
			title: "name",
			media: "image",
			productTypeName: "productType.name",
			isSpecial: "special",
		},
		prepare(selection) {
			const { title, media, productTypeName, isSpecial } = selection;
			const specialBadge = isSpecial ? "⭐ " : "";
			return {
				title: `${specialBadge}${title}`,
				subtitle: productTypeName || "No product type",
				media: media && media[0],
			};
		},
	},
};
