export default {
	name: "macnut",
	title: "Skin MacNut",
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
		},
		{
			name: "macnutType",
			title: "MacNut Type *",
			type: "reference",
			to: { type: "macnutType" },
			validation: (Rule) => Rule.required(),
		},
	],
	preview: {
		select: {
			title: "name",
			type: "macnutType.name",
			special: "special",
			media: "image",
		},
		prepare(selection) {
			const { title, media, type, special } = selection;
			return {
				title: title,
				subtitle: `${special ? "⭐️" : ""} ${type || "No macnut type selected"}`,
				media: media && media[0],
			};
		},
	},
};
