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
	 *   icon: "StickerIcon", // Used by resolver to map to a component
	 *   badge: "Hot",
	 *   image: "/images/services/sticker.jpg"
	 * }
	 */
	meta?: {
		description?: string;
		icon?: string;
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
					description: "Trang trí and bảo vệ laptop với hàng ngàn mẫu skin độc đáo.",
					icon: "laptop",
				},
			},
			{
				label: "Skin Nút Phím",
				path: "/san-pham/skin-nut-phim",
				meta: {
					description: "Cá nhân hóa bàn phím laptop theo phong cách riêng của bạn.",
					icon: "keyboard",
				},
			},
			{
				label: "Bật Lửa",
				path: "/san-pham/lighters",
				meta: {
					description: "Bộ sưu tập bật lửa Cricket độc bản, in theo yêu cầu.",
					icon: "local_fire_department",
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
					icon: "sticky_note_2",
					badge: "Bestseller",
				},
				children: [
					{
						label: "Sticker Sheet",
						path: "/services/sticker/sticker-sheet",
						meta: { description: "Nhiều sticker nhỏ trên cùng một tấm decal.", icon: "layers" },
					},
					{
						label: "Sticker Magnet",
						path: "/services/sticker/sticker-magnet",
						meta: { description: "Sticker nam châm dán tủ lạnh, xe hơi.", icon: "magnet" },
					},
					{
						label: "Sticker Diecut",
						path: "/services/sticker/sticker-diecut",
						meta: {
							description: "Cắt rời từng hình theo đường viền.",
							icon: "content_cut",
							badge: "Hot",
						},
					},
					{
						label: "Sticker Kisscut",
						path: "/services/sticker/sticker-kisscut",
						meta: { description: "Cắt màng decal nhưng giữ nguyên lớp đế.", icon: "border_style" },
					},
				],
			},
			{
				label: "Cá nhân hóa",
				path: "/services/ca-nhan-hoa",
				meta: {
					description: "Biến những vật dụng hằng ngày thành quà tặng độc bản.",
					icon: "auto_awesome",
					badge: "Unique",
				},
				children: [
					{
						label: "Skin Laptop",
						path: "/services/ca-nhan-hoa/skin-laptop-customize",
						meta: { description: "Tự thiết kế skin cho laptop của bạn.", icon: "laptop" },
					},
					{
						label: "Skin Nút Phím",
						path: "/services/ca-nhan-hoa/skin-nut-phim-customize",
						meta: { description: "Tự thiết kế skin cho phím laptop.", icon: "keyboard" },
					},
					{
						label: "Skin điện thoại",
						path: "/services/ca-nhan-hoa/skin-dien-thoai-customize",
						meta: {
							description: "Cá nhân hóa ốp lưng or dán skin điện thoại.",
							icon: "smartphone",
							badge: "New",
						},
					},
					{
						label: "Bật lửa",
						path: "/services/ca-nhan-hoa/skin-bat-lua-customize",
						meta: {
							description: "In hình cá nhân lên bật lửa Cricket.",
							icon: "local_fire_department",
						},
					},
				],
			},
			{
				label: "Ấn phẩm lưu niệm",
				path: "/services/an-pham-luu-niem",
				meta: {
					description: "Quà tặng lưu niệm, merchandise cho artist and doanh nghiệp.",
					icon: "card_giftcard",
					badge: "Pro",
				},
				children: [
					{
						label: "Acrylic Magnet",
						path: "/services/an-pham-luu-niem/acrylic-magnet",
						meta: {
							description: "Nam châm mica in UV cao cấp.",
							icon: "vibration",
							badge: "Trend",
						},
					},
					{
						label: "Móc khóa Mica",
						path: "/services/an-pham-luu-niem/moc-khoa-mica",
						meta: { description: "Móc khóa mica cắt theo hình yêu cầu.", icon: "vpn_key" },
					},
					{
						label: "Pin cài áo Mica",
						path: "/services/an-pham-luu-niem/pin-cai-ao-mica",
						meta: { description: "Pin cài áo (badge) mica in UV.", icon: "stars" },
					},
					{
						label: "In Postcard",
						path: "/services/an-pham-luu-niem/in-postcard",
						meta: { description: "In bưu thiếp, thiệp chúc mừng.", icon: "mail" },
					},
					{
						label: "Thank card / Gift card",
						path: "/services/an-pham-luu-niem/thank-card-gift-card",
						meta: { description: "Thẻ cảm ơn, thẻ quà tặng khách hàng.", icon: "card_membership" },
					},
					{
						label: "In ảnh ",
						path: "/services/an-pham-luu-niem/in-anh-da-nang",
						meta: { description: "In ảnh tại Đà Nẵng.", icon: "photo" },
					},
				],
			},
			{
				label: "Ấn phẩm văn phòng",
				path: "/services/an-pham-van-phong",
				meta: {
					description: "Giải pháp in ấn chuyên nghiệp cho văn phòng and doanh nghiệp.",
					icon: "business_center",
					badge: "Office",
				},
				children: [
					{
						label: "Bảng cứng in thông tin",
						path: "/services/an-pham-van-phong/bang-cung-in-thong-tin",
						meta: { description: "Bảng tên, bảng hướng dẫn, nội quy.", icon: "info" },
					},
					{
						label: "Giấy khen / Chứng nhận",
						path: "/services/an-pham-van-phong/giay-khen-giay-chung-nhan",
						meta: {
							description: "In bằng khen, giấy chứng nhận chất lượng cao.",
							icon: "workspace_premium",
						},
					},
					{
						label: "In bì thư",
						path: "/services/an-pham-van-phong/in-bi-thu",
						meta: { description: "In bì thư doanh nghiệp nhiều kích thước.", icon: "envelope" },
					},
					{
						label: "Sổ tay / Sổ bấm ghim",
						path: "/services/an-pham-van-phong/so-tay-ky-yeu-so-bam-ghim",
						meta: { description: "Sổ tay cá nhân hóa, sổ quà tặng.", icon: "menu_book" },
					},
				],
			},
			{
				label: "Ấn phẩm sự kiện",
				path: "/services/an-pham-su-kien",
				meta: {
					description: "Vật phẩm trang trí and tiếp thị cho sự kiện, triển lãm.",
					icon: "event",
					badge: "Event",
				},
				children: [
					{
						label: "Hashtag cầm tay",
						path: "/services/an-pham-su-kien/hashtag-cam-tay",
						meta: {
							description: "Hashtag chụp ảnh sự kiện, đám cưới.",
							icon: "tag",
							badge: "Hot",
						},
					},
					{
						label: "Poster Decal",
						path: "/services/an-pham-su-kien/poster-decal",
						meta: {
							description: "In poster quảng cáo, decal trang trí khổ lớn.",
							icon: "ad_units",
						},
					},
					{
						label: "Banner, Standee",
						path: "/services/an-pham-su-kien/banner-standee",
						meta: {
							description: "In banner, standee đa dạng chất liệu.",
							icon: "ad_units",
						},
					},
				],
			},
			{
				label: "Ấn phẩm tiếp thị",
				path: "/services/an-pham-tiep-thi",
				meta: {
					description: "Tăng nhận diện thương hiệu với ấn phẩm tiếp thị chuyên nghiệp.",
					icon: "campaign",
					badge: "Marketing",
				},
				children: [
					{
						label: "Catalogue / Brochure",
						path: "/services/an-pham-tiep-thi/catalogue-brochure",
						meta: {
							description: "In catalogue giới thiệu sản phẩm, dịch vụ.",
							icon: "library_books",
						},
					},
					{
						label: "In Card Visit",
						path: "/services/an-pham-tiep-thi/in-card-visit",
						meta: {
							description: "In danh thiếp cá nhân, doanh nghiệp.",
							icon: "contact_page",
							badge: "Hot",
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
