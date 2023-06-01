// First, we must import the schema creator
import createSchema from "part:@sanity/base/schema-creator";

// Then import schema types from any plugins that might expose them
import schemaTypes from "all:part:@sanity/base/schema-type";
import banner from "./banner";
import blockContent from "./block-content";
import costs from "./costs";
import incomesAnother from "./incomes-another";
import incomesLaptop from "./incomes-laptop";
import incomesSticker from "./incomes-sticker";
import letterCost from "./letter-cost";
import macnut from "./macnut";
import productType from "./productType";
import products from "./products";
import stickerType from "./sticker-type";
import incomesLaptopTest from "./test-incomes";
import incomesAnotherTest from "./test-incomes-another";
import incomesStickerTest from "./test-incomes-sticker";
import costsTest from "./test-costs";
// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
	// We name our schema
	name: "default",
	// Then proceed to concatenate our document type
	// to the ones provided by any plugins that are installed
	types: schemaTypes.concat([
		/* Your types here! */
		incomesLaptop,
		incomesSticker,
		incomesAnother,
		costs,
		letterCost,
		stickerType,
		incomesLaptopTest,
		incomesStickerTest,
		incomesAnotherTest,
		costsTest,
		products,
		macnut,
		productType,
		banner,
		blockContent,
	]),
});
