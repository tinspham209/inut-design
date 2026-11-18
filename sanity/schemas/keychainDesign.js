export default {
	name: "keychainDesign",
	title: "Keychain Design Snapshot",
	type: "document",
	fields: [
		{ name: "configVersion", title: "Config Version", type: "number", validation: (Rule) => Rule.required().min(1).max(1) },
		{ name: "config", title: "Design Configuration", type: "object", fields: [
			{ name: "ringId", type: "string", validation: (Rule) => Rule.required() },
			{ name: "shape", type: "object", fields: [{ name: "type", type: "string" }, { name: "frameId", type: "string" }, { name: "paddingMm", type: "number" }, { name: "smoothness", type: "number" }] },
			{ name: "sizeCm", type: "number", validation: (Rule) => Rule.required().min(3).max(10) },
			{ name: "acrylicId", type: "string", validation: (Rule) => Rule.required() },
			{ name: "printSides", type: "number", validation: (Rule) => Rule.required().min(1).max(2) },
			{ name: "backMode", type: "string", validation: (Rule) => Rule.required() },
			{ name: "front", type: "object", fields: [{ name: "image", type: "image" }, { name: "url", type: "url" }, { name: "transform", type: "object", fields: [{ name: "xMm", type: "number" }, { name: "yMm", type: "number" }, { name: "scale", type: "number" }, { name: "rotation", type: "number" }, { name: "flipX", type: "boolean" }] }, { name: "useProcessed", type: "boolean" }] },
			{ name: "backCustom", type: "object", fields: [{ name: "image", type: "image" }, { name: "url", type: "url" }, { name: "transform", type: "object", fields: [{ name: "xMm", type: "number" }, { name: "yMm", type: "number" }, { name: "scale", type: "number" }, { name: "rotation", type: "number" }, { name: "flipX", type: "boolean" }] }] },
			{ name: "material", type: "object", fields: [{ name: "edge", type: "string" }, { name: "thicknessMm", type: "number" }, { name: "sheen", type: "number" }] },
		] },
		{ name: "frontImage", title: "Front Image", type: "image" }, { name: "backImage", title: "Back Image", type: "image" },
		{ name: "createdAt", type: "datetime", readOnly: true }, { name: "requestId", type: "string", readOnly: true }, { name: "requestFingerprint", type: "string", readOnly: true, hidden: true },
	],
	preview: { select: { title: "config.shape.frameId", subtitle: "createdAt" }, prepare: ({ title, subtitle }) => ({ title: `Keychain · ${title || "design"}`, subtitle }) },
};
