export default {
	name: "income-sticker",
	title: "Test - Doanh thu Sticker",
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
		},
		{
			name: "soluong",
			title: "Số lượng giấy",
			type: "number",
		},
		{
			name: "stickerType",
			title: "Loại sticker",
			type: "reference",
			to: { type: "sticker-type" },
		},
		{
			name: "discount",
			title: "Giảm giá (%)",
			type: "number",
		},
		{
			name: "costGiay1",
			title: "Loại giấy 1",
			type: "reference",
			to: { type: "letter-cost" },
		},
		{
			name: "indexGiay1",
			title: "Số lượng giấy 1",
			type: "number",
		},
		{
			name: "costGiay2",
			title: "Loại giấy 2",
			type: "reference",
			to: { type: "letter-cost" },
		},
		{
			name: "indexGiay2",
			title: "Số lượng giấy 2",
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
