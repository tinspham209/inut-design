import { ProductPageTemplate } from "@/components/product-template";
import { IN_BI_THU_DATA } from "@/data/product-pages/an-pham-van-phong";
import { NextPageWithLayout } from "@/models/common";
import { MainLayout } from "@/components/layout";
import React from "react";

const InBiThuPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={IN_BI_THU_DATA} version="v1" />;
};

InBiThuPage.Layout = MainLayout;

export default InBiThuPage;
