import client from "part:@sanity/base/client";

const title = (value) => `Creative - ${value}`;
const required = (Rule) => Rule.required();
const integer =
	(min = 0) =>
	(Rule) =>
		Rule.required().custom((value) =>
			Number.isSafeInteger(value) && value >= min ? true : `Expected a safe integer >= ${min}`
		);
const field = (name, type = "string", extra = {}) => ({ name, title: title(name), type, ...extra });
const text = (name, extra = {}) => field(name, "string", { validation: required, ...extra });
const object = (name, fields, extra = {}) => ({
	name,
	title: title(name),
	type: "object",
	fields,
	...extra,
});
const ref = (name, type) => field(name, "reference", { to: [{ type }], validation: required });
const money = (name, min = 0) => field(name, "number", { validation: integer(min) });
const enumeration = (name, values, extra = {}) =>
	text(name, { options: { list: values }, ...extra });
const active = field("active", "boolean", { initialValue: false });
const uniqueKeys = (items) =>
	!items ||
	(items.every((item) => !!item._key) &&
		new Set(items.map((item) => item._key)).size === items.length) ||
	"Every item needs a unique key";
const array = (name, member, extra = {}) =>
	field(name, "array", {
		of: [member],
		validation: (Rule) => Rule.custom(uniqueKeys),
		...extra,
	});
const doc = (name, label, fields, extra = {}) => ({
	name,
	title: title(label),
	type: "document",
	fields,
	...extra,
});
const readonly = (fields) => fields.map((item) => ({ ...item, readOnly: true }));
const idWithoutDraft = (id = "") => id.replace(/^drafts\./, "");
const studioClient = () => client.withConfig({ apiVersion: "2022-09-19", useCdn: false });
const singleton = (id) => (Rule) =>
	Rule.custom(
		(_value, context) =>
			idWithoutDraft(context.document?._id) === id || `Use the dedicated singleton ${id}`
	);
const privateDocument = (prefix) => (Rule) =>
	Rule.custom(
		(_value, context) =>
			idWithoutDraft(context.document?._id).startsWith(prefix) ||
			"Server-managed private document ID required"
	);

const image = {
	type: "image",
	title: title("Gallery image"),
	options: { hotspot: true },
	fields: [text("alt"), enumeration("view", ["top", "bottom", "interior", "other"])],
	validation: (Rule) =>
		Rule.required().custom((value) => (value?.asset?._ref ? true : "Image asset required")),
};
const bankFields = [
	text("bankName"),
	text("accountName"),
	text("accountNumber"),
	field("transferInstructions", "text"),
];
const shippingFields = [text("code"), text("name"), money("fee")];
const selectionFields = [
	text("modelId"),
	text("modelName"),
	text("modelCode"),
	text("fitReference"),
	text("coverageId"),
	text("coverageName"),
	enumeration("coverageCode", ["top", "bottom", "interior", "full"]),
	text("coverageMeaning"),
];
const purchaseFields = [
	enumeration("productType", ["skin-laptop"]),
	text("productId"),
	object("selection", [text("modelId"), text("coverageId")]),
	money("quantity", 1),
];
const lineFields = [
	enumeration("productType", ["skin-laptop"]),
	text("productId"),
	text("lineKey"),
	text("productName"),
	text("productSlug"),
	{ ...image, name: "productImage", title: title("Product image") },
	object("selection", selectionFields),
	object("artwork", [
		text("identity"),
		text("version"),
		field("printAsset", "file", { validation: required }),
	]),
	money("quantity", 1),
	money("unitPrice", 1),
	money("subtotal", 1),
	ref("product", "creativaSkinProduct"),
	ref("model", "creativaMacbookModel"),
	ref("coverage", "creativaSkinCoverage"),
	array("retainedImages", image),
	object("sourceRevisions", [text("product"), text("model"), text("coverage")]),
];
const customer = object("customer", [
	text("name", { validation: (Rule) => Rule.required().max(200) }),
	text("phone", { validation: (Rule) => Rule.required().regex(/^[0-9]{10}$/) }),
	field("email", "string", {
		validation: (Rule) =>
			Rule.custom(
				(value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Invalid optional email"
			),
	}),
	field("address", "text"),
	field("note", "text"),
]);
const reviewed = object("reviewedQuote", [
	text("digest"),
	money("merchandiseTotal"),
	money("shippingFee"),
	money("finalAmount"),
]);
const request = object("request", [
	array("lines", object("purchaseLine", purchaseFields)),
	customer,
	enumeration("paymentMethod", ["cod", "bank_transfer"]),
	reviewed,
]);

export const creativaSkinProduct = doc(
	"creativaSkinProduct",
	"Skin products",
	[
		text("name"),
		field("slug", "slug", {
			options: {
				source: "name",
				maxLength: 96,
				isUnique: async (value, context) => {
					const id = idWithoutDraft(context.document?._id);
					const count = await studioClient().fetch(
						`count(*[_type == "creativaSkinProduct" && slug.current == $slug && !(_id in [$id,$draft])])`,
						{ slug: value, id, draft: `drafts.${id}` }
					);
					return count === 0;
				},
			},
			validation: (Rule) =>
				Rule.required().custom(
					(value) =>
						(value?.current &&
							/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current) &&
							value.current !== "huong-dan-su-dung") ||
						"Unique readable slug required; guide slug is reserved"
				),
		}),
		active,
		field("productionVerified", "boolean", {
			initialValue: false,
			description:
				"Approve licensed assets, retained printable master and production meaning before activation.",
		}),
		field("description", "text"),
		text("artworkId"),
		text("artworkVersion"),
		field("printAsset", "file", { validation: required }),
		array("images", image, {
			validation: (Rule) =>
				Rule.required()
					.min(3)
					.custom((images) => {
						if (
							!images ||
							!["top", "bottom", "interior"].every((view) =>
								images.some((item) => item.view === view && item.asset?._ref && item.alt?.trim())
							)
						)
							return "Approved top, bottom and interior images/alt text required";
						return uniqueKeys(images);
					}),
		}),
	],
	{
		validation: (Rule) =>
			Rule.custom(async (value) => {
				if (value?.active && !value.productionVerified)
					return "Production approval required before activation";
				if (!value?._id) return true;
				const published = await studioClient().getDocument(idWithoutDraft(value._id));
				if (
					published &&
					["artworkId", "artworkVersion"].some(
						(key) => published[key] && published[key] !== value[key]
					)
				) {
					return "Published artwork identity/version is immutable. Create a new version document and retain the original.";
				}
				if (
					published?.printAsset?.asset?._ref &&
					published.printAsset.asset._ref !== value.printAsset?.asset?._ref
				) {
					return "Published print master is immutable; create a new artwork version.";
				}
				return true;
			}),
		preview: { select: { title: "name", media: "images.0" } },
	}
);

