export default {
	name: "form-nhan-bao-gia",
	title: "Form Nhận Báo Giá 📝",
	type: "document",
	fields: [
		{
			name: "customerName",
			title: "Tên khách hàng",
			type: "string",
			validation: (Rule) => Rule.required().min(2).error("Vui lòng nhập tên khách hàng"),
		},
		{
			name: "companyBrand",
			title: "Tên Công ty hoặc Brand (nếu có)",
			type: "string",
		},
		{
			name: "phone",
			title: "Số điện thoại",
			type: "string",
			validation: (Rule) =>
				Rule.required()
					.min(9)
					.max(15)
					.regex(/^[0-9+()\s-]+$/i, { name: "phone" })
					.error("Số điện thoại không hợp lệ"),
		},
		{
			name: "email",
			title: "Email",
			type: "string",
			validation: (Rule) => Rule.required().email().error("Email không hợp lệ"),
		},
		{
			name: "usagePurpose",
			title: "Mục đích sử dụng",
			type: "string",
			options: {
				list: [
					{ title: "Kinh doanh", value: "kinh-doanh" },
					{ title: "Cá nhân", value: "ca-nhan" },
					{ title: "Nhãn dán bao bì", value: "nhan-dan-bao-bi" },
					{ title: "Sticker", value: "sticker" },
					{ title: "In ảnh", value: "in-anh" },
					{ title: "Bảng cứng in thông tin", value: "bang-cung-in-thong-tin" },
					{ title: "Móc khóa mica", value: "moc-khoa-mica" },
					{ title: "Pin cài áo mica", value: "pin-cai-ao-mica" },
					{ title: "Acrylic magnet", value: "acrylic-magnet" },
					{ title: "Sticker sheet", value: "sticker-sheet" },
					{ title: "Sticker magnet", value: "sticker-magnet" },
					{ title: "Sticker diecut", value: "sticker-diecut" },
					{ title: "Sticker kisscut", value: "sticker-kisscut" },
					{ title: "Skin laptop customize", value: "laptop-customize" },
					{ title: "Skin phone customize", value: "phone-customize" },
					{ title: "Lighter customize", value: "lighter-customize" },
					{ title: "Macnut customize", value: "macnut-customize" },
					{ title: "Khác", value: "other" },
				],
			},
			validation: (Rule) => Rule.required(),
		},
		{
			name: "usagePurposeOtherDetail",
			title: "Mục đích sử dụng khác (vui lòng mô tả)",
			type: "text",
			hidden: ({ document }) => document?.usagePurpose !== "other",
		},
		{
			name: "receiveQuoteChannel",
			title: "Nhận bảng báo giá qua kênh",
			type: "string",
			options: {
				list: [
					{ title: "Email", value: "email" },
					{ title: "Zalo", value: "zalo" },
					{ title: "Khác", value: "other" },
				],
				layout: "radio",
			},
			validation: (Rule) => Rule.required(),
		},
		{
			name: "receiveQuoteChannelOtherDetail",
			title: "Nhận bảng báo giá qua kênh khác (vui lòng mô tả)",
			type: "text",
			hidden: ({ document }) => document?.receiveQuoteChannel !== "other",
		},
		{
			name: "designStatus",
			title: "Bạn đã có thiết kế chưa?",
			type: "string",
			options: {
				list: [
					{ title: "Đã có, chỉ cần tư vấn in ấn", value: "have-design" },
					{ title: "Chưa có, cần tư vấn thiết kế và in ấn", value: "need-design-and-print" },
				],
				layout: "radio",
			},
		},
		{
			name: "priorityLevel",
			title: "Mức độ ưu tiên",
			type: "string",
			options: {
				list: [
					{ title: "Bình thường", value: "binh-thuong" },
					{ title: "Gấp (vui lòng điền ngày bạn cần)", value: "gap" },
				],
				layout: "radio",
			},
		},
		{
			name: "urgentDate",
			title: "Ngày cần (chỉ hiển thị khi chọn 'Gấp')",
			type: "date",
			options: {
				dateFormat: "DD/MM/YYYY",
			},
			hidden: ({ document }) => document?.priorityLevel !== "gap",
		},
		{
			name: "notes",
			title: "Ghi chú thêm",
			type: "text",
			rows: 3,
		},
	],
	preview: {
		select: {
			title: "customerName",
			phone: "phone",
			email: "email",
			usagePurpose: "usagePurpose",
		},
		prepare(selection) {
			const { title, phone, email, usagePurpose } = selection;
			return {
				title: title || "(Chưa có tên)",
				subtitle: `${phone || ""}${email ? " • " + email : ""}${
					usagePurpose ? " • " + usagePurpose : ""
				}`,
			};
		},
	},
	orderings: [
		{
			name: "nameAsc",
			title: "Tên khách hàng (A → Z)",
			by: [{ field: "customerName", direction: "asc" }],
		},
		{
			name: "nameDesc",
			title: "Tên khách hàng (Z → A)",
			by: [{ field: "customerName", direction: "desc" }],
		},
	],
};
