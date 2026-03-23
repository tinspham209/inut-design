import { ProductPageTemplate } from "@/components/product-template";
import { STICKER_KISSCUT_DATA } from "@/data/product-pages/sticker";
import { NextPageWithLayout } from "@/models/common";
import { MainLayout } from "@/components/layout";
import React from "react";

const StickerKisscutPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={STICKER_KISSCUT_DATA} version="v3" />;
};

StickerKisscutPage.Layout = MainLayout;

export default StickerKisscutPage;
