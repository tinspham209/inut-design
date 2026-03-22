import { ROUTE_LIST, RouteItem } from "@/components/common/header/routes";
import { COLOR_CODE } from "@/utils";
import {
	Box,
	Button,
	Chip,
	Container,
	Divider,
	Grid,
	Icon,
	Link as MuiLink,
	Stack,
	Typography,
} from "@mui/material";
import Link from "next/link";

const SERVICE_CATEGORIES = [
	{ path: "/services/an-pham-luu-niem", maxItems: 6 },
	{ path: "/services/an-pham-van-phong", maxItems: 4 },
	{ path: "/services/an-pham-su-kien", maxItems: 4 },
	{ path: "/services/an-pham-tiep-thi", maxItems: 4 },
	{ path: "/services/ca-nhan-hoa", maxItems: 4 },
];

function ServiceItemCard({ item }: { item: RouteItem }) {
	return (
		<Link href={item.path} passHref>
			<MuiLink underline="none">
				<Box
					sx={{
						backgroundColor: "#fff",
						borderRadius: 2,
						p: { xs: 1.5, sm: 2 },
						height: "100%",
						minHeight: 90,
						border: "1px solid rgba(0,0,0,0.08)",
						transition: "transform 0.2s ease, box-shadow 0.2s ease",
						"&:hover": {
							transform: "translateY(-4px)",
							boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
						},
					}}
				>
					<Stack spacing={0.75} alignItems="flex-start">
						<Stack direction="row" alignItems="center" justifyContent="space-between" width="100%">
							<Icon sx={{ color: COLOR_CODE.PRIMARY, fontSize: "1.6rem" }}>
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
							color={COLOR_CODE.TEXT_DARK}
							lineHeight={1.4}
							sx={{ fontSize: { xs: "0.9rem", sm: "1.05rem" } }}
						>
							{item.label}
						</Typography>
						{item.meta?.description && (
							<Typography
								variant="body2"
								color="text.secondary"
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
	);
}

function ServiceSubSection({ route, maxItems }: { route: RouteItem; maxItems: number }) {
	const items = (route.children || []).slice(0, maxItems);
	const cols = items.length <= 2 ? 6 : items.length === 3 ? 4 : 3;

	return (
		<Box>
			<Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5} mt={0.5}>
				<Stack direction="row" alignItems="center" spacing={1}>
					<Icon sx={{ color: COLOR_CODE.PRIMARY, fontSize: "1.4rem" }}>
						{route.meta?.icon || "folder"}
					</Icon>
					<Link href={route.path} passHref>
						<MuiLink underline="hover" color="inherit">
							<Typography
								variant="h6"
								fontWeight="bold"
								color={COLOR_CODE.TEXT_DARK}
								sx={{ fontSize: { xs: "1.1rem", sm: "1.3rem" } }}
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
				<Link href={route.path} passHref>
					<MuiLink>
						<Typography
							variant="caption"
							color={COLOR_CODE.PRIMARY}
							fontWeight="bold"
							sx={{ display: { xs: "none", sm: "block" } }}
						>
							Xem tất cả →
						</Typography>
					</MuiLink>
				</Link>
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
		<Box component="section" id={id} bgcolor={COLOR_CODE.BACKGROUND} pt={2} pb={6}>
			<Container>
				<Stack direction="row" py={3} justifyContent="center" alignItems="center">
					<Typography
						variant="h3"
						fontWeight="bold"
						textAlign="center"
						color={COLOR_CODE.TEXT_DARK}
					>
						Dịch vụ
					</Typography>
				</Stack>

				<Stack spacing={4}>
					{categories.map(({ route, maxItems }, index) => (
						<Box key={route.path}>
							<ServiceSubSection route={route} maxItems={maxItems} />
							{index < categories.length - 1 && <Divider sx={{ mt: 4 }} />}
						</Box>
					))}
				</Stack>

				<Stack direction="row" justifyContent="center" mt={5}>
					<Link href="/contact" passHref>
						<MuiLink>
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
