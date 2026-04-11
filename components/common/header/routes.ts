export interface RouteItem {
	label: string;
	path: string;
	children?: RouteItem[];
	isButton?: boolean;
	isMega?: boolean;
	/**
	 * Metadata for rendering navigation cards and SEO.
	 * @example
	 * meta: {
	 *   description: "Dịch vụ in sticker chất lượng cao",
	 *   image_url: "StickerIcon", // Used by resolver to map to a component
	 *   badge: "Hot",
	 *   image: "/images/services/sticker.jpg"
	 * }
	 */
	meta?: {
		description?: string;
		image_url?: string;
		badge?: string;
		image?: string;
	};
}

export const ROUTE_LIST: RouteItem[] = [
	{
		label: "Trang chủ",
		path: "/",
	},
	{
		label: "Sản Phẩm",
		path: "/san-pham",
		meta: {
			description:
				"Khám phá bộ sưu tập sản phẩm độc bản, từ skin laptop, skin nút phím đến các dòng bật lửa Cricket cá nhân hóa.",
			image: "/branding/ogImage.jpg",
		},
		children: [
			{
				label: "Skin Laptop",
				path: "/san-pham/skin-laptop",
				meta: {
					description: "Trang trí và bảo vệ laptop với hàng ngàn mẫu skin độc đáo.",
					image_url: "/branding/services/skin-laptop.avif",
				},
			},
			{
				label: "Skin Nút Phím",
				path: "/san-pham/skin-nut-phim",
				meta: {
					description: "Cá nhân hóa bàn phím laptop theo phong cách riêng của bạn.",
					image_url: "/branding/services/skin-nut-phim.avif",
				},
			},
			{
				label: "Bật Lửa",
				path: "/san-pham/lighters",
				meta: {
					description: "Bộ sưu tập bật lửa Cricket độc bản, in theo yêu cầu.",
					image_url: "/assets/skin-bat-lua-customize.avif",
					badge: "Bestseller",
				},
			},
		],
	},
	{
		label: "Dịch vụ",
		path: "/services",
		isMega: true,
		children: [
			{
				label: "Sticker",
				path: "/services/sticker",
				meta: {
					description: "In sticker, decal các loại với công nghệ in UV sắc nét.",
					image_url: "/services/sticker/thumbnail/root.avif",
					// badge: "Bestseller",
				},
				children: [
					{
						label: "Sticker Sheet",
						path: "/services/sticker/sticker-sheet",
						meta: {
							description: "Nhiều sticker nhỏ trên cùng một tấm decal.",
							image_url: "/services/sticker/thumbnail/sticker-sheet.avif",
						},
					},
					{
						label: "Sticker Magnet",
						path: "/services/sticker/sticker-magnet",
						meta: {
							description: "Sticker nam châm dán tủ lạnh, xe hơi.",
							image_url: "/services/sticker/thumbnail/sticker-magnet.avif",
						},
					},
					{
						label: "Sticker Diecut",
						path: "/services/sticker/sticker-diecut",
						meta: {
							description: "Cắt rời từng hình theo đường viền.",
							image_url: "/services/sticker/thumbnail/sticker-diecut.avif",
						},
					},
					{
						label: "Sticker Pack",
						path: "/services/sticker/sticker-pack",
						meta: {
							description: "Bộ sưu tập sticker độc đáo, in theo yêu cầu.",
							image_url: "/services/sticker/thumbnail/sticker-pack.avif",
						},
					},
					// {
					// 	label: "Sticker Kisscut",
					// 	path: "/services/sticker/sticker-kisscut",
					// 	meta: {
					// 		description: "Cắt màng decal nhưng giữ nguyên lớp đế.",
					// 		image_url: "/services/sticker/thumbnail/sticker-kisscut.avif",
					// 	},
					// },
				],
			},
			{
				label: "Cá nhân hóa",
				path: "/services/ca-nhan-hoa",
				meta: {
					description: "Biến những vật dụng hằng ngày thành quà tặng độc bản.",
					image_url: "/services/ca-nhan-hoa/thumbnail/root.avif",
				},
				children: [
					{
						label: "Skin Laptop",
						path: "/services/ca-nhan-hoa/skin-laptop-customize",
						meta: {
							description: "Tự thiết kế skin cho laptop của bạn.",
							image_url: "/services/ca-nhan-hoa/thumbnail/skin-laptop.avif",
						},
					},
					{
						label: "Skin Nút Phím",
						path: "/services/ca-nhan-hoa/skin-nut-phim-customize",
						meta: {
							description: "Tự thiết kế skin cho phím laptop.",
							image_url: "/services/ca-nhan-hoa/thumbnail/skin-nut-phim.avif",
						},
					},
					// {
					// 	label: "Skin điện thoại",
					// 	path: "/services/ca-nhan-hoa/skin-dien-thoai-customize",
					// 	meta: {
					// 		description: "Cá nhân hóa ốp lưng hoặc dán skin điện thoại.",
					// 		image_url: "",
					// 		badge: "New",
					// 	},
					// },
					{
						label: "Bật lửa",
						path: "/services/ca-nhan-hoa/skin-bat-lua-customize",
						meta: {
							description: "In hình cá nhân lên bật lửa Cricket.",
							image_url: "/services/ca-nhan-hoa/thumbnail/lighter.avif",
						},
					},
				],
			},
			{
				label: "Ấn phẩm lưu niệm",
				path: "/services/an-pham-luu-niem",
				meta: {
					description: "Quà tặng lưu niệm, merchandise cho artist và doanh nghiệp.",
					image_url: "/services/an-pham-luu-niem/thumbnail/root.avif",
					// badge: "Pro",
				},
				children: [
					{
						label: "Acrylic Magnet",
						path: "/services/an-pham-luu-niem/acrylic-magnet",
						meta: {
							description: "Nam châm mica in UV cao cấp.",
							image_url: "/services/an-pham-luu-niem/thumbnail/acrylic-magnet.avif",
						},
					},
					{
						label: "Móc khóa Mica",
						path: "/services/an-pham-luu-niem/moc-khoa-mica",
						meta: {
							description: "Móc khóa mica cắt theo hình yêu cầu.",
							image_url: "/services/an-pham-luu-niem/thumbnail/moc-khoa-mica.avif",
						},
					},
					{
						label: "Pin cài áo Mica",
						path: "/services/an-pham-luu-niem/pin-cai-ao-mica",
						meta: {
							description: "Pin cài áo (badge) mica in UV.",
							image_url: "/services/an-pham-luu-niem/thumbnail/pin-cai-ao-mica.avif",
						},
					},
					{
						label: "In Postcard",
						path: "/services/an-pham-luu-niem/in-postcard",
						meta: {
							description: "In bưu thiếp, thiệp chúc mừng.",
							image_url: "/services/an-pham-luu-niem/thumbnail/in-postcard.avif",
						},
					},
					{
						label: "Thank card / Gift card",
						path: "/services/an-pham-luu-niem/thank-card-gift-card",
						meta: {
							description: "Thẻ cảm ơn, thẻ quà tặng khách hàng.",
							image_url: "/services/an-pham-luu-niem/thumbnail/thank-card-gift-card.avif",
						},
					},
					{
						label: "In ảnh ",
						path: "/services/an-pham-luu-niem/in-anh-da-nang",
						meta: {
							description: "In ảnh tại Đà Nẵng.",
							image_url: "/services/an-pham-luu-niem/thumbnail/in-anh.avif",
						},
					},
				],
			},
			{
				label: "Ấn phẩm văn phòng",
				path: "/services/an-pham-van-phong",
				meta: {
					description: "Giải pháp in ấn chuyên nghiệp cho văn phòng và doanh nghiệp.",
					image_url: "/services/an-pham-van-phong/thumbnail/root.avif",
					// badge: "Office",
				},
				children: [
					{
						label: "Bảng cứng in thông tin",
						path: "/services/an-pham-van-phong/bang-cung-in-thong-tin",
						meta: {
							description: "Bảng tên, bảng hướng dẫn, nội quy.",
							image_url: "/services/an-pham-van-phong/thumbnail/bang-cung-in-thong-tin.avif",
						},
					},
					{
						label: "Giấy khen / Chứng nhận",
						path: "/services/an-pham-van-phong/giay-khen-giay-chung-nhan",
						meta: {
							description: "In bằng khen, giấy chứng nhận chất lượng cao.",
							image_url: "/services/an-pham-van-phong/thumbnail/bang-khen-giay-khen.avif",
						},
					},
					{
						label: "In bì thư",
						path: "/services/an-pham-van-phong/in-bi-thu",
						meta: {
							description: "In bì thư doanh nghiệp nhiều kích thước.",
							image_url: "/services/an-pham-van-phong/thumbnail/bi-thu.avif",
						},
					},
					{
						label: "Sổ tay / Sổ bấm ghim",
						path: "/services/an-pham-van-phong/so-tay-ky-yeu-so-bam-ghim",
						meta: {
							description: "Sổ tay cá nhân hóa, sổ quà tặng.",
							image_url: "/services/an-pham-van-phong/thumbnail/so-tay-so-bam-ghim.avif",
						},
					},
				],
			},
			{
				label: "Ấn phẩm sự kiện",
				path: "/services/an-pham-su-kien",
				meta: {
					description: "Vật phẩm trang trí và tiếp thị cho sự kiện, triển lãm.",
					image_url: "/services/an-pham-su-kien/thumbnail/root.avif",
					// badge: "Event",
				},
				children: [
					{
						label: "Hashtag cầm tay",
						path: "/services/an-pham-su-kien/hashtag-cam-tay",
						meta: {
							description: "Hashtag chụp ảnh sự kiện, đám cưới.",
							image_url: "/services/an-pham-su-kien/thumbnail/hashtag-cam-tay.avif",
							badge: "Hot",
						},
					},
					{
						label: "Poster Decal",
						path: "/services/an-pham-su-kien/poster-decal",
						meta: {
							description: "In poster quảng cáo, decal trang trí khổ lớn.",
							image_url: "/services/an-pham-su-kien/thumbnail/poster-decal.avif",
						},
					},
					{
						label: "Banner, Standee",
						path: "/services/an-pham-su-kien/banner-standee",
						meta: {
							description: "In banner, standee đa dạng chất liệu.",
							image_url: "/services/an-pham-su-kien/thumbnail/banner-standee.avif",
						},
					},
					{
						label: "Huy Chương",
						path: "/services/an-pham-su-kien/huy-chuong",
						meta: {
							description: "In huy chương cho sự kiện, giải thưởng.",
							image_url: "/services/an-pham-su-kien/thumbnail/huy-chuong.avif",
						},
					},
					{
						label: "Sự kiện trọn gói",
						path: "/services/an-pham-su-kien/su-kien-tron-goi-da-nang",
						meta: {
							description:
								"Từ concept đến thi công. Thiết kế đồng bộ, in ấn sắc nét, set up chỉn chu.",
							image_url: "/services/an-pham-su-kien/thumbnail/su-kien-tron-goi.avif",
						},
					},
				],
			},
			{
				label: "Ấn phẩm tiếp thị",
				path: "/services/an-pham-tiep-thi",
				meta: {
					description: "Tăng nhận diện thương hiệu với ấn phẩm tiếp thị chuyên nghiệp.",
					image_url: "/services/an-pham-tiep-thi/thumbnail/root.avif",
					// badge: "Marketing",
				},
				children: [
					{
						label: "Catalogue / Brochure",
						path: "/services/an-pham-tiep-thi/catalogue-brochure",
						meta: {
							description: "In catalogue giới thiệu sản phẩm, dịch vụ.",
							image_url: "/services/an-pham-tiep-thi/thumbnail/catalogue-brochure.avif",
						},
					},
					{
						label: "In Card Visit",
						path: "/services/an-pham-tiep-thi/in-card-visit",
						meta: {
							description: "In danh thiếp cá nhân, doanh nghiệp.",
							image_url: "/services/an-pham-tiep-thi/thumbnail/in-card-visit.avif",
						},
					},
					{
						label: "Voucher, Vé mời sự kiện, Thẻ tích điểm, Tờ rơi",
						path: "/services/an-pham-tiep-thi/voucher-ve-moi-su-kien-the-tich-diem-to-roi",
						meta: {
							description: "In voucher, vé mời sự kiện, thẻ tích điểm, tờ rơi.",
							image_url:
								"/services/an-pham-tiep-thi/thumbnail/voucher-ve-moi-su-kien-the-tich-diem-to-roi.avif",
						},
					},
				],
			},
			{
				label: "Ấn phẩm F&B",
				path: "/services/an-pham-fb",
				meta: {
					description: "Tăng nhận diện thương hiệu với ấn phẩm F&B chuyên nghiệp.",
					image_url: "/services/an-pham-fb/thumbnail/root.avif",
					// badge: "F&B",
				},
				children: [
					{
						label: "Thiết kế & In Menu",
						path: "/services/an-pham-fb/thiet-ke-in-menu",
						meta: {
							description: "Thiết kế và in menu cho nhà hàng, quán ăn.",
							image_url: "/services/an-pham-fb/thumbnail/thiet-ke-in-menu.avif",
						},
					},
					{
						label: "Sản phẩm Decor",
						path: "/services/an-pham-fb/san-pham-decor",
						meta: {
							description: "In decor sản phẩm F&B.",
							image_url: "/services/an-pham-fb/thumbnail/san-pham-decor.avif",
						},
					},
					{
						label: "Phiếu, vé, hóa đơn GTGT",
						path: "/services/an-pham-fb/phieu-ve-hoa-don-gtgt",
						meta: {
							description: "Thiết kế và in phiếu, vé, hóa đơn GTGT.",
							image_url: "/services/an-pham-fb/thumbnail/phieu-ve-hoa-don-gtgt.avif",
						},
					},
					{
						label: "Tấm lót bàn ăn",
						path: "/services/an-pham-fb/tam-lot-ban-an",
						meta: {
							description: "Thiết kế và in tấm lót bàn ăn.",
							image_url: "/services/an-pham-fb/thumbnail/tam-lot-ban-an.avif",
						},
					},
				],
			},
			{
				label: "Ấn phẩm Bao bì",
				path: "/services/an-pham-bao-bi",
				meta: {
					description: "Tăng nhận diện thương hiệu với ấn phẩm Bao bì chuyên nghiệp.",
					image_url: "/services/an-pham-bao-bi/thumbnail/root.avif",
					// badge: "Packaging",
				},
				children: [
					{
						label: "Decal nhãn mác",
						path: "/services/an-pham-bao-bi/decal-nhan-mac",
						meta: {
							description: "Thiết kế và in decal nhãn mác.",
							image_url: "/services/an-pham-bao-bi/thumbnail/decal-nhan-mac.avif",
						},
					},
					{
						label: "Hộp sản phẩm",
						path: "/services/an-pham-bao-bi/hop-san-pham",
						meta: {
							description: "Thiết kế và in hộp sản phẩm.",
							image_url: "/services/an-pham-bao-bi/thumbnail/hop-san-pham.avif",
						},
					},
					{
						label: "Tem bảo hành / Sản phẩm",
						path: "/services/an-pham-bao-bi/tem-bao-hanh",
						meta: {
							description: "Thiết kế và in tem bảo hành, tem sản phẩm.",
							image_url: "/services/an-pham-bao-bi/thumbnail/tem-bao-hanh.avif",
						},
					},
				],
			},
		],
	},
	{
		label: "Liên hệ",
		path: "/contact",
	},
	{
		label: "Về chúng tôi",
		path: "/about-us",
	},
	{
		label: "Tra đơn",
		path: "/order-tracking",
	},
	{
		label: "Nhận báo giá",
		path: "/contact/form",
		isButton: true,
	},
];
