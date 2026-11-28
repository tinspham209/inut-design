import handler from "vinext/server/fetch-handler";
import paths from "virtual:inut-deployed-paths";
import { isUndeployedProductPath } from "./deployed-paths";

export * from "vinext/server/fetch-handler";

const deployed = paths ? new Set(paths) : null;

const worker = {
	async fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> {
		const url = new URL(request.url);
		if ((request.method === "GET" || request.method === "HEAD") && isUndeployedProductPath(url.pathname, deployed)) {
			if (url.pathname.startsWith("/_next/data/")) {
				return new Response(request.method === "HEAD" ? null : JSON.stringify({ notFound: true }), {
					status: 404,
					headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" },
				});
			}
			const notFoundUrl = new URL("/404", request.url);
			const response = await handler.fetch(new Request(notFoundUrl, request), env, ctx);
			return new Response(response.body, { status: 404, headers: response.headers });
		}
		return handler.fetch(request, env, ctx);
	},
};

export default worker;
