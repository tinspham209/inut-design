import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { LighterCartContent } from "@/components/cart/lighters/LighterCartContent";
import { NextPageWithLayout } from "@/models/common";
import { Container, Box, Typography, Breadcrumbs, Link as MuiLink } from "@mui/material";
import Link from "next/link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useState, useEffect } from "react";

const LighterCartPage: NextPageWithLayout = () => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	return (
		<Box sx={{ bgcolor: "background.default", minHeight: "80vh", py: { xs: 4, md: 8 } }}>
			<Seo
				data={{
					title: "Giỏ hàng Bật lửa — INUT Design",
					description:
						"Giỏ hàng của bạn tại INUT Design. Kiểm tra các sản phẩm bật lửa đã chọn và tiến hành thanh toán.",
					url: "https://inutdesign.com/cart/lighters",
					thumbnailUrl: "/branding/ogImage.jpg",
				}}
			/>
			<Container maxWidth="lg">
				<Breadcrumbs
					separator={<NavigateNextIcon fontSize="small" />}
					aria-label="breadcrumb"
					sx={{ mb: 4 }}
				>
					<Link href="/" passHref legacyBehavior>
						<MuiLink underline="hover" color="inherit">
							Trang chủ
						</MuiLink>
					</Link>
					<Link href="/san-pham/lighters" passHref legacyBehavior>
						<MuiLink underline="hover" color="inherit">
							Bật lửa
						</MuiLink>
					</Link>
					<Typography color="text.primary">Giỏ hàng</Typography>
				</Breadcrumbs>

				<Typography variant="h4" component="h1" fontWeight="bold" gutterBottom sx={{ mb: 4 }}>
					Giỏ hàng của bạn
				</Typography>

				<Box
					sx={{
						bgcolor: "background.paper",
						borderRadius: 2,
						boxShadow: 1,
						overflow: "hidden",
						border: 1,
						borderColor: "divider",
						minHeight: 400,
					}}
				>
					{mounted ? (
						<LighterCartContent showTitle={false} />
					) : (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								height: 400,
							}}
						>
							<Typography color="text.disabled">Đang tải giỏ hàng...</Typography>
						</Box>
					)}
				</Box>
			</Container>
		</Box>
	);
};

LighterCartPage.Layout = MainLayout;

export default LighterCartPage;
