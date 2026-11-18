export const HOLE_DIAMETER_MM = 4;
export type PointMm = { x: number; y: number };

export function mmToPx(valueMm: number, pxPerCm: number): number {
	return (valueMm / 10) * pxPerCm;
}

export function pxToMm(valuePx: number, pxPerCm: number): number {
	return (valuePx / pxPerCm) * 10;
}

export function frameScale(masterWidthMm: number, masterHeightMm: number, sizeCm: number) {
	if (![masterWidthMm, masterHeightMm, sizeCm].every(Number.isFinite) || masterWidthMm <= 0 || masterHeightMm <= 0 || sizeCm < 3 || sizeCm > 10) {
		throw new Error("Kích thước khung không hợp lệ");
	}
	return (sizeCm * 10) / Math.max(masterWidthMm, masterHeightMm);
}

export function scaleEnvelope(bounds: { minX: number; minY: number; maxX: number; maxY: number }, sizeCm: number) {
	const values = Object.values(bounds);
	if (!values.every(Number.isFinite) || bounds.maxX <= bounds.minX || bounds.maxY <= bounds.minY || !Number.isInteger(sizeCm) || sizeCm < 3 || sizeCm > 10) throw new Error("Đường viền vượt ngoài kích thước hỗ trợ");
	const sourceWidth = bounds.maxX - bounds.minX;
	const sourceHeight = bounds.maxY - bounds.minY;
	const scale = (sizeCm * 10) / Math.max(sourceWidth, sourceHeight);
	const widthMm = sourceWidth * scale;
	const heightMm = sourceHeight * scale;
	if (Math.max(widthMm, heightMm) > sizeCm * 10 + 0.01) throw new Error("Đường viền vượt ngoài kích thước đã chọn");
	return { scale, widthMm, heightMm };
}

export function reconstructHole(cx: number, cy: number) {
	if (!Number.isFinite(cx) || !Number.isFinite(cy)) throw new Error("Tọa độ lỗ không hợp lệ");
	return { cx, cy, radiusMm: HOLE_DIAMETER_MM / 2 as 2 };
}

export function holeAtMm(cx: number, cy: number, frameScaleFactor: number, masterHoleRadius: number, masterUnitsPerMm: number) {
	if (![cx, cy, frameScaleFactor, masterHoleRadius, masterUnitsPerMm].every(Number.isFinite) || masterUnitsPerMm <= 0) throw new Error("Tọa độ lỗ không hợp lệ");
	return { cx: cx * frameScaleFactor, cy: cy * frameScaleFactor, radiusMm: HOLE_DIAMETER_MM / 2, sourceRadiusMm: masterHoleRadius / masterUnitsPerMm };
}
