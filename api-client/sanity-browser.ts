import sanityClient from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

/**
 * Tokenless client for public CMS reads. Keep writes and privileged queries out
 * of modules imported by React components or browser hooks.
 */
export const client = sanityClient({
	projectId,
	dataset,
	apiVersion: "2022-09-19",
	useCdn: true,
});

const builder = imageUrlBuilder(client);

export const urlFor = (source: any) => builder.image(source).auto("format").fit("max");
