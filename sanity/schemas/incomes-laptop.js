export default {
	name: "incomes-laptop",
	title: "Doanh thu",
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
			name: "matLung",
			title: "Mặt lưng (120)",
			type: "boolean",
			initialValue: false,
		},
		{
			name: "matPhim",
			title: "Mặt phím (180)",
			type: "boolean",
			initialValue: false,
		},
		{
			name: "matDay",
			title: "Mặt đáy (150)",
			type: "boolean",
			initialValue: false,
		},
		{
			name: "vienManHinh",
			title: "Viền màn hình (100)",
			type: "boolean",
			initialValue: false,
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
