import { bannerApi } from "@/api-client/banner";
import { lightersApi } from "@/api-client/lighters";
import { MainLayout } from "@/components/layout";
import { LighterProduct, LighterType } from "@/models/cart";
import { Banner } from "@/models/banner";
import { NextPageWithLayout } from "@/models/common";
import { GetStaticProps } from "next";
import React from "react";
import { LightersPageContainer } from "@/components/lighters";

type LighterProductWithTypeName = LighterProduct & {
	typeName: string;
	typeSlug: string;
};

const LightersPage: NextPageWithLayout = ({ lighters, lighterTypes, banner }: Props) => {
	return <LightersPageContainer lighters={lighters} lighterTypes={lighterTypes} banner={banner} />;
};

LightersPage.Layout = MainLayout;

type Props = {
	lighters: LighterProductWithTypeName[];
	lighterTypes: LighterType[];
	banner: Banner[];
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const lighters: LighterProduct[] = await lightersApi.getAllLighters();
	const lighterTypes: LighterType[] = await lightersApi.getAllLighterTypes();
	const banner: Banner[] = await bannerApi.getBannerPage("lighters-page");

	// Filter out drafts and map type information
	const formatLighters: LighterProductWithTypeName[] = lighters
		.filter((lighter) => !lighter._id.includes("drafts"))
		.map((lighter) => {
			const lighterType = lighterTypes.find((type) => type._id === lighter.lighterType?._ref);
			return {
				...lighter,
				typeName: lighterType?.name || "",
				typeSlug: lighterType?.slug?.current || "",
			};
		})
		.sort((prev, cur) => {
			const datePrev = prev._createdAt;
			const dateCur = cur._createdAt;
			return datePrev < dateCur ? 1 : -1;
		});

	const formatLighterTypes = lighterTypes.filter(
		(lighterType) => !lighterType._id.includes("drafts")
	);

	return {
		props: {
			lighters: formatLighters,
			lighterTypes: formatLighterTypes,
			banner,
		},
		revalidate: 86400, // Revalidate every 24 hours
	};
};

export default LightersPage;
