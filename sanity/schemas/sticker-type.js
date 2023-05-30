export default {
	name: "sticker-type",
	title: "Loại Sticker",
	type: "document",
	fields: [
		{
			name: "title",
			title: "Thông Tin",
			type: "string",
		},
		{
			name: "slug",
			title: "Slug",
			type: "slug",
			options: {
				source: "title",
				maxLength: 90,
			},
		},
		{
			name: "price",
			title: "Giá (300)",
			type: "number",
		},
		{
			name: "details",
			title: "Chi tiết",
			type: "blockContent",
		},
	],

	preview: {
		select: {
			name: "title",
			subtitle: "price",
		},
		prepare(selection) {
			const { name, subtitle } = selection;
			return {
				title: name,
				subtitle: subtitle,
			};
		},
	},
};
