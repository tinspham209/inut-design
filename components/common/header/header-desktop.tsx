import { COLOR_CODE } from "@/utils";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { ROUTE_LIST, RouteItem } from "./routes";

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
							left: "50%",
							transform: "translateX(-50%)",
							width: "100vw",
							backgroundColor: "white",
							zIndex: 100,
							p: 4,
							borderTop: `1px solid ${COLOR_CODE.BORDER}`,
							boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
						}}
					>
						<Container>
							<Grid container spacing={4} justifyContent="center">
								{item.children.map((column) => (
									<Grid item xs={12} sm={6} md={2} key={column.label}>
										<Link href={column.path} passHref>
											<MuiLink
												sx={{
													fontWeight: "bold",
													color: COLOR_CODE.PRIMARY,
													textTransform: "uppercase",
													fontSize: "0.875rem",
												}}
												underline="hover"
											>
												{column.label}
											</MuiLink>
										</Link>
										<Stack spacing={1.5} mt={1.5}>
											{column.children?.map((subItem) => (
												<Link key={subItem.path} href={subItem.path} passHref>
													<MuiLink
														sx={{
															fontSize: "0.95rem",
															color: "text.primary",
															transition: "all 0.2s",
															"&:hover": {
																color: COLOR_CODE.PRIMARY,
																transform: "translateX(4px)",
															},
															display: "inline-block",
														}}
														underline="none"
														data-umami-event={
															"header_navigation_click_desktop_mega_" +
															subItem.label.toLowerCase().replace(/\s+/g, "_")
														}
														className={clsx({ active: isActive(subItem.path) })}
													>
														{subItem.label}
													</MuiLink>
												</Link>
											))}
										</Stack>
									</Grid>
								))}
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
									data-umami-event={
										"header_navigation_click_desktop_dropdown_" +
										child.label.toLowerCase().replace(/\s+/g, "_")
									}
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
				backgroundColor: "white",
				zIndex: 99,
				borderBottom: `1px solid ${COLOR_CODE.BORDER}`,
				boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
			}}
		>
			<Container>
				<Stack
					direction="row"
					justifyContent={"space-between"}
					alignItems={"center"}
					sx={{ height: 64 }}
				>
					<Link href={"/"} passHref>
						<MuiLink sx={{ display: "flex" }}>
							<Image src={"/branding/logo.webp"} alt="logo" width={103} height={32} />
						</MuiLink>
					</Link>

					<Stack direction="row" alignItems="center" spacing={4} sx={{ height: "100%" }}>
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
									}}
								>
									<Link href={route.path} passHref>
										<MuiLink
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
											data-umami-event={
												"header_navigation_click_desktop_" + route.label.toLowerCase()
											}
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
									sx={{
										borderRadius: "4px",
										fontWeight: "bold",
										textTransform: "uppercase",
									}}
									data-umami-event={"header_navigation_click_desktop_" + route.label.toLowerCase()}
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
