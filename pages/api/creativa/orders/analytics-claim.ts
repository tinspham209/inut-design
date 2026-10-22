import { claimCreativaAnalytics } from "@/utils/creativa/analytics.server";
import { creativaApi } from "@/utils/creativa/api.server";

export const config = { api: { bodyParser: false } };
export default creativaApi("POST", "analytics", async (_req, body) => claimCreativaAnalytics(body));