export const creativaMacbookModel = doc(
	"creativaMacbookModel",
	"MacBook models",
	[
		text("name"),
		text("code"),
		field("sortOrder", "number", { validation: integer() }),
		active,
		field("fitVerified", "boolean", { initialValue: false }),
		text("fitReference", {
			description:
				"Approved physical fit and retrievable retained cut-template reference, not a screenshot label.",
		}),
	],
	{
		validation: (Rule) =>
			Rule.custom(
				(value) =>
					!value?.active ||
					(value.fitVerified === true && !!value.fitReference?.trim()) ||
					"Verified fit/template required before activation"
			),
	}
);

export const creativaSkinCoverage = doc(
	"creativaSkinCoverage",
	"Skin coverage and shared prices",
	[
		enumeration("code", ["top", "bottom", "interior", "full"]),
		text("name"),
		text("description"),
		field("sortOrder", "number", { validation: integer() }),
		active,
		money("price", 1),
	],
	{
		validation: (Rule) =>
			Rule.custom(async (value) => {
				if (!value?.active || !value.code) return true;
				const id = idWithoutDraft(value._id);
				const count = await studioClient().fetch(
					`count(*[_type == "creativaSkinCoverage" && active == true && code == $code && !(_id in [$id,$draft]) && !(_id in path("drafts.**"))])`,
					{ code: value.code, id, draft: `drafts.${id}` }
				);
				return count === 0 || "Only one active coverage per preset is allowed";
			}),
	}
);

export const creativaShippingSettings = doc(
	"creativaShippingSettings",
	"Shipping settings",
	[
		array(
			"rules",
			object("shippingRule", [
				...shippingFields,
				active,
				field("isDefault", "boolean"),
				field("sortOrder", "number", { validation: integer() }),
				field("note", "text"),
			]),
			{
				validation: (Rule) =>
					Rule.required().custom((rules) => {
						if (!rules || rules.filter((rule) => rule.active && rule.isDefault).length !== 1)
							return "Exactly one active default shipping rule required";
						if (new Set(rules.map((rule) => rule.code)).size !== rules.length)
							return "Shipping codes must be unique";
						return uniqueKeys(rules);
					}),
			}
		),
	],
	{ validation: singleton("creativa-shipping-settings") }
);

