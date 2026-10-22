import { getCreativaCatalog } from "@/api-client/creativa-catalog";
import { creativaApi, scalarQuery } from "@/utils/creativa/api.server";

export default creativaApi("GET", "catalog", async (req) =>
	getCreativaCatalog(scalarQuery(req.query.q, "q"), scalarQuery(req.query.cursor, "cursor") || undefined));
