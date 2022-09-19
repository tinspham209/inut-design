import * as React from 'react'
import { Box } from '@mui/system'
import { Icon, Stack, Typography } from '@mui/material'
import { Facebook, Instagram, LinkedIn, Twitter } from '@mui/icons-material'

const socialLinks = [
	{
		icon: Facebook,
		url: 'https://www.facebook.com/',
	},
	{
		icon: Instagram,
		url: 'https://www.instagram.com/',
	},
	{
		icon: Twitter,
		url: 'https://www.twitter.com/',
	},
	{
		icon: LinkedIn,
		url: 'https://www.linkedin.com/',
	},
]

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
			<Typography>Copyright ©{new Date().getFullYear()} All rights reserved </Typography>
		</Box>
	)
}
