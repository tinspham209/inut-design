import { MainLayout } from "@/components/layout";
import { ProductPageTemplate } from "@/components/product-template";
import { BANNER_STANDEE_DATA } from "@/data/product-pages/an-pham-su-kien";
import { NextPageWithLayout } from "@/models/common";

const BannerStandeePage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={BANNER_STANDEE_DATA} />;
};

BannerStandeePage.Layout = MainLayout;

export default BannerStandeePage;
