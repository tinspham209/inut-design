import defaultResolve from "part:@sanity/base/document-actions";

const protectedRecords = new Set([
	"creativaOrder",
	"creativaCheckoutIntent",
	"creativaOrderLookup",
	"creativaSalesSettings",
]);
const technical = new Set(["creativaCheckoutIntent", "creativaOrderLookup"]);

export default function resolveCreativaActions(props) {
	const actions = defaultResolve(props);
	if (technical.has(props.type)) return [];
	if (protectedRecords.has(props.type)) {
		return actions.filter(
			(action) => !["delete", "duplicate", "unpublish", "restore"].includes(action.action)
		);
	}
	if (
		["creativaSkinProduct", "creativaMacbookModel", "creativaSkinCoverage"].includes(props.type)
	) {
		return actions.filter((action) => !["delete", "unpublish"].includes(action.action));
	}
	return actions;
}
