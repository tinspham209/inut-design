import {
	Avatar,
	Box,
	Grid,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Paper,
	Stack,
	Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import React from "react";

interface Highlight {
	title: string;
	description: string;
	icon: React.ReactNode;
}

interface IntroductionSectionProps {
	bullets: string[];
	highlights: Highlight[];
}

export const IntroductionSection: React.FC<IntroductionSectionProps> = ({
	bullets,
	highlights,
}) => {
	return (
		<Grid container spacing={{ xs: 2, md: 3 }}>
			<Grid item xs={12}>
				<Typography
					variant="h4"
					fontWeight={800}
					color="text.primary"
					sx={{ fontSize: { xs: "1.5rem", md: "2.125rem" }, mb: { xs: 1, md: 0 } }}
				>
					Skin Laptop Custom theo yêu cầu
				</Typography>
			</Grid>
			<Grid item xs={12} md={7}>
				<List sx={{ color: "text.primary", py: 0 }}>
					{bullets.map((item) => (
						<ListItem key={item} disableGutters sx={{ py: { xs: 0.5, md: 1 } }}>
							<ListItemIcon sx={{ minWidth: { xs: 28, md: 32 } }}>
								<CheckCircleOutlineIcon color="primary" />
							</ListItemIcon>
							<ListItemText primary={item} />
						</ListItem>
					))}
				</List>
			</Grid>
			<Grid item xs={12} md={5}>
				<Stack spacing={{ xs: 1.5, md: 2 }}>
					{highlights.map((item) => (
						<Paper
							key={item.title}
							variant="outlined"
							sx={{
								p: { xs: 1.5, md: 2 },
								borderRadius: 2,
								bgcolor: "background.paper",
								borderColor: "divider",
								color: "text.primary",
							}}
						>
							<Stack direction="row" spacing={2} alignItems="center">
								<Avatar sx={{ bgcolor: "rgba(255,140,0,0.12)" }}>{item.icon}</Avatar>
								<Box>
									<Typography fontWeight={700}>{item.title}</Typography>
									<Typography variant="body2" color="text.secondary">
										{item.description}
									</Typography>
								</Box>
							</Stack>
						</Paper>
					))}
				</Stack>
			</Grid>
		</Grid>
	);
};
