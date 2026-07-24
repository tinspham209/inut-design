export const MERCHANT_LISTING_CONFIG = {
	shippingDetails: {
		"@type": "OfferShippingDetails",
		"shippingMethod": "Giao hàng tận nơi",
		"shippingCost": 0,
		"shippingRate": {
			"@type": "MonetaryAmount",
			"value": 0,
			"currency": "VND"
		},
		"shippingDestination": {
			"@type": "DefinedRegion",
			"addressCountry": "VN",
			"addressRegion": ["DN"]
		},
		"deliveryTime": {
			"@type": "ShippingDeliveryTime",
			"handlingTime": {
				"@type": "QuantitativeValue",
				"minValue": 0,
				"maxValue": 1,
				"unitCode": "DAY"
			},
			"transitTime": {
				"@type": "QuantitativeValue",
				"minValue": 1,
				"maxValue": 5,
				"unitCode": "DAY"
			}
		}
	},
	hasMerchantReturnPolicy: {
		"@type": "MerchantReturnPolicy",
		"refundsAllowed": true,
		"returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
		"returnFees": "https://schema.org/FreeReturn",
		"returnMethod": "https://schema.org/ReturnByMail",
		"applicableCountry": "VN",
		"merchantReturnDays": 1
	}
};

export interface FAQItem {
	question: string;
	answer: string;
}

export const LIGHTERS_FAQ: FAQItem[] = [
	{
		question: "Bật lửa custom tại INUT Design có tối thiểu bao nhiêu cái?",
		answer: "INUT Design nhận in từ 1 cái. Giá sẽ tốt hơn khi đặt số lượng từ 10 cái trở lên. Liên hệ Zalo 0327 124 321 để được báo giá chi tiết.",
	},
	{
		question: "Thời gian làm bật lửa theo yêu cầu là bao lâu?",
		answer: "Thông thường 2–3 ngày làm việc sau khi xác nhận thiết kế. Có thể làm nhanh trong ngày nếu có thiết kế sẵn và đặt trước 10 giờ sáng.",
	},
	{
		question: "Chất liệu bật lửa được làm bằng gì?",
		answer: "Vỏ bật lửa bằng kim loại (thép hoặc đồng). Hình in được ủi nhiệt trực tiếp lên bề mặt, bền đẹp, không bong tróc khi sử dụng bình thường.",
	},
	{
		question: "Tôi có thể upload hình ảnh của mình để in lên bật lửa không?",
		answer: "Có. Bạn gửi hình qua Zalo (0327 124 321), INUT Design sẽ chỉnh sửa và gửi lại file thiết kế để bạn duyệt trước khi in. Dịch vụ thiết kế hoàn toàn miễn phí.",
	},
	{
		question: "Bật lửa custom tại INUT Design giao hàng được không?",
		answer: "Có. Giao toàn quốc qua bưu điện hoặc đơn vị vận chuyển. Riêng tại Đà Nẵng có thể giao tận nơi miễn phí trong cùng ngày.",
	},
];

export const SKIN_LAPTOP_FAQ: FAQItem[] = [
	{
		question: "Skin laptop tại INUT có tương thích với laptop của tôi không?",
		answer: "INUT Design có skin cho hầu hết các dòng laptop phổ biến: Dell, HP, Asus, Acer, Lenovo, MacBook. Nhắn model máy qua Zalo 0327 124 321 để kiểm tra tương thích ngay.",
	},
	{
		question: "Dán skin laptop có để lại keo hoặc làm hỏng máy không?",
		answer: "Không. Skin sử dụng keo chuyên dụng, dễ dán – dễ tháo, không để lại keo dư, không ảnh hưởng bề mặt máy khi tháo đúng cách.",
	},
	{
		question: "Skin laptop bền trong bao lâu?",
		answer: "Chất liệu vinyl cao cấp bền 2–3 năm trong điều kiện sử dụng bình thường, không bị bong hay phai màu khi tránh ánh nắng trực tiếp liên tục.",
	},
	{
		question: "Tôi có thể đặt skin laptop theo hình tự chọn không?",
		answer: "Có. Gửi hình hoặc ý tưởng qua Zalo (0327 124 321), INUT Design thiết kế miễn phí và gửi bản xem trước trong vòng 30 phút trong giờ làm việc.",
	},
	{
		question: "Giá skin laptop tại INUT Design là bao nhiêu?",
		answer: "Giá skin mặt nắp từ 150.000đ, full bộ (nắp + palm rest + đáy) từ 250.000đ. Giá có thể thay đổi theo kích thước và loại chất liệu. Liên hệ Zalo để được báo giá chính xác.",
	},
];

