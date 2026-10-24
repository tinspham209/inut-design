import assert from "node:assert/strict";
import {
	formatNotification,
	formatNotificationParts,
} from "../utils/creativa/notifications.server.ts";

function orderFixture(overrides = {}) {
	return {
		_id: "creativa.order.test-123",
		_type: "creativaOrder",
		_rev: "test-revision",
		publicId: "Test_123",
		orderDate: "2026-10-24T09:03:51.202Z",
		status: "pending",
		paymentStatus: "pending",
		paymentMethod: "bank_transfer",
		customer: {
			name: "An <Alex> & Co",
			phone: "0901234567",
			email: "alex@example.test",
			address: "Hà Nội",
			note: "Xin chào <team> & cập nhật",
		},
		lines: [
			{
				_type: "acceptedLine",
				_key: "line-1",
				productType: "skin-laptop",
				productName: "Skin <Pro>",
				selection: {
					modelName: "MacBook & Pro",
					modelCode: "internal-model-code",
					coverageName: "Mặt lưng",
					coverageMeaning: "Bảo vệ",
				},
				quantity: 2,
				unitPrice: 125000,
				subtotal: 250000,
				production: { printAssetPath: "/creativa/print/skin.pdf" },
			},
		],
		currency: "VND",
		merchandiseTotal: 250000,
		shippingFee: 30000,
		discount: 0,
		finalAmount: 280000,
		shipping: { code: "standard", name: "Tiêu chuẩn", fee: 30000 },
		bank: null,
		notifications: [],
		...overrides,
	};
}

function assertBalancedHtml(text) {
	const stack = [];
	for (const tag of text.match(/<\/?(?:b|code)>/g) || []) {
		if (tag.startsWith("</")) {
			assert.equal(stack.pop(), tag.slice(2, -1), "Telegram HTML tags must close in order");
		} else {
			stack.push(tag.slice(1, -1));
		}
	}
	assert.equal(stack.length, 0, "Telegram HTML tags must be balanced");
}

const message = formatNotification(orderFixture());
for (const value of [
	"ĐƠN HÀNG CREATIVA MỚI",
	"<b>Mã đơn hàng:</b> <code>Test_123</code>",
	"24/10/2026",
	"16:03",
	"Họ tên:</b> An &lt;Alex&gt; &amp; Co",
	"<b>Skin &lt;Pro&gt;</b>",
	"MacBook &amp; Pro",
	"File in: /creativa/print/skin.pdf",
	"125.000₫ = 250.000₫",
	"Thành tiền: 280.000₫",
	"Chuyển khoản ngân hàng",
	"creativaOrder;creativa.order.test-123",
	"creativa/order-tracking/Test_123",
]) {
	assert.ok(message.includes(value), `Missing formatted value: ${value}`);
}
assert.ok(!message.includes("internal-model-code"));
assert.ok(!message.includes("pending"));
assertBalancedHtml(message);
console.log("✓ Formats the Creativa order using the staff-friendly Telegram layout");

const parts = formatNotificationParts(
	orderFixture({
		customer: {
			...orderFixture().customer,
			note: "<&".repeat(1000),
		},
	})
);
assert.ok(parts.length > 1, "Long customer notes should split into multiple messages");
for (const [index, part] of parts.entries()) {
	assert.equal(part.position, index + 1);
	assert.ok(part.text.length <= 4096, "Telegram message parts must stay under the API limit");
	assert.doesNotMatch(part.text, /&(?!amp;|lt;|gt;)/, "HTML entities must not be split");
	assertBalancedHtml(part.text);
}
console.log("✓ Splits long notifications without breaking HTML tags or entities");
