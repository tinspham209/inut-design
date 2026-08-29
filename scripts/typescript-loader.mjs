import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function resolveFile(candidate) {
	const candidates = path.extname(candidate)
		? [candidate]
		: [`${candidate}.ts`, `${candidate}.tsx`, `${candidate}.js`, path.join(candidate, "index.ts")];

	for (const filePath of candidates) {
		try {
			await access(filePath);
			return pathToFileURL(filePath).href;
		} catch {
			// Try the next supported local source extension.
		}
	}
	return null;
}

export async function resolve(specifier, context, nextResolve) {
	if (specifier.startsWith("@/")) {
		const resolved = await resolveFile(path.join(repositoryRoot, specifier.slice(2)));
		if (resolved) return { url: resolved, shortCircuit: true };
	}

	if (
		(specifier.startsWith("./") || specifier.startsWith("../")) &&
		context.parentURL?.startsWith("file:")
	) {
		const parentPath = path.dirname(fileURLToPath(context.parentURL));
		const resolved = await resolveFile(path.resolve(parentPath, specifier));
		if (resolved) return { url: resolved, shortCircuit: true };
	}

	return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
	if (url.endsWith(".ts") || url.endsWith(".tsx")) {
		const source = await readFile(fileURLToPath(url), "utf8");
		const output = ts.transpileModule(source, {
			compilerOptions: {
				module: ts.ModuleKind.ESNext,
				target: ts.ScriptTarget.ES2022,
				jsx: ts.JsxEmit.ReactJSX,
			},
			fileName: fileURLToPath(url),
		});
		return {
			format: "module",
			source: output.outputText,
			shortCircuit: true,
		};
	}

	return nextLoad(url, context);
}
