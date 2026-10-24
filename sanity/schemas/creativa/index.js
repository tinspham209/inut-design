import client from "part:@sanity/base/client";
import bankInfo from "../bankInfo";
import shippingFee from "../shippingFee";
import StatusSelectWithGuide from "../../components/StatusSelectWithGuide";
import { bankCodeOptions, bankNameOptions, bankShortNameOptions } from "./bankOptions";

const title = (value) => `Creative - ${value}`;
const humanLabel = (value) =>
	value
		.replace(/([a-z0-9])([A-Z])/g, "$1 $2")
		.replace(/[_-]+/g, " ")
		.split(" ")
		.map((word) =>
			/^(id|url)$/i.test(word) ? word.toUpperCase() : word[0].toUpperCase() + word.slice(1)
		)
		.join(" ");
const required = (Rule) => Rule.required();
const integer =
	(min = 0) =>
	(Rule) =>
		Rule.required().custom((value) =>
			Number.isSafeInteger(value) && value >= min ? true : `Expected a safe integer >= ${min}`
		);
const field = (name, type = "string", extra = {}) => ({
	name,
	title: humanLabel(name),
	type,
	...extra,
});
const text = (name, extra = {}) => field(name, "string", { validation: required, ...extra });
const printAssetPath = () =>
	text("printAssetPath", {
		description:
			"Absolute path on the printing computer or shared drive. Metadata only: no upload, browser storage or automatic file access. File existence is not checked; do not include secrets in a public dataset.",
		validation: (Rule) =>
			Rule.required().custom(
				(value) =>
					(typeof value === "string" &&
						!/[\u0000-\u001f]/.test(value) &&
						(/^\/.+/.test(value) ||
							/^[A-Za-z]:[\\/].+/.test(value) ||
							/^\\\\[^\\/]+[\\/][^\\/]+[\\/].+/.test(value))) ||
					"Enter an absolute file path, such as /Volumes/PrintAssets/design.pdf or D:\\PrintAssets\\design.pdf"
			),
	});
const object = (name, fields, extra = {}) => ({
	name,
	title: humanLabel(name),
	type: "object",
	fields,
	...extra,
});
const ref = (name, type) => field(name, "reference", { to: [{ type }], validation: required });
const money = (name, min = 0) => field(name, "number", { validation: integer(min) });
const enumeration = (name, values, extra = {}) =>
	text(name, {
		options: {
			list: values.map((value) => ({
				title:
					{
						cod: "Cash on Delivery (COD)",
						ga4: "Google Analytics 4",
						umami: "Umami",
					}[value] || humanLabel(value),
				value,
			})),
		},
		...extra,
	});
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
	title: "Gallery Image",
	options: { hotspot: true },
	fields: [text("alt"), enumeration("view", ["top", "bottom", "interior", "other"])],
	validation: (Rule) =>
		Rule.required().custom((value) => (value?.asset?._ref ? true : "Image asset required")),
};
const bankFields = [
	field("profileId"),
	field("name"),
	text("bankName"),
	field("bankShortName"),
	field("bankCode"),
	text("accountName"),
	text("accountNumber"),
	field("image", "image"),
	field("transferInstructions", "text"),
];
const shippingFields = [text("code"), text("name"), money("fee")];
const selectionFields = [
	text("modelId"),
	text("modelName"),
	text("modelCode"),
	field("fitReference", "string", {
		description: "Retained legacy order data; not required for new orders.",
	}),
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
	{ ...image, name: "productImage", title: "Product Image" },
	object("selection", selectionFields),
	object("production", [printAssetPath()]),
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
	field("address", "text", { rows: 2 }),
	field("note", "text", { title: "Order Notes", rows: 2 }),
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
	"Skin laptop",
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
		{ ...active, initialValue: true },
		field("description", "blockContent"),
		printAssetPath(),
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
		preview: { select: { title: "name", media: "images.0" } },
	}
);

export const creativaMacbookModel = doc("creativaMacbookModel", "MacBook models", [
	text("name"),
	field("code", "slug", {
		options: { source: "name", maxLength: 96 },
		validation: (Rule) =>
			Rule.required().custom(
				(value) =>
					(value?.current && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)) ||
					"Generate a readable code from the model name"
			),
	}),
	field("sortOrder", "number", { validation: integer() }),
	active,
]);

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

export const creativaShippingSettings = {
	...shippingFee,
	name: "creativaShippingSettings",
	title: title("Shipping Fee"),
	fields: shippingFee.fields.map((item) =>
		item.name === "fee" ? { ...item, validation: integer() } : item
	),
};

