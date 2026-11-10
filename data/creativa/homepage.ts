export const HOME_CATALOG = "/creativa/skin-laptop";
export const HOME_GUIDES = `${HOME_CATALOG}/huong-dan-su-dung`;

export const HOME_MODELS = [
	{ id: "neo", name: "MacBook Neo", image: "/creativa/homepage/gingham.jpg" },
	{ id: "air", name: "MacBook Air", image: "/creativa/homepage/stripes.jpg" },
	{ id: "pro", name: "MacBook Pro", image: "/creativa/homepage/check.jpg" },
];

export const HOME_STYLES = [
	{
		id: "minimal",
		title: "Tối giản",
		image: "/creativa/homepage/editorial.jpg",
		alternate: "/creativa/homepage/creative.jpg",
	},
	{
		id: "creative",
		title: "Sáng tạo",
		image: "/creativa/homepage/gingham.jpg",
		alternate: "/creativa/homepage/product-concept.jpg",
	},
];

export const HOME_DETAILS = [
	{
		id: "print",
		title: "01. Họa tiết lên skin có rõ không?",
		content:
			"Tụi mình chăm chút cho từng đường nét và màu sắc. Hãy xem ảnh sản phẩm để chọn mẫu đúng gu.",
	},
	{
		id: "application",
		title: "02. Mình chưa từng dán skin thì sao?",
		content: "Cứ xem hướng dẫn và căn mép từng chút một. Bạn có thể hỏi INUT nếu cần hỗ trợ.",
	},
	{
		id: "removal",
		title: "03. Muốn đổi mẫu khác thì gỡ sao?",
		content:
			"Gỡ nhẹ tay, từ từ theo hướng dẫn sử dụng. Nếu chưa rõ cách tháo, nhắn INUT trước khi thực hiện.",
	},
	{
		id: "style",
		title: "04. Làm sao tìm mẫu hợp mình?",
		content: "Chọn họa tiết bạn muốn nhìn mỗi ngày, rồi kiểm tra đúng dòng MacBook trước khi đặt.",
	},
];

export const HOME_SOCIALS: Array<{ id: string; label: string; href?: string }> = [
	{ id: "instagram", label: "Instagram" },
	{ id: "facebook", label: "Facebook" },
	{ id: "tiktok", label: "TikTok" },
];
