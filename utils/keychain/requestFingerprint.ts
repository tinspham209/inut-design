import { sha256Hex } from "@/utils/worker-crypto";

const TRANSIENT_KEYS = new Set(["view", "preview", "camera", "cameraState", "geometryRevision"]);

function canonicalize(value: unknown): unknown {
	if (Array.isArray(value)) return value.map(canonicalize);
	if (!value || typeof value !== "object") return value;
	return Object.keys(value as Record<string, unknown>).sort().reduce<Record<string, unknown>>((result, key) => {
		if (!TRANSIENT_KEYS.has(key)) result[key] = canonicalize((value as Record<string, unknown>)[key]);
		return result;
	}, {});
}

/** Stable SHA-256 fingerprint for the persisted design payload, excluding camera/view-only state. */
export function createKeychainRequestFingerprint(value: unknown) {
	return sha256Hex(JSON.stringify(canonicalize(value)));
}
