import type { ServiceCardProps } from "@/components/common/ServiceCard";

export const BUILDER_CARDS: ServiceCardProps[] = [
	{
		title: "Tự thiết kế bật lửa",
		description:
			"Tải ảnh lên, căn chỉnh vị trí thiết kế và xem trước trực quan trên mô hình bật lửa 3D.",
		image_url: "/branding/builders/lighter-builder-card-thumbnail.avif",
		href: "/builder/lighters",
		compact: true,
	},
	{
		title: "Tự thiết kế móc khóa mica",
		description:
			"Chọn khung hoặc cắt theo hình, kiểu khoen, kích thước và màu mica; tùy chỉnh hai mặt rồi tải ảnh xem trước.",
		image_url: "/branding/builders/keychain-builder-card-thumbnail.avif",
		href: "/builder/keychain",
		compact: true,
	},
];
