// First, we must import the schema creator
import createSchema from "part:@sanity/base/schema-creator";

// Then import schema types from any plugins that might expose them
import schemaTypes from "all:part:@sanity/base/schema-type";
import banner from "./banner";
import products from "./products";
import productType from "./productType";
import macnut from "./macnut";
import blockContent from "./block-content";
import incomes from "./incomes";
import incomesSticker from "./incomes-sticker";
import incomesAnother from "./incomes-another";
import stickerType from "./sticker-type";
import costs from "./costs";
import letterCost from "./letter-cost";
// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
	// We name our schema
	name: "default",
	// Then proceed to concatenate our document type
	// to the ones provided by any plugins that are installed
	types: schemaTypes.concat([
		/* Your types here! */
		incomes,
		incomesSticker,
		incomesAnother,
		costs,
		letterCost,
		stickerType,
		products,
		macnut,
		productType,
		banner,
		blockContent,
	]),
});
