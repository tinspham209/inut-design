import { ComingSoon, Seo } from "@/components/common";
import { CreativaLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import { trackContactClick, trackEvent } from "@/utils/analytics";
import { Box, Button, Container, Link as MuiLink, Stack, Typography } from "@mui/material";
import Link from "next/link";

const CreativaHomePage: NextPageWithLayout = () => {
	return (
		<>
			<Seo
				data={{
					title: "inut.creativa — Merchandise cho Running, Trail, Trekking",
					description:
						"inut.creativa là nhánh thương hiệu chuyên merchandise cho cộng đồng chạy bộ, trail và trekking: khung kỷ niệm race, sticker, phụ kiện và quà tặng sự kiện.",
					url: "https://inutdesign.com/creativa",
					thumbnailUrl: "/branding/ogImage.jpg",
					canonical: "https://inutdesign.com/creativa",
				}}
			/>

			<Box sx={{ bgcolor: "#0A0A0A", color: "#FFF", py: { xs: 8, md: 10 } }}>
				<Container>
					<Stack spacing={3} maxWidth={860}>
						<Typography variant="overline" sx={{ color: "primary.main", letterSpacing: 1.5 }}>
							inut.creativa
						</Typography>
						<Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
							Run. Create. Connect. Inspire.
						</Typography>
						<Typography variant="h6" sx={{ color: "#D0D0D0", fontWeight: 400 }}>
							Brand dành cho running / trail / trekking: thiết kế và sản xuất merchandise giúp mỗi
							race có một dấu ấn đáng nhớ.
						</Typography>

						<Stack direction={{ xs: "column", sm: "row" }} spacing={2} pt={1}>
							<Link href="#" passHref legacyBehavior>
								<MuiLink
									underline="none"
									onClick={() => {
										trackEvent("cta_click", {
											ctaName: "creativa_quote_now",
											location: "creativa_hero",
											pagePath: "/creativa",
										});
										trackContactClick("form", "creativa_homepage");
									}}
								>
									<Button variant="contained" color="primary">
										Nhận báo giá ngay
									</Button>
								</MuiLink>
							</Link>

							<Link href="#" passHref legacyBehavior>
								<MuiLink
									underline="none"
									onClick={() => {
										trackEvent("cta_click", {
											ctaName: "creativa_contact_consulting",
											location: "creativa_hero",
											pagePath: "/creativa",
										});
									}}
								>
									<Button variant="outlined" sx={{ color: "#FFF", borderColor: "#FFF" }}>
										Liên hệ tư vấn
									</Button>
								</MuiLink>
							</Link>
						</Stack>
					</Stack>
				</Container>
			</Box>

			<Box>
				<ComingSoon />
			</Box>
		</>
	);
};

CreativaHomePage.Layout = CreativaLayout;

export default CreativaHomePage;
