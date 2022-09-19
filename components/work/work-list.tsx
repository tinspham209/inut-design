import * as React from 'react'
import { Box } from '@mui/system'
import { Work } from '@/models'
import { Divider } from '@mui/material'
import { WorkCard } from './work-card'

interface WorkListProps {
	workList: Work[]
}

export function WorkList({ workList }: WorkListProps) {
	if (workList.length === 0) return null
	return (
		<Box>
			{workList.map((work) => (
				<React.Fragment key={work.id}>
					<WorkCard work={work} />
					<Divider
						sx={{
							my: 3,
						}}
					/>
				</React.Fragment>
			))}
		</Box>
	)
}
