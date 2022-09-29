import { Seo } from "@/components/common";
import styles from "@/components/home/information.module.css";
import { MainLayout } from "@/components/layout";
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

const ContactContainer: NextPageWithLayout = () => {
	return (
		<>
			<Seo
				data={{
					title: "Liên hệ - INUT Design",
					description: "Tiệm may đo skin laptop theo yêu cầu, Cửa Hàng Thời Trang Dành Cho Laptop",
					url: "https://inutdesign.com/contact",
					thumbnailUrl:
						"https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp",
				}}
			/>
			<Box component={"section"} pt={2} pb={{ xs: 4 }}>
				<Container>
					<Breadcrumbs>
						<Link href={"/"} passHref>
							<MuiLink>Trang chủ</MuiLink>
						</Link>

						<Typography color="text.primary">Liên hệ</Typography>
					</Breadcrumbs>
					<Grid container spacing={3} mt={3}>
						<Grid item xs={12} sm={4}>
							<Stack justifyContent={"center"}>
								<Box sx={{ margin: "0 auto" }}>
									<Image
										src={
											"https://res.cloudinary.com/dmspucdtf/image/upload/v1663647671/inut/292635797_197003529328579_4330060878795101093_n_bjzhby.jpg"
										}
										width={220}
										height={220}
										alt="infor-image"
										priority={true}
										className={styles.infoImage}
									/>
								</Box>
							</Stack>
						</Grid>
						<Grid item xs={12} sm={8}>
							<Box maxWidth={440}>
								<Stack
									flexDirection={"row"}
									alignItems="center"
									justifyContent={"space-between"}
									sx={{}}
								>
									<Typography variant="h5" sx={{ mr: 4 }}>
										inut_skin
									</Typography>
								</Stack>

								<Typography variant="body1" sx={{ mt: 1 }} fontWeight="bold">
									I NÚT - Cửa Hàng Thời Trang Dành Cho Laptop Tại Đà Nẵng
								</Typography>
								<Typography variant="body1" sx={{ mt: 1 }}>
									Custom skin laptop, cho tất cả các loại laptop có trên trái đất. Không giới hạn
									hình ảnh và idea!!!!
								</Typography>
								<MuiLink
									href="https://goo.gl/maps/hBKBhHvRAGMPUn3e9"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Typography variant="body1" sx={{ mt: 1 }}>
										Địa chỉ: K294/43 Điện Biên Phủ, Đà Nẵng, Việt Nam
									</Typography>
								</MuiLink>
								<MuiLink href="tel:0792359996" target="_blank" rel="noopener noreferrer">
									<Typography variant="body1" sx={{ mt: 1 }}>
										Số điện thoại: 079 235 9996
									</Typography>
								</MuiLink>
								<Typography variant="body1" sx={{ mt: 1 }}>
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
		title: "Liên hệ ngay",
	},
	{
		link: "https://www.facebook.com/profile.php?id=100063876652109",
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
		link: "https://goo.gl/maps/hBKBhHvRAGMPUn3e9",
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

export default ContactContainer;
