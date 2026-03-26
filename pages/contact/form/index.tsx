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
			<Box mt={2} bgcolor={COLOR_CODE.BACKGROUND}>
				<HeroImage imgUrl="/cover-web.webp" />
			</Box>
			<Container>
				<Breadcrumbs
					sx={{
						mt: 2,
					}}
				>
					<Link href={"/"} passHref>
						<MuiLink>Trang chủ</MuiLink>
					</Link>
					<Link href={"/contact"} passHref>
						<MuiLink>Liên hệ</MuiLink>
					</Link>

					<Typography color="text.primary">Nhận báo giá</Typography>
				</Breadcrumbs>
			</Container>
			<Container sx={{ py: 2 }}>
				<QuoteRequestFormComponent />
			</Container>
		</Box>
	);
};

ContactForm.Layout = MainLayout;

export default ContactForm;
