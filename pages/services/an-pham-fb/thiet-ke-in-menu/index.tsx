import { MainLayout } from "@/components/layout";
import { ProductPageTemplate } from "@/components/product-template";
import { THIET_KE_IN_MENU_DATA } from "@/data/product-pages/an-pham-fb";
import { NextPageWithLayout } from "@/models/common";

const ThietKeInMenuPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={THIET_KE_IN_MENU_DATA} />;
};

ThietKeInMenuPage.Layout = MainLayout;

export default ThietKeInMenuPage;
