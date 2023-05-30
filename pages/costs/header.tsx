import { Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

const CostsHeader = () => {
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

				<Typography color="text.primary">Chi phí</Typography>
			</Breadcrumbs>

			<Typography variant="h4" color="text.primary" fontWeight={"bold"}>
				Chi phí
			</Typography>
		</>
	);
};

export default CostsHeader;
