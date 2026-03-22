import { ProductPageTemplate } from "@/components/product-template";
import { IN_POSTCARD_DATA } from "@/data/product-pages/san-pham-luu-niem";
import { NextPageWithLayout } from "@/models/common";
import { MainLayout } from "@/components/layout";
import React from "react";

const InPostcardPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={IN_POSTCARD_DATA} />;
};

InPostcardPage.Layout = MainLayout;

export default InPostcardPage;
