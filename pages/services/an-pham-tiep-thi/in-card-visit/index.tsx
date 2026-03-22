import { ProductPageTemplate } from "@/components/product-template";
import { IN_CARD_VISIT_DATA } from "@/data/product-pages/an-pham-tiep-thi";
import { NextPageWithLayout } from "@/models/common";
import { MainLayout } from "@/components/layout";
import React from "react";

const InCardVisitPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={IN_CARD_VISIT_DATA} />;
};

InCardVisitPage.Layout = MainLayout;

export default InCardVisitPage;
