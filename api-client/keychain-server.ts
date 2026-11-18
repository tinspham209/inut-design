import sanityClient from "@sanity/client";
import { createKeychainRequestFingerprint } from "@/utils/keychain/requestFingerprint";
import type { SnapshotRepository } from "@/utils/keychain/snapshotLifecycle";

const client = sanityClient({
	projectId: process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET,
	token: process.env.SANITY_TOKEN, apiVersion: "2022-09-19", useCdn: false,
});

export function fingerprint(value: unknown) {
	return createKeychainRequestFingerprint(value);
}
export const keychainSnapshotRepository: SnapshotRepository = {
	readDirect: async (id) => client.getDocument(id),
	createIfAbsent: async (id, requestId, config, requestFingerprint) => {
		const value = config as { version?: number; front?: { image?: unknown }; backCustom?: { image?: unknown } };
		const doc = { _id: id, _type: "keychainDesign", configVersion: value.version, config, frontImage: value.front?.image, backImage: value.backCustom?.image, createdAt: new Date().toISOString(), requestId, requestFingerprint };
		await client.mutate([{ createIfNotExists: doc }], { returnDocuments: false, visibility: "sync" });
	},
};
