import { ProductPageTemplate } from "@/components/product-template";
import { STICKER_DIECUT_DATA } from "@/data/product-pages/sticker";
import { NextPageWithLayout } from "@/models/common";
import { MainLayout } from "@/components/layout";
import React from "react";

const StickerDiecutPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={STICKER_DIECUT_DATA} />;
};

StickerDiecutPage.Layout = MainLayout;

export default StickerDiecutPage;
