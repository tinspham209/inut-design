import S from "@sanity/desk-tool/structure-builder";

const blocked = new Set([
	"creativaOrder",
	"creativaCheckoutIntent",
	"creativaOrderLookup",
	"creativaShippingSettings",
	"creativaBankSettings",
	"creativaSalesSettings",
]);
export default S.defaultInitialValueTemplateItems().filter(
	(item) => !blocked.has(item.serialize().templateId)
);
