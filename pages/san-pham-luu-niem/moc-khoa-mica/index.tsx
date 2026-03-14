import { ProductPageTemplate } from "@/components/product-template";
import { MOC_KHOA_MICA_DATA } from "@/data/product-pages/san-pham-luu-niem";
import { NextPageWithLayout } from "@/models/common";
import { MainLayout } from "@/components/layout";
import React from "react";

const MocKhoaMicaPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={MOC_KHOA_MICA_DATA} />;
};

MocKhoaMicaPage.Layout = MainLayout;

export default MocKhoaMicaPage;
