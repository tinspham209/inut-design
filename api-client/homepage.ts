import { Banner } from "@/models/banner";
import { LighterProduct } from "@/models/cart";
import { Products } from "@/models/products";
import { client } from "./sanity-browser";

export type HomepageContent = {
	banner: Banner[];
	products: Products;
	macnuts: Products;
	lighters: LighterProduct[];
};

const IMAGE_PROJECTION = `_key, _type, asset, crop, hotspot`;
const PRODUCT_LIST_FIELDS = `_id, _type, name, slug{current}, image[0...2]{${IMAGE_PROJECTION}}, productType, macnutType, type, special, _createdAt`;
const LIGHTER_LIST_FIELDS = `_id, _type, name, slug{current}, image[0...2]{${IMAGE_PROJECTION}}, lighterType, special, _createdAt`;

export const HOMEPAGE_CONTENT_QUERY = `{
	"banner": *[_type == "banner" && slug.current == "homepage"]{
		_id, _rev, _type, _updatedAt, createdAt, buttonText, slug{current},
		image{_type, asset, crop, hotspot}
	},
	"products": *[_type == "products" && special == true] | order(_createdAt desc)[0...8]{${PRODUCT_LIST_FIELDS}},
	"macnuts": *[_type == "macnut" && special == true] | order(_createdAt desc)[0...8]{${PRODUCT_LIST_FIELDS}},
	"lighters": *[_type == "lighterProducts" && special == true] | order(_createdAt desc)[0...8]{${LIGHTER_LIST_FIELDS}}
}`;

export async function getHomepageContent(): Promise<HomepageContent> {
	return client.fetch<HomepageContent>(HOMEPAGE_CONTENT_QUERY);
}
