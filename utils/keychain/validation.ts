import { ACRYLICS, FRAMES, RINGS, SIZES_CM } from "@/data/keychain/catalog";
import type { KeychainConfig } from "@/components/keychain-builder/types";

export function isFiniteIn(value: unknown, min: number, max: number): value is number {
	return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

export function validateKeychainConfig(value: unknown): value is KeychainConfig {
	if (!value || typeof value !== "object") return false;
	const config = value as Partial<KeychainConfig>;
	if (config.version !== 1 || !RINGS.some((item) => item.id === config.ringId)) return false;
	if (!SIZES_CM.includes(config.sizeCm as (typeof SIZES_CM)[number])) return false;
	if (!ACRYLICS.some((item) => item.id === config.acrylicId)) return false;
	if (!config.shape) return false;
	if (config.shape.type === "frame") {
		const frameId = config.shape.frameId;
		if (!FRAMES.some((item) => item.id === frameId)) return false;
	}
	if (config.shape.type === "die-cut" && (!isFiniteIn(config.shape.paddingMm, 1, 20) || !isFiniteIn(config.shape.smoothness, 0, 10))) return false;
	if (config.acrylicId === "clear") {
		if (config.printSides === 1 && !["through-acrylic", "white"].includes(config.backMode || "")) return false;
		if (config.printSides === 2 && !["mirror-front", "custom"].includes(config.backMode || "")) return false;
	} else if (config.printSides !== 1 || config.backMode !== "material") return false;
	return Boolean(config.front && validTransform(config.front.transform) && config.material && isFiniteIn(config.material.thicknessMm, 1, 10) && isFiniteIn(config.material.sheen, 0, 1));
}

export function validTransform(transform: unknown): boolean {
	if (!transform || typeof transform !== "object") return false;
	const t = transform as Record<string, unknown>;
	return isFiniteIn(t.xMm, -200, 200) && isFiniteIn(t.yMm, -200, 200) && isFiniteIn(t.scale, 0.05, 20) && isFiniteIn(t.rotation, -3600, 3600) && typeof t.flipX === "boolean";
}
