import type { AcrylicId } from "@/components/keychain-builder/types";

export const FRAME_IDS = ["bear", "cat", "circle", "cloud", "diamond", "drop", "flower", "heart", "hexagon", "landscape", "oval", "polaroid", "portrait", "rounded-square", "rounded-star", "shield", "speech-bubble", "ticket"] as const;
export const FRAME_LABELS: Record<(typeof FRAME_IDS)[number], string> = {
	bear: "Gấu", cat: "Mèo", circle: "Tròn", cloud: "Mây", diamond: "Kim cương", drop: "Giọt nước", flower: "Hoa", heart: "Trái tim", hexagon: "Lục giác", landscape: "Phong cảnh", oval: "Oval", polaroid: "Polaroid", portrait: "Chân dung", "rounded-square": "Vuông bo góc", "rounded-star": "Sao bo góc", shield: "Khiên", "speech-bubble": "Bong bóng thoại", ticket: "Vé",
};
export const FRAMES = FRAME_IDS.map((id) => ({ id, label: FRAME_LABELS[id], src: `/keychain/frames/frame-${id}.svg`, masterHeightMm: 30, estimatedAnchor: { x: 50, y: 12 }, minSizeMm: 30, maxSizeMm: 100, demo: true, approval: "unapproved-demo" as const }));
export const RINGS = Array.from({ length: 10 }, (_, index) => ({ id: `ring-${String(index + 1).padStart(2, "0")}`, label: `Móc ${index + 1}`, src: `/keychain/rings/ring-${String(index + 1).padStart(2, "0")}.png`, estimatedAnchor: { x: 50, y: 12 }, demo: true, approval: "unapproved-demo" as const }));
export const ACRYLICS: Array<{ id: AcrylicId; label: string; opaque: boolean; color: string }> = [
	{ id: "clear", label: "Trong suốt", opaque: false, color: "rgba(182,226,255,.22)" },
	{ id: "red", label: "Đỏ", opaque: true, color: "#d85a5a" }, { id: "yellow", label: "Vàng", opaque: true, color: "#e7c747" },
	{ id: "orange", label: "Cam", opaque: true, color: "#ed8844" }, { id: "green", label: "Xanh lá", opaque: true, color: "#55a77a" },
	{ id: "blue", label: "Xanh dương", opaque: true, color: "#548ac5" }, { id: "white", label: "Trắng", opaque: true, color: "#f3f3ed" }, { id: "black", label: "Đen", opaque: true, color: "#30313a" },
];
export const SIZES_CM = [3, 4, 5, 6, 7, 8, 9, 10] as const;
