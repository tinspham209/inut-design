import { COLOR_CODE } from "@/utils";
import Box from "@mui/material/Box";
import MuiLink from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export function MegaMenuContactBox() {
	return (
		<Box
			sx={{
				border: `1px solid ${COLOR_CODE.BORDER}`,
				borderRadius: "4px",
				p: 2.5,
				backgroundColor: "rgba(0,0,0,0.02)",
				height: "100%",
			}}
		>
			<Typography
				variant="h6"
				sx={{
					fontWeight: "bold",
					color: COLOR_CODE.PRIMARY,
					textTransform: "uppercase",
					fontSize: "0.875rem",
					mb: 1.5,
				}}
			>
				Liên hệ ngay
			</Typography>
			<Stack spacing={1}>
				<Typography variant="body2" sx={{ color: "text.primary" }}>
					Mr. Tom —{" "}
					<MuiLink
						href="https://zalo.me/0792359996"
						target="_blank"
						color="inherit"
						underline="hover"
					>
						079 235 9996
					</MuiLink>
				</Typography>
				<Typography variant="body2" sx={{ color: "text.primary" }}>
					Ms. Boo —{" "}
					<MuiLink
						href="https://zalo.me/0777208215"
						target="_blank"
						color="inherit"
						underline="hover"
					>
						077 720 8215
					</MuiLink>
				</Typography>
			</Stack>
		</Box>
	);
}
