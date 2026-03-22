import { ProductPageTemplate } from "@/components/product-template";
import { SKIN_NUT_PHIM_DATA } from "@/data/product-pages/ca-nhan-hoa";
import { NextPageWithLayout } from "@/models/common";
import { MainLayout } from "@/components/layout";
import React from "react";

const MacnutCustomizePage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={SKIN_NUT_PHIM_DATA} />;
};

MacnutCustomizePage.Layout = MainLayout;

export default MacnutCustomizePage;
