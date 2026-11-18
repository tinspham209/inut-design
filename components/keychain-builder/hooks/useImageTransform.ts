import { useCallback, useState } from "react";
import type { ImageTransform } from "../types";

export const defaultImageTransform: ImageTransform = { xMm: 0, yMm: 0, scale: 1, rotation: 0, flipX: false };
export function useImageTransform(initial = defaultImageTransform) {
	const [transform, setTransform] = useState(initial);
	const pan = useCallback((dxMm: number, dyMm: number) => setTransform((value) => ({ ...value, xMm: clamp(value.xMm + dxMm, -100, 100), yMm: clamp(value.yMm + dyMm, -100, 100) })), []);
	const zoom = useCallback((factor: number) => setTransform((value) => ({ ...value, scale: clamp(value.scale * factor, 0.1, 12) })), []);
	const rotate = useCallback((degrees: number) => setTransform((value) => ({ ...value, rotation: wrap(value.rotation + degrees) })), []);
	const flip = useCallback(() => setTransform((value) => ({ ...value, flipX: !value.flipX })), []);
	const reset = useCallback(() => setTransform(defaultImageTransform), []);
	return { transform, setTransform, pan, zoom, rotate, flip, reset, fit: reset };
}
function clamp(value: number, min: number, max: number) { return Math.max(min, Math.min(max, value)); }
function wrap(value: number) { return ((value % 360) + 360) % 360; }
