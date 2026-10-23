import type { CreativaDescription } from "@/models/creativa";
import { CreativaError, isRecord, validCreativaImageRef } from "./contracts";

function invalidDescription(): never {
	throw new CreativaError("CONFIGURATION_ERROR", "Mô tả sản phẩm Creativa không hợp lệ.", 503);
}

export function parseCreativaDescription(value: unknown): CreativaDescription | undefined {
	if (value === undefined || value === null) return undefined;
	if (typeof value === "string") return value;
	if (!Array.isArray(value)) return invalidDescription();
	return value.map((node) => {
		if (!isRecord(node)) return invalidDescription();
		if (node._type === "image") {
			if (
				!isRecord(node.asset) ||
				node.asset._type !== "reference" ||
				!validCreativaImageRef(node.asset._ref) ||
				(node.alt !== undefined && typeof node.alt !== "string")
			)
				return invalidDescription();
			return {
				_type: "image" as const,
				asset: { _type: "reference", _ref: node.asset._ref },
				...(typeof node._key === "string" && { _key: node._key }),
				...(typeof node.alt === "string" && { alt: node.alt }),
			};
		}
		const listItem = node.listItem;
		if (
			node._type !== "block" ||
			!Array.isArray(node.children) ||
			(node.style !== undefined &&
				(typeof node.style !== "string" ||
					!["normal", "h1", "h2", "h3", "h4", "blockquote"].includes(node.style))) ||
			(listItem !== undefined && listItem !== "bullet" && listItem !== "number") ||
			(node.level !== undefined &&
				(typeof node.level !== "number" || !Number.isSafeInteger(node.level) || node.level < 1)) ||
			(node.markDefs !== undefined && !Array.isArray(node.markDefs))
		)
			return invalidDescription();
		const markDefs = (Array.isArray(node.markDefs) ? node.markDefs : []).map((mark: unknown) => {
			if (
				!isRecord(mark) ||
				typeof mark._key !== "string" ||
				!mark._key ||
				mark._type !== "link" ||
				typeof mark.href !== "string" ||
				!mark.href.trim()
			)
				return invalidDescription();
			let url: URL;
			try {
				url = new URL(mark.href, "https://inutdesign.com");
			} catch {
				return invalidDescription();
			}
			if (
				!["https:", "http:", "mailto:", "tel:"].includes(url.protocol) ||
				url.username ||
				url.password
			)
				return invalidDescription();
			return { _key: mark._key, _type: "link" as const, href: mark.href };
		});
		if (new Set(markDefs.map((mark) => mark._key)).size !== markDefs.length)
			return invalidDescription();
		const marks = new Set(["strong", "em", ...markDefs.map((mark) => mark._key)]);
		const children = node.children.map((span: unknown) => {
			if (
				!isRecord(span) ||
				span._type !== "span" ||
				typeof span.text !== "string" ||
				(span.marks !== undefined &&
					(!Array.isArray(span.marks) ||
						span.marks.some((mark) => typeof mark !== "string" || !marks.has(mark))))
			)
				return invalidDescription();
			return {
				_type: "span" as const,
				text: span.text,
				...(typeof span._key === "string" && { _key: span._key }),
				...(Array.isArray(span.marks) && { marks: span.marks }),
			};
		});
		return {
			_type: "block" as const,
			...(typeof node._key === "string" && { _key: node._key }),
			...(typeof node.style === "string" && { style: node.style }),
			...((listItem === "bullet" || listItem === "number") && { listItem }),
			...(typeof node.level === "number" && { level: node.level }),
			children,
			markDefs,
		};
	});
}

export function creativaDescriptionText(description: CreativaDescription | undefined): string {
	if (typeof description === "string") return description.trim();
	return (description || [])
		.filter((node) => node._type === "block")
		.map((node) => (node._type === "block" ? node.children.map((span) => span.text).join("") : ""))
		.join("\n\n")
		.trim();
}
