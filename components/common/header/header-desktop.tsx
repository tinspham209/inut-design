import { COLOR_CODE } from "@/utils";
import { Container, Link as MuiLink, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { ROUTE_LIST } from "./routes";

export function HeaderDesktop() {
	const router = useRouter();

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
				backgroundColor: COLOR_CODE.BACKGROUND,
				zIndex: 99,
				borderBottom: `1px solid ${COLOR_CODE.BORDER}`,
				backdropFilter: "blur(20px)",
				boxShadow: "0px 2px 8px #383232",
			}}
		>
			<Container>
				<Stack direction="row" justifyContent={"space-between"}>
					<Link href={"/"} passHref>
						<MuiLink sx={{ fontWeight: "bold" }} underline="hover" className="">
							<Typography variant="h4" fontFamily={'"Zawtturee", "Bangers" ,"Roboto", sans-serif'}>
								INUT Design
							</Typography>
						</MuiLink>
					</Link>
					<Box>
						{ROUTE_LIST.map((route, index) => (
							<Link key={`${route.path}-${index}`} href={route.path} passHref>
								<MuiLink
									sx={{
										ml: 2,
										fontWeight: "medium",
										fontSize: 24,
										fontFamily: '"Zawtturee", "Bangers" ,"Roboto", sans-serif',
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
