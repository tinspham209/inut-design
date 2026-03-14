import { ProductPageTemplate } from "@/components/product-template";
import { ARCYLIC_MAGNET_DATA } from "@/data/product-pages/san-pham-luu-niem";
import { NextPageWithLayout } from "@/models/common";
import { MainLayout } from "@/components/layout";
import React from "react";

const ArcylicMagnetPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={ARCYLIC_MAGNET_DATA} />;
};

ArcylicMagnetPage.Layout = MainLayout;

export default ArcylicMagnetPage;
