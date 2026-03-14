import { ProductPageTemplate } from "@/components/product-template";
import { CATALOGUE_BROCHURE_DATA } from "@/data/product-pages/an-pham-tiep-thi";
import { NextPageWithLayout } from "@/models/common";
import { MainLayout } from "@/components/layout";
import React from "react";

const CatalogueBrochurePage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={CATALOGUE_BROCHURE_DATA} />;
};

CatalogueBrochurePage.Layout = MainLayout;

export default CatalogueBrochurePage;
