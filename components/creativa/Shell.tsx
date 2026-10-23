/* eslint-disable camelcase */
import {
	AppBar,
	Badge,
	Box,
	Button,
	Container,
	Drawer,
	IconButton,
	Stack,
	TextField,
	Toolbar,
	Typography,
	Alert,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useHydratedCreativaCart } from "@/hooks/creativa/useBrowserState";
import { trackCreativa } from "@/utils/creativa/analytics";

export const CREATIVA_NAV = [
	{ label: "Skin MacBook", href: "/creativa/skin-laptop" },
	{ label: "Hướng dẫn", href: "/creativa/skin-laptop/huong-dan-su-dung" },
	{ label: "Tra cứu đơn", href: "/creativa/order-tracking" },
];
export const CREATIVA_FOOTER = [
	{ label: "INUT Creativa", href: "/creativa" },
	...CREATIVA_NAV,
	{ label: "INUT Design", href: "/" },
];

export function CreativaStoreHeader() {
	const { items, hydrated, warning } = useHydratedCreativaCart();
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const router = useRouter();
	const navigation = (href: string) => {
		setOpen(false);
		trackCreativa("cta_click", { cta_name: "navigation", surface: "header" });
		void router.push(href);
	};
	return (
		<AppBar
			position="sticky"
			color="transparent"
			elevation={0}
			sx={{
				bgcolor: "background.default",
				color: "text.primary",
				borderBottom: "1px solid",
				borderColor: "divider",
			}}
		>
			<Toolbar sx={{ justifyContent: "space-between", minHeight: { xs: 64, md: 76 }, gap: 1 }}>
				<IconButton
					aria-label="Mở danh mục"
					onClick={() => setOpen(true)}
					sx={{ display: { md: "none" } }}
				>
					<MenuIcon />
				</IconButton>
				<Stack direction="row" gap={2} sx={{ display: { xs: "none", md: "flex" }, flex: 1 }}>
					{CREATIVA_NAV.map((item) => (
						<Button
							key={item.href}
							onClick={() => navigation(item.href)}
							sx={{ textTransform: "none" }}
						>
							{item.label}
						</Button>
					))}
				</Stack>
				<Link href="/creativa" passHref>
					<Typography
						component="a"
						onClick={() =>
							trackCreativa("cta_click", { surface: "header", cta_name: "brand_home" })
						}
						sx={{
							fontWeight: 800,
							letterSpacing: "-.06em",
							fontSize: { xs: 25, md: 30 },
							color: "primary.main",
							textDecoration: "none",
						}}
					>
						inut.creativa
					</Typography>
				</Link>
				<Stack
					direction="row"
					alignItems="center"
					gap={1}
					sx={{ flex: { md: 1 }, justifyContent: "flex-end" }}
				>
					<Box
						component="form"
						sx={{ display: { xs: "none", lg: "block" } }}
						onSubmit={(event) => {
							event.preventDefault();
							void router.push({
								pathname: "/creativa/skin-laptop",
								query: query.trim() ? { q: query.trim() } : {},
							});
						}}
					>
						<TextField
							size="small"
							label="Tìm mẫu skin"
							value={query}
							onChange={(event) => setQuery(event.target.value)}
							inputProps={{ maxLength: 80 }}
						/>
					</Box>
					<IconButton aria-label="Giỏ hàng Creativa" onClick={() => navigation("/creativa/cart")}>
						<Badge
							badgeContent={hydrated ? items.reduce((sum, item) => sum + item.quantity, 0) : 0}
							color="primary"
						>
							<ShoppingBagOutlinedIcon />
						</Badge>
					</IconButton>
				</Stack>
			</Toolbar>
			{warning && (
				<Alert severity="warning" sx={{ borderRadius: 0 }}>
					{warning}
				</Alert>
			)}
			<Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
				<Stack p={3} gap={2} width={290}>
					<IconButton
						aria-label="Đóng danh mục"
						onClick={() => setOpen(false)}
						sx={{ alignSelf: "flex-end" }}
					>
						<CloseIcon />
					</IconButton>
					<Typography fontWeight={800}>INUT Creativa</Typography>
					{CREATIVA_NAV.map((item) => (
						<Button key={item.href} onClick={() => navigation(item.href)}>
							{item.label}
						</Button>
					))}
				</Stack>
			</Drawer>
		</AppBar>
	);
}

export function CreativaStoreFooter() {
	return (
		<Box
			component="footer"
			sx={{
				bgcolor: "background.paper",
				borderTop: "1px solid",
				borderColor: "divider",
				py: 4,
				mt: "auto",
			}}
		>
			<Container maxWidth="xl">
				<Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={3}>
					<Box>
						<Typography fontSize={24} fontWeight={800} color="primary.main">
							inut.creativa
						</Typography>
						<Typography variant="body2">Một nhánh thương hiệu của INUT Design.</Typography>
					</Box>
					<Stack direction="row" flexWrap="wrap" gap={2}>
						{CREATIVA_FOOTER.map((item) => (
							<Link key={item.href} href={item.href} passHref>
								<Typography
									component="a"
									onClick={() =>
										trackCreativa("cta_click", { surface: "footer", cta_name: item.href })
									}
									sx={{ color: "inherit", textDecoration: "underline", alignSelf: "center" }}
								>
									{item.label}
								</Typography>
							</Link>
						))}
					</Stack>
				</Stack>
			</Container>
		</Box>
	);
}
