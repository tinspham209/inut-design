import { Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

const IncomesHeader = () => {
	return (
		<>
			<Breadcrumbs
				sx={{
					mt: 1,
					mb: 2,
				}}
			>
				<Link href={"/admin"} passHref>
					<MuiLink>Trang chủ</MuiLink>
				</Link>

				<Typography color="text.primary">Doanh thu</Typography>
			</Breadcrumbs>

			<Typography variant="h4" color="text.primary" fontWeight={"bold"}>
				Doanh thu
			</Typography>
		</>
	);
};

export default IncomesHeader;
