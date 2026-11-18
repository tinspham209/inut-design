import type { FrameSvgData } from "../geometry/frameSvg";
import type { KeychainConfig } from "../types";

export async function renderKeychain2d(canvas: HTMLCanvasElement, frame: FrameSvgData, config: KeychainConfig, image?: CanvasImageSource) {
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Thiết bị không hỗ trợ Canvas 2D");
	const [x, y, width, height] = frame.viewBox;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	const path = new Path2D(frame.cutPath);
	ctx.save();
	ctx.scale(canvas.width / width, canvas.height / height);
	ctx.translate(-x, -y);
	ctx.fillStyle = config.acrylicId === "clear" ? "rgba(190,225,245,.28)" : config.acrylicId;
	ctx.fill(path);
	ctx.clip(path);
	if (image && config.front.url) {
		const transform = config.front.transform;
		ctx.translate(width / 2 + transform.xMm, height / 2 + transform.yMm);
		ctx.rotate((transform.rotation * Math.PI) / 180);
		ctx.scale(transform.scale * (transform.flipX ? -1 : 1), transform.scale);
		const source = image as CanvasImageSource & { width: number; height: number };
		const scale = Math.max(width * 0.72 / source.width, height * 0.72 / source.height);
		ctx.drawImage(source, -source.width * scale / 2, -source.height * scale / 2, source.width * scale, source.height * scale);
	}
	ctx.restore();
	ctx.save();
	ctx.scale(canvas.width / width, canvas.height / height);
	ctx.translate(-x, -y);
	ctx.strokeStyle = "#e6e8eb";
	ctx.lineWidth = 1.2;
	ctx.stroke(path);
	ctx.restore();
	return canvas;
}
