export const CREATIVA_SKIN_CATALOG = "/creativa/skin-laptop";

export type CreativaHomeStyle = {
	id: string;
	title: string;
	reveal: string;
	description: string;
	image: string;
	imageAlt: string;
	href: string;
	cta: string;
};

// Editorial previews, not CMS categories or filtered product lists.
export const CREATIVA_HOME_STYLES: CreativaHomeStyle[] = [
	{
		id: "minimal",
		title: "Tối giản",
		reveal: "vẫn có cá tính",
		description:
			"Những gam màu nhẹ và họa tiết tiết chế dành cho người thích sự gọn gàng nhưng không muốn chiếc MacBook trông quá quen thuộc.",
		image: "/creativa/homepage/minimal-concept.jpg",
		imageAlt: "MacBook tông kem trên bàn sáng, cạnh sổ tay và tách cà phê",
		href: CREATIVA_SKIN_CATALOG,
		cta: "Tìm gu trong bộ sưu tập",
	},
	{
		id: "bold",
		title: "Nổi bật",
		reveal: "theo cách của bạn",
		description:
			"Màu sắc và họa tiết có thể biến chiếc MacBook quen thuộc thành chi tiết mang dấu ấn riêng trên bàn làm việc.",
		image: "/creativa/homepage/bold-concept.jpg",
		imageAlt: "MacBook xanh slate trên nền ấm, cạnh những mảnh giấy màu",
		href: CREATIVA_SKIN_CATALOG,
		cta: "Khám phá bộ sưu tập",
	},
];

export type CreativaHomeSocial = {
	id: string;
	label: string;
	href?: string;
};

// Add approved profile URLs here; unconfigured channels are not clickable.
export const CREATIVA_HOME_SOCIALS: CreativaHomeSocial[] = [
	{ id: "instagram", label: "Instagram" },
	{ id: "facebook", label: "Facebook" },
	{ id: "tiktok", label: "TikTok" },
];

export const CREATIVA_HOME_DETAILS = [
	{
		id: "personal-style",
		title: "Dấu ấn cá nhân",
		description:
			"Tối giản, giàu chất nghệ thuật hay nổi bật cá tính — mỗi phong cách là một cách để chiếc MacBook nói lên điều bạn thích. Bắt đầu từ màu sắc và họa tiết hợp gu của bạn.",
	},
	{
		id: "see-the-design",
		title: "Nhìn rõ trước khi chọn",
		description:
			"Xem từng thiết kế và các góc ảnh trên trang sản phẩm trước khi quyết định. Những hình có nhãn “Ảnh concept AI” trên homepage chỉ minh họa cảm hứng hình ảnh, không phải ảnh chụp sản phẩm hay phản hồi của khách hàng.",
	},
	{
		id: "choose-your-model",
		title: "Chọn đúng dòng MacBook",
		description:
			"Đối chiếu dòng MacBook của bạn với các lựa chọn trên trang sản phẩm, sau đó chọn phạm vi dán phù hợp. Chưa chắc về model? Hãy kiểm tra thông tin máy trước khi thêm vào giỏ.",
	},
];
