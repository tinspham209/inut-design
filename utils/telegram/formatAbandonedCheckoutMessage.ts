import { SendAbandonedCheckoutNotificationRequest } from "./telegram.types";

const VIETNAM_TIMEZONE = "Asia/Ho_Chi_Minh";

export function formatAbandonedCheckoutMessage(
	abandonedData: SendAbandonedCheckoutNotificationRequest
): string {
	const sanitize = (value?: string): string =>
		(value || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();

	const formatPrice = (amount: number): string => amount.toLocaleString("vi-VN") + "₫";

	const abandonedAt = new Date(abandonedData.abandonedAt).toLocaleString("vi-VN", {
		timeZone: VIETNAM_TIMEZONE,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});

	const itemsText = abandonedData.orderItems
		.map((item, index) => {
			const productName = item.productName || "Sản phẩm";
			const typeName = item.lighterTypeName || "Loại";

			return (
				`${index + 1}. <b>${sanitize(productName)}</b>\n` +
				`   • Loại: ${sanitize(typeName)}\n` +
				`   • SL: ${item.quantity} × ${formatPrice(item.unitPrice)} = ${formatPrice(item.subtotal)}`
			);
		})
		.join("\n");

	const checkoutUrl = abandonedData.pagePath
		? `https://inutdesign.com${abandonedData.pagePath}`
		: "https://inutdesign.com/checkout/lighters";

	return `
⚠️ <b>CHECKOUT BỊ BỎ DỞ</b>
━━━━━━━━━━━━━━━━━━

📱 <b>SĐT khách:</b> <code>${sanitize(abandonedData.customerPhone)}</code>
🏠 <b>Địa chỉ:</b> ${sanitize(abandonedData.deliveryAddress) || "N/A"}
🕒 <b>Thời điểm:</b> ${abandonedAt}

📦 <b>CHI TIẾT GIỎ HÀNG</b>
━━━━━━━━━━━━━━━━━━
${itemsText}

💰 <b>Tổng tạm tính:</b> ${formatPrice(abandonedData.totalAmount)}
🔢 <b>Số dòng sản phẩm:</b> ${abandonedData.orderItems.length}

🔗 <b>Trang checkout:</b> ${sanitize(checkoutUrl)}
`.trim();
}
