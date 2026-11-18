import type { KeychainConfig } from "@/components/keychain-builder/types";
import { validateKeychainConfig } from "@/utils/keychain/validation";

type KeychainImage = { _type: "image"; asset: { _ref: string; _type: "reference" } };

const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SANITY_IMAGE_REF = /^image-[a-f0-9]+-\d+x\d+-(?:png|jpe?g|webp|gif)$/i;

export function isKeychainRequestId(value: unknown): value is string {
	return typeof value === "string" && UUID_V4.test(value);
}

export function isSanityImageReference(value: unknown): value is KeychainImage {
	if (!value || typeof value !== "object") return false;
	const image = value as Partial<KeychainImage>;
	return image._type === "image" && image.asset?._type === "reference" && typeof image.asset._ref === "string" && SANITY_IMAGE_REF.test(image.asset._ref);
}

export function validateKeychainServerConfig(value: unknown): value is KeychainConfig {
	if (!validateKeychainConfig(value)) return false;
	const config = value as KeychainConfig;
	const faces = [config.front, config.backCustom].filter(Boolean);
	for (const face of faces) {
		if (face?.image && !isSanityImageReference(face.image)) return false;
		if (face?.processedImage && !isSanityImageReference(face.processedImage)) return false;
		if (face?.processedUrl && !isSanityAssetUrl(face.processedUrl, face.processedImage)) return false;
		if (face?.url && !isSanityAssetUrl(face.url, face.image)) return false;
	}
	return true;
}

function isSanityAssetUrl(value: string, image?: KeychainImage) {
	try {
		const url = new URL(value);
		if (url.protocol !== "https:" || url.hostname !== "cdn.sanity.io" || url.username || url.password) return false;
		if (!/^\/images\/[a-z0-9]+\/[a-z0-9-]+\//i.test(url.pathname)) return false;
		const assetId = image?.asset?._ref;
	const assetHash = assetId?.match(/^image-([a-f0-9]+)-/i)?.[1];
		return Boolean(assetHash && new RegExp(`/${assetHash}-[^/]+\\.[a-z0-9]+$`, "i").test(url.pathname));
	} catch { return false; }
}
