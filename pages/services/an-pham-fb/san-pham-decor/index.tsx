import { MainLayout } from "@/components/layout";
import { ProductPageTemplate } from "@/components/product-template";
import { SAN_PHAM_DECOR_DATA } from "@/data/product-pages/an-pham-fb";
import { NextPageWithLayout } from "@/models/common";

const SanPhamDecorPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={SAN_PHAM_DECOR_DATA} />;
};

SanPhamDecorPage.Layout = MainLayout;

export default SanPhamDecorPage;
