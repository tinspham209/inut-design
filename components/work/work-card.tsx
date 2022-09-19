import * as React from 'react'
import { Box } from '@mui/system'
import { Work } from '@/models'
import { Chip, Divider, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import { format } from 'date-fns'

interface WorkListProps {
	work: Work
}

export function WorkCard({ work }: WorkListProps) {
	if (!work) return null
	return (
		<Stack
			direction={{
				xs: 'column',
				sm: 'row',
			}}
			spacing={2}
		>
			<Box width={{ xs: '100%', sm: '246px' }} flexShrink={0}>
				<Image
					src={work.thumbnailUrl}
					width={246}
					height={180}
					layout="responsive"
					alt="work thumbnail"
				/>
			</Box>
			<Box>
				<Typography variant="h4" fontWeight={'bold'}>
					{work.title}
				</Typography>
				<Stack direction="row" my={2}>
					<Chip color="secondary" label={format(Number(work.createdAt), 'yyyy')} size="small" />
					<Typography ml={3} color="GrayText">
						{work.tagList.join(', ')}
					</Typography>
				</Stack>
				<Typography>{work.shortDescription}</Typography>
			</Box>
		</Stack>
	)
}
