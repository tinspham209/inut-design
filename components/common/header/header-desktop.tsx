import { COLOR_CODE } from "@/utils";
import { Fingerprint } from "@mui/icons-material";
import { Container, IconButton, Link as MuiLink, Stack, Tooltip, Typography } from "@mui/material";
import { Box } from "@mui/system";
import clsx from "clsx";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { toast } from "react-hot-toast";
import { ROUTE_LIST, ROUTE_LIST_ADMIN } from "./routes";

type Props = {
	isAuthenticated: boolean;
};

export function HeaderDesktop({ isAuthenticated }: Props) {
	const router = useRouter();
	const [isLoading, setIsLoading] = React.useState(false);

	const routeList = React.useMemo(() => {
		return isAuthenticated ? ROUTE_LIST_ADMIN : ROUTE_LIST;
	}, [isAuthenticated]);

	const handleLogout = () => {
		setIsLoading(true);
		signOut().then(() => {
			setIsLoading(false);

			toast.success("Logout successfully");
			router.push("/login");
		});
	};

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
						{routeList.map((route, index) => (
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
						{isAuthenticated ? (
							<Tooltip title="Đăng xuất">
								<IconButton
									aria-label="fingerprint"
									color="secondary"
									sx={{
										transform: "translateY(-4px)",
										ml: 1,
									}}
									onClick={handleLogout}
									disabled={isLoading}
								>
									<Fingerprint />
								</IconButton>
							</Tooltip>
						) : (
							<Link key={`login`} href={`/login`} passHref>
								<MuiLink
									sx={{
										ml: 1,
										fontWeight: "medium",
										fontSize: 24,
										fontFamily: '"Zawtturee", "Bangers" ,"Roboto", sans-serif',
									}}
									underline="hover"
								>
									<IconButton
										aria-label="fingerprint"
										color="secondary"
										sx={{
											transform: "translateY(-4px)",
										}}
									>
										<Fingerprint />
									</IconButton>
								</MuiLink>
							</Link>
						)}
					</Box>
				</Stack>
			</Container>
		</Box>
	);
}
