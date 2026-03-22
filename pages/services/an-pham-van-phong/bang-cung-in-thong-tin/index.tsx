import { ProductPageTemplate } from "@/components/product-template";
import { BANG_CUNG_IN_THONG_TIN_DATA } from "@/data/product-pages/an-pham-van-phong";
import { NextPageWithLayout } from "@/models/common";
import { MainLayout } from "@/components/layout";
import React from "react";

const BangCungInThongTinPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={BANG_CUNG_IN_THONG_TIN_DATA} />;
};

BangCungInThongTinPage.Layout = MainLayout;

export default BangCungInThongTinPage;
