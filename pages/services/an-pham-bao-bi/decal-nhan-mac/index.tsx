import { MainLayout } from "@/components/layout";
import { ProductPageTemplate } from "@/components/product-template";
import { DECAL_NHAN_MAC_DATA } from "@/data/product-pages/an-pham-bao-bi";
import { NextPageWithLayout } from "@/models/common";

const DecalNhanMacPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={DECAL_NHAN_MAC_DATA} />;
};

DecalNhanMacPage.Layout = MainLayout;

export default DecalNhanMacPage;
