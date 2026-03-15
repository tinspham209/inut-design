import { COLOR_CODE } from "@/utils";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { ROUTE_LIST } from "./routes";

export function HeaderDesktop() {
	const router = useRouter();

	const routeList = React.useMemo(() => {
		return ROUTE_LIST;
	}, []);

	return (
		<Box
			component={"header"}
			pt={2}
			pb={1}
			display={{
				xs: "none",
				md: "block",
			}}
			sx={{
				position: "fixed",
				top: 0,
				width: "100%",
				backgroundColor: "secondary.dark",
				zIndex: 99,
				borderBottom: `1px solid ${COLOR_CODE.BORDER}`,
				backdropFilter: "blur(20px)",
			}}
		>
			<Container>
				<Stack direction="row" justifyContent={"space-between"} alignItems={"center"}>
					<Link href={"/"} passHref>
						<MuiLink>
							<Image src={"/branding/logo.webp"} alt="logo" width={"103px"} height={"32px"} />
						</MuiLink>
					</Link>
					<Stack direction="row" alignItems="center" spacing={1.5}>
						{routeList.map((route, index) => (
							<Link key={`${route.path}-${index}`} href={route.path} passHref>
								<MuiLink
									sx={{
										fontWeight: "bold",
										fontSize: 16,
										textTransform: "uppercase",
									}}
									underline="hover"
									data-umami-event={"header_navigation_click_desktop_" + route.label.toLowerCase()}
									className={clsx({ active: router.pathname === route.path })}
								>
									{route.label}
								</MuiLink>
							</Link>
						))}
						<Link href={"/contact/form"} passHref>
							<Button
								size="small"
								variant="contained"
								sx={{ transform: "translateY(-1px)" }}
								data-umami-event={"header_navigation_click_desktop_contact_form"}
							>
								Nhận báo giá
							</Button>
						</Link>
					</Stack>
				</Stack>
			</Container>
		</Box>
	);
}
