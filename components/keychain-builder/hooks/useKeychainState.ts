import { useReducer } from "react";
import type { AcrylicId, KeychainAction, KeychainConfig } from "@/components/keychain-builder/types";

export const initialKeychainConfig: KeychainConfig = {
	version: 1, ringId: "ring-01", shape: { type: "frame", frameId: "heart" }, sizeCm: 5,
	acrylicId: "clear", printSides: 1, backMode: "through-acrylic",
	front: { transform: { xMm: 0, yMm: 0, scale: 1, rotation: 0, flipX: false } },
	material: { edge: "polished", thicknessMm: 3, sheen: 0.35 },
};

export function keychainReducer(state: KeychainConfig, action: KeychainAction): KeychainConfig {
	switch (action.type) {
		case "select-ring": return { ...state, ringId: action.ringId };
		case "select-frame": return { ...state, shape: { type: "frame", frameId: action.frameId } };
		case "set-size": return { ...state, sizeCm: action.sizeCm };
		case "select-acrylic": return { ...state, acrylicId: action.acrylicId };
		case "confirm-opaque": return { ...state, acrylicId: action.acrylicId, printSides: 1, backMode: "material" };
		case "set-back-mode": return { ...state, backMode: action.backMode, printSides: action.backMode === "mirror-front" || action.backMode === "custom" ? 2 : 1 };
		case "set-print-sides": return { ...state, printSides: action.printSides, backMode: action.printSides === 1 ? "through-acrylic" : "mirror-front" };
		case "set-face": return action.face === "front" ? { ...state, front: action.value } : { ...state, backCustom: action.value };
		case "load": return action.config;
		case "reset": return initialKeychainConfig;
		default: return state;
	}
}

export function useKeychainState() {
	return useReducer(keychainReducer, initialKeychainConfig);
}

export function isOpaqueAcrylic(id: AcrylicId) { return id !== "clear"; }
