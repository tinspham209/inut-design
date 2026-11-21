export type BuilderId = "keychain" | "lighter";

export interface BuilderDefinition {
	id: BuilderId;
	title: string;
	description: string;
	imageUrl: string;
	href: "/builder/keychain" | "/builder/lighters";
	badge?: string;
	priority: number;
}

export const BUILDERS: readonly BuilderDefinition[] = [
	{
		id: "keychain",
		title: "Tự thiết kế móc khóa mica",
		description:
			"Chọn khung hoặc cắt theo hình, kiểu khoen, kích thước và màu mica; tùy chỉnh hai mặt rồi tải ảnh xem trước.",
		imageUrl: "/branding/builders/keychain-builder-card-thumbnail.avif",
		href: "/builder/keychain",
		badge: "Mới",
		priority: 1,
	},
	{
		id: "lighter",
		title: "Tự thiết kế bật lửa",
		description:
			"Tải ảnh lên, căn chỉnh vị trí thiết kế và xem trước trực quan trên mô hình bật lửa 3D.",
		imageUrl: "/branding/builders/lighter-builder-card-thumbnail.avif",
		href: "/builder/lighters",
		priority: 2,
	},
];
