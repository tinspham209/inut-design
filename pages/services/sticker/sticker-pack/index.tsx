import { MainLayout } from "@/components/layout";
import { ProductPageTemplate } from "@/components/product-template";
import { STICKER_PACK_DATA } from "@/data/product-pages/sticker";
import { NextPageWithLayout } from "@/models/common";

const StickerPackPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={STICKER_PACK_DATA} version="v1" />;
};

StickerPackPage.Layout = MainLayout;

export default StickerPackPage;