export const creativaBankSettings = {
	...bankInfo,
	name: "creativaBankSettings",
	title: title("Bank Information"),
	fields: bankInfo.fields.flatMap((item) => {
		if (item.name === "bankName")
			return [
				{
					...item,
					description: "Full bank name from the VietQR bank list",
					options: { list: bankNameOptions },
				},
			];
		if (item.name === "bankShortName")
			return [
				{
					...item,
					description: "Bank short name from the VietQR bank list",
					options: { list: bankShortNameOptions },
				},
				field("bankCode", "string", {
					title: "VietQR Bank Code",
					description: "Bank code used to generate the dynamic VietQR payment QR.",
					options: { list: bankCodeOptions },
					validation: required,
				}),
			];
		return [item];
	}),
	validation: (Rule) =>
		Rule.custom(async (value) => {
			if (!value?.isActive || !value.isPrimary) return true;
			const id = idWithoutDraft(value._id);
			const count = await studioClient().fetch(
				`count(*[_type == "creativaBankSettings" && isActive == true && isPrimary == true &&
					!(_id in [$id,$draft]) && !(_id in path("drafts.**")) && !(_id in path("versions.**"))])`,
				{ id, draft: `drafts.${id}` }
			);
			return count === 0 || "Only one active primary Creativa bank account is allowed";
		}),
};

