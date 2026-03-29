import { COLOR_CODE } from "@/utils";
import { Box, Breadcrumbs, Link as MuiLink, Stack, Typography } from "@mui/material";
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
			<Breadcrumbs
				sx={{
					mb: 2,
					"& .MuiBreadcrumbs-separator": { color: COLOR_CODE.TEXT_SOFT },
					"& li": { color: COLOR_CODE.TEXT_SOFT },
				}}
			>
				<Link href={"/"} passHref>
					<MuiLink sx={{ color: COLOR_CODE.TEXT_SOFT, "&:hover": { color: COLOR_CODE.WHITE } }}>
						Trang chủ
					</MuiLink>
				</Link>
				<Typography sx={{ color: COLOR_CODE.TEXT_MUTED }}>Bật lửa</Typography>
			</Breadcrumbs>
			<Stack direction="row" alignItems="center" gap={1.25} mb={1.5} mt={1}>
				<Box sx={{ width: 20, height: 2, bgcolor: COLOR_CODE.PRIMARY }} />
				<Typography
					sx={{
						fontWeight: 700,
						fontSize: "0.68rem",
						letterSpacing: "0.18em",
						textTransform: "uppercase",
						color: COLOR_CODE.PRIMARY,
					}}
				>
					BẬT LỬA
				</Typography>
			</Stack>
			<Box id="title">
				<Typography
					variant="h2"
					fontWeight="800"
					letterSpacing="-0.04em"
					sx={{ color: COLOR_CODE.WHITE }}
				>
					Bật lửa (<CountUp end={itemCount} duration={2} />)
				</Typography>
			</Box>
		</Box>
	);
};

export default LightersPageHeader;
