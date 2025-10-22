import React from "react";
import { Breadcrumbs, Typography, Link as MuiLink } from "@mui/material";
import Link from "next/link";

interface BreadcrumbsNavProps {
	lighterName: string;
	lighterSlug: string;
}

const BreadcrumbsNav: React.FC<BreadcrumbsNavProps> = ({ lighterName, lighterSlug }) => (
	<Breadcrumbs sx={{ mt: 2, mb: 2 }}>
		<Link href="/" passHref>
			<MuiLink>Trang chủ</MuiLink>
		</Link>
		<Link href={`/lighters#${lighterSlug}`} passHref>
			<MuiLink>Lighters</MuiLink>
		</Link>
		<Typography color="text.primary">{lighterName}</Typography>
	</Breadcrumbs>
);

export default BreadcrumbsNav;
