import { MainLayout } from "@/components/layout";
import { ProductPageTemplate } from "@/components/product-template";
import { HUY_CHUONG_DATA } from "@/data/product-pages/an-pham-su-kien";
import { NextPageWithLayout } from "@/models/common";

const HuyChuongPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={HUY_CHUONG_DATA} />;
};

HuyChuongPage.Layout = MainLayout;

export default HuyChuongPage;
