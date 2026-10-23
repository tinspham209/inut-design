import S from "@sanity/desk-tool/structure-builder";

const hidden = new Set(["creativaSalesSettings", "creativaCheckoutIntent", "creativaOrderLookup"]);
const singleton = (schema, id, title) =>
	S.listItem()
		.title(`Creative - ${title}`)
		.id(schema)
		.child(S.document().schemaType(schema).documentId(id));

export default () => {
	const items = S.documentTypeListItems().filter((item) => !hidden.has(item.getId()));
	const isCreativa = (item) => item.getId().startsWith("creativa");
	return S.list()
		.title("Content")
		.items([
			...items.filter((item) => !isCreativa(item)),
			...items.filter(isCreativa).map((item) =>
				item.getId() === "creativaOrder"
					? item.child(
							S.list()
								.title("Orders")
								.items([
									S.listItem()
										.title("All Orders")
										.child(
											S.documentTypeList("creativaOrder")
												.title("All Orders")
												.initialValueTemplates([])
										),
									S.listItem()
										.title("Handoff Requires Attention")
										.child(
											S.documentList()
												.title("Handoff Requires Attention")
												.schemaType("creativaOrder")
												.initialValueTemplates([])
												.filter(
													'_type == "creativaOrder" && (defined(handoffIssue) || count(notifications[state in ["pending","failed","unknown","dispatching"]]) > 0)'
												)
										),
								])
					  )
					: item
			),
			singleton("creativaSalesSettings", "creativa.settings.sales", "Sales destinations (private)"),
		]);
};
