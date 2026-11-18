import type { FrameSvgData } from "../geometry/frameSvg";
import type { KeychainConfig } from "../types";
import { renderKeychain2d } from "./render2d";

export async function renderShowcasePng(frame: FrameSvgData, config: KeychainConfig, image?: CanvasImageSource, scale: 1 | 2 | 3 = 1): Promise<Blob> {
	const sideMm = config.sizeCm * 10;
	const sidePx = sideMm * 10 * scale;
	if (sidePx > 6000) throw new Error("Kích thước xuất vượt giới hạn thiết bị. Hãy chọn tỷ lệ thấp hơn.");
	const canvas = document.createElement("canvas");
	const aspect = frame.viewBox[3] / frame.viewBox[2];
	canvas.width = Math.round(sidePx);
	canvas.height = Math.round(sidePx * aspect);
	await renderKeychain2d(canvas, frame, config, image);
	const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
	if (!blob) throw new Error("Không thể tạo PNG trên thiết bị này");
	return blob;
}
