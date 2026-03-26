import { MainLayout } from "@/components/layout";
import { ProductPageTemplate } from "@/components/product-template";
import { PHIEU_VE_HOA_DON_GTGT_DATA } from "@/data/product-pages/an-pham-fb";
import { NextPageWithLayout } from "@/models/common";

const PhieuVeHoaDonGtgtPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={PHIEU_VE_HOA_DON_GTGT_DATA} />;
};

PhieuVeHoaDonGtgtPage.Layout = MainLayout;

export default PhieuVeHoaDonGtgtPage;
