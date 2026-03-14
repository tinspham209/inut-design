import { ProductPageTemplate } from "@/components/product-template";
import { POSTER_DECAL_DATA } from "@/data/product-pages/an-pham-su-kien";
import { NextPageWithLayout } from "@/models/common";
import { MainLayout } from "@/components/layout";
import React from "react";

const PosterDecalPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={POSTER_DECAL_DATA} />;
};

PosterDecalPage.Layout = MainLayout;

export default PosterDecalPage;
