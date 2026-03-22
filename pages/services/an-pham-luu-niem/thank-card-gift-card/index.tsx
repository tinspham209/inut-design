import { ProductPageTemplate } from "@/components/product-template";
import { THANK_CARD_DATA } from "@/data/product-pages/san-pham-luu-niem";
import { NextPageWithLayout } from "@/models/common";
import { MainLayout } from "@/components/layout";
import React from "react";

const ThankCardGiftCardPage: NextPageWithLayout = () => {
	return <ProductPageTemplate data={THANK_CARD_DATA} />;
};

ThankCardGiftCardPage.Layout = MainLayout;

export default ThankCardGiftCardPage;
