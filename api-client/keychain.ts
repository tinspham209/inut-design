export type KeychainImage = { _type: "image"; asset: { _ref: string; _type: "reference" } };
export type KeychainUploadResponse = { image: KeychainImage; url: string };
export type KeychainSnapshotResponse = { id: string; url: string };

export async function saveKeychainSnapshot(config: unknown, requestId: string): Promise<KeychainSnapshotResponse> {
	const response = await fetch("/api/keychain/designs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ requestId, config }) });
	const payload: unknown = await response.json();
	if (!response.ok) throw new Error(
		typeof (payload as { error?: unknown })?.error === "string"
			? (payload as { error: string }).error
			: "Không lưu được thiết kế."
	);
	return payload as KeychainSnapshotResponse;
}

export async function readKeychainSnapshot(id: string): Promise<{ id: string; configVersion: number; config: unknown }> {
	const response = await fetch(`/api/keychain/designs/${encodeURIComponent(id)}`, { cache: "no-store" });
	const payload: unknown = await response.json();
	if (!response.ok) throw new Error(
		typeof (payload as { error?: unknown })?.error === "string"
			? (payload as { error: string }).error
			: "Không tải được thiết kế."
	);
	return payload as { id: string; configVersion: number; config: unknown };
}

export async function uploadKeychainImage(file: File): Promise<KeychainUploadResponse> {
	if (!/^image\/(png|jpeg|webp)$/.test(file.type)) throw new Error("Chỉ hỗ trợ ảnh PNG, JPEG và WebP.");
	if (file.size > 10 * 1024 * 1024) throw new Error("Ảnh không được vượt quá 10 MB.");
	const prepared = await prepareSanityImageUpload(file);
	const data = new Uint8Array(await prepared.arrayBuffer());
	let binary = "";
	for (let offset = 0; offset < data.length; offset += 0x8000) binary += String.fromCharCode(...data.subarray(offset, offset + 0x8000));
	const response = await fetch("/api/keychain/uploads", {
		method: "POST", headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ data: btoa(binary), contentType: prepared.type || file.type, filename: file.name }),
	});
	const payload: unknown = await response.json();
	const imagePayload = payload as Partial<KeychainUploadResponse> & { error?: unknown };
	if (!response.ok) throw new Error(
		typeof imagePayload.error === "string" ? imagePayload.error : "Không tải được ảnh. Vui lòng thử lại."
	);
	if (!imagePayload.image?.asset?._ref || typeof imagePayload.url !== "string") throw new Error("Máy chủ trả về thông tin ảnh không hợp lệ.");
	return payload as KeychainUploadResponse;
}
import { prepareSanityImageUpload } from "@/api-client/sanity-upload";
