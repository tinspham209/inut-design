import { Box, Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import dynamic from "next/dynamic";
const CountUp = dynamic(() => import("react-countup"), { ssr: false });

interface LightersPageHeaderProps {
	itemCount: number;
}

const LightersPageHeader: React.FC<LightersPageHeaderProps> = ({ itemCount }) => {
	return (
		<Box>
			<Breadcrumbs>
				<Link href={"/"} passHref>
					<MuiLink>Trang chủ</MuiLink>
				</Link>
				<Typography>Bật lửa</Typography>
			</Breadcrumbs>
			<Box mt={1} id="title">
				<Typography variant="h2" fontWeight="bold" textAlign="center" letterSpacing="10px">
					Bật lửa (<CountUp end={itemCount} duration={2} />)
				</Typography>
			</Box>
		</Box>
	);
};

export default LightersPageHeader;
