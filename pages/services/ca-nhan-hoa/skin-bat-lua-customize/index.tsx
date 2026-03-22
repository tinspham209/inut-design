import { MainLayout } from "@/components/layout";
import { ProductPageTemplate } from "@/components/product-template";
import { LIGHTERS_CUSTOMIZE_DATA } from "@/data/product-pages/ca-nhan-hoa";
import { NextPageWithLayout } from "@/models/common";

const LightersCustomizePage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={LIGHTERS_CUSTOMIZE_DATA} />;
};

LightersCustomizePage.Layout = MainLayout;

export default LightersCustomizePage;
