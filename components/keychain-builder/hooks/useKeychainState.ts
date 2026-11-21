import { useReducer } from "react";
import type { AcrylicId, KeychainAction, KeychainConfig, KeychainSession } from "@/components/keychain-builder/types";

export const initialKeychainConfig: KeychainConfig = {
	version: 1, ringId: "ring-01", shape: { type: "frame", frameId: "heart" }, sizeCm: 5, cutBorderPx: 20,
	acrylicId: "clear", printSides: 1, backMode: "through-acrylic",
	front: { transform: { xMm: 0, yMm: 0, scale: 1, rotation: 0, flipX: false } },
	material: { thicknessMm: 3 },
};

export function keychainReducer(state: KeychainConfig, action: KeychainAction): KeychainConfig {
	switch (action.type) {
		case "select-ring": return { ...state, ringId: action.ringId };
		case "select-frame": return { ...state, shape: { type: "frame", frameId: action.frameId } };
		case "select-die-cut": return { ...state, shape: { type: "die-cut", paddingMm: 5, smoothness: 4 } };
		case "set-size": {
			const maximumCutBorderPx = Math.max(0, Math.min(80, (action.sizeCm * 10 - 6) * 2));
			return { ...state, sizeCm: action.sizeCm, cutBorderPx: Math.min(state.cutBorderPx ?? 20, maximumCutBorderPx) };
		}
		case "set-cut-border": return { ...state, cutBorderPx: Math.max(0, Math.min(80, action.cutBorderPx)) };
		case "set-material": return { ...state, material: { thicknessMm: action.material.thicknessMm ?? state.material.thicknessMm } };
		case "select-acrylic": return action.acrylicId === "clear"
			? { ...state, acrylicId: "clear", printSides: 1, backMode: "through-acrylic" }
			: { ...state, acrylicId: action.acrylicId, printSides: 1, backMode: "material" };
		case "confirm-opaque": return { ...state, acrylicId: action.acrylicId, printSides: 1, backMode: "material" };
		case "set-back-mode": return { ...state, backMode: action.backMode, printSides: action.backMode === "mirror-front" || action.backMode === "custom" ? 2 : 1 };
		case "set-print-sides": return { ...state, printSides: action.printSides, backMode: action.printSides === 1 ? "through-acrylic" : "mirror-front" };
		case "set-face": return action.face === "front" ? { ...state, front: action.value } : { ...state, backCustom: action.value };
		case "load": return { ...action.config, material: { thicknessMm: action.config.material.thicknessMm } };
		case "set-view":
		case "set-preview": return state;
		case "reset": return initialKeychainConfig;
		default: return state;
	}
}

const initialSession: KeychainSession = { config: initialKeychainConfig, view: "front", preview: "2d", revisions: { config: 0, frontImage: 0, backImage: 0, geometry: 0 } };
function sessionReducer(state: KeychainSession, action: KeychainAction): KeychainSession {
	if (action.type === "set-view") return { ...state, view: action.view };
	if (action.type === "set-preview") return { ...state, preview: action.preview };
	const config = keychainReducer(state.config, action);
	const isFront = action.type === "set-face" && action.face === "front";
	const isBack = action.type === "set-face" && action.face === "backCustom";
	const currentFrontSource = state.config.front.useProcessed && state.config.front.processedUrl ? state.config.front.processedUrl : state.config.front.url;
	const nextFront = action.type === "set-face" && action.face === "front" ? action.value : state.config.front;
	const nextFrontSource = nextFront.useProcessed && nextFront.processedUrl ? nextFront.processedUrl : nextFront.url;
	const processedAssetSaved = isFront && state.config.front.useProcessed && nextFront.useProcessed && state.config.front.url === nextFront.url && state.config.front.processedUrl?.startsWith("blob:") && nextFront.processedUrl?.startsWith("https://cdn.sanity.io/");
	const frontImageSourceChanged = isFront && currentFrontSource !== nextFrontSource && !processedAssetSaved;
	const changesGeometry = action.type === "select-frame" || action.type === "select-die-cut" || action.type === "set-size" || action.type === "set-cut-border" || action.type === "load" || action.type === "reset" || frontImageSourceChanged;
	return {
		...state, config,
		revisions: {
			config: state.revisions.config + 1,
			frontImage: state.revisions.frontImage + Number(isFront),
			backImage: state.revisions.backImage + Number(isBack),
			geometry: state.revisions.geometry + Number(changesGeometry),
		},
	};
}

export function useKeychainState() {
	const [session, dispatch] = useReducer(sessionReducer, initialSession);
	return [session.config, dispatch, session] as const;
}

export function isOpaqueAcrylic(id: AcrylicId) { return id !== "clear"; }
