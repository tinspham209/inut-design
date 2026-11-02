import type { GetStaticProps } from "next";
import { CreativaLayout } from "@/components/layout";
import { CreativaHomepage } from "@/components/creativa/Homepage";
import { CreativaSeo } from "@/components/creativa/Seo";
import { CREATIVA_HOME_STYLES } from "@/data/creativa/homepage";
import type { NextPageWithLayout } from "@/models/common";
import type { CreativaCatalogPage } from "@/models/creativa";
import { CreativaError } from "@/utils/creativa/contracts";

type HomeProps = {
	catalog: CreativaCatalogPage | null;
	catalogError: string | null;
};

const CreativaHome: NextPageWithLayout<HomeProps> = ({ catalog, catalogError }) => (
	<>
		<CreativaSeo
			title="Skin MacBook — Một diện mạo mới, một dấu ấn riêng"
			path="/creativa"
			description="Khám phá skin MacBook INUT Creativa: từ gam màu tinh tế đến họa tiết nổi bật. Chọn thiết kế hợp gu, đúng dòng máy và phạm vi dán dành cho bạn."
		/>
		<CreativaHomepage styles={CREATIVA_HOME_STYLES} catalog={catalog} catalogError={catalogError} />
	</>
);

CreativaHome.Layout = CreativaLayout;

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
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
