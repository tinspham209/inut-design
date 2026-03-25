import { MainLayout } from "@/components/layout";
import { ProductPageTemplate } from "@/components/product-template";
import { SU_KIEN_TRON_GOI_DATA } from "@/data/product-pages/an-pham-su-kien";
import { NextPageWithLayout } from "@/models/common";

const SuKienTronGoiPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={SU_KIEN_TRON_GOI_DATA} />;
};

SuKienTronGoiPage.Layout = MainLayout;

export default SuKienTronGoiPage;
