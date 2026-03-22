import { bannerApi } from "@/api-client/banner";
import { urlFor } from "@/api-client/sanity-client";
import { Seo } from "@/components/common";
import { HeroImage } from "@/components/home";
import { MainLayout } from "@/components/layout";
import { LIST_CONTACTS } from "@/data/contacts/list-contacts";
import { Banner } from "@/models/banner";
import { NextPageWithLayout } from "@/models/common";
import { trackContactClick, trackPhoneClick, trackSocialClick } from "@/utils/analytics";
import { ArrowForwardIos } from "@mui/icons-material";
import { Box, Breadcrumbs, Container, Link as MuiLink, Stack, Typography } from "@mui/material";
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
						"Thiết kế & In ấn - Skin Laptop - Sticker - Decal - Thiệp - Card - Tem Nhãn, skin laptop da nang, skin laptop đà nẵng",
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
					<Stack justifyContent={"center"} flexDirection="row" m={"24px auto"}>
						<Box maxWidth={440}>
							<Stack justifyContent="center" alignItems="center">
								<Image
									src={"/branding/logo.webp"}
									width={258}
									height={80}
									unoptimized
									alt="infor-image"
									priority={true}
								/>
							</Stack>

							<Typography variant="body1" sx={{ mt: 1 }} fontWeight="bold" textAlign="center">
								Thiết kế & In ấn
								<br />
								Skin Laptop - Sticker - Decal - Thiệp - Card - Tem Nhãn
							</Typography>

							<MuiLink
								href="https://maps.app.goo.gl/dAdKSbnBEvarx6LK8"
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
									Địa chỉ: K574/5 Ông Ích Khiêm, Đà Nẵng, Việt Nam
								</Typography>
							</MuiLink>

							<MuiLink href="tel:0327124321" target="_blank" rel="noopener noreferrer">
								<Typography
									variant="body1"
									sx={{
										mt: 1,
										"&:hover": {
											color: "primary.main",
										},
									}}
								>
									Số điện thoại: 0327 124 321
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
								Giờ làm việc: 08:00 - 17:30 (từ T2 đến T7)
							</Typography>
						</Box>
					</Stack>
					<Stack justifyContent={"center"} flexDirection="row" m={"24px auto"}>
						<Box
							sx={{
								minWidth: 320,
								maxWidth: 360,
								width: "100%",
								borderRadius: 8,
							}}
						>
							{LIST_CONTACTS.map((item) => (
								<MuiLink
									href={item.link}
									{...(!item.isInternalUrl && {
										target: "_blank",
										rel: "noopener noreferrer",
									})}
									key={item.title}
									onClick={() => {
										if (item.trackingType === "messenger") {
											trackContactClick("messenger");
										} else if (item.trackingType === "phone") {
											trackPhoneClick();
										} else if (item.trackingType === "social") {
											trackSocialClick(item.title.toLowerCase());
										}
									}}
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
