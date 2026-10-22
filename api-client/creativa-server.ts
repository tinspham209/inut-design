import sanityClient from "@sanity/client";
import { CreativaError } from "@/utils/creativa/contracts";

let cached: ReturnType<typeof sanityClient> | undefined;

export function creativaServerClient() {
	if (typeof window !== "undefined") throw new Error("Server-only Creativa adapter");
	const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
	const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET;
	const token = process.env.SANITY_TOKEN;
	if (!projectId || !dataset || !token) {
		throw new CreativaError("SERVICE_UNAVAILABLE", "Dịch vụ Creativa chưa sẵn sàng.", 503);
	}
	if (!cached)
		cached = sanityClient({
			projectId,
			dataset,
			token,
			apiVersion: "2022-09-19",
			useCdn: false,
			timeout: 10000,
		});
	return cached;
}
