const RING_IDS = Array.from({ length: 10 }, (_, index) => {
	const value = `ring-${String(index + 1).padStart(2, "0")}`;
	return { title: `Móc ${String(index + 1).padStart(2, "0")}`, value };
});

const FRAME_OPTIONS = [
	["bear", "Gấu"], ["cat", "Mèo"], ["circle", "Tròn"], ["cloud", "Mây"],
	["diamond", "Kim cương"], ["drop", "Giọt nước"], ["flower", "Hoa"], ["heart", "Trái tim"],
	["hexagon", "Lục giác"], ["landscape", "Phong cảnh"], ["oval", "Oval"],
	["polaroid", "Polaroid"], ["portrait", "Chân dung"], ["rounded-square", "Vuông bo góc"],
	["rounded-star", "Sao bo góc"], ["shield", "Khiên"], ["speech-bubble", "Bong bóng thoại"], ["ticket", "Vé"],
].map(([value, title]) => ({ title, value }));

const ACRYLIC_OPTIONS = [
	["clear", "Trong suốt"], ["red", "Đỏ"], ["yellow", "Vàng"], ["orange", "Cam"],
	["green", "Xanh lá"], ["blue", "Xanh dương"], ["white", "Trắng"], ["black", "Đen"],
].map(([value, title]) => ({ title, value }));

const TRANSFORM_FIELDS = [
	{ name: "xMm", title: "Dịch ngang (mm)", type: "number" },
	{ name: "yMm", title: "Dịch dọc (mm)", type: "number" },
	{ name: "scale", title: "Tỷ lệ ảnh", type: "number" },
	{ name: "rotation", title: "Góc xoay (độ)", type: "number" },
	{ name: "flipX", title: "Lật ngang", type: "boolean" },
];

const IMAGE_FACE_FIELDS = [
	{ name: "image", title: "Ảnh gốc", type: "image", options: { hotspot: false } },
	{ name: "processedImage", title: "Ảnh đã xử lý nền", type: "image", options: { hotspot: false } },
	{
		name: "useProcessed", title: "Đang dùng ảnh đã xử lý", type: "boolean",
		description: "Ảnh gốc được giữ lại để có thể chuyển về bản ban đầu.",
	},
	{ name: "transform", title: "Vị trí ảnh", type: "object", fields: TRANSFORM_FIELDS },
	// Old snapshots stored derived CDN URLs. Keep them in the schema, hidden, so
	// Studio can still read those documents while new snapshots use asset refs.
	{ name: "url", type: "url", hidden: true },
	{ name: "processedUrl", type: "url", hidden: true },
];

