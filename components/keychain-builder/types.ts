export type AcrylicId = "clear" | "red" | "yellow" | "orange" | "green" | "blue" | "white" | "black";
export type BackMode = "through-acrylic" | "white" | "mirror-front" | "custom" | "material";
export type ShapeConfig = { type: "frame"; frameId: string } | { type: "die-cut"; paddingMm: number; smoothness: number };
export type ImageTransform = { xMm: number; yMm: number; scale: number; rotation: number; flipX: boolean };
export type ImageFace = { image?: { _type: "image"; asset: { _ref: string; _type: "reference" } }; processedImage?: { _type: "image"; asset: { _ref: string; _type: "reference" } }; processedUrl?: string; url?: string; transform: ImageTransform; useProcessed?: boolean };
export type KeychainConfig = {
	version: 1; ringId: string; shape: ShapeConfig; sizeCm: number; acrylicId: AcrylicId; cutBorderPx?: number;
	printSides: 1 | 2; backMode: BackMode; front: ImageFace; backCustom?: ImageFace;
	material: { thicknessMm: number };
};
export type KeychainGeometry = { cutPath: string; printPath: string; viewBox: [number, number, number, number]; hole: { cx: number; cy: number; radiusMm: 2 }; anchor: { x: number; y: number }; revision: number };
export type KeychainApiError = { error: string };
export type KeychainDesignResponse = { id: string; url: string };
export type OperationRevision = { config: number; frontImage: number; backImage: number; geometry: number };
export type KeychainAction =
	| { type: "select-ring"; ringId: string }
	| { type: "select-frame"; frameId: string }
	| { type: "select-die-cut" }
	| { type: "set-size"; sizeCm: number }
	| { type: "set-cut-border"; cutBorderPx: number }
	| { type: "set-material"; material: Partial<KeychainConfig["material"]> }
	| { type: "select-acrylic"; acrylicId: AcrylicId }
	| { type: "confirm-opaque"; acrylicId: Exclude<AcrylicId, "clear"> }
	| { type: "set-back-mode"; backMode: Exclude<BackMode, "material"> }
	| { type: "set-print-sides"; printSides: 1 | 2 }
	| { type: "set-face"; face: "front" | "backCustom"; value: ImageFace }
	| { type: "load"; config: KeychainConfig }
	| { type: "set-view"; view: "front" | "back" }
	| { type: "set-preview"; preview: "2d" | "3d" }
	| { type: "reset" };
export type KeychainSession = { config: KeychainConfig; view: "front" | "back"; preview: "2d" | "3d"; revisions: { config: number; frontImage: number; backImage: number; geometry: number } };
