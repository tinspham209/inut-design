export default {
	name: "configStaticContentEachPage",
	title: "Config Static Content Each Page 📄",
	type: "document",
	fields: [
		{
			name: "name",
			title: "Name",
			type: "string",
			description: "Tên page.",
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
			name: "camKetMuaHang",
			title: "Cam Kết Mua Hàng",
			type: "blockContent",
			description: "Nội dung của section Cam kết mua hàng",
		},
		{
			name: "moTaSanPham",
			title: "Mô Tả Sản Phẩm",
			type: "blockContent",
			description: "Nội dung của section Mô tả sản phẩm trên trang product và macnut detail.",
		},
	],
	preview: {
		select: {
			name: "name",
			slug: "slug.current",
		},
		prepare(selection) {
			const { name, slug } = selection;
			return {
				title: `${name || "(No name)"}`,
				subtitle: `Slug: /${slug || "(no-slug)"}`,
			};
		},
	},
};
