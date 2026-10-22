import { getCreativaOptions } from "@/api-client/creativa-catalog";
import { creativaApi } from "@/utils/creativa/api.server";

export default creativaApi("GET", "catalog", async () => getCreativaOptions());
