import { Facebook, Instagram } from '@mui/icons-material';
import { Icon, Stack, Typography } from '@mui/material';
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
					<Box
						key={link.url}
						component="a"
						p={2}
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
					</Box>
				))}
			</Stack>
			<Typography>INUT Design © {new Date().getFullYear()} </Typography>
		</Box>
	);
}
