import { COLOR_CODE, trackHeaderNavigation } from "@/utils";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Fade from "@mui/material/Fade";
import MuiLink from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { ROUTE_LIST, RouteItem } from "./routes";
import { MegaMenuContactBox } from "./MegaMenuContactBox";
import { Divider, Grid } from "@mui/material";

export function HeaderDesktop() {
	const router = useRouter();
	const [activeMenu, setActiveMenu] = useState<string | null>(null);

	const handleMouseEnter = (label: string) => {
		setActiveMenu(label);
	};

	const handleMouseLeave = () => {
		setActiveMenu(null);
	};

	const isActive = (path: string) => {
		if (path === "/") return router.pathname === "/";
		return router.pathname.startsWith(path);
	};

	const renderDropdown = (item: RouteItem) => {
		if (!item.children) return null;

		if (item.isMega) {
			return (
				<Fade in={activeMenu === item.label} timeout={300}>
					<Paper
						elevation={4}
						sx={{
							position: "absolute",
							top: "100%",
							left: 0,
							width: "100%",
							backgroundColor: "white",
							zIndex: 100,
							py: 4,
							px: 2,
							borderTop: `1px solid ${COLOR_CODE.BORDER}`,
							boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
						}}
					>
						<Container maxWidth="lg">
							<Grid container spacing={2} justifyContent="center">
								{/* Column 1: Sticker, Cá nhân hóa */}
								<Grid item xs>
									<Stack spacing={3}>
										{item.children.slice(0, 2).map((group) => (
											<Box key={group.label}>
												<MegaMenuLink isTitle href={group.path}>
													{group.label}
												</MegaMenuLink>
												<Stack mt={1.5} spacing={1.5}>
													{group.children?.map((subItem) => (
														<MegaMenuLink key={subItem.path} href={subItem.path}>
															{subItem.label}
														</MegaMenuLink>
													))}
												</Stack>
											</Box>
										))}
									</Stack>
								</Grid>

								<Divider
									orientation="vertical"
									flexItem
									sx={{ mx: 2, borderColor: COLOR_CODE.BORDER }}
								/>

								{/* Column 2: Ấn phẩm lưu niệm, Ấn phẩm Tiếp Thị*/}
								<Grid item xs>
									<Stack spacing={3}>
										{[item.children[2], item.children[5]].map((group) => (
											<Box key={group.label}>
												<MegaMenuLink isTitle href={group.path}>
													{group.label}
												</MegaMenuLink>
												<Stack mt={1.5} spacing={1.5}>
													{group.children?.map((subItem) => (
														<MegaMenuLink key={subItem.path} href={subItem.path}>
															{subItem.label}
														</MegaMenuLink>
													))}
												</Stack>
											</Box>
										))}
									</Stack>
								</Grid>

								<Divider
									orientation="vertical"
									flexItem
									sx={{ mx: 2, borderColor: COLOR_CODE.BORDER }}
								/>

								{/* Column 3: Ấn phẩm sự kiện, Ấn phẩm F&B */}
								<Grid item xs>
									<Stack spacing={3}>
										{[item.children[4], item.children[6]].map((group) => (
											<Box key={group.label}>
												<MegaMenuLink isTitle href={group.path}>
													{group.label}
												</MegaMenuLink>
												<Stack mt={1.5} spacing={1.5}>
													{group.children?.map((subItem) => (
														<MegaMenuLink key={subItem.path} href={subItem.path}>
															{subItem.label}
														</MegaMenuLink>
													))}
												</Stack>
											</Box>
										))}
									</Stack>
								</Grid>

								<Divider
									orientation="vertical"
									flexItem
									sx={{ mx: 2, borderColor: COLOR_CODE.BORDER }}
								/>

								{/* Column 4: Ấn phẩm văn phòng */}
								<Grid item xs>
									<Stack spacing={3}>
										{[item.children[3], item.children[7]].map((group) => (
											<Box key={group.label}>
												<MegaMenuLink isTitle href={group.path}>
													{group.label}
												</MegaMenuLink>
												<Stack mt={1.5} spacing={1.5}>
													{group.children?.map((subItem) => (
														<MegaMenuLink key={subItem.path} href={subItem.path}>
															{subItem.label}
														</MegaMenuLink>
													))}
												</Stack>
											</Box>
										))}
									</Stack>
								</Grid>
							</Grid>
						</Container>
					</Paper>
				</Fade>
			);
		}

		return (
			<Fade in={activeMenu === item.label} timeout={300}>
				<Paper
					elevation={4}
					sx={{
						position: "absolute",
						top: "100%",
						minWidth: 200,
						backgroundColor: "white",
						zIndex: 100,
						py: 1,
						boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
					}}
				>
					<Stack>
						{item.children.map((child) => (
							<Link key={child.path} href={child.path} passHref>
								<MuiLink
									onClick={() => trackHeaderNavigation(child.label, item.label, "desktop")}
									sx={{
										px: 3,
										py: 1.5,
										fontSize: "0.95rem",
										color: "text.primary",
										"&:hover": {
											backgroundColor: "rgba(0, 0, 0, 0.04)",
											color: COLOR_CODE.PRIMARY,
										},
									}}
									underline="none"
									className={clsx({ active: isActive(child.path) })}
								>
									{child.label}
								</MuiLink>
							</Link>
						))}
					</Stack>
				</Paper>
			</Fade>
		);
	};

	const MegaMenuLink = ({
		href,
		children,
		isTitle = false,
	}: {
		href: string;
		children: React.ReactNode;
		isTitle?: boolean;
	}) => (
		<Link href={href} passHref>
			<MuiLink
				underline="hover"
				sx={{
					fontWeight: isTitle ? "bold" : "normal",
					color: isTitle ? COLOR_CODE.PRIMARY : "text.secondary",
					textTransform: isTitle ? "uppercase" : "none",
					fontSize: isTitle ? "0.875rem" : "0.95rem",
					display: "inline-block",
					position: "relative",
					"&:hover": {
						color: COLOR_CODE.PRIMARY,
					},
					...(isTitle && {
						display: "flex",
						alignItems: "center",
						gap: 1,
						"&::before": {
							content: '""',
							width: 2,
							height: 14,
							backgroundColor: COLOR_CODE.PRIMARY,
							display: "inline-block",
						},
					}),
				}}
			>
				{children}
			</MuiLink>
		</Link>
	);

	return (
		<Box
			component={"header"}
			display={{
				xs: "none",
				md: "block",
			}}
			sx={{
				position: "fixed",
				top: 0,
				width: "100%",
				backgroundColor: "white",
				zIndex: 99,
				borderBottom: `1px solid ${COLOR_CODE.BORDER}`,
				boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
			}}
		>
			<Container maxWidth="xl">
				<Stack
					direction="row"
					justifyContent={"space-between"}
					alignItems={"center"}
					sx={{ height: 64 }}
				>
					<Link href={"/"} passHref>
						<MuiLink sx={{ display: "flex", flexShrink: 0 }}>
							<Image src={"/branding/logo.webp"} alt="logo" width={103} height={32} priority />
						</MuiLink>
					</Link>

					<Stack
						direction="row"
						alignItems="center"
						spacing={{ md: 2, lg: 4 }}
						sx={{
							height: "100%",
						}}
					>
						{ROUTE_LIST.map((route, index) => {
							if (route.isButton) return null;

							return (
								<Box
									key={`${route.path}-${index}`}
									onMouseEnter={() => handleMouseEnter(route.label)}
									onMouseLeave={handleMouseLeave}
									sx={{
										height: "100%",
										display: "flex",
										alignItems: "center",
										position: route.isMega ? "static" : "relative",
										flexShrink: 0,
									}}
								>
									<Link href={route.path} passHref>
										<MuiLink
											onClick={() => trackHeaderNavigation(route.label, "Main Nav", "desktop")}
											sx={{
												fontWeight: "bold",
												fontSize: 15,
												textTransform: "uppercase",
												color: "text.primary",
												position: "relative",
												display: "flex",
												alignItems: "center",
												gap: 0.5,
												"&::after": {
													content: '""',
													position: "absolute",
													bottom: -4,
													left: 0,
													width: isActive(route.path) ? "100%" : 0,
													height: 2,
													backgroundColor: COLOR_CODE.PRIMARY,
													transition: "width 0.3s ease-in-out",
												},
												"&:hover::after": {
													width: "100%",
												},
											}}
											underline="none"
											className={clsx({ active: isActive(route.path) })}
										>
											{route.label}
											{route.children && route.children.length > 0 && (
												<KeyboardArrowDownIcon
													sx={{
														fontSize: 18,
														transition: "transform 0.3s ease",
														transform:
															activeMenu === route.label ? "rotate(180deg)" : "rotate(0deg)",
														color:
															activeMenu === route.label || isActive(route.path)
																? COLOR_CODE.PRIMARY
																: "inherit",
													}}
												/>
											)}
										</MuiLink>
									</Link>
									{renderDropdown(route)}
								</Box>
							);
						})}

						{ROUTE_LIST.filter((r) => r.isButton).map((route) => (
							<Link key={route.path} href={route.path} passHref>
								<Button
									variant="contained"
									size="small"
									onClick={() => trackHeaderNavigation(route.label, "Main Nav", "desktop")}
									sx={{
										borderRadius: "4px",
										fontWeight: "bold",
										textTransform: "uppercase",
										flexShrink: 0,
									}}
								>
									{route.label}
								</Button>
							</Link>
						))}
					</Stack>
				</Stack>
			</Container>
		</Box>
	);
}
