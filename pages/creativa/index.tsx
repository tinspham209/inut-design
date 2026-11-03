import type { GetStaticProps } from "next";
import Head from "next/head";
import { CreativaLayout } from "@/components/layout";
import { CreativaSeo } from "@/components/creativa/Seo";
import { CreativaHomepageV2 } from "@/components/creativa/HomepageV2";
import type { NextPageWithLayout } from "@/models/common";
import type { CreativaCatalogPage } from "@/models/creativa";
import { CreativaError } from "@/utils/creativa/contracts";

type Props = { catalog: CreativaCatalogPage | null; catalogError: string | null };

const CreativaHome: NextPageWithLayout<Props> = ({ catalog, catalogError }) => (
	<>
		<Head>
			{/* Fonts are scoped to this marketing draft rather than every storefront page. */}
			{/* eslint-disable-next-line @next/next/no-page-custom-font */}
			<link
				href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;600;700&family=Nunito+Sans:wght@400;600;700&family=Poppins:wght@500;600;700;800&display=swap"
				rel="stylesheet"
			/>
		</Head>
		<CreativaSeo
			title="Skin MacBook — MacBook cũng có gu riêng"
			path="/creativa"
			description="Khám phá skin MacBook INUT Creativa: chọn thiết kế hợp gu, đúng dòng máy và phạm vi dán dành cho bạn."
		/>
		<CreativaHomepageV2 catalog={catalog} catalogError={catalogError} />
	</>
);

CreativaHome.Layout = CreativaLayout;

export const getStaticProps: GetStaticProps<Props> = async () => {
	const { creativaCatalogApi } = await import("@/api-client/creativa-catalog");
	try {
		const catalog = await creativaCatalogApi.getPage();
		return {
			props: {
				catalog: { ...catalog, items: catalog.items.slice(0, 4), cursor: null },
				catalogError: null,
			},
			revalidate: 60,
		};
	} catch (failure) {
		console.error("[Creativa homepage] Rendering unavailable catalog.", {
			code: failure instanceof CreativaError ? failure.code : "CATALOG_UNAVAILABLE",
		});
		return {
			props: {
				catalog: null,
				catalogError:
					failure instanceof CreativaError ? failure.message : "Không thể tải bộ sưu tập lúc này.",
			},
			revalidate: 60,
		};
	}
};

export default CreativaHome;
