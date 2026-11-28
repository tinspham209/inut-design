import { Seo } from "@/components/common";
import { HeroImage } from "@/components/home";
import { MainLayout } from "@/components/layout";
import QuoteRequestFormComponent from "@/components/contact/QuoteRequestForm";
import { NextPageWithLayout } from "@/models/common";
import { COLOR_CODE } from "@/utils";
import { SITE_URL } from "@/utils/siteUrl";
import { Box, Breadcrumbs, Container, Link as MuiLink, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";

const ContactForm: NextPageWithLayout = () => {
	const router = useRouter();
	const hasQueryParams = Object.keys(router.query).length > 0;
	return (
		<Box>
			<Seo
				data={{
					title: "Đăng ký nhận tư vấn, báo giá - INUT Design",
					description:
						"Điền thông tin để nhận tư vấn, báo giá về thiết kế, in ấn tại Đà Nẵng. INUT Design sẽ liên hệ bạn sớm nhất.",
					url: `${SITE_URL}/contact/form`,
					thumbnailUrl: "/branding/og-image/contact.jpg",
					noindex: hasQueryParams,
				}}
			/>
			<Box pt={2} bgcolor={COLOR_CODE.INK}>
				<Container maxWidth="md">
					<HeroImage imgUrl="/branding/og-image/contact.jpg" />
				</Container>
			</Box>
			<Box sx={{ bgcolor: COLOR_CODE.INK }} pb={6}>
				<Container>
					<Breadcrumbs
						sx={{
							pt: 2,
						}}
					>
						<MuiLink sx={{ color: COLOR_CODE.TEXT_MUTED }} underline="hover" component={Link} href={"/"}>
								Trang chủ
							</MuiLink>
						<MuiLink sx={{ color: COLOR_CODE.TEXT_MUTED }} underline="hover" component={Link} href={"/contact"}>
								Liên hệ
							</MuiLink>

						<Typography sx={{ color: COLOR_CODE.WHITE }}>Nhận báo giá</Typography>
					</Breadcrumbs>
				</Container>
				<Container sx={{ py: 2 }}>
					<QuoteRequestFormComponent />
				</Container>
			</Box>
		</Box>
	);
};

ContactForm.Layout = MainLayout;

export default ContactForm;

// Keep request-dependent pages out of the shared prerender cache.
export const getServerSideProps = async () => ({ props: {} });
