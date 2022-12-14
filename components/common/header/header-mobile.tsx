import {
	Container,
	Drawer,
	IconButton,
	Link as MuiLink,
	List,
	ListItem,
	ListItemButton,
	Stack,
	Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { ROUTE_LIST } from "./routes";
import MenuIcon from "@mui/icons-material/Menu";
import { COLOR_CODE } from "@/utils";
export function HeaderMobile() {
	const [open, setOpen] = React.useState(false);
	const router = useRouter();

	const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
		if (
			event.type === "keydown" &&
			((event as React.KeyboardEvent).key === "Tab" ||
				(event as React.KeyboardEvent).key === "Shift")
		) {
			return;
		}
		setOpen(open);
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
				backgroundColor: COLOR_CODE.BACKGROUND,
				zIndex: 99,
				borderBottom: "1px solid rgb(245, 245, 245)",
				backdropFilter: "blur(20px)",
				boxShadow: "0px 2px 8px #383232",
			}}
		>
			<Container maxWidth="xs">
				<Stack direction="row" justifyContent={"flex-start"} alignItems="center">
					<IconButton
						onClick={toggleDrawer(true)}
						onKeyDown={toggleDrawer(true)}
						sx={{
							"& svg": {
								color: COLOR_CODE.WHITE,
							},
						}}
					>
						<MenuIcon />
					</IconButton>
					<Link href={"/"} passHref>
						<MuiLink sx={{ fontWeight: "bold", ml: 2 }} underline="hover" className="">
							<Typography variant="h3" fontFamily={'"Zawtturee", "Bangers" ,"Roboto", sans-serif'}>
								INUT Design
							</Typography>
						</MuiLink>
					</Link>
				</Stack>
				<Drawer
					anchor={"left"}
					sx={{
						bgcolor: COLOR_CODE.BACKGROUND,
					}}
					open={open}
					onClose={toggleDrawer(false)}
				>
					<List
						sx={{
							minWidth: "180px",
						}}
					>
						{ROUTE_LIST.map((route) => (
							<ListItem key={route.path} onClick={toggleDrawer(false)} disableGutters>
								<ListItemButton
									sx={{
										justifyContent: "center",
									}}
									selected={router.pathname === route.path}
								>
									<Link href={route.path} passHref>
										<MuiLink
											sx={{ fontWeight: "medium" }}
											underline="hover"
											className={clsx({ active: router.pathname === route.path })}
										>
											{route.label}
										</MuiLink>
									</Link>
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</Drawer>
			</Container>
		</Box>
	);
}
