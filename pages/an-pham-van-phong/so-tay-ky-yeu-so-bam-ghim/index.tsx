import { ProductPageTemplate } from "@/components/product-template";
import { SO_TAY_DATA } from "@/data/product-pages/an-pham-van-phong";
import { NextPageWithLayout } from "@/models/common";
import { MainLayout } from "@/components/layout";
import React from "react";

const SoTayPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={SO_TAY_DATA} />;
};

SoTayPage.Layout = MainLayout;

export default SoTayPage;
