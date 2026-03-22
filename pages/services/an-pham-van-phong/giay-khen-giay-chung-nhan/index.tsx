import { ProductPageTemplate } from "@/components/product-template";
import { GIAY_KHEN_DATA } from "@/data/product-pages/an-pham-van-phong";
import { NextPageWithLayout } from "@/models/common";
import { MainLayout } from "@/components/layout";
import React from "react";

const GiayKhenGiayChungNhanPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={GIAY_KHEN_DATA} />;
};

GiayKhenGiayChungNhanPage.Layout = MainLayout;

export default GiayKhenGiayChungNhanPage;
