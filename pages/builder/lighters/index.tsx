import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { BuilderSkeleton } from "@/components/lighter-builder/BuilderSkeleton";
import { NextPageWithLayout } from "@/models/common";
import dynamic from "next/dynamic";

// Only disable SSR for LighterBuilder (Three.js), not the whole page
// so the .Layout property is preserved and MainLayout header/footer render correctly
const LighterBuilder = dynamic(
	() => import("@/components/lighter-builder/LighterBuilder").then((mod) => mod.LighterBuilder),
	{
		ssr: false,
		loading: () => <BuilderSkeleton />,
	}
);

const LighterBuilderPage: NextPageWithLayout = () => {
	return (
		<>
			<Seo
				data={{
					title: "Tạo Mẫu Bật Lửa — INUT Design",
					description:
						"Thiết kế bật lửa theo ý bạn với công cụ 3D của INUT Design. Tải ảnh lên, xem trước trên mô hình 3D rồi đặt hàng ngay.",
					url: "https://inutdesign.com/builder/lighters",
					thumbnailUrl: "/branding/ogImage.jpg",
				}}
			/>
			<LighterBuilder />
		</>
	);
};

LighterBuilderPage.Layout = MainLayout;

export default LighterBuilderPage;