export default {
	name: "keychainDesign",
	title: "Keychain Design Snapshot",
	type: "document",
	description: "Snapshot thiết kế móc khóa được tạo khi người dùng xuất ảnh.",
	fieldsets: [
		{ name: "design", title: "Cấu hình thiết kế", options: { collapsible: true, collapsed: false } },
		{ name: "legacy", title: "Trường tương thích cũ", options: { collapsible: true, collapsed: true } },
	],
	fields: [
		{
			name: "config",
			title: "Cấu hình thiết kế",
			type: "object",
			fieldset: "design",
			readOnly: true,
			fields: [
				{
					name: "version", title: "Phiên bản cấu hình", type: "number",
					validation: (Rule) => Rule.required().valid(1),
				},
				{
					name: "ringId", title: "Kiểu móc", type: "string",
					options: { list: RING_IDS }, validation: (Rule) => Rule.required().valid(...RING_IDS.map(({ value }) => value)),
				},
				{
					name: "shape", title: "Hình dạng", type: "object",
					fields: [
						{
							name: "type", title: "Kiểu tạo hình", type: "string",
							options: { list: [{ title: "Khung có sẵn", value: "frame" }, { title: "Cắt theo ảnh", value: "die-cut" }], layout: "radio" },
							validation: (Rule) => Rule.required().valid("frame", "die-cut"),
						},
						{
							name: "frameId", title: "Khung", type: "string",
							options: { list: FRAME_OPTIONS }, hidden: ({ parent }) => parent?.type !== "frame",
							validation: (Rule) => Rule.custom((value, context) => context.parent?.type === "frame" && !value ? "Cần chọn khung." : true),
						},
						{
							name: "paddingMm", title: "Khoảng viền cắt (mm)", type: "number",
							hidden: ({ parent }) => parent?.type !== "die-cut",
							validation: (Rule) => Rule.custom((value, context) => context.parent?.type === "die-cut" && (typeof value !== "number" || value < 1 || value > 20) ? "Giá trị phải từ 1 đến 20 mm." : true),
						},
						{
							name: "smoothness", title: "Độ mượt đường cắt", type: "number",
							hidden: ({ parent }) => parent?.type !== "die-cut",
							validation: (Rule) => Rule.custom((value, context) => context.parent?.type === "die-cut" && (typeof value !== "number" || value < 0 || value > 10) ? "Giá trị phải từ 0 đến 10." : true),
						},
					],
				},
				{ name: "sizeCm", title: "Kích thước thành phẩm (cm)", type: "number", validation: (Rule) => Rule.required().valid(3, 4, 5, 6, 7, 8, 9, 10) },
				{ name: "cutBorderPx", title: "Viền cắt ảnh (px)", type: "number", validation: (Rule) => Rule.min(0).max(80) },
				{ name: "acrylicId", title: "Màu mica", type: "string", options: { list: ACRYLIC_OPTIONS }, validation: (Rule) => Rule.required().valid(...ACRYLIC_OPTIONS.map(({ value }) => value)) },
				{ name: "printSides", title: "Số mặt in", type: "number", options: { list: [{ title: "1 mặt", value: 1 }, { title: "2 mặt", value: 2 }] }, validation: (Rule) => Rule.required().valid(1, 2) },
				{ name: "backMode", title: "Cách hiển thị mặt sau", type: "string", options: { list: [
					{ title: "Nhìn xuyên mica", value: "through-acrylic" }, { title: "Lót trắng", value: "white" },
					{ title: "Lật ảnh mặt trước", value: "mirror-front" }, { title: "Ảnh riêng", value: "custom" }, { title: "Màu vật liệu", value: "material" },
				] }, validation: (Rule) => Rule.required().valid("through-acrylic", "white", "mirror-front", "custom", "material") },
				{ name: "front", title: "Mặt trước", type: "object", fields: IMAGE_FACE_FIELDS },
				{ name: "backCustom", title: "Ảnh mặt sau riêng", type: "object", hidden: ({ parent }) => parent?.backMode !== "custom", fields: IMAGE_FACE_FIELDS },
				{ name: "material", title: "Vật liệu", type: "object", fields: [
					{ name: "edge", title: "Cạnh", type: "string", options: { list: [{ title: "Đánh bóng", value: "polished" }, { title: "Tự nhiên", value: "natural" }] }, validation: (Rule) => Rule.required().valid("polished", "natural") },
					{ name: "thicknessMm", title: "Độ dày (mm)", type: "number", options: { list: [2, 3, 5].map((value) => ({ title: `${value} mm`, value })) }, validation: (Rule) => Rule.required().valid(2, 3, 5) },
					{ name: "sheen", title: "Độ bóng", type: "number", validation: (Rule) => Rule.required().min(0).max(1) },
				] },
			],
		},
		// Deprecated fields remain hidden to support reading legacy documents and
		// to prevent Studio from presenting the same values twice.
		{ name: "configVersion", title: "Config Version (cũ)", type: "number", fieldset: "legacy", hidden: true, readOnly: true },
		{ name: "frontImage", title: "Ảnh mặt trước (cũ)", type: "image", fieldset: "legacy", hidden: true, readOnly: true },
		{ name: "backImage", title: "Ảnh mặt sau (cũ)", type: "image", fieldset: "legacy", hidden: true, readOnly: true },
		{ name: "createdAt", title: "Ngày tạo (cũ)", type: "datetime", fieldset: "legacy", hidden: true, readOnly: true },
		{ name: "requestId", title: "Request ID (cũ)", type: "string", fieldset: "legacy", hidden: true, readOnly: true },
		{ name: "requestFingerprint", title: "Request fingerprint (cũ)", type: "string", fieldset: "legacy", hidden: true, readOnly: true },
	],
	preview: {
		select: { shapeType: "config.shape.type", frameId: "config.shape.frameId", media: "config.front.image", createdAt: "_createdAt" },
		prepare: ({ shapeType, frameId, media, createdAt }) => ({
			title: shapeType === "die-cut" ? "Móc khóa · Cắt theo ảnh" : `Móc khóa · ${FRAME_OPTIONS.find((item) => item.value === frameId)?.title || "Thiết kế"}`,
			subtitle: createdAt ? new Date(createdAt).toLocaleString("vi-VN") : "Snapshot thiết kế",
			media,
		}),
	},
	orderings: [{ name: "createdAtDesc", title: "Mới nhất", by: [{ field: "_createdAt", direction: "desc" }] }],
};
