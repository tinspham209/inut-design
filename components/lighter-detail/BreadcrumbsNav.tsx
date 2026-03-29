import React from "react";
import { Breadcrumbs, Typography, Link as MuiLink } from "@mui/material";
import Link from "next/link";
import { COLOR_CODE } from "@/utils";

interface BreadcrumbsNavProps {
	lighterName: string;
	lighterSlug: string;
}

const BreadcrumbsNav: React.FC<BreadcrumbsNavProps> = ({ lighterName, lighterSlug }) => (
	<Breadcrumbs
		sx={{
			mt: 2,
			mb: 2,
			"& .MuiBreadcrumbs-separator": { color: COLOR_CODE.TEXT_SOFT },
			"& li": { color: COLOR_CODE.TEXT_SOFT },
		}}
	>
		<Link href="/" passHref>
			<MuiLink sx={{ color: COLOR_CODE.TEXT_SOFT, "&:hover": { color: COLOR_CODE.WHITE } }}>
				Trang chủ
			</MuiLink>
		</Link>
		<Link href={`/san-pham/lighters#${lighterSlug}`} passHref>
			<MuiLink sx={{ color: COLOR_CODE.TEXT_SOFT, "&:hover": { color: COLOR_CODE.WHITE } }}>
				Lighters
			</MuiLink>
		</Link>
		<Typography sx={{ color: COLOR_CODE.TEXT_MUTED }}>{lighterName}</Typography>
	</Breadcrumbs>
);

export default BreadcrumbsNav;
