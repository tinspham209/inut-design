/* eslint-disable camelcase */
import { Box, Button, Stack, Typography } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import Image from "next/image";
import Link from "next/link";
import { CREATIVA_SKIN_CATALOG, type CreativaHomeSocial } from "@/data/creativa/homepage";
import { trackCreativa } from "@/utils/creativa/analytics";

const helpLinks = [
	{ label: "Xem skin MacBook", href: CREATIVA_SKIN_CATALOG },
	{ label: "Hướng dẫn sử dụng", href: `${CREATIVA_SKIN_CATALOG}/huong-dan-su-dung` },
	{ label: "Tra cứu đơn hàng", href: "/creativa/order-tracking" },
	{ label: "Về INUT Design", href: "/" },
];

export function CreativaHomeFooter({ socials }: { socials: CreativaHomeSocial[] }) {
	return (
		<Box
			component="footer"
			sx={{ bgcolor: "primary.main", color: "#20130c", px: { xs: 2, md: 4 }, pt: { xs: 4, md: 6 } }}
		>
			<Box sx={{ display: "grid", gridTemplateColumns: { md: "1fr 1fr" }, gap: { xs: 4, md: 10 } }}>
				<Box>
					<Typography
						component="h2"
						sx={{ fontSize: { xs: 28, md: 36 }, letterSpacing: "-.04em", lineHeight: 1.15 }}
					>
						Gu mới cho chiếc
						<br />
						MacBook quen thuộc.
					</Typography>
					<Typography sx={{ maxWidth: 410, mt: 2, mb: 2 }}>
						Kết nối với INUT để cùng khám phá những mẫu skin mới và cảm hứng cho góc làm việc của
						bạn.
					</Typography>
					<Stack direction="row" flexWrap="wrap" gap={1} aria-label="Mạng xã hội INUT">
						{socials.map((social) =>
							social.href ? (
								<Button
									key={social.id}
									component="a"
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									variant="outlined"
									endIcon={<ArrowOutwardIcon fontSize="small" />}
									onClick={() =>
										trackCreativa("social_click", {
											surface: "home_footer",
											method: social.id,
										})
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
					{socials.some((social) => !social.href) && (
						<Typography variant="caption" sx={{ display: "block", mt: 1 }}>
							Các kênh mạng xã hội đang được cập nhật.
						</Typography>
					)}
					<Box sx={{ position: "relative", aspectRatio: "16 / 7", maxWidth: 440, mt: 3 }}>
						<Image
							src="/creativa/homepage/social-concept.jpg"
							alt="Ảnh concept AI: MacBook xanh nhạt bên tách cà phê và sổ tay"
							layout="fill"
							objectFit="cover"
							sizes="(min-width: 900px) 440px, 100vw"
						/>
						<Typography
							variant="caption"
							sx={{
								position: "absolute",
								right: 8,
								top: 8,
								bgcolor: "#f6f3ed",
								px: 1,
								color: "#382a23",
								fontSize: 10,
							}}
						>
							Ảnh concept AI
						</Typography>
					</Box>
				</Box>
				<Box>
					<Typography component="h2" sx={{ fontSize: 24, fontWeight: 400, mb: 2 }}>
						Chọn đúng skin cho MacBook của bạn.
					</Typography>
					<Typography sx={{ maxWidth: 440, mb: 2 }}>
						Chưa chắc về dòng máy đang sử dụng? Kiểm tra model và các lựa chọn trên trang sản phẩm
						trước khi đặt. Rõ thông tin, yên tâm chọn mẫu.
					</Typography>
					<Stack alignItems="flex-start" gap={0.5}>
						{helpLinks.map((item) => (
							<Link key={item.href} href={item.href} passHref>
								<Button
									component="a"
									onClick={() =>
										trackCreativa("cta_click", { surface: "home_footer", cta_name: item.href })
									}
									sx={{ color: "inherit", px: 0, justifyContent: "flex-start" }}
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
					fontWeight: 500,
					letterSpacing: "-.075em",
					color: "#fffaf7",
					mt: { xs: 5, md: 9 },
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
				<Typography variant="caption">
					INUT Creativa · Một nhánh thương hiệu của INUT Design.
				</Typography>
				<Typography variant="caption">Một diện mạo mới. Một dấu ấn riêng.</Typography>
			</Stack>
		</Box>
	);
}
