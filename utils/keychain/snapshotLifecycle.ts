export type KeychainSnapshot = { _id: string; requestFingerprint?: string; config: unknown; configVersion?: number; createdAt?: string };
export type SnapshotRepository = {
	readDirect: (id: string) => Promise<KeychainSnapshot | null>;
	createIfAbsent: (id: string, config: unknown) => Promise<void>;
};

export async function saveSnapshotIdempotently(requestId: string, config: unknown, requestFingerprint: string, repository: SnapshotRepository, legacyRequestFingerprint?: string) {
	const id = `keychainDesign.${requestId}`;
	const prior = await repository.readDirect(id);
	if (prior) return matchesFingerprint(prior, requestFingerprint, legacyRequestFingerprint) ? { status: "replay" as const, snapshot: prior } : { status: "conflict" as const };
	await repository.createIfAbsent(id, config);
	const saved = await repository.readDirect(id);
	if (!saved) throw new Error("Snapshot creation was not visible after write");
	if (!matchesFingerprint(saved, requestFingerprint, legacyRequestFingerprint)) return { status: "conflict" as const };
	return { status: "created" as const, snapshot: saved };
}

function matchesFingerprint(snapshot: KeychainSnapshot, current: string, legacy?: string) {
	if (snapshot.requestFingerprint === current || (legacy && snapshot.requestFingerprint === legacy)) return true;
	return createKeychainRequestFingerprint(snapshot.config) === current;
}

export async function readSnapshotById(requestId: string, repository: SnapshotRepository) {
	if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) return { status: 400 as const };
	const snapshot = await repository.readDirect(`keychainDesign.${requestId}`);
	if (!snapshot) return { status: 404 as const };
	return { status: 200 as const, snapshot };
}
import { createKeychainRequestFingerprint } from "@/utils/keychain/requestFingerprint";
