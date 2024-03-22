import { COLOR_CODE } from "@/utils";
import { Facebook, Instagram } from "@mui/icons-material";
import { Container, Icon, Link as MuiLink, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";

const socialLinks = [
	{
		icon: Facebook,
		url: "https://www.facebook.com/inutdesign",
	},

	{
		icon: Instagram,
		url: "https://www.instagram.com/inut_skin/",
	},
];

export function Footer() {
	return (
		<Box
			component={"footer"}
			py={2}
			textAlign="center"
			bgcolor={COLOR_CODE.BACKGROUND}
			zIndex={100}
		>
			<Container maxWidth="sm">
				<Stack direction="row" justifyContent={"center"}>
					{socialLinks.map((link) => (
						<MuiLink
							key={link.url}
							component="a"
							p={1}
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
						>
							<Icon
								component={link.icon}
								sx={{
									fontSize: 48,
								}}
							/>
						</MuiLink>
					))}
				</Stack>
				<Typography>INUT Design - {new Date().getFullYear()} </Typography>
				<MuiLink
					href="https://maps.app.goo.gl/SRm8YB4fy8VfWmb39"
					target="_blank"
					rel="noopener noreferrer"
				>
					<Typography variant="body1" sx={{ mt: 1 }}>
						Địa chỉ: 176B Hải Phòng, Đà Nẵng, Việt Nam
					</Typography>
				</MuiLink>
				<MuiLink href="tel:+84792359996" target="_blank" rel="noopener noreferrer">
					<Typography sx={{ mt: 1 }}>Số điện thoại: 079 235 9996</Typography>
				</MuiLink>
				<Typography sx={{ mt: 1 }}>Giờ làm việc: 09:00 - 20:00 (từ T3 đến CN)</Typography>
				<MuiLink href="https://tinspham.dev" target="_blank" rel="noopener noreferrer">
					<Typography sx={{ mt: 1 }}>Thiết kế: www.tinspham.dev</Typography>
				</MuiLink>
			</Container>
		</Box>
	);
}
