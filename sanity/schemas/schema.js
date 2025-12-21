// First, we must import the schema creator
import createSchema from "part:@sanity/base/schema-creator";

// Then import schema types from any plugins that might expose them
import schemaTypes from "all:part:@sanity/base/schema-type";
import banner from "./banner";
import bankInfo from "./bankInfo";
import blockContent from "./block-content";
import lighterProducts from "./lighterProducts";
import lighterType from "./lighterType";
import macnut from "./macnut";
import macnutType from "./macnutType";
import ordersLighter from "./ordersLighter";
import productType from "./productType";
import products from "./products";
import shippingFee from "./shippingFee";
import staticContentEachPage from "./staticContentEachPage";
import formNhanBaoGia from "./formNhanBaoGia";

// Then we give our schema to the builder and provide the result to Sanity
export default createSchema({
	// We name our schema
	name: "default",
	// Then proceed to concatenate our document type
	// to the ones provided by any plugins that are installed
	types: schemaTypes.concat([
		/* Your types here! */
		ordersLighter,
		formNhanBaoGia,
		products,
		productType,
		macnut,
		macnutType,
		lighterProducts,
		lighterType,
		bankInfo,
		shippingFee,
		// priceLaptop,
		staticContentEachPage,
		banner,
		blockContent,
	]),
});
