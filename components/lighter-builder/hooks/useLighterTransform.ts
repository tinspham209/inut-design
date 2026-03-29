import { useState, useCallback } from "react";
import { LighterTransform } from "../types";
import { DEFAULT_TRANSFORM } from "../constants";

export function useLighterTransform() {
	const [transform, setTransform] = useState<LighterTransform>(DEFAULT_TRANSFORM);

	const updateTransform = useCallback((updates: Partial<LighterTransform>) => {
		setTransform((prev) => ({ ...prev, ...updates }));
	}, []);

	const resetTransform = useCallback(() => {
		setTransform(DEFAULT_TRANSFORM);
	}, []);

	const setPosition = useCallback((x: number, y: number) => {
		setTransform((prev) => ({ ...prev, scrollX: x, scrollY: y }));
	}, []);

	return {
		transform,
		updateTransform,
		resetTransform,
		setPosition,
	};
}
