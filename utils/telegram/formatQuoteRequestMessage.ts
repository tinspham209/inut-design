import { QuoteRequestForm } from "@/models/quoteRequest";

export function formatQuoteRequestMessage(quoteData: QuoteRequestForm): string {
	const {
		customerName,
		companyBrand,
		phone,
		email,
		usagePurpose,
		usagePurposeOtherDetail,
		designStatus,
		priorityLevel,
		urgentDate,
		notes,
	} = quoteData;

	// Map values to Vietnamese labels
	const usagePurposeLabels: Record<string, string> = {
		"kinh-doanh": "Kinh doanh",
		"ca-nhan": "Cá nhân",
		"nhan-dan-bao-bi": "Nhãn dán bao bì",
		sticker: "Sticker",
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
	message += `📧 <b>Email:</b> ${email}\n\n`;

	message += `🎯 <b>Mục đích:</b> ${usagePurposeLabels[usagePurpose] || usagePurpose}\n`;

	if (usagePurpose === "other" && usagePurposeOtherDetail) {
		message += `   └ <i>${usagePurposeOtherDetail}</i>\n`;
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
