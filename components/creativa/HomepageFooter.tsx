/* eslint-disable camelcase */
import { Box, Button, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { HOME_CATALOG, HOME_GUIDES, HOME_SOCIALS } from "@/data/creativa/homepage";
import { trackCreativa } from "@/utils/creativa/analytics";

const links = [
	{ label: "Xem skin MacBook", href: HOME_CATALOG },
	{ label: "Hướng dẫn sử dụng", href: HOME_GUIDES },
	{ label: "Tra cứu đơn hàng", href: "/creativa/order-tracking" },
	{ label: "Về INUT Design", href: "/" },
];

export function CreativaHomepageFooter() {
	return (
		<Box
			component="footer"
			sx={{
				bgcolor: "#fd4d01",
				color: "#24150f",
				px: { xs: 2, md: 5 },
				pt: { xs: 5, md: 7 },
				fontFamily: '"Nunito Sans", Roboto, sans-serif',
				"& .MuiTypography-root": { fontFamily: "inherit" },
			}}
		>
			<Box sx={{ display: "grid", gridTemplateColumns: { md: "1fr 1fr" }, gap: { xs: 5, md: 9 } }}>
				<Box>
					<Typography
						component="h2"
						sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 700, lineHeight: 1.15 }}
					>
						Có gu thì khoe thôi.
					</Typography>
					<Typography sx={{ maxWidth: 430, mt: 2, mb: 2 }}>
						Follow INUT Creativa để ngắm skin mới và tìm thêm cảm hứng cho chiếc MacBook của bạn.
					</Typography>
					<Stack direction="row" flexWrap="wrap" gap={1}>
						{HOME_SOCIALS.map((social) =>
							social.href ? (
								<Button
									key={social.id}
									component="a"
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									variant="outlined"
									onClick={() =>
										trackCreativa("social_click", { surface: "home_v2_footer", method: social.id })
									}
									sx={{ color: "inherit", borderColor: "currentColor", borderRadius: 20 }}
								>
									{social.label}
								</Button>
							) : (
								<Button
									key={social.id}
									disabled
									variant="outlined"
									aria-label={`${social.label} — sắp kết nối`}
									sx={{
										borderRadius: 20,
										"&.Mui-disabled": {
											color: "#38271d",
											borderColor: "#733013",
											borderStyle: "dashed",
										},
									}}
								>
									{social.label}
								</Button>
							)
						)}
					</Stack>
					{HOME_SOCIALS.some((social) => !social.href) && (
						<Typography variant="caption" sx={{ display: "block", mt: 1 }}>
							Các kênh mạng xã hội đang được cập nhật.
						</Typography>
					)}
				</Box>
				<Box>
					<Typography
						component="h2"
						sx={{ fontSize: { xs: 24, md: 30 }, fontWeight: 700, lineHeight: 1.2 }}
					>
						Đúng dòng máy. Đúng chiếc skin.
					</Typography>
					<Typography sx={{ maxWidth: 440, mt: 2 }}>
						Chưa rõ MacBook đời nào? Xem cách kiểm tra model trước khi chọn skin.
					</Typography>
					<Link href={HOME_GUIDES} passHref>
						<Button
							component="a"
							onClick={() =>
								trackCreativa("cta_click", { surface: "home_v2_footer", cta_name: "model_guide" })
							}
							sx={{ color: "inherit", px: 0, mt: 1, textDecoration: "underline" }}
						>
							Xem cách kiểm tra model
						</Button>
					</Link>
					<Stack alignItems="flex-start" mt={2}>
						{links.map((item) => (
							<Link key={item.href} href={item.href} passHref>
								<Button
									component="a"
									onClick={() =>
										trackCreativa("cta_click", { surface: "home_v2_footer", cta_name: item.href })
									}
									sx={{ color: "inherit", px: 0 }}
								>
									{item.label}
								</Button>
							</Link>
						))}
					</Stack>
				</Box>
			</Box>
			<Typography
				aria-label="INUT Creativa"
				sx={{
					fontSize: "17.5vw",
					lineHeight: 1,
					fontWeight: 700,
					letterSpacing: "-.075em",
					color: "#fffcf2",
					mt: { xs: 6, md: 9 },
					mb: 3,
				}}
			>
				inut.creativa
			</Typography>
			<Stack
				direction={{ xs: "column", sm: "row" }}
				justifyContent="space-between"
				gap={0.5}
				sx={{ borderTop: "1px solid rgba(32,19,12,.3)", py: 2 }}
			>
				<Typography variant="caption">INUT Creativa - Một dự án thuộc INUT Design.</Typography>
				<Typography variant="caption">Một diện mạo mới. Một dấu ấn riêng.</Typography>
			</Stack>
		</Box>
	);
}
