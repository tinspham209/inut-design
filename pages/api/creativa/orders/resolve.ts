import { creativaApi } from "@/utils/creativa/api.server";
import { CreativaError, isRecord } from "@/utils/creativa/contracts";
import { resolveCreativaOrder } from "@/utils/creativa/orders.server";

export const config = { api: { bodyParser: false } };
export default creativaApi("POST", "submit", async (_req, body) => {
	if (!isRecord(body)) throw new CreativaError("INVALID_INPUT", "Yêu cầu khôi phục không hợp lệ.", 400);
	return resolveCreativaOrder(body.capability);
});
