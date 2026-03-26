import { QuoteRequestForm } from "@/models/quoteRequest";

export function formatQuoteRequestMessage(quoteData: QuoteRequestForm): string {
	const {
		customerName,
		companyBrand,
		phone,
		email,
		usagePurpose,
		usagePurposeOtherDetail,
		quantity,
		deviceModel,
		receiveQuoteChannel,
		receiveQuoteChannelOtherDetail,
		designStatus,
		priorityLevel,
		urgentDate,
		notes,
	} = quoteData;

	// Map values to Vietnamese labels
	const usagePurposeLabels: Record<string, string> = {
		"kinh-doanh": "Kinh doanh",
		"ca-nhan": "Cá nhân",
		"decal-nhan-mac": "Decal Nhãn Mác",
		"hop-san-pham": "Hộp Sản Phẩm",
		"tem-bao-hanh": "Tem Bảo Hành",
		"nhan-dan-bao-bi": "Nhãn dán bao bì",
		"san-pham-decor": "Sản Phẩm Decor",
		"design-in-menu": "Thiết Kế & In Menu",
		"phieu-ve-hoa-don-gtgt": "Phiếu, Vé & Hóa Đơn GTGT",
		"tam-lot-ban-an": "Tấm Lót Bàn Ăn",
		"hashtag-cam-tay": "Hashtag Cầm Tay",
		"poster-decal": "Poster & Decal",
		"banner-standee": "Banner & Standee",
		"huy-chuong": "Huy chương",
		"su-kien-tron-goi": "Sự Kiện Trọn Gói",
		"in-card-visit": "In Card Visit",
		"catalogue-brochure": "In Catalogue, Brochure",
		"in-voucher-ve-moi-su-kien-the-tich-diem": "In Voucher, Vé Mời, Thẻ Tích Điểm, Tờ Rơi",
		"giay-khen-giay-chung-nhan": "Giấy Khen & Giấy Chứng Nhận",
		"in-bi-thu": "In Bì Thư",
		"so-tay-ky-yeu-so-bam-ghim": "Sổ Tay, Kỷ Yếu & Sổ Bấm Ghim",
		"bang-cung-in-thong-tin": "Bảng cứng in thông tin",
		"skin-laptop-customize": "Skin laptop custom",
		"skin-phone-customize": "Skin phone custom",
		"lighters-customize": "Bật lửa custom",
		"macnut-customize": "Nút phím custom",
		"thank-card-gift-card": "Thank Card & Gift Card",
		"in-postcard": "In Postcard",
		"in-anh": "In ảnh",
		"moc-khoa-mica": "Móc khóa mica",
		"pin-cai-ao-mica": "Pin cài áo mica",
		"acrylic-magnet": "Acrylic magnet",
		"sticker-sheet": "Sticker sheet",
		"sticker-magnet": "Sticker magnet",
		"sticker-diecut": "Sticker diecut",
		"sticker-kisscut": "Sticker kisscut",
		sticker: "Sticker",
		other: "Khác",
	};

	const receiveQuoteChannelLabels: Record<string, string> = {
		email: "Email",
		zalo: "Zalo",
		phone: "Số điện thoại",
		other: "Khác",
	};

	const designStatusLabels: Record<string, string> = {
		"have-design": "Đã có, chỉ cần tư vấn in ấn",
		"need-design-and-print": "Chưa có, cần tư vấn thiết kế và in ấn",
	};

	const priorityLabels: Record<string, string> = {
		"binh-thuong": "Bình thường",
		gap: "Gấp",
	};

	let message = `🔔 <b>YÊU CẦU BÁO GIÁ MỚI</b>\n\n`;
	message += `👤 <b>Khách hàng:</b> ${customerName}\n`;

	if (companyBrand) {
		message += `🏢 <b>Công ty/Brand:</b> ${companyBrand}\n`;
	}

	message += `📱 <b>Số điện thoại:</b> ${phone}\n`;

	if (email) {
		message += `📧 <b>Email:</b> ${email}\n`;
	}

	message += `📥 <b>Nhận báo giá qua:</b> ${
		receiveQuoteChannelLabels[receiveQuoteChannel] || receiveQuoteChannel
	}\n`;
	if (receiveQuoteChannel === "other" && receiveQuoteChannelOtherDetail) {
		message += `   └ <i>${receiveQuoteChannelOtherDetail}</i>\n`;
	}

	message += `\n🎯 <b>Mục đích:</b> ${usagePurposeLabels[usagePurpose] || usagePurpose}\n`;

	if (usagePurpose === "other" && usagePurposeOtherDetail) {
		message += `   └ <i>${usagePurposeOtherDetail}</i>\n`;
	}

	if (quantity) {
		message += `🔢 <b>Số lượng:</b> ${quantity}\n`;
	}

	if (deviceModel) {
		message += `💻 <b>Model thiết bị:</b> ${deviceModel}\n`;
	}

	if (designStatus) {
		message += `🎨 <b>Thiết kế:</b> ${designStatusLabels[designStatus] || designStatus}\n`;
	}

	if (priorityLevel) {
		message += `⚡ <b>Ưu tiên:</b> ${priorityLabels[priorityLevel] || priorityLevel}\n`;
		if (priorityLevel === "gap" && urgentDate) {
			const dateObj = new Date(urgentDate);
			const formattedDate = dateObj.toLocaleDateString("vi-VN");
			message += `   └ <b>Ngày cần:</b> ${formattedDate}\n`;
		}
	}

	if (notes) {
		message += `\n💬 <b>Ghi chú:</b>\n${notes}\n`;
	}

	message += `\n⏰ <b>Thời gian:</b> ${new Date().toLocaleString("vi-VN")}`;

	return message;
}
