import { MainLayout } from "@/components/layout";
import { ProductPageTemplate } from "@/components/product-template";
import { TEM_BAO_HANH_DATA } from "@/data/product-pages/an-pham-bao-bi";
import { NextPageWithLayout } from "@/models/common";

const TemBaoHanhPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={TEM_BAO_HANH_DATA} />;
};

TemBaoHanhPage.Layout = MainLayout;

export default TemBaoHanhPage;
