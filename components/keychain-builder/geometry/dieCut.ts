import type { AlphaMask } from "./imageAlpha";

export type Point = { x: number; y: number };
export type ContourResult = { points: Point[]; areaPx: number; bounds: { minX: number; minY: number; maxX: number; maxY: number }; widthMm: number; heightMm: number; scale: number };
export type DieCutGeometry = ContourResult & { hole: { cx: number; cy: number; radiusMm: 2 }; outerPath: string; path: string };

const key = (point: Point) => `${point.x},${point.y}`;
function signedArea(points: Point[]) { let area = 0; for (let i = 0; i < points.length; i += 1) { const a = points[i]; const b = points[(i + 1) % points.length]; area += a.x * b.y - b.x * a.y; } return area / 2; }

function countComponents(mask: AlphaMask) {
	const seen = new Uint8Array(mask.alpha.length); const stack: number[] = []; let components = 0;
	for (let index = 0; index < mask.alpha.length; index += 1) {
		if (!mask.alpha[index] || seen[index]) continue;
		components += 1; if (components > 1) return components;
		seen[index] = 1; stack.push(index);
		while (stack.length) {
			const current = stack.pop(); if (current === undefined) continue;
			const x = current % mask.width; const y = Math.floor(current / mask.width);
			for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
				if (nx < 0 || ny < 0 || nx >= mask.width || ny >= mask.height) continue;
				const next = ny * mask.width + nx; if (mask.alpha[next] && !seen[next]) { seen[next] = 1; stack.push(next); }
			}
		}
	}
	return components;
}

function boundaryLoops(mask: AlphaMask) {
	const edges = new Map<string, Point[]>();
	const add = (start: Point, end: Point) => { const from = key(start); const list = edges.get(from) || []; list.push(end); edges.set(from, list); };
	const filled = (x: number, y: number) => x >= 0 && y >= 0 && x < mask.width && y < mask.height && mask.alpha[y * mask.width + x] === 1;
	for (let y = 0; y < mask.height; y += 1) for (let x = 0; x < mask.width; x += 1) if (filled(x, y)) {
		if (!filled(x, y - 1)) add({ x, y }, { x: x + 1, y });
		if (!filled(x + 1, y)) add({ x: x + 1, y }, { x: x + 1, y: y + 1 });
		if (!filled(x, y + 1)) add({ x: x + 1, y: y + 1 }, { x, y: y + 1 });
		if (!filled(x - 1, y)) add({ x, y: y + 1 }, { x, y });
	}
	const loops: Point[][] = [];
	while (edges.size) {
		const startKey = edges.keys().next().value as string; const [sx, sy] = startKey.split(",").map(Number);
		const points: Point[] = [{ x: sx, y: sy }]; let current = points[0]; let guard = mask.alpha.length * 4 + 4;
		while (guard-- > 0) {
			const from = key(current); const choices = edges.get(from); if (!choices?.length) break;
			const next = choices.pop(); if (!next) break; if (choices.length === 0) edges.delete(from);
			if (next.x === sx && next.y === sy) break;
			points.push(next); current = next;
		}
		if (points.length >= 3 && key(current) !== startKey) loops.push(points);
	}
	return loops;
}

function distanceToLine(point: Point, a: Point, b: Point) {
	const dx = b.x - a.x; const dy = b.y - a.y;
	if (dx === 0 && dy === 0) return Math.hypot(point.x - a.x, point.y - a.y);
	return Math.abs(dy * point.x - dx * point.y + b.x * a.y - b.y * a.x) / Math.hypot(dx, dy);
}
function simplifyOpen(points: Point[], tolerance: number): Point[] {
	if (points.length <= 2) return points;
	let farthest = 0; let index = 0;
	for (let i = 1; i < points.length - 1; i += 1) { const distance = distanceToLine(points[i], points[0], points[points.length - 1]); if (distance > farthest) { farthest = distance; index = i; } }
	if (farthest <= tolerance) return [points[0], points[points.length - 1]];
	return [...simplifyOpen(points.slice(0, index + 1), tolerance).slice(0, -1), ...simplifyOpen(points.slice(index), tolerance)];
}
export function simplifyClosed(points: Point[], tolerance = 1.5): Point[] {
	if (points.length < 4) return points;
	let farthestIndex = 1; let farthestDistance = 0;
	for (let i = 1; i < points.length; i += 1) { const distance = Math.hypot(points[i].x - points[0].x, points[i].y - points[0].y); if (distance > farthestDistance) { farthestDistance = distance; farthestIndex = i; } }
	const first = simplifyOpen(points.slice(0, farthestIndex + 1), tolerance);
	const second = simplifyOpen([...points.slice(farthestIndex), points[0]], tolerance);
	return [...first.slice(0, -1), ...second.slice(0, -1)];
}

