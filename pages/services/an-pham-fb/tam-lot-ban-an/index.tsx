import { MainLayout } from "@/components/layout";
import { ProductPageTemplate } from "@/components/product-template";
import { TAM_LOT_BAN_AN_DATA } from "@/data/product-pages/an-pham-fb";
import { NextPageWithLayout } from "@/models/common";

const TamLotBanAnPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={TAM_LOT_BAN_AN_DATA} />;
};

TamLotBanAnPage.Layout = MainLayout;

export default TamLotBanAnPage;
