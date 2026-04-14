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

	const MegaMenuLink = ({
		href,
		children,
		isTitle = false,
		onClick,
	}: {
		href: string;
		children: React.ReactNode;
		isTitle?: boolean;
		onClick?: () => void;
	}) => (
		<Link href={href} passHref>
			<MuiLink
				underline="hover"
				onClick={onClick}
				sx={{
					fontWeight: isTitle ? "bold" : "normal",
					color: isTitle ? COLOR_CODE.PRIMARY : COLOR_CODE.TEXT_MUTED,
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
							backgroundColor: COLOR_CODE.SURFACE_ELEVATED,
							zIndex: 100,
							py: 4,
							px: 2,
							borderTop: `1px solid ${COLOR_CODE.BORDER_DARK}`,
							borderBottom: `1px solid ${COLOR_CODE.BORDER_DARK}`,
							boxShadow: "0 20px 40px rgba(8, 7, 6, 0.28)",
							pointerEvents: activeMenu === item.label ? "auto" : "none",
						}}
					>
						<Container maxWidth="lg">
							<Grid container spacing={2} justifyContent="center">
								{/* Column 1: Sticker, Cá nhân hóa */}
								<Grid item xs>
									<Stack spacing={3}>
										{item.children.slice(0, 2).map((group) => (
											<Box key={group.label}>
												<MegaMenuLink
													isTitle
													href={group.path}
													onClick={() => {
														trackHeaderNavigation(group.label, item.label, "desktop");
														setActiveMenu(null);
													}}
												>
													{group.label}
												</MegaMenuLink>
												<Stack mt={1.5} spacing={1.5}>
													{group.children?.map((subItem) => (
														<MegaMenuLink
															key={subItem.path}
															href={subItem.path}
															onClick={() => {
																trackHeaderNavigation(subItem.label, item.label, "desktop");
																setActiveMenu(null);
															}}
														>
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
												<MegaMenuLink
													isTitle
													href={group.path}
													onClick={() => {
														trackHeaderNavigation(group.label, item.label, "desktop");
														setActiveMenu(null);
													}}
												>
													{group.label}
												</MegaMenuLink>
												<Stack mt={1.5} spacing={1.5}>
													{group.children?.map((subItem) => (
														<MegaMenuLink
															key={subItem.path}
															href={subItem.path}
															onClick={() => {
																trackHeaderNavigation(subItem.label, item.label, "desktop");
																setActiveMenu(null);
															}}
														>
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
												<MegaMenuLink
													isTitle
													href={group.path}
													onClick={() => {
														trackHeaderNavigation(group.label, item.label, "desktop");
														setActiveMenu(null);
													}}
												>
													{group.label}
												</MegaMenuLink>
												<Stack mt={1.5} spacing={1.5}>
													{group.children?.map((subItem) => (
														<MegaMenuLink
															key={subItem.path}
															href={subItem.path}
															onClick={() => {
																trackHeaderNavigation(subItem.label, item.label, "desktop");
																setActiveMenu(null);
															}}
														>
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
												<MegaMenuLink
													isTitle
													href={group.path}
													onClick={() => {
														trackHeaderNavigation(group.label, item.label, "desktop");
														setActiveMenu(null);
													}}
												>
													{group.label}
												</MegaMenuLink>
												<Stack mt={1.5} spacing={1.5}>
													{group.children?.map((subItem) => (
														<MegaMenuLink
															key={subItem.path}
															href={subItem.path}
															onClick={() => {
																trackHeaderNavigation(subItem.label, item.label, "desktop");
																setActiveMenu(null);
															}}
														>
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
						backgroundColor: COLOR_CODE.SURFACE_ELEVATED,
						zIndex: 100,
						py: 1,
						border: `1px solid ${COLOR_CODE.BORDER_DARK}`,
						borderRadius: 2,
						boxShadow: "0 20px 40px rgba(8, 7, 6, 0.28)",
						pointerEvents: activeMenu === item.label ? "auto" : "none",
					}}
				>
					<Stack>
						{item.children.map((child) => (
							<Link key={child.path} href={child.path} passHref>
								<MuiLink
									onClick={() => {
										trackHeaderNavigation(child.label, item.label, "desktop");
										setActiveMenu(null);
									}}
									sx={{
										px: 3,
										py: 1.5,
										fontSize: "0.95rem",
										color: COLOR_CODE.WHITE,
										"&:hover": {
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
				backgroundColor: "rgba(8, 7, 6, 0.88)",
				backdropFilter: "blur(18px)",
				zIndex: 99,
				borderBottom: `1px solid ${COLOR_CODE.BORDER_DARK}`,
				boxShadow: "0 10px 30px rgba(8, 7, 6, 0.18)",
			}}
		>
			<Container maxWidth="xl">
				<Stack
					direction="row"
					justifyContent={"space-between"}
					alignItems={"center"}
					sx={{ height: 72 }}
				>
					<Link href={"/"} passHref>
						<MuiLink sx={{ display: "flex", flexShrink: 0 }}>
							<Image src={"/branding/logo.avif"} alt="logo" width={103} height={32} priority />
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
											onClick={() => {
												trackHeaderNavigation(route.label, "Main Nav", "desktop");
												setActiveMenu(null);
											}}
											sx={{
												fontWeight: "bold",
												fontSize: 15,
												textTransform: "uppercase",
												color: isActive(route.path) ? COLOR_CODE.WHITE : COLOR_CODE.TEXT_MUTED,
												position: "relative",
												display: "flex",
												alignItems: "center",
												gap: 0.5,
												letterSpacing: "0.04em",
												transition: "color 150ms ease",
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
												"&:hover": {
													color: COLOR_CODE.WHITE,
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
									onClick={() => {
										trackHeaderNavigation(route.label, "Main Nav", "desktop");
										setActiveMenu(null);
									}}
									sx={{
										borderRadius: "4px",
										fontWeight: "bold",
										textTransform: "uppercase",
										letterSpacing: "0.06em",
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
