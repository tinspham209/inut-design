import { createDieCutGeometry, type DieCutGeometry } from "./dieCut";

type Request = { revision: number; width: number; height: number; alpha: ArrayBuffer; sizeCm: number; tolerancePx: number };
type Response = { revision: number; geometry?: DieCutGeometry; error?: string };

self.onmessage = (event: MessageEvent<Request>) => {
	const request = event.data;
	try {
		const alpha = new Uint8Array(request.alpha);
		const geometry = createDieCutGeometry({ width: request.width, height: request.height, alpha }, request.sizeCm, request.tolerancePx);
		const response: Response = { revision: request.revision, geometry };
		self.postMessage(response);
	} catch (error) {
		const response: Response = { revision: request.revision, error: error instanceof Error ? error.message : "Không thể tạo đường cắt." };
		self.postMessage(response);
	}
};