export const MACNUT_FAQ: FAQItem[] = [
	{
		question: "MACNUT là gì?",
		answer: "MACNUT là skin dán phím chuyên dụng cho MacBook, dày chỉ 0.1mm. Giúp bảo vệ phím, cá nhân hóa bàn phím và tăng độ thẩm mỹ cho MacBook của bạn.",
	},
	{
		question: "MACNUT có tương thích với tất cả MacBook không?",
		answer: "MACNUT có mẫu riêng cho từng đời MacBook (Air M1/M2, Pro 13/14/16 inch...). Vui lòng cho biết đời máy và năm sản xuất qua Zalo 0327 124 321 để chọn đúng size.",
	},
	{
		question: "Dán MACNUT có ảnh hưởng đến cảm giác gõ phím không?",
		answer: "Hầu như không. Skin mỏng 0.1mm, giữ nguyên cảm giác gõ phím tự nhiên. Một số người còn thích hơn vì bề mặt nhám nhẹ, ít bị trượt tay.",
	},
	{
		question: "Thời gian giao MACNUT là bao lâu?",
		answer: "Hàng có sẵn tại kho giao trong ngày tại Đà Nẵng hoặc 2–5 ngày toàn quốc. Đặt theo yêu cầu (hình riêng) thêm 1–2 ngày in.",
	},
	{
		question: "MACNUT có bền không? Có bị bong không?",
		answer: "Chất liệu vinyl cao cấp với keo chuyên dụng, không để lại vết khi tháo ra. Bền 1–2 năm khi sử dụng bình thường và không tiếp xúc với hóa chất mạnh.",
	},
];

// ─── Product-page category FAQ constants ─────────────────────────────────────
// Each constant is shared by all pages in the same category.
// To update FAQs for an entire category, edit the constant here — no page files needed.

export const STICKER_FAQ: FAQItem[] = [
	{
		question: "INUT Design in sticker tối thiểu bao nhiêu cái?",
		answer: "Không có số lượng tối thiểu. Bạn có thể đặt từ 1 cái. Đặt số lượng nhiều hơn sẽ được giá tốt hơn. Liên hệ Zalo 0327 124 321 để được báo giá chính xác.",
	},
	{
		question: "In sticker mất bao lâu để hoàn thành?",
		answer: "Thông thường 1–2 ngày làm việc cho đơn có sẵn file. Đơn cần thiết kế thêm 30–60 phút. Giao tận nơi trong ngày tại Đà Nẵng.",
	},
	{
		question: "Sticker tại INUT Design có bền và chống nước không?",
		answer: "Có. Sticker được in UV và cán màng chống nước, chống trầy xước. Thích hợp dán chai nước, máy tính, xe và các bề mặt ngoài trời.",
	},
	{
		question: "Tôi cần chuẩn bị file thiết kế gì để đặt in sticker?",
		answer: "File vector (AI, EPS, PDF) hoặc PNG nền trong độ phân giải ≥300dpi là tốt nhất. Nếu chưa có file, INUT Design hỗ trợ thiết kế và vẽ cutline miễn phí.",
	},
	{
		question: "INUT Design có in sticker theo mẫu tự thiết kế không?",
		answer: "Có. Gửi file hoặc ý tưởng qua Zalo (0327 124 321). Đội ngũ sẽ tư vấn chất liệu, form cắt và xem trước mẫu trước khi in.",
	},
];

export const CA_NHAN_HOA_FAQ: FAQItem[] = [
	{
		question: "INUT Design cá nhân hóa những sản phẩm nào?",
		answer: "Hiện INUT Design cá nhân hóa: skin laptop, skin điện thoại, skin bàn phím MacBook (MACNUT), và bật lửa Zippo. Tất cả đều in theo hình tự chọn.",
	},
	{
		question: "Thời gian thực hiện sản phẩm cá nhân hóa là bao lâu?",
		answer: "Phần lớn hoàn thành trong ngày đối với khu vực Đà Nẵng. Đơn giao tỉnh khác 2–5 ngày làm việc tùy hãng vận chuyển.",
	},
	{
		question: "Tôi có thể tự thiết kế hay cần file có sẵn?",
		answer: "Cả hai đều được. Bạn có thể gửi hình ảnh yêu thích và INUT Design sẽ thiết kế, xem trước miễn phí trước khi in. Không cần kinh nghiệm thiết kế.",
	},
	{
		question: "Sản phẩm cá nhân hóa có bảo hành không?",
		answer: "Có. Nếu sản phẩm bị lỗi do in ấn hoặc chất liệu (bong, phai màu sớm bất thường), INUT Design hỗ trợ làm lại miễn phí. Liên hệ ngay qua Zalo 0327 124 321.",
	},
];

