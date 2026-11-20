import type { KeychainConfig } from "../types";

export function getMaterialEdgeStyle(material: KeychainConfig["material"]) {
	const sheen = Math.max(0, Math.min(1, material.sheen));
	const thicknessMm = Math.max(2, Math.min(5, material.thicknessMm));
	return {
		color: material.edge === "polished"
			? `rgba(255,255,255,${0.35 + sheen * 0.45})`
			: `rgba(76,92,101,${0.35 + sheen * 0.3})`,
		widthMm: 0.22 + ((thicknessMm - 2) / 3) * 0.58,
	};
}
