import { LIST_CONTACTS } from "@/data/contacts/list-contacts";
import { COLOR_CODE } from "@/utils";
import {
	Box,
	Button,
	Container,
	Divider,
	Grid,
	Link as MuiLink,
	Stack,
	Typography,
} from "@mui/material";
import Link from "next/link";

function formatLinkDisplay(link: string): string {
	if (link.startsWith("tel:")) return link.replace("tel:+84", "0").replace("tel:", "");
	if (link.startsWith("mailto:")) return link.replace("mailto:", "");
	if (link.startsWith("/")) return `inutdesign.com${link}`;
	try {
		const url = new URL(link);
		// Instagram → @handle
		if (url.hostname.includes("instagram.com")) {
			const handle = url.pathname.replace(/\//g, "");
			return `@${handle}`;
		}
		// Facebook
		if (url.hostname.includes("facebook.com")) {
			return url.pathname.replace(/\//g, "");
		}
		// maps
		if (url.hostname.includes("maps")) return "Xem bản đồ →";
		// Zalo
		if (url.hostname.includes("zalo.me")) return url.href.replace("https://", "");
		// Messenger
		if (url.hostname.includes("m.me")) return "Nhắn tin Messenger →";
		// generic: strip https://www.
		return url.hostname.replace("www.", "") + url.pathname.replace(/\/$/, "");
	} catch {
		return link;
	}
}

export function ChotDon() {
	return (
		<Box
			component="section"
			sx={{
				bgcolor: "#18191c",
			}}
		>
			<Container maxWidth="lg" disableGutters>
				<Grid container>
					{/* Left — CTA */}
					<Grid
						item
						xs={12}
						md={6}
						sx={{
							p: { xs: 4, sm: 6, md: 8 },
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
						}}
					>
						<Typography
							variant="overline"
							sx={{
								color: COLOR_CODE.PRIMARY,
								letterSpacing: 3,
								fontWeight: "bold",
								mb: 2,
								display: "block",
							}}
						>
							— Bắt đầu ngay
						</Typography>

						<Typography
							component="h2"
							sx={{
								fontSize: { xs: "2.2rem", sm: "3rem", md: "3.6rem" },
								fontWeight: 900,
								lineHeight: 1.1,
								color: "#fff",
								mb: 0.5,
							}}
						>
							Sẵn sàng biến
							<br />
							ý tưởng thành
							<br />
							<Box
								component="span"
								sx={{
									color: COLOR_CODE.PRIMARY,
									fontStyle: "italic",
								}}
							>
								sản phẩm?
							</Box>
						</Typography>

						<Typography
							variant="body2"
							sx={{
								color: "rgba(255,255,255,0.5)",
								mt: 3,
								mb: 4,
								lineHeight: 1.7,
							}}
						>
							Inbox ngay — báo giá trong 15 phút.
							<br />
							Không cần đặt cọc. Không cần có file sẵn.
						</Typography>

						<Stack direction="row" spacing={1} flexWrap="wrap">
							<MuiLink
								href="https://zalo.me/0327124321"
								target="_blank"
								rel="noopener noreferrer"
								underline="none"
							>
								<Button
									variant="contained"
									size="large"
									sx={{
										fontWeight: "bold",
									}}
								>
									Inbox Zalo ngay
								</Button>
							</MuiLink>
							<Link href="/contact/form" passHref legacyBehavior>
								<MuiLink rel="noopener noreferrer" underline="none">
									<Button
										variant="outlined"
										size="large"
										sx={{
											fontWeight: "bold",
										}}
									>
										Nhận báo giá
									</Button>
								</MuiLink>
							</Link>
						</Stack>
					</Grid>

					{/* Right — contact list */}
					<Grid
						item
						xs={12}
						md={6}
						sx={{
							borderLeft: { md: "1px solid rgba(255,255,255,0.08)" },
							borderTop: { xs: "1px solid rgba(255,255,255,0.08)", md: "none" },
						}}
					>
						{LIST_CONTACTS.map((item, index) => {
							if (!item.isShowInHomepage) return null;
							return (
								<Box key={`${item.title}-${index}`}>
									<MuiLink
										href={item.link}
										target={item.link.startsWith("/") ? undefined : "_blank"}
										rel="noopener noreferrer"
										underline="none"
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 2.5,
											px: { xs: 4, sm: 5, md: 6 },
											py: 2.5,
											transition: "background 0.18s ease",
											"&:hover": {
												bgcolor: "rgba(255,255,255,0.04)",
											},
										}}
									>
										{/* Icon box */}
										<Box
											sx={{
												width: 48,
												height: 48,
												minWidth: 48,
												borderRadius: 1.5,
												bgcolor: "rgba(225,97,46,0.15)",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												color: COLOR_CODE.PRIMARY,
												"& svg": { fontSize: "1.5rem !important" },
											}}
										>
											{item.icon}
										</Box>

										{/* Label + value */}
										<Stack spacing={0.25}>
											<Typography
												variant="caption"
												sx={{
													color: "rgba(255,255,255,0.4)",
													textTransform: "uppercase",
													letterSpacing: 1.5,
													fontWeight: 600,
													fontSize: "0.65rem",
												}}
											>
												{item.title}
											</Typography>
											<Typography
												variant="body2"
												sx={{
													color: "rgba(255,255,255,0.9)",
													fontWeight: 600,
													fontSize: { xs: "0.85rem", sm: "0.95rem" },
												}}
											>
												{formatLinkDisplay(item.link)}
											</Typography>
										</Stack>
									</MuiLink>

									{index < LIST_CONTACTS.length - 1 && (
										<Divider sx={{ borderColor: "rgba(255,255,255,0.06)" }} />
									)}
								</Box>
							);
						})}
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}