export const LUU_NIEM_FAQ: FAQItem[] = [
	{
		question: "INUT Design có in quà lưu niệm theo số lượng ít không?",
		answer: "Có. Hầu hết sản phẩm lưu niệm có thể đặt từ 1 cái (postcard, móc khóa, pin cài áo...). Số lượng lớn được giá sỉ — liên hệ Zalo 0327 124 321 để được tư vấn.",
	},
	{
		question: "Sản phẩm lưu niệm tại INUT Design phù hợp dịp nào?",
		answer: "Phù hợp tặng bạn bè, kỷ niệm sinh nhật, sự kiện công ty, fan-meeting, hoặc làm quà tốt nghiệp. INUT Design tư vấn miễn phí theo nhu cầu của bạn.",
	},
	{
		question: "Tôi có thể in hình riêng lên sản phẩm lưu niệm không?",
		answer: "Có. Gửi hình ảnh, logo hoặc ý tưởng qua Zalo (0327 124 321). Đội thiết kế sẽ xem trước mẫu trước khi in — hoàn toàn miễn phí.",
	},
	{
		question: "Chất liệu quà lưu niệm tại INUT Design như thế nào?",
		answer: "Mica trong, mica màu, acrylic, giấy cứng cao cấp — tùy sản phẩm. Mỗi chất liệu đều được lựa chọn kỹ lưỡng để đảm bảo độ bền và thẩm mỹ.",
	},
	{
		question: "Giao hàng quà lưu niệm mất bao lâu?",
		answer: "Tại Đà Nẵng giao trong ngày. Toàn quốc 2–5 ngày qua J&T, GHN hoặc bưu điện. Đơn số lượng lớn có thể cần thêm 1–2 ngày sản xuất.",
	},
];

export const SU_KIEN_FAQ: FAQItem[] = [
	{
		question: "INUT Design in ấn phẩm cho sự kiện với số lượng bao nhiêu?",
		answer: "Nhận mọi quy mô từ sự kiện nhỏ 50 người đến hội nghị 1000+ người. Không có số lượng tối thiểu — liên hệ Zalo 0327 124 321 để được báo giá trọn gói.",
	},
	{
		question: "Có thể đặt gấp ấn phẩm sự kiện trong 1–2 ngày không?",
		answer: "Có thể tùy loại sản phẩm. Liên hệ sớm nhất có thể qua Zalo 0327 124 321 để đội ngũ kiểm tra lịch và ưu tiên xử lý đơn gấp.",
	},
	{
		question: "INUT Design có làm gói in ấn sự kiện trọn gói không?",
		answer: "Có. Gói sự kiện trọn gói bao gồm: backdrop, banner, standee, hashtag cầm tay, postcard, sticker... INUT Design phối hợp từ thiết kế đến giao hàng.",
	},
	{
		question: "Tôi cần cung cấp gì để đặt in ấn phẩm sự kiện?",
		answer: "Cần thông tin sự kiện (tên, ngày, địa điểm), logo/màu thương hiệu và nhu cầu cụ thể. Nếu chưa có file thiết kế, INUT Design hỗ trợ thiết kế miễn phí.",
	},
];

export const TIEP_THI_FAQ: FAQItem[] = [
	{
		question: "INUT Design in ấn phẩm tiếp thị những loại nào?",
		answer: "Chuyên in card visit, catalogue, brochure, voucher, tờ rơi, và nhiều ấn phẩm thương mại khác. Liên hệ Zalo 0327 124 321 để tư vấn loại phù hợp nhất.",
	},
	{
		question: "Card visit in xong sau bao lâu có hàng?",
		answer: "Thông thường 1–2 ngày làm việc sau khi duyệt file. Đơn gấp có thể xử lý trong ngày tùy số lượng — vui lòng liên hệ trước để kiểm tra.",
	},
	{
		question: "Chất liệu card visit và catalogue có những loại nào?",
		answer: "Card visit: giấy couché, matte, PP bóng/mờ, kraft. Catalogue: giấy couché 80-170gsm, bìa cứng. Mỗi loại phù hợp với mục đích và ngân sách khác nhau.",
	},
	{
		question: "In số lượng nhỏ ấn phẩm tiếp thị được không?",
		answer: "Được. Card visit từ 50 tờ, catalogue từ 10 cuốn, voucher từ 20 tờ. Số lượng càng nhiều giá đơn vị càng rẻ — báo giá chính xác qua Zalo 0327 124 321.",
	},
];

