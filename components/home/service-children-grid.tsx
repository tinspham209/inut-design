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
	titleHref: string;
	items: RouteItem[];
	maxItems?: number;
	darkMode?: boolean;
	showSeeMore?: boolean;
	id?: string;
};

export function ServiceChildrenGrid({
	title,
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
	const textColor = darkMode ? COLOR_CODE.WHITE : COLOR_CODE.TEXT_DARK;
	const cardBg = darkMode ? "rgba(255,255,255,0.06)" : "#fff";
	const cardBorder = darkMode ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(0,0,0,0.08)";

	return (
		<Box
			component="section"
			bgcolor={darkMode ? COLOR_CODE.BACKGROUND_CARD : COLOR_CODE.BACKGROUND}
			pt={2}
			pb={4}
			id={id}
		>
			<Container>
				<Stack direction="row" py={3} justifyContent="center" alignItems="center">
					<Link href={titleHref} passHref>
						<MuiLink underline="hover" color="inherit">
							<Typography variant="h3" fontWeight="bold" textAlign="center" color={textColor}>
								{title}
							</Typography>
						</MuiLink>
					</Link>
				</Stack>

				<Grid container spacing={2}>
					{displayItems.map((item) => (
						<Grid item xs={6} sm={3} key={item.path}>
							<Link href={item.path} passHref>
								<MuiLink underline="none" onClick={() => handleItemClick(item)}>
									<Box
										sx={{
											backgroundColor: cardBg,
											borderRadius: 2,
											p: { xs: 1.5, sm: 2 },
											height: "100%",
											minHeight: 100,
											transition: "transform 0.2s ease, box-shadow 0.2s ease",
											border: cardBorder,
											"&:hover": {
												transform: "translateY(-4px)",
												boxShadow: darkMode
													? "0 8px 24px rgba(0,0,0,0.4)"
													: "0 8px 24px rgba(0,0,0,0.1)",
											},
										}}
									>
										<Stack spacing={1} alignItems="flex-start">
											<Stack
												direction="row"
												alignItems="center"
												justifyContent="space-between"
												width="100%"
											>
												<Icon sx={{ color: COLOR_CODE.PRIMARY, fontSize: "1.75rem" }}>
													{item.meta?.icon || "star"}
												</Icon>
												{item.meta?.badge && (
													<Chip
														label={item.meta.badge}
														size="small"
														color="primary"
														sx={{ fontSize: "0.6rem", height: 18 }}
													/>
												)}
											</Stack>
											<Typography
												variant="body1"
												fontWeight="bold"
												color={textColor}
												lineHeight={1.4}
												sx={{ fontSize: { xs: "0.9rem", sm: "1.1rem" } }}
											>
												{item.label}
											</Typography>
											{item.meta?.description && (
												<Typography
													variant="body2"
													color={darkMode ? "rgba(255,255,255,0.55)" : "text.secondary"}
													sx={{
														display: { xs: "none", sm: "-webkit-box" },
														WebkitLineClamp: 2,
														WebkitBoxOrient: "vertical",
														overflow: "hidden",
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
							<MuiLink>
								<Button variant="contained">Xem thêm</Button>
							</MuiLink>
						</Link>
					</Stack>
				)}
			</Container>
		</Box>
	);
}
