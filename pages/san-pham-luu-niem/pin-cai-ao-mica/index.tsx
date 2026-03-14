import { ProductPageTemplate } from "@/components/product-template";
import { PIN_CAI_AO_MICA_DATA } from "@/data/product-pages/san-pham-luu-niem";
import { NextPageWithLayout } from "@/models/common";
import { MainLayout } from "@/components/layout";
import React from "react";

const PinCaiAoMicaPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={PIN_CAI_AO_MICA_DATA} />;
};

PinCaiAoMicaPage.Layout = MainLayout;

export default PinCaiAoMicaPage;