export const VAN_PHONG_FAQ: FAQItem[] = [
	{
		question: "INUT Design in ấn phẩm văn phòng những loại nào?",
		answer: "Chuyên in: bằng khen, kỷ niệm chương, bì thư, sổ tay, bảng thông tin công ty... Tất cả đều có thể in logo và nội dung theo yêu cầu doanh nghiệp.",
	},
	{
		question: "Giấy khen/bằng khen in tại INUT Design có chất lượng như thế nào?",
		answer: "In trên giấy couché dày, cán màng hoặc ép kim tùy chọn. Màu sắc sắc nét, chữ rõ ràng. Thường hoàn thành trong 1–2 ngày làm việc.",
	},
	{
		question: "Sổ tay đặt hàng tại INUT có tùy chỉnh bìa và nội dung không?",
		answer: "Có. In bìa theo thiết kế riêng (logo, màu thương hiệu), chọn số trang và chất liệu giấy bên trong. Phù hợp làm quà tặng doanh nghiệp và kỷ niệm.",
	},
	{
		question: "Thời gian giao ấn phẩm văn phòng là bao lâu?",
		answer: "Phần lớn hoàn thành 1–2 ngày. Đơn số lượng lớn hoặc cần ép kim, cán mờ có thể 3–5 ngày. Giao tận nơi tại Đà Nẵng, giao toàn quốc theo yêu cầu.",
	},
];

export const FB_FAQ: FAQItem[] = [
	{
		question: "INUT Design in sản phẩm F&B những loại nào?",
		answer: "Chuyên in: menu nhà hàng/quán cà phê, phiếu gọi món, hóa đơn, tấm lót bàn ăn, decor quán (sticker, poster, bảng hiệu nội thất...). Theo yêu cầu từng quán.",
	},
	{
		question: "In menu quán cà phê tại INUT có lâu không?",
		answer: "Thông thường 2–3 ngày cho menu đơn giản (1–2 trang). Menu nhiều trang có bìa cứng hoặc ép kim có thể 4–5 ngày. Liên hệ Zalo để đặt lịch cụ thể.",
	},
	{
		question: "Menu in tại INUT Design có thể cập nhật nội dung lại sau này không?",
		answer: "Có. Chỉ cần cung cấp lại file cập nhật là in lại được. Mẫu thiết kế cũ được lưu để lần sau chỉ cần chỉnh giá/món mà không tốn phí thiết kế.",
	},
	{
		question: "Tấm lót bàn ăn có in được logo và thông tin quán không?",
		answer: "Có. Tấm lót bàn ăn (placemat) in 4 màu, kích thước A3/A4, giấy kraft hoặc couché. Phù hợp branding quán và để menu nhỏ phía sau.",
	},
];

export const BAO_BI_FAQ: FAQItem[] = [
	{
		question: "INUT Design in bao bì, nhãn mác cho những sản phẩm nào?",
		answer: "Nhận in: nhãn mác sản phẩm, decal chai lọ, hộp đựng sản phẩm, tem bảo hành. Phù hợp các thương hiệu nhỏ, shop online, cơ sở sản xuất thủ công mỹ nghệ.",
	},
	{
		question: "In nhãn mác có số lượng tối thiểu không?",
		answer: "Không có số lượng tối thiểu bắt buộc. Tuy nhiên, từ 100 cái trở lên giá đơn vị sẽ rẻ hơn đáng kể. Báo giá chính xác qua Zalo 0327 124 321.",
	},
	{
		question: "Tem/nhãn tại INUT có chống nước và bền không?",
		answer: "Có. Sử dụng vật liệu vinyl hoặc PP không thấm nước, keo chuyên dụng. Bền với môi trường ẩm, phù hợp nhãn chai mỹ phẩm, thực phẩm, nước uống.",
	},
	{
		question: "Hộp sản phẩm in tại INUT có những loại chất liệu nào?",
		answer: "Carton trắng, carton nâu kraft, duplex (bìa cứng 2 mặt). Có thể in màu toàn bộ, in nhãn dán lên hộp hoặc dập chìm nổi tùy thiết kế.",
	},
];

// ─── Shared across global service pages ──────────────────────────────────────

export const SERVICES_FAQ: FAQItem[] = [
	{
		question: "Quy trình đặt hàng tại INUT Design như thế nào?",
		answer: "Nhắn Zalo (0327 124 321) mô tả nhu cầu → INUT báo giá trong 15 phút → Xác nhận và thanh toán → Nhận hàng. Đơn giản, nhanh chóng, minh bạch.",
	},
	{
		question: "INUT Design chấp nhận phương thức thanh toán nào?",
		answer: "Chuyển khoản ngân hàng, QR Code (VietQR), và tiền mặt khi nhận hàng tại Đà Nẵng. Thanh toán 50% trước, 50% khi nhận hàng cho đơn lớn.",
	},
	{
		question: "INUT Design có giao hàng toàn quốc không?",
		answer: "Có. Giao qua bưu điện và các đơn vị vận chuyển (J&T, GHN, Viettel Post). Riêng khu vực Đà Nẵng giao tận nơi miễn phí trong cùng ngày.",
	},
];
