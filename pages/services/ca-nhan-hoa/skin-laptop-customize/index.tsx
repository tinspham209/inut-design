import { ProductPageTemplate } from "@/components/product-template";
import { SKIN_LAPTOP_DATA } from "@/data/product-pages/ca-nhan-hoa";
import { NextPageWithLayout } from "@/models/common";
import { MainLayout } from "@/components/layout";
import React from "react";

const SkinLaptopCustomizePage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={SKIN_LAPTOP_DATA} />;
};

SkinLaptopCustomizePage.Layout = MainLayout;

export default SkinLaptopCustomizePage;
