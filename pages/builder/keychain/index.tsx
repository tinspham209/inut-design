import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
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
			url: "https://inutdesign.com/builder/keychain",
			thumbnailUrl: "/branding/ogImage.jpg",
		}} />
		<KeychainBuilder />
	</>
);

KeychainBuilderPage.Layout = MainLayout;
export default KeychainBuilderPage;
