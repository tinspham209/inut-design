import { creativaApi } from "@/utils/creativa/api.server";
import { submitCreativaOrder } from "@/utils/creativa/orders.server";

export const config = { api: { bodyParser: false } };
export default creativaApi("POST", "submit", async (req, body) => submitCreativaOrder(req.headers["idempotency-key"], body));
