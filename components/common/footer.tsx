import { Facebook, Instagram } from '@mui/icons-material';
import { Icon, Link as MuiLink, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';

const socialLinks = [
	{
		icon: Facebook,
		url: 'https://www.facebook.com/profile.php?id=100063876652109',
	},

	{
		icon: Instagram,
		url: 'https://www.instagram.com/inut_skin/',
	},
];

export function Footer() {
	return (
		<Box component={'footer'} py={2} textAlign="center">
			<Stack direction="row" justifyContent={'center'}>
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
			<MuiLink
				href="https://goo.gl/maps/hBKBhHvRAGMPUn3e9"
				target="_blank"
				rel="noopener noreferrer"
			>
				<Typography>Địa chỉ: K294/43 Điện Biên Phủ, Đà Nẵng, Việt Nam</Typography>
			</MuiLink>
			<MuiLink href="tel:+792359996" target="_blank" rel="noopener noreferrer">
				<Typography sx={{ mt: 1 }}>Số điện thoại: 079 235 9996 (bé Hồ Nút)</Typography>
			</MuiLink>
			<Typography sx={{ mt: 1 }}>Giờ làm việc: 09:00 - 20:00 (từ T3 đến CN)</Typography>

			<Typography sx={{ mt: 1 }}>INUT Design - {new Date().getFullYear()} </Typography>
		</Box>
	);
}
