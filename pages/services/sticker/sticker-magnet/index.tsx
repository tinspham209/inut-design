import { ProductPageTemplate } from "@/components/product-template";
import { STICKER_MAGNET_DATA } from "@/data/product-pages/sticker";
import { NextPageWithLayout } from "@/models/common";
import { MainLayout } from "@/components/layout";
import React from "react";

const StickerMagnetPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={STICKER_MAGNET_DATA} />;
};

StickerMagnetPage.Layout = MainLayout;

export default StickerMagnetPage;
