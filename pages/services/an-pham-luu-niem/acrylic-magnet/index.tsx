import { ProductPageTemplate } from "@/components/product-template";
import { ACRYLIC_MAGNET_DATA } from "@/data/product-pages/san-pham-luu-niem";
import { NextPageWithLayout } from "@/models/common";
import { MainLayout } from "@/components/layout";
import React from "react";

const AcrylicMagnetPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={ACRYLIC_MAGNET_DATA} />;
};

AcrylicMagnetPage.Layout = MainLayout;

export default AcrylicMagnetPage;
