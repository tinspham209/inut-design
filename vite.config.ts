import { defineConfig, type Plugin } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { createHash } from "node:crypto";
import { realpathSync } from "node:fs";
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
