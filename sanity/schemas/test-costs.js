export default {
	name: "costs",
	title: "Test - Chi Phí",
	type: "document",
	fields: [
		{
			name: "title",
			title: "Thông Tin",
			type: "string",
		},
		{
			name: "date",
			title: "Ngày",
			type: "date",
			options: {
				dateFormat: "YYYY-MM-DD",
				calendarTodayLabel: "Today",
			},
			initialValue: new Date(),
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
			subtitle: "date",
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
