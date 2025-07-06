import { Seo } from "@/components/common";
import { HeroImage } from "@/components/home";
import { MainLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import { COLOR_CODE } from "@/utils";
import { Box, Breadcrumbs, Container, Link as MuiLink, Typography } from "@mui/material";
import Link from "next/link";

const ContactForm: NextPageWithLayout = () => {
	return (
		<Box>
			<Seo
				data={{
					title: "Đăng ký nhận tư vấn - INUT Design",
					description:
						"Điền thông tin để nhận tư vấn về skin laptop, thiết kế, in ấn tại Đà Nẵng. INUT Design sẽ liên hệ bạn sớm nhất.",
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
					<Link href={"/"} passHref>
						<MuiLink>Liên hệ</MuiLink>
					</Link>

					<Typography color="text.primary">Nhận báo giá</Typography>
				</Breadcrumbs>
			</Container>
			<Box mt={2}>
				<iframe
					src="https://docs.google.com/forms/d/e/1FAIpQLSc1qONbFb6jm72FE_Bcsy0VzfyvzYGQ2vefw8mmJwBqmYZS-Q/viewform?embedded=true"
					width="100%"
					height="1900"
					frameBorder="0"
					marginHeight={0}
					marginWidth={0}
				>
					Đang tải…
				</iframe>
			</Box>
		</Box>
	);
};

ContactForm.Layout = MainLayout;

export default ContactForm;
