import { bannerApi } from "@/api-client/banner";
import { lightersApi } from "@/api-client/lighters";
import { MainLayout } from "@/components/layout";
import { LighterProduct, LighterType } from "@/models/cart";
import { Banner } from "@/models/banner";
import { NextPageWithLayout } from "@/models/common";
import { GetServerSideProps } from "next";
import React from "react";
import { LightersPageContainer } from "@/components/lighters";

type LighterProductWithTypeName = LighterProduct & {
	typeName: string;
	typeSlug: string;
};

const LightersPage: NextPageWithLayout = ({
	lighters,
	lighterTypes,
	banner,
	total,
	page,
	pageSize,
}: Props) => {
	return (
		<LightersPageContainer
			lighters={lighters}
			lighterTypes={lighterTypes}
			banner={banner}
			total={total}
			page={page}
			pageSize={pageSize}
		/>
	);
};

LightersPage.Layout = MainLayout;

type Props = {
	lighters: LighterProductWithTypeName[];
	lighterTypes: LighterType[];
	banner: Banner[];
	total: number;
	page: number;
	pageSize: number;
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ query, res }) => {
	const filter = typeof query.filter === "string" ? query.filter : "";
	const page = 1;
	const pageSize = 24;
	res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");

	const [catalog, lighterTypes, banner] = await Promise.all([
		lightersApi.getLightersPage({ page, pageSize, filter }),
		lightersApi.getAllLighterTypes(),
		bannerApi.getBannerPage("lighters-page"),
	]);
	const lighters: LighterProduct[] = catalog.items;

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
			total: catalog.total,
			page: catalog.page,
			pageSize: catalog.pageSize,
		},
	};
};

export default LightersPage;
