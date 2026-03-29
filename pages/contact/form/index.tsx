import { Seo } from "@/components/common";
import { HeroImage } from "@/components/home";
import { MainLayout } from "@/components/layout";
import QuoteRequestFormComponent from "@/components/contact/QuoteRequestForm";
import { NextPageWithLayout } from "@/models/common";
import { COLOR_CODE } from "@/utils";
import { Box, Breadcrumbs, Container, Link as MuiLink, Typography } from "@mui/material";
import Link from "next/link";

const ContactForm: NextPageWithLayout = () => {
	return (
		<Box>
			<Seo
				data={{
					title: "Đăng ký nhận tư vấn, báo giá - INUT Design",
					description:
						"Điền thông tin để nhận tư vấn, báo giá về thiết kế, in ấn tại Đà Nẵng. INUT Design sẽ liên hệ bạn sớm nhất.",
					url: "https://inutdesign.com/contact/form",
					thumbnailUrl: "/branding/ogImage.jpg",
				}}
			/>
			<Box pt={2} bgcolor={COLOR_CODE.INK}>
				<HeroImage imgUrl="/cover-web.webp" />
			</Box>
			<Box sx={{ bgcolor: COLOR_CODE.INK }} pb={6}>
				<Container>
					<Breadcrumbs
						sx={{
							pt: 2,
						}}
					>
						<Link href={"/"} passHref>
							<MuiLink sx={{ color: COLOR_CODE.TEXT_MUTED }} underline="hover">
								Trang chủ
							</MuiLink>
						</Link>
						<Link href={"/contact"} passHref>
							<MuiLink sx={{ color: COLOR_CODE.TEXT_MUTED }} underline="hover">
								Liên hệ
							</MuiLink>
						</Link>

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
