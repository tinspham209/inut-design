import { RouteItem } from "@/components/common/header/routes";
import { COLOR_CODE } from "@/utils";
import { trackEvent } from "@/utils/analytics";
import {
	Box,
	Button,
	Chip,
	Container,
	Grid,
	Icon,
	Link as MuiLink,
	Stack,
	Typography,
} from "@mui/material";
import Link from "next/link";

type Props = {
	title: string;
	/** Short uppercase eyebrow label above the section title */
	eyebrow?: string;
	titleHref: string;
	items: RouteItem[];
	maxItems?: number;
	/** slightly elevated bg variant (ink-2 vs ink) */
	darkMode?: boolean;
	showSeeMore?: boolean;
	id?: string;
};

export function ServiceChildrenGrid({
	title,
	eyebrow,
	titleHref,
	items,
	maxItems,
	darkMode = false,
	showSeeMore = true,
	id,
}: Props) {
	const handleItemClick = (item: RouteItem) => {
		trackEvent("service_click", {
			service_title: item.label,
			service_path: item.path,
			section: title,
		});
	};
	const displayItems = maxItems ? items.slice(0, maxItems) : items;
	const bgColor = darkMode ? COLOR_CODE.INK_2 : COLOR_CODE.INK;

	return (
		<Box
			component="section"
			bgcolor={bgColor}
			sx={{ py: { xs: "60px", sm: "80px" }, px: { xs: 2, sm: "32px" } }}
			id={id}
		>
			<Container maxWidth="lg" disableGutters>
				{/* Section header */}
				<Box mb={4.5}>
					<Stack direction="row" alignItems="center" gap={1.25} mb={1.5}>
						<Box sx={{ width: 20, height: 2, bgcolor: COLOR_CODE.PRIMARY, flexShrink: 0 }} />
						<Typography
							sx={{
								fontWeight: 700,
								fontSize: "0.68rem",
								letterSpacing: "0.18em",
								textTransform: "uppercase",
								color: COLOR_CODE.PRIMARY,
							}}
						>
							{eyebrow || title}
						</Typography>
					</Stack>
					<Link href={titleHref} passHref>
						<MuiLink underline="none">
							<Typography
								component="h2"
								sx={{
									fontWeight: 800,
									fontSize: { xs: "1.6rem", sm: "2rem", md: "2.4rem" },
									lineHeight: 1.05,
									letterSpacing: "-0.04em",
									color: COLOR_CODE.WHITE,
									mt: 1.5,
									"&:hover": { color: COLOR_CODE.PRIMARY },
									transition: "color 150ms",
								}}
							>
								{title}
							</Typography>
						</MuiLink>
					</Link>
				</Box>

				<Grid container spacing={2}>
					{displayItems.map((item) => (
						<Grid item xs={6} sm={3} key={item.path}>
							<Link href={item.path} passHref>
								<MuiLink underline="none" onClick={() => handleItemClick(item)}>
									<Box
										sx={{
											bgcolor: COLOR_CODE.INK_3,
											border: `1px solid ${COLOR_CODE.INK_4}`,
											borderRadius: "12px",
											overflow: "hidden",
											height: "100%",
											transition: "border-color 200ms, transform 200ms cubic-bezier(0.16,1,0.3,1)",
											"&:hover": {
												borderColor: "rgba(255,77,0,0.25)",
												transform: "translateY(-3px)",
												"& img": { transform: "scale(1.05)" },
											},
										}}
									>
										{/* 4:3 Image Container */}
										<Box
											sx={{ width: "100%", pt: "75%", position: "relative", overflow: "hidden" }}
										>
											{item.meta?.image_url ? (
												<Box
													component="img"
													src={item.meta.image_url}
													alt={item.label}
													sx={{
														position: "absolute",
														top: 0,
														left: 0,
														width: "100%",
														height: "100%",
														objectFit: "cover",
														transition: "transform 0.5s ease",
													}}
												/>
											) : (
												<Box
													sx={{
														position: "absolute",
														top: 0,
														left: 0,
														width: "100%",
														height: "100%",
														bgcolor: COLOR_CODE.INK_4,
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
													}}
												>
													<Icon sx={{ color: COLOR_CODE.PRIMARY }}>star</Icon>
												</Box>
											)}

											{item.meta?.badge && (
												<Chip
													label={item.meta.badge}
													size="small"
													color="primary"
													sx={{
														position: "absolute",
														top: 8,
														right: 8,
														fontSize: "0.6rem",
														height: 18,
														zIndex: 1,
													}}
												/>
											)}
										</Box>

										<Stack spacing={0.75} p={2} alignItems="flex-start">
											<Typography
												sx={{
													fontWeight: 700,
													fontSize: { xs: "0.85rem", sm: "0.9rem" },
													color: COLOR_CODE.WHITE,
													lineHeight: 1.4,
													letterSpacing: "0.02em",
												}}
											>
												{item.label}
											</Typography>
											{item.meta?.description && (
												<Typography
													sx={{
														display: "-webkit-box",
														WebkitLineClamp: 2,
														WebkitBoxOrient: "vertical",
														overflow: "hidden",
														fontSize: "0.78rem",
														color: COLOR_CODE.TEXT_SOFT,
														lineHeight: 1.5,
													}}
												>
													{item.meta.description}
												</Typography>
											)}
										</Stack>
									</Box>
								</MuiLink>
							</Link>
						</Grid>
					))}
				</Grid>

				{showSeeMore && (
					<Stack flexDirection="row" justifyContent="center" mt={3}>
						<Link href={titleHref} passHref>
							<MuiLink underline="none">
								<Button variant="contained">Xem thêm</Button>
							</MuiLink>
						</Link>
					</Stack>
				)}
			</Container>
		</Box>
	);
}
