export default {
	name: "productType",
	title: "Product Type",
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
			validation: (Rule) => Rule.required(),
		},
	],
	preview: {
		select: {
			title: "name",
		},
	},
};
