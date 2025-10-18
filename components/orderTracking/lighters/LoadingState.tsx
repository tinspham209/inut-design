import { Box, Container, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import React from "react";

const LoadingState: React.FC = () => (
	<Box
		component="section"
		bgcolor="secondary.dark"
		minHeight="100vh"
		display="flex"
		alignItems="center"
		justifyContent="center"
		py={8}
	>
		<Container maxWidth="sm">
			<Card>
				<CardContent sx={{ textAlign: "center", py: 6 }}>
					<CircularProgress size={60} sx={{ mb: 3 }} />
					<Typography variant="h6" fontWeight="bold" gutterBottom>
						Đang tải thông tin đơn hàng...
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Vui lòng chờ trong giây lát
					</Typography>
				</CardContent>
			</Card>
		</Container>
	</Box>
);

export default LoadingState;
