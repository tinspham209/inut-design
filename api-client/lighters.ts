import { client } from "./sanity-client";
import { LighterProduct, LighterType, LighterProductWithType } from "@/models/cart";

export const lightersApi = {
	// ==================== Lighter Products ====================

	/**
	 * Get all lighter products
	 */
	async getAllLighters(): Promise<LighterProduct[]> {
		const query = '*[_type == "lighterProducts"] | order(_createdAt desc)';
		return await client.fetch(query);
	},

	/**
	 * Get all lighter product slugs (for static path generation)
	 */
	async getAllLighterSlugs() {
		const query = `*[_type == "lighterProducts"]{
			slug {
				current
			}
		}`;
		return await client.fetch(query);
	},

	/**
	 * Get a single lighter product by slug
	 */
	async getLighterBySlug(slug: string): Promise<LighterProduct> {
		const query = `*[_type == "lighterProducts" && slug.current == $slug][0]`;
		return await client.fetch(query, { slug });
	},

	/**
	 * Get a lighter product with its type details populated
	 */
	async getLighterWithTypeBySlug(slug: string): Promise<LighterProductWithType> {
		const query = `*[_type == "lighterProducts" && slug.current == $slug][0]{
			...,
			"lighterTypeDetails": lighterType->
		}`;
		return await client.fetch(query, { slug });
	},

	// ==================== Lighter Types ====================

	/**
	 * Get all lighter types
	 */
	async getAllLighterTypes(): Promise<LighterType[]> {
		const query = '*[_type == "lighterType"] | order(name asc)';
		return await client.fetch(query);
	},

	/**
	 * Get a single lighter type by ID
	 */
	async getLighterTypeById(id: string): Promise<LighterType> {
		const query = `*[_type == "lighterType" && _id == $id][0]`;
		return await client.fetch(query, { id });
	},

	/**
	 * Get a single lighter type by slug
	 */
	async getLighterTypeBySlug(slug: string): Promise<LighterType> {
		const query = `*[_type == "lighterType" && slug.current == $slug][0]`;
		return await client.fetch(query, { slug });
	},

	// ==================== Special/Featured Products ====================

	/**
	 * Get special/featured lighter products for homepage
	 */
	async getSpecialLighters(): Promise<LighterProduct[]> {
		const query = '*[_type == "lighterProducts" && special == true] | order(_createdAt desc)';
		return await client.fetch(query);
	},
};
