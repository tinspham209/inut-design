/* eslint-disable camelcase */
import { Breadcrumbs, Link as MuiLink, Typography } from "@mui/material";
import Link from "next/link";
import { trackCreativa } from "@/utils/creativa/analytics";

export function CreativaBreadcrumbs({
	ancestors = [{ label: "Creativa", href: "/creativa" }],
	current,
}: {
	ancestors?: Array<{ label: string; href: string }>;
	current: string;
}) {
	return (
		<Breadcrumbs aria-label="Điều hướng trang" sx={{ mb: 1.5, fontSize: 12 }}>
			{ancestors.map((item) => (
				<MuiLink
						underline="hover"
						onClick={() =>
							trackCreativa("cta_click", { surface: "breadcrumb", cta_name: item.href })
						}
					 component={Link} key={item.href} href={item.href}>
						{item.label}
					</MuiLink>
			))}
			<Typography component="span" variant="caption" color="text.secondary" aria-current="page">
				{current}
			</Typography>
		</Breadcrumbs>
	);
}
