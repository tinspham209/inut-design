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
			py={2}
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
				borderBottom: "1px solid rgb(245, 245, 245)",
				backdropFilter: 'blur(20px)',
				boxShadow: '0px 2px 8px #f0f1f2'
			}}
		>
			<Container>
				<Stack direction="row" justifyContent={"space-between"}>
					<Link href={"/"} passHref>
						<MuiLink sx={{ fontWeight: "bold" }} underline="hover" className="">
							<Typography variant="h5">INUT Design</Typography>
						</MuiLink>
					</Link>
					<Box>
						{ROUTE_LIST.map((route) => (
							<Link key={route.path} href={route.path} passHref>
								<MuiLink
									sx={{ ml: 2, fontWeight: "medium" }}
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
