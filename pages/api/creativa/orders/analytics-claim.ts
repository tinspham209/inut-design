import { creativaApi } from "@/utils/creativa/api.server";
import { CreativaError } from "@/utils/creativa/contracts";

export const config = { api: { bodyParser: false } };
export default creativaApi("POST", "analytics", async () => {
	throw new CreativaError(
		"ANALYTICS_CLAIMS_RETIRED",
		"Đo lường không còn ghi nhận quyền gửi vào Sanity. Đơn hàng không bị ảnh hưởng.",
		410
	);
});
