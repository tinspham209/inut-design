import { COLOR_CODE } from "@/utils";
import { Box, Container, Link as MuiLink, Stack } from "@mui/material";
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
					<Box>
						{routeList.map((route, index) => (
							<Link key={`${route.path}-${index}`} href={route.path} passHref>
								<MuiLink
									sx={{
										ml: 2,
										fontWeight: "bold",
										fontSize: 16,
										textTransform: "uppercase",
									}}
									underline="hover"
									className={clsx({ active: router.pathname === route.path })}
								>
									{route.label}
								</MuiLink>
							</Link>
						))}
					</Box>
				</Stack>
			</Container>
		</Box>
	);
}
