import { defineConfig, type Plugin } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { createHash } from "node:crypto";
import { patchCssModules } from "vite-css-modules";
import path from "node:path";
import { visualizer } from "rollup-plugin-visualizer";

const backgroundRemovalEnabled =
	process.env.NEXT_PUBLIC_KEYCHAIN_BACKGROUND_REMOVAL_ENABLED === "true";
const disabledBrowserImageRemoval = path.resolve(
	import.meta.dirname,
	"components/keychain-builder/image/backgroundRemovalDisabled.ts",
);
const workerSharp = path.resolve(import.meta.dirname, "utils/worker-sharp.ts");
const browserFsFallback = (): Plugin => ({
	name: "browser-fs-fallback",
	enforce: "pre",
	resolveId(source, _importer, options) {
		if (!options?.ssr && /^(?:node:)?fs(?:\/promises)?$/.test(source)) {
			return path.resolve(import.meta.dirname, "utils/browser-fs.ts");
		}
		return null;
	},
});

export default defineConfig({
	plugins: [
		patchCssModules({ exportMode: "default" }),
		browserFsFallback(),
		vinext(),
		cloudflare(),
		...(process.env.ANALYZE === "true"
			? [
					visualizer({
						filename: ".vinext/bundle-stats.html",
						gzipSize: true,
						brotliSize: true,
						open: false,
					}),
				]
			: []),
	],
	resolve: {
		alias: {
			sharp: workerSharp,
			...(backgroundRemovalEnabled ? {} : { "@imgly/background-removal": disabledBrowserImageRemoval }),
		},
	},
	css: {
		modules: {
			generateScopedName(name: string, filename: string) {
				const relativePath = path
					.relative(import.meta.dirname, filename.replace(/\?.*$/, ""))
					.replaceAll("\\", "/");
				return `_${name}_${createHash("sha256").update(relativePath).digest("hex").slice(0, 7)}`;
			},
		},
	},
});
