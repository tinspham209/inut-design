import { RINGS } from "@/data/keychain/catalog";
import type { FrameSvgData } from "../geometry/frameSvg";
import type { KeychainConfig } from "../types";
import { getFullKeychainHeight, renderKeychain2d, type ConnectorAssets, type RenderSide } from "./render2d";

export type PngScale = 1 | 2 | 3;
export type PngScope = "full-keychain" | "charm-only";

function loadLocalImage(src: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image(); image.onload = () => resolve(image); image.onerror = () => reject(new Error("Không tải được hình móc demo.")); image.src = src;
	});
}

export async function renderShowcasePng(frame: FrameSvgData, config: KeychainConfig, image?: CanvasImageSource, scale: PngScale = 1, scope: PngScope = "full-keychain", side: RenderSide = "front"): Promise<Blob> {
	const charmWidth = Math.round(config.sizeCm * 100 * scale);
	const ringSrc = RINGS.find((item) => item.id === config.ringId)?.src;
	if (scope === "full-keychain" && !ringSrc) throw new Error("Không tìm thấy móc demo trong catalog.");
	const ring = scope === "full-keychain" && ringSrc ? await loadLocalImage(ringSrc) : undefined;
	const outputHeight = Math.ceil(charmWidth * getFullKeychainHeight(frame, config, ring) / frame.viewBox[2]);
	if (charmWidth > 6000 || outputHeight > 6000 || charmWidth * outputHeight > 24_000_000) throw new Error("Kích thước xuất vượt giới hạn thiết bị. Hãy chọn tỷ lệ thấp hơn.");
	let connectors: ConnectorAssets | undefined;
	if (ring && config.ringId === "ring-01") {
		const names = ["keychain_01_f", "keychain_01_b", "keychain_02_f", "keychain_02_b", "keychain_03_f", "keychain_03_b", "keychain_tail_f", "keychain_tail_b"];
		const images = await Promise.all(names.map(loadLocalImage));
		connectors = { ring1Front: images[0], ring1Back: images[1], ring2Front: images[2], ring2Back: images[3], ring3Front: images[4], ring3Back: images[5], tailFront: images[6], tailBack: images[7] };
	}
	const output = document.createElement("canvas"); output.width = charmWidth; output.height = outputHeight;
	await renderKeychain2d(output, frame, config, image, side, ring, connectors);
	const blob = await new Promise<Blob | null>((resolve) => output.toBlob(resolve, "image/png"));
	output.width = 0; output.height = 0;
	if (!blob) throw new Error("Không thể tạo PNG trên thiết bị này");
	return blob;
}
