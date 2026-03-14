import { ProductPageTemplate } from "@/components/product-template";
import { STICKER_SHEET_DATA } from "@/data/product-pages/sticker";
import { NextPageWithLayout } from "@/models/common";
import { MainLayout } from "@/components/layout";
import React from "react";

const StickerSheetPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={STICKER_SHEET_DATA} />;
};

StickerSheetPage.Layout = MainLayout;

export default StickerSheetPage;
