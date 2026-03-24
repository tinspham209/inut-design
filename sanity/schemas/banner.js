export default {
	name: "banner",
	title: "Banner",
	type: "document",
	fields: [
		{
			name: "image",
			title: "Image",
			type: "image",
			options: {
				hotspot: true,
			},
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
			name: "buttonText",
			title: "ButtonText",
			type: "string",
			validation: (Rule) => Rule.required(),
		},
	],
	preview: {
		select: {
			name: "slug",
			media: "image",
		},
		prepare(selection) {
			const { name, media } = selection;
			return {
				title: name.current,
				media: media,
			};
		},
	},
};
