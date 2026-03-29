import { COLOR_CODE, trackHeaderNavigation } from "@/utils";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import MenuIcon from "@mui/icons-material/Menu";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { ROUTE_LIST, RouteItem } from "./routes";

export function HeaderMobile() {
	const [open, setOpen] = useState(false);
	const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
		"Dịch vụ": true,
		"Sản Phẩm": true,
	});
	const router = useRouter();

	const toggleDrawer = (isOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
		if (
			event.type === "keydown" &&
			((event as React.KeyboardEvent).key === "Tab" ||
				(event as React.KeyboardEvent).key === "Shift")
		) {
			return;
		}
		setOpen(isOpen);
	};

	const handleExpand = (label: string) => {
		setExpandedItems((prev) => ({
			...prev,
			[label]: !prev[label],
		}));
	};

	const isActive = (path: string) => {
		if (path === "/") return router.pathname === "/";
		return router.pathname.startsWith(path);
	};

	const renderNavItem = (item: RouteItem, level = 0) => {
		const hasChildren = item.children && item.children.length > 0;
		const isExpanded = expandedItems[item.label];

		if (item.isButton) return null;

		return (
			<React.Fragment key={item.path + item.label}>
				<ListItem disablePadding>
					<Stack direction="row" alignItems="center" sx={{ width: "100%" }}>
						<Link href={item.path} passHref>
							<ListItemButton
								onClick={() => {
									trackHeaderNavigation(item.label, "Main Nav", "mobile");
									setOpen(false);
								}}
								sx={{
									pl: level * 2 + 2,
									flexGrow: 1,
									borderRadius: 1,
								}}
								selected={isActive(item.path)}
							>
								<ListItemText
									primary={item.label}
									primaryTypographyProps={{
										fontWeight: level === 0 ? "bold" : "medium",
										fontSize: level === 0 ? 16 : 14,
										textTransform: level === 0 ? "uppercase" : "none",
										color: isActive(item.path) ? COLOR_CODE.PRIMARY : COLOR_CODE.WHITE,
									}}
								/>
							</ListItemButton>
						</Link>
						{hasChildren && (
							<IconButton
								size="small"
								onClick={() => handleExpand(item.label)}
								sx={{ mr: 1, color: COLOR_CODE.PRIMARY }}
							>
								{isExpanded ? <ExpandLess /> : <ExpandMore />}
							</IconButton>
						)}
					</Stack>
				</ListItem>
				{hasChildren && (
					<Collapse in={isExpanded} timeout="auto" unmountOnExit>
						<List
							component="div"
							disablePadding
							sx={{ backgroundColor: COLOR_CODE.SURFACE_ELEVATED }}
						>
							{item.children?.map((child) => renderNavItem(child, level + 1))}
						</List>
					</Collapse>
				)}
			</React.Fragment>
		);
	};

	return (
		<Box
			component={"header"}
			py={2}
			display={{ xs: "block", md: "none" }}
			sx={{
				position: "fixed",
				top: 0,
				width: "100%",
				backgroundColor: "rgba(8, 7, 6, 0.92)",
				backdropFilter: "blur(16px)",
				zIndex: 99,
				borderBottom: `1px solid ${COLOR_CODE.BORDER_DARK}`,
				boxShadow: "0 10px 24px rgba(8, 7, 6, 0.16)",
			}}
		>
			<Container maxWidth="lg">
				<Stack direction="row" justifyContent={"space-between"} alignItems="center">
					<Stack direction="row" alignItems="center" spacing={1}>
						<IconButton
							onClick={toggleDrawer(true)}
							sx={{
								color: COLOR_CODE.WHITE,
								p: 0,
							}}
							type="button"
							aria-label="Menu"
						>
							<MenuIcon />
						</IconButton>
						<Link href={"/"} passHref>
							<Box sx={{ display: "flex", cursor: "pointer" }}>
								<Image src={"/branding/logo.webp"} alt="logo" width={103} height={32} priority />
							</Box>
						</Link>
					</Stack>

					<Link href={"/contact/form"} passHref>
						<Button
							variant="contained"
							size="small"
							sx={{
								fontSize: "0.75rem",
								fontWeight: "bold",
								textTransform: "uppercase",
								letterSpacing: "0.06em",
							}}
						>
							Báo giá
						</Button>
					</Link>
				</Stack>

				<Drawer
					anchor={"left"}
					open={open}
					onClose={toggleDrawer(false)}
					PaperProps={{
						sx: {
							width: "80%",
							maxWidth: 320,
							display: "flex",
							flexDirection: "column",
							backgroundColor: COLOR_CODE.INK,
							color: COLOR_CODE.WHITE,
						},
					}}
				>
					<Box
						sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}
					>
						<Image src={"/branding/logo.webp"} alt="logo" width={103} height={32} />
						<IconButton onClick={toggleDrawer(false)} sx={{ color: COLOR_CODE.WHITE }}>
							<CloseIcon />
						</IconButton>
					</Box>
					<Divider sx={{ borderColor: COLOR_CODE.BORDER_DARK }} />
					<List sx={{ flexGrow: 1, py: 0 }}>{ROUTE_LIST.map((route) => renderNavItem(route))}</List>
					<Divider sx={{ borderColor: COLOR_CODE.BORDER_DARK }} />
					<Box sx={{ p: 2 }}>
						{ROUTE_LIST.filter((r) => r.isButton).map((route) => (
							<Link key={route.path} href={route.path} passHref>
								<Button
									fullWidth
									variant="contained"
									onClick={toggleDrawer(false)}
									sx={{
										py: 1.5,
										fontWeight: "bold",
										textTransform: "uppercase",
										letterSpacing: "0.06em",
									}}
								>
									{route.label}
								</Button>
							</Link>
						))}
					</Box>
				</Drawer>
			</Container>
		</Box>
	);
}
