import { RINGS } from "@/data/keychain/catalog";
import type { FrameSvgData } from "../geometry/frameSvg";
import type { KeychainConfig } from "../types";
import { renderKeychain2d, type RenderSide } from "./render2d";

export type PngScale = 1 | 2 | 3;
export type PngScope = "full-keychain" | "charm-only";

function loadLocalImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image(); image.onload = () => resolve(image); image.onerror = () => reject(new Error("Không tải được hình móc demo.")); image.src = src;
	});
}

export async function renderShowcasePng(frame: FrameSvgData, config: KeychainConfig, image?: CanvasImageSource, scale: PngScale = 1, scope: PngScope = "full-keychain", side: RenderSide = "front"): Promise<Blob> {
	const charmWidth = Math.round(config.sizeCm * 100 * scale);
	const aspect = frame.viewBox[3] / frame.viewBox[2];
	const charmHeight = Math.round(charmWidth * aspect);
	if (charmWidth > 6000 || charmHeight > 6000 || charmWidth * charmHeight > 24_000_000) throw new Error("Kích thước xuất vượt giới hạn thiết bị. Hãy chọn tỷ lệ thấp hơn.");
	const charm = document.createElement("canvas"); charm.width = charmWidth; charm.height = charmHeight;
	await renderKeychain2d(charm, frame, config, image, side);
	const ringSrc = RINGS.find((item) => item.id === config.ringId)?.src;
	if (scope === "full-keychain" && !ringSrc) throw new Error("Không tìm thấy móc demo trong catalog.");
	const ring = scope === "full-keychain" && ringSrc ? await loadLocalImage(ringSrc) : undefined;
	const ringHeight = ring ? Math.round(charmWidth * 0.34) : 0;
	const output = document.createElement("canvas"); output.width = charmWidth; output.height = charmHeight + ringHeight;
	const ctx = output.getContext("2d");
	if (!ctx) throw new Error("Thiết bị không hỗ trợ Canvas 2D");
	if (ring) {
		const ringWidth = Math.round(charmWidth * 0.38);
		ctx.drawImage(ring, (charmWidth - ringWidth) / 2, 0, ringWidth, ringHeight);
	}
	ctx.drawImage(charm, 0, ringHeight);
	const blob = await new Promise<Blob | null>((resolve) => output.toBlob(resolve, "image/png"));
	charm.width = 0; charm.height = 0; output.width = 0; output.height = 0;
	if (!blob) throw new Error("Không thể tạo PNG trên thiết bị này");
	return blob;
}
