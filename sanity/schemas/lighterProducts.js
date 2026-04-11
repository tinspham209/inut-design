export default {
	name: "lighterProducts",
	title: "Lighters(Bật lửa)",
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
			type: "blockContent",
			description: "Product details. Supports rich text.",
		},
		{
			name: "special",
			title: "Special",
			type: "boolean",
			description: "Highlight product in Homepage",
			initialValue: false,
		},
		{
			name: "lighterType",
			title: "Lighter Type",
			type: "reference",
			to: { type: "lighterType" },
			options: {
				disableNew: false,
			},
			validation: (Rule) => Rule.required(),
		},
	],
	preview: {
		select: {
			title: "name",
			media: "image",
			lighterTypeName: "lighterType.name",
			special: "special",
		},
		prepare(selection) {
			const { title, media, lighterTypeName, special } = selection;
			return {
				title: title,
				subtitle: `${special ? "⭐️" : ""} ${lighterTypeName || "No lighter type selected"}`,
				media: media && media[0],
			};
		},
	},
};
