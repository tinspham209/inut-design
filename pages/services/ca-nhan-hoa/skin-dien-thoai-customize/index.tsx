import { ProductPageTemplate } from "@/components/product-template";
import { SKIN_DIEN_THOAI_DATA } from "@/data/product-pages/ca-nhan-hoa";
import { NextPageWithLayout } from "@/models/common";
import { MainLayout } from "@/components/layout";
import React from "react";

const SkinPhoneCustomizePage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={SKIN_DIEN_THOAI_DATA} />;
};

SkinPhoneCustomizePage.Layout = MainLayout;

export default SkinPhoneCustomizePage;
