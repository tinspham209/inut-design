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
		<MuiLink sx={{ color: COLOR_CODE.TEXT_SOFT, "&:hover": { color: COLOR_CODE.WHITE } }} component={Link} href="/">
				Trang chủ
			</MuiLink>
		<MuiLink sx={{ color: COLOR_CODE.TEXT_SOFT, "&:hover": { color: COLOR_CODE.WHITE } }} component={Link} href={`/san-pham/lighters#${lighterSlug}`}>
				Lighters
			</MuiLink>
		<Typography sx={{ color: COLOR_CODE.TEXT_MUTED }}>{lighterName}</Typography>
	</Breadcrumbs>
);

export default BreadcrumbsNav;
