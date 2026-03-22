import { ComingSoon, Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import { Box } from "@mui/material";

const AboutUsPage: NextPageWithLayout = () => {
	return (
		<>
			<Seo
				data={{
					title: "Về chúng tôi - INUT Design",
					description:
						"Tìm hiểu về INUT Design và hành trình sáng tạo của INUT. Chúng tôi cung cấp giải pháp in ấn sticker và sản phẩm cá nhân hóa chất lượng cao tại Đà Nẵng.",
					url: "https://inutdesign.com/about-us",
					thumbnailUrl: "/branding/ogImage.jpg",
				}}
			/>

			<Box>
				<ComingSoon />
			</Box>
		</>
	);
};

AboutUsPage.Layout = MainLayout;

export default AboutUsPage;
