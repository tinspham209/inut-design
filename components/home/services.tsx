import { ROUTE_LIST, RouteItem } from "@/components/common/header/routes";
import { COLOR_CODE } from "@/utils";
import { BRAND_COLORS } from "@/utils/design-tokens";
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

const SERVICE_CATEGORIES = [
	{ path: "/services/ca-nhan-hoa", maxItems: 6 },
	{ path: "/services/an-pham-luu-niem", maxItems: 6 },
	{ path: "/services/an-pham-su-kien", maxItems: 6 },
	{ path: "/services/an-pham-fb", maxItems: 6 },
	{ path: "/services/an-pham-tiep-thi", maxItems: 6 },
	{ path: "/services/an-pham-van-phong", maxItems: 6 },
	{ path: "/services/an-pham-bao-bi", maxItems: 6 },
];

function ServiceItemCard({ item }: { item: RouteItem }) {
	const handleItemClick = () => {
		trackEvent("service_click", {
			service_title: item.label,
			service_path: item.path,
			section: "Homepage Services",
		});
	};

	return (
		<Link href={item.path} passHref>
			<MuiLink underline="none" onClick={handleItemClick}>
				<Box
					sx={{
						bgcolor: COLOR_CODE.INK_3,
						border: `1px solid ${COLOR_CODE.INK_4}`,
						borderRadius: "12px",
						p: { xs: 1.5, sm: 2 },
						height: "100%",
						minHeight: 90,
						transition: "border-color 200ms, transform 200ms cubic-bezier(0.16,1,0.3,1)",
						"&:hover": {
							borderColor: "rgba(255,77,0,0.25)",
							transform: "translateY(-3px)",
						},
					}}
				>
					<Stack spacing={0.75} alignItems="flex-start">
						<Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
							<Box
								sx={{
									width: 40,
									height: 40,
									bgcolor: BRAND_COLORS.orangeLo,
									borderRadius: "8px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
								}}
							>
								<Icon sx={{ color: COLOR_CODE.PRIMARY, fontSize: "1.25rem" }}>
									{item.meta?.icon || "star"}
								</Icon>
							</Box>
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
									display: { xs: "none", sm: "-webkit-box" },
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
	);
}

function ServiceSubSection({ route, maxItems }: { route: RouteItem; maxItems: number }) {
	const items = (route.children || []).slice(0, maxItems);
	const cols = items.length <= 2 ? 6 : items.length === 3 ? 4 : 3;

	const handleHeaderClick = () => {
		trackEvent("service_click", {
			service_title: route.label,
			service_path: route.path,
			section: "Homepage Services Section Header",
		});
	};

	return (
		<Box>
			<Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5} mt={0.5}>
				<Stack direction="row" alignItems="center" spacing={1}>
					<Icon sx={{ color: COLOR_CODE.PRIMARY, fontSize: "1.4rem" }}>
						{route.meta?.icon || "folder"}
					</Icon>
					<Link href={route.path} passHref>
						<MuiLink
							underline="hover"
							onClick={handleHeaderClick}
							sx={{ color: COLOR_CODE.TEXT_MUTED, "&:hover": { color: COLOR_CODE.WHITE } }}
						>
							<Typography
								sx={{
									fontWeight: 700,
									fontSize: { xs: "1.1rem", sm: "1.3rem" },
									color: "inherit",
									letterSpacing: "-0.01em",
								}}
							>
								{route.label}
							</Typography>
						</MuiLink>
					</Link>
					{route.meta?.badge && (
						<Chip
							label={route.meta.badge}
							size="small"
							color="primary"
							sx={{ fontSize: "0.6rem", height: 18 }}
						/>
					)}
				</Stack>
			</Stack>

			<Grid container spacing={1.5}>
				{items.map((item) => (
					<Grid item xs={6} sm={cols} key={item.path}>
						<ServiceItemCard item={item} />
					</Grid>
				))}
			</Grid>
		</Box>
	);
}

export function ServicesSection({ id }: { id?: string }) {
	const servicesRoute = ROUTE_LIST.find((r) => r.path === "/services");

	const categories = SERVICE_CATEGORIES.map(({ path, maxItems }) => ({
		maxItems,
		route: servicesRoute?.children?.find((r) => r.path === path),
	})).filter((c) => c.route != null) as { maxItems: number; route: RouteItem }[];

	return (
		<Box
			component="section"
			id={id}
			bgcolor={COLOR_CODE.INK}
			sx={{ py: { xs: "60px", sm: "80px" }, px: { xs: 2, sm: "32px" } }}
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
							Dịch Vụ
						</Typography>
					</Stack>
					<Typography
						component="h2"
						sx={{
							fontWeight: 800,
							fontSize: { xs: "1.6rem", sm: "2rem", md: "2.4rem" },
							lineHeight: 1.05,
							letterSpacing: "-0.04em",
							color: COLOR_CODE.WHITE,
							mt: 1.5,
						}}
					>
						Chúng Tôi{" "}
						<Box component="em" sx={{ fontStyle: "italic", color: COLOR_CODE.PRIMARY }}>
							Làm Gì
						</Box>
					</Typography>
				</Box>

				<Stack spacing={4}>
					{categories.map(({ route, maxItems }, index) => (
						<Box
							key={route.path}
							sx={
								index < categories.length - 1
									? {
											pb: 4,
											borderBottom: `1px solid ${COLOR_CODE.INK_4}`,
									  }
									: undefined
							}
						>
							<ServiceSubSection route={route} maxItems={maxItems} />
						</Box>
					))}
				</Stack>

				<Stack direction="row" justifyContent="center" mt={5}>
					<Link href="/contact" passHref>
						<MuiLink underline="none">
							<Button variant="contained" size="large">
								Liên hệ tư vấn
							</Button>
						</MuiLink>
					</Link>
				</Stack>
			</Container>
		</Box>
	);
}
