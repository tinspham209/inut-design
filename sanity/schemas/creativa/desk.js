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
			...items
				.filter(isCreativa)
				.map((item) =>
					item.getId() === "creativaOrder"
						? item.child(
								S.documentTypeList("creativaOrder").title("Orders").initialValueTemplates([])
						  )
						: item
				),
			singleton("creativaSalesSettings", "creativa.settings.sales", "Sales destinations (private)"),
		]);
};
