import sanityClient from "@sanity/client";
import { createKeychainRequestFingerprint } from "@/utils/keychain/requestFingerprint";

const client = sanityClient({
	projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET,
	token: process.env.SANITY_TOKEN, apiVersion: "2022-09-19", useCdn: false,
});

export function fingerprint(value: unknown) {
	return createKeychainRequestFingerprint(value);
}
export async function getKeychainSnapshot(id: string) {
	return client.getDocument(id);
}
export async function createKeychainSnapshot(requestId: string, config: Record<string, any>, requestFingerprint: string) {
	const id = `keychainDesign.${requestId}`;
	const doc = { _id: id, _type: "keychainDesign", configVersion: config.version, config, frontImage: config.front?.image, backImage: config.backCustom?.image, createdAt: new Date().toISOString(), requestId, requestFingerprint };
	await client.mutate([{ createIfNotExists: doc }], { returnDocuments: false, visibility: "sync" });
	return client.getDocument(id);
}
