import { Seo } from "@/components/common";
import { BuilderLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import { SITE_URL } from "@/utils/siteUrl";
import dynamic from "next/dynamic";

const KeychainBuilder = dynamic(
	() => import("@/components/keychain-builder/KeychainBuilder").then((module) => module.KeychainBuilder),
	{ ssr: false, loading: () => <div style={{ minHeight: 500, background: "#101116" }} aria-label="Đang tải trình thiết kế" /> }
);

const KeychainBuilderPage: NextPageWithLayout = () => (
	<>
		<Seo data={{
			title: "Thiết kế móc khóa mica — INUT Design",
			description: "Tạo bản xem trước móc khóa mica với hình minh họa và tải ảnh PNG giới thiệu.",
			url: `${SITE_URL}/builder/keychain`,
			thumbnailUrl: `${SITE_URL}/branding/og-image/keychain-builder.webp`,
		}} />
		<KeychainBuilder />
	</>
);

KeychainBuilderPage.Layout = BuilderLayout;
export default KeychainBuilderPage;
