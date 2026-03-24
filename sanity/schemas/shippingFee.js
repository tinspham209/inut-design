export default {
	name: "shippingFee",
	title: "Shipping Fee 🚚",
	type: "document",
	fields: [
		{
			name: "name",
			title: "Name",
			type: "string",
			description:
				"Tên cấu hình / khu vực / phương thức vận chuyển (ví dụ: 'Nội thành Đà Nẵng', 'Toàn quốc', 'Giao nhanh').",
			validation: (Rule) => Rule.required(),
		},
		{
			name: "slug",
			title: "Slug",
			description: "Vui lòng không chỉnh sửa trừ khi bạn biết mình đang làm gì.",
			type: "slug",
			options: {
				source: "name",
				maxLength: 90,
			},
			validation: (Rule) => Rule.required(),
		},
		{
			name: "fee",
			title: "Fee (VND)",
			type: "number",
			description: "Phí vận chuyển (đơn vị: VND).",
			validation: (Rule) => Rule.required().min(0),
			initialValue: 0,
		},
		{
			name: "note",
			title: "Note",
			type: "text",
			description: "Ghi chú hiển thị cho khách hàng hoặc nội bộ (tùy chọn).",
		},
	],
	preview: {
		select: {
			name: "name",
			fee: "fee",
			note: "note",
			slug: "slug.current",
		},
		prepare(selection) {
			const { name, slug, fee, note } = selection;
			return {
				title: `${name || "(No name)"}`,
				subtitle: `${fee !== undefined ? fee.toLocaleString() : 0}₫${
					note ? " • " + slug + " • " + note.slice(0, 40) : ""
				}`,
			};
		},
	},
	orderings: [
		{
			name: "feeAsc",
			title: "Fee (Low → High)",
			by: [{ field: "fee", direction: "asc" }],
		},
		{
			name: "feeDesc",
			title: "Fee (High → Low)",
			by: [{ field: "fee", direction: "desc" }],
		},
		{
			name: "nameAsc",
			title: "Name (A → Z)",
			by: [{ field: "name", direction: "asc" }],
		},
	],
};
