import { bannerApi } from "@/api-client/banner";
import { urlFor } from "@/api-client/sanity-client";
import { Seo } from "@/components/common";
import { HeroImage } from "@/components/home";
import { MainLayout } from "@/components/layout";
import { Banner } from "@/models/banner";
import { NextPageWithLayout } from "@/models/common";
import {
	ArrowForwardIos,
	Facebook,
	Instagram,
	MapsHomeWork,
	Message,
	Phone,
} from "@mui/icons-material";
import {
	Box,
	Breadcrumbs,
	Container,
	Grid,
	Link as MuiLink,
	Stack,
	Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { GetStaticProps } from "next/types";

const ContactContainer: NextPageWithLayout = ({ banner }: Props) => {
	return (
		<>
			<Seo
				data={{
					title: "Liên hệ - INUT Design",
					description:
						"Tiệm may đo skin laptop theo yêu cầu, Cửa Hàng Thời Trang Dành Cho Laptop, skin laptop da nang, skin laptop đà nẵng",
					url: "https://inutdesign.com/contact",
					thumbnailUrl:
						"https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp",
				}}
			/>

			<Box component={"section"} pt={2} pb={4}>
				<Container>
					<Breadcrumbs>
						<Link href={"/"} passHref>
							<MuiLink>Trang chủ</MuiLink>
						</Link>

						<Typography color="text.primary">Liên hệ</Typography>
					</Breadcrumbs>
					<Grid
						container
						spacing={3}
						mt={3}
						flexDirection={{
							xs: "column-reverse",
							sm: "row",
						}}
					>
						<Grid
							item
							xs={1}
							sm={4}
							sx={{
								opacity: {
									xs: 0,
									sm: "100%",
								},
							}}
						>
							<Stack justifyContent={"center"}>
								<Box sx={{ margin: "0 auto" }}></Box>
							</Stack>
						</Grid>
						<Grid item xs={12} sm={8}>
							<Box maxWidth={440}>
								<Box ml={4}>
									<Image
										src={"/branding/logo.webp"}
										width={258}
										height={80}
										unoptimized
										alt="infor-image"
										priority={true}
									/>
								</Box>

								<Typography variant="body1" sx={{ mt: 1 }} fontWeight="bold">
									Cửa Hàng Thời Trang Dành Cho Laptop Tại Đà Nẵng
								</Typography>

								<MuiLink
									href="https://goo.gl/maps/hBKBhHvRAGMPUn3e9"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Typography
										variant="body1"
										sx={{
											mt: 1,
											"&:hover": {
												color: "primary.main",
											},
										}}
									>
										Địa chỉ: K574/5 ông ích khiêm, Đà Nẵng, Việt Nam
									</Typography>
								</MuiLink>

								<MuiLink href="tel:0792359996" target="_blank" rel="noopener noreferrer">
									<Typography
										variant="body1"
										sx={{
											mt: 1,
											"&:hover": {
												color: "primary.main",
											},
										}}
									>
										Số điện thoại: 079 235 9996
									</Typography>
								</MuiLink>
								<Typography
									variant="body1"
									sx={{
										mt: 1,
									}}
								>
									Giờ làm việc: 09:00 - 20:00 (từ T3 đến CN)
								</Typography>
							</Box>
						</Grid>
					</Grid>
					<Stack justifyContent={"center"} flexDirection="row" m={"24px auto"}>
						<Box
							sx={{
								minWidth: 320,
								maxWidth: 360,
								width: "100%",
								borderRadius: 8,
							}}
						>
							{listContacts.map((item) => (
								<MuiLink
									href={item.link}
									target="_blank"
									rel="noopener noreferrer"
									key={item.title}
								>
									<Stack
										flexDirection={"row"}
										justifyContent="space-between"
										alignItems={"center"}
										sx={{
											border: "1px solid #c1c1c1",
											borderRadius: 16,
											p: "8px 24px",
											mb: 3,
											boxShadow: "-1px 3px 3px -1px rgb(0 0 0 / 25%)",
											transition: "all 0.2s ease-in-out",
											"&:hover": {
												transform: "scale(1.05)",
											},
										}}
									>
										{item.icon}
										<Typography variant="h5">{item.title}</Typography>
										<ArrowForwardIos />
									</Stack>
								</MuiLink>
							))}
						</Box>
					</Stack>
				</Container>
				<Box mt={8}>
					<HeroImage imgUrl={urlFor(banner.image).url()} />
				</Box>
			</Box>
		</>
	);
};

const listContacts = [
	{
		link: "https://m.me/642209429738886",
		icon: (
			<Message
				sx={{
					fontSize: 48,
				}}
			/>
		),
		title: "Nhắn tin tư vấn",
	},
	{
		link: "https://www.facebook.com/inutdesign",
		icon: (
			<Facebook
				sx={{
					fontSize: 48,
				}}
			/>
		),
		title: "Facebook",
	},
	{
		link: "https://www.instagram.com/inut_skin/",
		icon: (
			<Instagram
				sx={{
					fontSize: 48,
				}}
			/>
		),
		title: "Instagram",
	},
	{
		link: "https://goo.gl/maps/PpPJPgWsm3CigD9E8",
		icon: (
			<MapsHomeWork
				sx={{
					fontSize: 48,
				}}
			/>
		),
		title: "Địa chỉ",
	},
	{
		link: "tel:+792359996",
		icon: (
			<Phone
				sx={{
					fontSize: 48,
				}}
			/>
		),
		title: "Số điện thoại",
	},
];

ContactContainer.Layout = MainLayout;
type Props = {
	banner: Banner;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
	const banner: Banner = await bannerApi.getBannerPage("contact-page");

	return {
		props: {
			banner: banner ? banner[0] : [],
		},
	};
};

export default ContactContainer;
