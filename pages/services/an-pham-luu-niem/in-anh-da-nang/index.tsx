import { ProductPageTemplate } from "@/components/product-template";
import { NextPageWithLayout } from "@/models/common";
import { MainLayout } from "@/components/layout";
import React from "react";
import { IN_ANH_DATA } from "@/data/product-pages/san-pham-luu-niem";

const InAnhPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={IN_ANH_DATA} />;
};

InAnhPage.Layout = MainLayout;

export default InAnhPage;
