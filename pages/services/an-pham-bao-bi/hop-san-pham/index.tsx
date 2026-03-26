import { MainLayout } from "@/components/layout";
import { ProductPageTemplate } from "@/components/product-template";
import { HOP_SAN_PHAM_DATA } from "@/data/product-pages/an-pham-bao-bi";
import { NextPageWithLayout } from "@/models/common";

const HopSanPhamPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={HOP_SAN_PHAM_DATA} />;
};

HopSanPhamPage.Layout = MainLayout;

export default HopSanPhamPage;
