import { Seo } from "@/components/common";
import { SITE_URL } from "@/utils/siteUrl";

export function CreativaSeo({
	title,
	path,
	description = "Khám phá các mẫu skin MacBook của INUT Creativa.",
	image = "/branding/ogImage.jpg",
	noindex = false,
	structured,
}: {
	title: string;
	path: string;
	description?: string;
	image?: string;
	noindex?: boolean;
	structured?: string;
}) {
	return (
		<Seo
			data={{
				title: `${title} — INUT Creativa`,
				description,
				url: `${SITE_URL}${path}`,
				canonical: `${SITE_URL}${path}`,
				thumbnailUrl: image,
				noindex,
				siteName: "INUT Creativa",
				productStructuredData: structured,
			}}
		/>
	);
}
