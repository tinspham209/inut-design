import { creativaApi, scalarQuery } from "@/utils/creativa/api.server";
import { getCreativaOrder } from "@/utils/creativa/orders.server";

export default creativaApi("GET", "lookup", async (req) => getCreativaOrder(scalarQuery(req.query.publicId, "publicId")));