export const creativaBankSettings = doc(
	"creativaBankSettings",
	"Bank settings",
	[active, ...bankFields],
	{ validation: singleton("creativa-bank-settings") }
);

export const creativaSalesSettings = doc(
	"creativaSalesSettings",
	"Sales destinations (private)",
	[
		active,
		array(
			"destinations",
			object("salesDestination", [
				enumeration("channel", ["telegram"]),
				text("chatId", {
					validation: (Rule) => Rule.required().regex(/^-?[0-9]{1,30}$/),
				}),
				active,
			]),
			{
				validation: (Rule) =>
					Rule.required()
						.max(5)
						.custom((destinations) => {
							if (
								destinations &&
								new Set(destinations.map((d) => d.chatId)).size !== destinations.length
							)
								return "Destinations must be unique";
							return uniqueKeys(destinations);
						}),
			}
		),
	],
	{ validation: singleton("creativa.settings.sales") }
);

export const creativaCheckoutIntent = doc(
	"creativaCheckoutIntent",
	"Checkout intents (server-managed)",
	readonly([
		enumeration("state", ["pending", "accepted", "rejected"]),
		field("fingerprint"),
		request,
		ref("order", "creativaOrder"),
		object("rejection", [
			text("code"),
			text("message"),
			money("status"),
			object("quote", [
				array(
					"lines",
					object(
						"quoteLine",
						lineFields.filter(
							(item) =>
								!["product", "model", "coverage", "retainedImages", "sourceRevisions"].includes(
									item.name
								)
						)
					)
				),
				text("currency"),
				money("merchandiseTotal"),
				money("shippingFee"),
				money("discount"),
				money("finalAmount"),
				object("shipping", shippingFields),
				enumeration("paymentMethod", ["cod", "bank_transfer"]),
				field("bankAvailable", "boolean"),
				text("digest"),
			]),
		]),
	]),
	{ readOnly: true, validation: privateDocument("creativa.intent.") }
);

export const creativaOrderLookup = doc(
	"creativaOrderLookup",
	"Public-ID index (server-managed)",
	readonly([ref("order", "creativaOrder")]),
	{ readOnly: true, validation: privateDocument("creativa.lookup.") }
);

export const creativaOrder = doc(
	"creativaOrder",
	"Orders",
	[
		...readonly([
			text("publicId", { validation: (Rule) => Rule.required().regex(/^[A-Za-z0-9_-]{10}$/) }),
			text("analyticsId"),
			field("orderDate", "datetime", { validation: required }),
			enumeration("paymentMethod", ["cod", "bank_transfer"]),
			customer,
			array("lines", object("acceptedLine", lineFields), {
				validation: (Rule) => Rule.required().min(1).custom(uniqueKeys),
			}),
			text("currency"),
			money("merchandiseTotal"),
			money("shippingFee"),
			money("discount"),
			money("finalAmount"),
			object("shipping", shippingFields),
			object("bank", bankFields),
			field("salesSettings", "reference", { to: [{ type: "creativaSalesSettings" }] }),
			field("handoffIssue"),
			array(
				"notifications",
				object("notificationReceipt", [
					text("destinationId"),
					text("chatId"),
					enumeration("state", ["pending", "dispatching", "sent", "failed", "unknown"]),
					field("nonce"),
					field("attemptedAt", "datetime"),
					field("outcome"),
					field("messageId"),
				])
			),
			array(
				"analyticsReceipts",
				object("analyticsReceipt", [
					enumeration("destination", ["ga4", "umami"]),
					text("eventKey"),
					field("claimedAt", "datetime"),
				])
			),
		]),
		enumeration("status", [
			"pending",
			"confirmed",
			"processing",
			"in_transit",
			"completed",
			"cancelled",
		]),
		enumeration("paymentStatus", ["pending", "paid", "failed", "refunded"]),
		field("trackingNumber", "string", { validation: (Rule) => Rule.max(200) }),
		field("internalNotes", "text"),
	],
	{
		validation: privateDocument("creativa.order."),
		preview: { select: { title: "publicId", subtitle: "handoffIssue" } },
		orderings: [
			{
				title: title("Newest orders"),
				name: "newest",
				by: [{ field: "orderDate", direction: "desc" }],
			},
		],
	}
);

export default [
	creativaSkinProduct,
	creativaMacbookModel,
	creativaSkinCoverage,
	creativaShippingSettings,
	creativaBankSettings,
	creativaSalesSettings,
	creativaCheckoutIntent,
	creativaOrder,
	creativaOrderLookup,
];
