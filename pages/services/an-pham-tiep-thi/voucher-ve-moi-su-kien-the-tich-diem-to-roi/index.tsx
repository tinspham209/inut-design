import { MainLayout } from "@/components/layout";
import { ProductPageTemplate } from "@/components/product-template";
import { IN_VOUCHER_VE_MOI_SU_KIEN_THE_TICH_DIEM_DATA } from "@/data/product-pages/an-pham-tiep-thi";
import { NextPageWithLayout } from "@/models/common";

const VoucherVeMoiSuKienTheTichDiemPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={IN_VOUCHER_VE_MOI_SU_KIEN_THE_TICH_DIEM_DATA} />;
};

VoucherVeMoiSuKienTheTichDiemPage.Layout = MainLayout;

export default VoucherVeMoiSuKienTheTichDiemPage;
