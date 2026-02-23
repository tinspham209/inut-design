import { Box, Button, Grid, Link, Paper, Stack, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

interface Contact {
	name: string;
	role: string;
	roleBadge: string;
	phone: string;
	displayPhone: string;
	photoUrl: string;
}

interface ContactSectionProps {
	contacts: Contact[];
}

export const ContactSection: React.FC<ContactSectionProps> = ({ contacts }) => {
	return (
		<Box id="order">
			<Paper
				variant="outlined"
				sx={{
					p: 2,
					borderRadius: 2,
					bgcolor: "background.paper",
					borderColor: "divider",
					color: "text.primary",
				}}
			>
				<Stack spacing={1.5}>
					<Typography
						variant="h4"
						fontWeight={800}
						sx={{ fontSize: { xs: "1.5rem", md: "2.125rem" } }}
					>
						Đặt in theo yêu cầu
					</Typography>
					<Typography color="text.secondary" sx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}>
						Liên hệ ngay để nhận báo giá nhanh và tư vấn mẫu thiết kế phù hợp nhất với dòng máy của bạn.
					</Typography>
					<Stack direction="row" justifyContent="center" sx={{ pt: 0.5 }}>
						<Link href="/contact/form" passHref>
							<Button
								variant="contained"
								color="primary"
								size="large"
								sx={{
									fontWeight: 700,
									px: { xs: 2.5, md: 4 },
									minWidth: { xs: "100%", sm: 320 },
								}}
							>
								Gửi thông tin yêu cầu cho INUT
							</Button>
						</Link>
					</Stack>
					<Grid container spacing={1.5}>
						{contacts.map((contact) => (
							<Grid item xs={12} md={Math.floor(12 / contacts.length)} key={contact.phone}>
								<Link
									component="a"
									href={`https://zalo.me/${contact.phone}`}
									sx={{ display: "block" }}
									target="_blank"
									rel="noopener noreferrer"
								>
									<Image
										src={contact.photoUrl}
										alt={`${contact.name} contact`}
										width={2048}
										height={512}
										style={{ width: "100%", height: "auto" }}
									/>
								</Link>
							</Grid>
						))}
					</Grid>
				</Stack>
			</Paper>
		</Box>
	);
};
