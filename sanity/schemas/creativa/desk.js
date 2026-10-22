import S from "@sanity/desk-tool/structure-builder";

const hidden = new Set([
	"creativaShippingSettings", "creativaBankSettings", "creativaSalesSettings",
	"creativaCheckoutIntent", "creativaOrderLookup",
]);
const singleton = (schema, id, title) => S.listItem().title(`Creative - ${title}`).id(schema)
	.child(S.document().schemaType(schema).documentId(id));

export default () => S.list().title("Content").items([
	...S.documentTypeListItems().filter((item) => !hidden.has(item.getId())).map((item) =>
		item.getId() === "creativaOrder" ? item.child(
			S.list().title("Creative - Orders").items([
				S.listItem().title("Creative - All orders").child(
					S.documentTypeList("creativaOrder").title("Creative - All orders").initialValueTemplates([])),
				S.listItem().title("Creative - Handoff requires attention").child(
					S.documentList().title("Creative - Handoff requires attention")
						.schemaType("creativaOrder")
						.initialValueTemplates([])
						.filter('_type == "creativaOrder" && (defined(handoffIssue) || count(notifications[state in ["pending","failed","unknown","dispatching"]]) > 0)')),
			]),
		) : item),
	singleton("creativaShippingSettings", "creativa-shipping-settings", "Shipping settings"),
	singleton("creativaBankSettings", "creativa-bank-settings", "Bank settings"),
	singleton("creativaSalesSettings", "creativa.settings.sales", "Sales destinations (private)"),
]);
