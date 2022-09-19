import * as React from 'react'
import { Box } from '@mui/system'
import { MainLayout } from '@/components/layout'

export interface WorksPageProps {}

export default function WorksPage(props: WorksPageProps) {
	return <Box component={'div'}>Works Page</Box>
}

WorksPage.Layout = MainLayout
