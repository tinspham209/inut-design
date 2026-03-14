import { ProductPageTemplate } from "@/components/product-template";
import { IN_ANH_DATA } from "@/data/product-pages/in-anh-da-nang";
import { NextPageWithLayout } from "@/models/common";
import { MainLayout } from "@/components/layout";
import React from "react";

const InAnhPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={IN_ANH_DATA} />;
};

InAnhPage.Layout = MainLayout;

export default InAnhPage;
