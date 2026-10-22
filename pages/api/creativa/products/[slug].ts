import { getCreativaProduct } from "@/api-client/creativa-catalog";
import { creativaApi, scalarQuery } from "@/utils/creativa/api.server";

export default creativaApi("GET", "catalog", async (req) => getCreativaProduct(scalarQuery(req.query.slug, "slug")));
