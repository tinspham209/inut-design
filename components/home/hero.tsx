import { urlFor } from '@/api-client/sanity-client';
import { Banner } from '@/models/banner';
import { Container } from '@mui/material';
import { Box } from '@mui/system';
import Image from 'next/image';
import * as React from 'react';

type Props = {
	imgUrl: string;
};

export function HeroSection({ imgUrl }: Props) {
	return (
		<Box component={'section'} pb={{ xs: 4 }}>
			<Container>
				<Image
					src={imgUrl}
					width="100%"
					height="50%"
					layout="responsive"
					alt="avatar"
					priority={true}
				/>
			</Container>
		</Box>
	);
}
