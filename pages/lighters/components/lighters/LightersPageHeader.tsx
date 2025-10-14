import { Box, Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";
import CountUp from "react-countup";

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
				<Typography>Lighters</Typography>
			</Breadcrumbs>
			<Box mt={3} id="title">
				<Typography variant="h2" fontWeight="bold" textAlign="center" letterSpacing="10px">
					Lighters (<CountUp end={itemCount} duration={2} />)
				</Typography>
			</Box>
		</Box>
	);
};

export default LightersPageHeader;