export function traceDieCut(mask: AlphaMask, sizeCm: number, tolerancePx = 1.5): ContourResult {
	if (!Number.isInteger(mask.width) || !Number.isInteger(mask.height) || mask.width < 1 || mask.height < 1 || mask.alpha.length !== mask.width * mask.height) throw new Error("Alpha mask không hợp lệ");
	if (!Number.isInteger(sizeCm) || sizeCm < 3 || sizeCm > 10 || !Number.isFinite(tolerancePx) || tolerancePx < 0) throw new Error("Kích thước đường viền không hợp lệ");
	if (countComponents(mask) !== 1) throw new Error("Ảnh rỗng hoặc có nhiều mảnh rời; hãy chọn ảnh liền khối");
	const loops = boundaryLoops(mask).sort((a, b) => Math.abs(signedArea(b)) - Math.abs(signedArea(a)));
	if (!loops.length) throw new Error("Không tạo được đường viền ảnh");
	let points = simplifyClosed(loops[0], tolerancePx);
	if (points.length < 3) throw new Error("Đường viền ảnh quá nhỏ");
	const areaPx = Math.abs(signedArea(points)); if (!Number.isFinite(areaPx) || areaPx <= 1) throw new Error("Diện tích đường viền không hợp lệ");
	const xs = points.map((point) => point.x); const ys = points.map((point) => point.y);
	const bounds = { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
	const widthPx = bounds.maxX - bounds.minX; const heightPx = bounds.maxY - bounds.minY;
	if (widthPx <= 0 || heightPx <= 0 || !Number.isInteger(sizeCm) || sizeCm < 3 || sizeCm > 10) throw new Error("Đường viền vượt ngoài kích thước cho phép");
	const scale = (sizeCm * 10) / Math.max(widthPx, heightPx);
	points = points.map(({ x, y }) => ({ x: (x - bounds.minX) * scale, y: (y - bounds.minY) * scale }));
	return { points, areaPx, bounds, widthMm: widthPx * scale, heightMm: heightPx * scale, scale };
}

/**
 * Builds a die-cut outline from the front alpha mask, a 10 mm attachment ear,
 * and a reconstructed 4 mm hole. The output is already in millimeters and the
 * longest outer dimension includes the ear.
 */
export function createDieCutGeometry(mask: AlphaMask, sizeCm: number, tolerancePx = 1.5): DieCutGeometry {
	if (!Number.isInteger(mask.width) || !Number.isInteger(mask.height) || mask.width < 1 || mask.height < 1 || mask.alpha.length !== mask.width * mask.height) throw new Error("Alpha mask không hợp lệ");
	if (!Number.isInteger(sizeCm) || sizeCm < 3 || sizeCm > 10 || !Number.isFinite(tolerancePx) || tolerancePx < 0) throw new Error("Kích thước đường viền không hợp lệ");
	if (countComponents(mask) !== 1) throw new Error("Ảnh rỗng hoặc có nhiều mảnh rời; hãy chọn ảnh liền khối");
	let minX = mask.width; let maxX = -1; let minY = mask.height; let maxY = -1;
	for (let index = 0; index < mask.alpha.length; index += 1) if (mask.alpha[index]) {
		const x = index % mask.width; const y = Math.floor(index / mask.width);
		minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
	}
	const sourceWidth = maxX - minX + 1; const sourceHeight = maxY - minY + 1;
	const sizeMm = sizeCm * 10; const earRadiusMm = 5;
	const scaleMmPerSourcePx = Math.min(sizeMm / sourceWidth, (sizeMm - earRadiusMm) / sourceHeight);
	const pixelsPerMm = 6;
	const contentWidth = Math.max(1, Math.round(sourceWidth * scaleMmPerSourcePx * pixelsPerMm));
	const contentHeight = Math.max(1, Math.round(sourceHeight * scaleMmPerSourcePx * pixelsPerMm));
	const earRadiusPx = Math.round(earRadiusMm * pixelsPerMm);
	const width = contentWidth; const height = contentHeight + earRadiusPx;
	const alpha = new Uint8Array(width * height);
	for (let y = 0; y < contentHeight; y += 1) for (let x = 0; x < contentWidth; x += 1) {
		const sourceX = minX + Math.min(sourceWidth - 1, Math.floor(x / (contentWidth / sourceWidth)));
		const sourceY = minY + Math.min(sourceHeight - 1, Math.floor(y / (contentHeight / sourceHeight)));
		if (mask.alpha[sourceY * mask.width + sourceX]) alpha[(y + earRadiusPx) * width + x] = 1;
	}
	const centerX = (width - 1) / 2; const centerY = earRadiusPx;
	for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
		const distance = Math.hypot(x - centerX, y - centerY);
		if (distance <= earRadiusPx) alpha[y * width + x] = 1;
	}
	const holeRadiusPx = 2 * pixelsPerMm;
	for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
		if (Math.hypot(x - centerX, y - centerY) < holeRadiusPx) alpha[y * width + x] = 0;
	}
	const contour = traceDieCut({ width, height, alpha }, sizeCm, tolerancePx);
	const points = contour.points;
	const cx = centerX * contour.scale; const cy = centerY * contour.scale;
	const outerPath = `M ${points.map(({ x, y }) => `${x.toFixed(3)} ${y.toFixed(3)}`).join(" L ")} Z`;
	const path = `${outerPath} M ${(cx + 2).toFixed(3)} ${cy.toFixed(3)} A 2 2 0 1 0 ${(cx - 2).toFixed(3)} ${cy.toFixed(3)} A 2 2 0 1 0 ${(cx + 2).toFixed(3)} ${cy.toFixed(3)} Z`;
	return { ...contour, points, hole: { cx, cy, radiusMm: 2 }, outerPath, path };
}
