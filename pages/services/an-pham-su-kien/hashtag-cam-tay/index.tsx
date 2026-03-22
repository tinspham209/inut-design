import { ProductPageTemplate } from "@/components/product-template";
import { HASHTAG_CAM_TAY_DATA } from "@/data/product-pages/an-pham-su-kien";
import { NextPageWithLayout } from "@/models/common";
import { MainLayout } from "@/components/layout";
import React from "react";

const HashtagCamTayPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={HASHTAG_CAM_TAY_DATA} />;
};

HashtagCamTayPage.Layout = MainLayout;

export default HashtagCamTayPage;
