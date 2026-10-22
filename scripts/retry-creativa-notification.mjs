#!/usr/bin/env node
// Run with server environment configured:
// node scripts/retry-creativa-notification.mjs
//   --order=creativa.order.<uuid> --retry [--acknowledge-unknown]
import { register } from "node:module";

const args = process.argv.slice(2);
const orderId = args.find((arg) => arg.startsWith("--order="))?.slice("--order=".length);
if (!orderId || !/^creativa\.order\.[a-f0-9-]{36}$/.test(orderId) || !args.includes("--retry") ||
	args.some((arg) => !arg.startsWith("--order=") && !["--retry", "--acknowledge-unknown"].includes(arg))) {
	console.error("Usage: --order=creativa.order.<uuid> --retry [--acknowledge-unknown]");
	process.exitCode = 1;
} else {
	try {
		register("./typescript-loader.mjs", import.meta.url);
		register(`data:text/javascript,${encodeURIComponent(`
			export async function resolve(specifier, context, nextResolve) {
				return nextResolve(specifier.endsWith(".server") ? specifier + ".ts" : specifier, context);
			}
		`)}`, import.meta.url);
		const { dispatchNotifications } = await import("../utils/creativa/notifications.server.ts");
		await dispatchNotifications(orderId, {
			retry: true, acknowledgeUnknown: args.includes("--acknowledge-unknown"),
		});
		console.log("Retry routine completed. Inspect saved per-destination outcomes in authenticated Studio.");
	} catch {
		console.error("Retry did not complete. Inspect configuration and saved outcomes; reconcile unknown delivery before retry.");
		process.exitCode = 1;
	}
}
