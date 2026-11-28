import { defineConfig, type Plugin } from "vite";
import vinext from "vinext";
import { staticAssetsAdapter } from "@vinext/cloudflare/cache/static-assets-adapter";
import { cloudflare } from "@cloudflare/vite-plugin";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, realpathSync } from "node:fs";
import { createRequire } from "node:module";
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
const muiIconEsm = path.resolve(
	import.meta.dirname,
	"node_modules/@mui/icons-material/esm",
);
const muiRequire = createRequire(
	realpathSync(path.resolve(import.meta.dirname, "node_modules/@mui/material/package.json")),
);
const muiSystemEsm = path.join(path.dirname(muiRequire.resolve("@mui/system/package.json")), "esm");
const muiUtilsEsm = path.join(path.dirname(muiRequire.resolve("@mui/utils/package.json")), "esm");
const rtgEsm = path.join(
	path.dirname(muiRequire.resolve("react-transition-group/package.json")),
	"esm",
);
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

const deployedPaths = (): Plugin => {
	let building = false;
	const id = "virtual:inut-deployed-paths";
	return {
		name: "inut-deployed-paths",
		configResolved(config) { building = config.command === "build"; },
		resolveId(source) { return source === id ? `\0${id}` : null; },
		load(source) {
			if (source !== `\0${id}`) return null;
			const file = path.resolve(import.meta.dirname, "artifacts/migration/runtime/current-slugs.json");
			if (!existsSync(file)) {
				if (building) throw new Error("Missing current slug inventory; run pnpm migration:current-slugs");
				return "export default null";
			}
			const slugs = JSON.parse(readFileSync(file, "utf8"));
			const inventory = JSON.parse(readFileSync(path.resolve(import.meta.dirname, "scripts/migration/prerender-route-inventory.json"), "utf8"));
			if (slugs.validation?.status !== "pass" || !Array.isArray(slugs.paths) || !Array.isArray(inventory.publicPages)) throw new Error("Invalid deployed path inventory");
			const staticPages = inventory.publicPages.filter((file: string) => !file.includes("[")).map((file: string) => file.replace(/^pages/, "").replace(/\.(?:tsx?|jsx?)$/, "").replace(/\/index$/, "") || "/");
			return `export default ${JSON.stringify([...new Set([...slugs.paths, ...staticPages])])}`;
		},
	};
};

export default defineConfig({
	plugins: [
		deployedPaths(),
		patchCssModules({ exportMode: "default" }),
		browserFsFallback(),
		vinext({ cache: { cdn: staticAssetsAdapter() }, prerender: { routes: "*", concurrency: 2 } }),
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
		alias: [
			{ find: "sharp", replacement: workerSharp },
			{
				find: /^@mui\/icons-material\/(.+)$/,
				replacement: `${muiIconEsm}/$1.js`,
			},
			{
				find: /^@mui\/icons-material$/,
				replacement: `${muiIconEsm}/index.js`,
			},
			{
				find: /^@mui\/system\/(?!esm\/)(.+)$/,
				replacement: `${muiSystemEsm}/$1`,
			},
			{
				find: /^@mui\/system$/,
				replacement: `${muiSystemEsm}/index.js`,
			},
			{
				find: /^@mui\/utils\/(?!esm\/)(.+)$/,
				replacement: `${muiUtilsEsm}/$1`,
			},
			{
				find: /^@mui\/utils$/,
				replacement: `${muiUtilsEsm}/index.js`,
			},
			{
				find: /^react-transition-group\/(?!esm\/)(.+)$/,
				replacement: `${rtgEsm}/$1`,
			},
			{
				find: /^react-transition-group$/,
				replacement: `${rtgEsm}/index.js`,
			},
			...(backgroundRemovalEnabled
				? []
				: [{ find: "@imgly/background-removal", replacement: disabledBrowserImageRemoval }]),
		],
	},
	ssr: {
		optimizeDeps: {
			// Ensure CJS transitive deps imported by ESM-rewritten @mui/material subpaths
			// are pre-bundled to ESM for workerd during `vite dev`, and skip bundling `next`
			// (only imported for TypeScript types in Pages Router files).
			include: [
				"@mui/material > prop-types",
				"@mui/material > react-is",
				"@mui/material > prop-types > react-is",
			],
			exclude: ["next"],
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