export const creativaSalesSettings = doc(
	"creativaSalesSettings",
	"Sales destinations (private)",
	[
		active,
		array(
			"destinations",
			object("salesDestination", [
				enumeration("channel", ["telegram"], { title: "Delivery Service" }),
				text("chatId", {
					description:
						"Recipient only, not a bot token. For a channel use its actual -100… chat ID and grant the bot posting permission. A positive ID normally targets a private chat; that user must start the bot.",
					validation: (Rule) => Rule.required().regex(/^-?[0-9]{1,30}$/),
				}),
				active,
			]),
			{
				description:
					"These are recipient Chat IDs only. The web server also needs CREATIVA_TELEGRAM_BOT_TOKEN; never paste a token here. Publish changes for new orders; saved failed deliveries are not resent automatically.",
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
	{
		description:
			"Publish recipient settings here. Sending also requires CREATIVA_TELEGRAM_BOT_TOKEN in the web server environment; never store/paste the token in Studio. Restart the web server after changing its environment. Published recipient changes apply to new orders; existing delivery receipts keep their saved recipient and are not resent automatically.",
		validation: singleton("creativa.settings.sales"),
		preview: {
			select: { active: "active", destinations: "destinations" },
			prepare: ({ active, destinations }) => ({
				title: "Sales Destinations",
				subtitle: `${active ? "Active" : "Inactive"} · ${
					(destinations || []).filter((item) => item.active).length
				} active recipient(s) · server bot token required`,
			}),
		},
	}
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
								![
									"product",
									"model",
									"coverage",
									"retainedImages",
									"sourceRevisions",
									"production",
									"artwork",
								].includes(item.name)
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

const hiddenTechnical = (item) => ({
	...item,
	hidden: true,
	readOnly: true,
	validation: undefined,
});
const productionLineFields = [
	text("productName", { title: "Product Name", validation: (Rule) => Rule.required().max(200) }),
	field("productImage", "image", {
		title: "Product Image",
		fields: [hiddenTechnical(field("alt")), hiddenTechnical(field("view"))],
	}),
	object(
		"selection",
		[
			text("modelName", { title: "Model Name", validation: (Rule) => Rule.required().max(200) }),
			text("coverageName", {
				title: "Skin Coverage",
				validation: (Rule) => Rule.required().max(200),
			}),
			...selectionFields
				.filter((item) => !["modelName", "coverageName"].includes(item.name))
				.map(hiddenTechnical),
		],
		{ title: "Model and Coverage", options: { collapsible: false }, validation: required }
	),
	money("quantity", 1),
	object("production", [printAssetPath()], {
		title: "Print File",
		options: { collapsible: false },
		validation: (Rule) =>
			Rule.custom((value, context) =>
				context.parent?.artwork || value?.printAssetPath
					? true
					: "Enter the print asset path for this production item"
			),
	}),
	...lineFields
		.filter(
			(item) =>
				!["productName", "productImage", "selection", "production", "quantity"].includes(item.name)
		)
		.map(hiddenTechnical),
];

export const creativaOrder = doc(
	"creativaOrder",
	"Orders",
	[
		text("publicId", {
			title: "Order Number",
			readOnly: true,
			fieldset: "order",
			validation: (Rule) => Rule.required().regex(/^[A-Za-z0-9_-]{10}$/),
		}),
		field("orderDate", "datetime", {
			title: "Order Date",
			validation: required,
			fieldset: "order",
		}),
		enumeration(
			"status",
			["pending", "confirmed", "processing", "in_transit", "completed", "cancelled"],
			{ title: "Order Status", inputComponent: StatusSelectWithGuide, fieldset: "order" }
		),
		array(
			"lines",
			object("acceptedLine", productionLineFields, {
				title: "Production Item",
				options: { collapsible: false },
				preview: {
					select: {
						title: "productName",
						model: "selection.modelName",
						coverage: "selection.coverageName",
						quantity: "quantity",
						media: "productImage",
					},
					prepare: ({ title, model, coverage, quantity, media }) => ({
						title: title || "Production item",
						subtitle: [model, coverage, quantity !== undefined ? `Qty: ${quantity}` : null]
							.filter(Boolean)
							.join(" · "),
						media,
					}),
				},
			}),
			{
				title: "Order Items",
				validation: (Rule) => Rule.required().min(1).custom(uniqueKeys),
			}
		),
		{ ...customer, title: "Customer", options: { collapsible: false }, validation: required },
		enumeration("paymentMethod", ["cod", "bank_transfer"], {
			fieldset: "totals",
			description:
				"Changing the method retains saved bank details; it does not choose a new account. If no bank was saved, confirm transfer details with the customer.",
		}),
		enumeration("paymentStatus", ["pending", "paid", "failed", "refunded"], { fieldset: "totals" }),
		{ ...money("merchandiseTotal"), title: "Total Amount", fieldset: "totals" },
		{ ...money("shippingFee"), fieldset: "totals" },
		{ ...money("discount"), fieldset: "totals" },
		{
			...money("finalAmount"),
			fieldset: "totals",
			description:
				"(total_amount + shipping_fee - discount), If manual change any value of these 3 field above, please recalculate this field manually to avoid missing values.",
		},
		field("internalNotes", "text", { title: "Admin Notes", rows: 2 }),
		field("trackingNumber", "string", {
			title: "Tracking Number",
			validation: (Rule) => Rule.max(200),
		}),
		hiddenTechnical(field("analyticsId")),
		hiddenTechnical(text("currency")),
		hiddenTechnical(object("shipping", shippingFields)),
		hiddenTechnical(object("bank", bankFields)),
		hiddenTechnical(
			field("salesSettings", "reference", { to: [{ type: "creativaSalesSettings" }] })
		),
		hiddenTechnical(field("handoffIssue")),
		hiddenTechnical(
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
					field("formatVersion", "number"),
					field("legacyUnknownAcknowledgedAt", "datetime"),
					array(
						"parts",
						object("notificationPart", [
							money("position", 1),
							field("text", "text", { validation: (Rule) => Rule.required().max(4000) }),
							enumeration("state", ["pending", "dispatching", "sent", "failed", "unknown"]),
							money("attempts"),
							field("nonce"),
							field("attemptedAt", "datetime"),
							field("outcome"),
							field("messageId"),
							field("unknownAcknowledgedAt", "datetime"),
						])
					),
				])
			)
		),
		hiddenTechnical(
			array(
				"analyticsReceipts",
				object("analyticsReceipt", [
					enumeration("destination", ["ga4", "umami"]),
					text("eventKey"),
					field("claimedAt", "datetime"),
				])
			)
		),
	],
	{
		validation: privateDocument("creativa.order."),
		fieldsets: [
			{ name: "order", title: "Order", options: { columns: 2 } },
			{ name: "totals", title: "Payment and Totals", options: { columns: 2 } },
		],
		preview: {
			select: {
				publicId: "publicId",
				status: "status",
				customerName: "customer.name",
				orderDate: "orderDate",
				finalAmount: "finalAmount",
			},
			prepare: ({ publicId, status, customerName, orderDate, finalAmount }) => ({
				title: `[${humanLabel(status || "pending")}] ${publicId || "Order"}`,
				subtitle: [
					customerName || "Customer",
					orderDate ? new Date(orderDate).toLocaleString("vi-VN") : "No date",
					typeof finalAmount === "number" ? `${finalAmount.toLocaleString("vi-VN")}₫` : "No amount",
				].join(" - "),
			}),
		},
		orderings: [
			{
				title: "Newest Orders",
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
