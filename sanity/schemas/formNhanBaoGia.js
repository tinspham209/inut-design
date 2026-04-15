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
		},
		{
			name: "usagePurpose",
			title: "Mục đích sử dụng",
			type: "string",
			options: {
				list: [
					{ title: "Kinh doanh", value: "kinh-doanh" },
					{ title: "Cá nhân", value: "ca-nhan" },
					{ title: "Decal Nhãn Mác", value: "decal-nhan-mac" },
					{ title: "Hộp Sản Phẩm", value: "hop-san-pham" },
					{ title: "Tem Bảo Hành", value: "tem-bao-hanh" },
					{ title: "Nhãn dán bao bì", value: "nhan-dan-bao-bi" },
					{ title: "Sản Phẩm Decor", value: "san-pham-decor" },
					{ title: "Thiết Kế & In Menu", value: "design-in-menu" },
					{ title: "Phiếu, Vé & Hóa Đơn GTGT", value: "phieu-ve-hoa-don-gtgt" },
					{ title: "Tấm Lót Bàn Ăn", value: "tam-lot-ban-an" },
					{ title: "Hashtag Cầm Tay", value: "hashtag-cam-tay" },
					{ title: "Poster & Decal", value: "poster-decal" },
					{ title: "Banner & Standee", value: "banner-standee" },
					{ title: "Huy chương", value: "huy-chuong" },
					{ title: "Sự Kiện Trọn Gói", value: "su-kien-tron-goi" },
					{
						title: "Thiết kế in ấn cửa hàng trọn gói",
						value: "thiet-ke-in-an-cua-hang-tron-goi",
					},
					{ title: "In Card Visit", value: "in-card-visit" },
					{ title: "In Catalogue, Brochure", value: "catalogue-brochure" },
					{
						title: "In Voucher, Vé Mời, Thẻ Tích Điểm, Tờ Rơi",
						value: "in-voucher-ve-moi-su-kien-the-tich-diem",
					},
					{ title: "Giấy Khen & Giấy Chứng Nhận", value: "giay-khen-giay-chung-nhan" },
					{ title: "In Bì Thư", value: "in-bi-thu" },
					{ title: "Sổ Tay, Kỷ Yếu & Sổ Bấm Ghim", value: "so-tay-ky-yeu-so-bam-ghim" },
					{ title: "Bảng cứng in thông tin", value: "bang-cung-in-thong-tin" },
					{ title: "Skin laptop custom theo yêu cầu", value: "skin-laptop-customize" },
					{ title: "Skin phone custom theo yêu cầu", value: "skin-phone-customize" },
					{ title: "Bật lửa custom theo yêu cầu", value: "lighters-customize" },
					{ title: "Nút phím custom theo yêu cầu", value: "macnut-customize" },
					{ title: "Thank Card & Gift Card", value: "thank-card-gift-card" },
					{ title: "In Postcard", value: "in-postcard" },
					{ title: "In ảnh", value: "in-anh" },
					{ title: "Móc khóa mica", value: "moc-khoa-mica" },
					{ title: "Pin cài áo mica", value: "pin-cai-ao-mica" },
					{ title: "Acrylic magnet", value: "acrylic-magnet" },
					{ title: "Sticker sheet", value: "sticker-sheet" },
					{ title: "Sticker magnet", value: "sticker-magnet" },
					{ title: "Sticker diecut", value: "sticker-diecut" },
					{ title: "Sticker kisscut", value: "sticker-kisscut" },
					{ title: "Sticker", value: "sticker" },
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
			name: "quantity",
			title: "Số lượng",
			type: "string",
		},
		{
			name: "deviceModel",
			title: "Model thiết bị",
			type: "string",
		},
		{
			name: "receiveQuoteChannel",
			title: "Nhận bảng báo giá qua kênh",
			type: "string",
			options: {
				list: [
					{ title: "Email", value: "email" },
					{ title: "Zalo", value: "zalo" },
					{ title: "Số điện thoại", value: "phone" },
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
