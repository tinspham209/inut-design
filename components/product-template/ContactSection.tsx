import { trackContactClick } from "@/utils/analytics";
import { Box, Button, Grid, Link, Stack, Typography } from "@mui/material";
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

export const CONTACTS: Contact[] = [
	{
		name: "Mr. Tom",
		role: "Zalo Chat",
		roleBadge: "Phụ trách Kinh doanh",
		phone: "0792359996",
		displayPhone: "0792.359.996",
		photoUrl: "/branding/contacts/contact-01.avif",
	},
	{
		name: "Ms. Boo",
		role: "Zalo Chat",
		roleBadge: "Hỗ trợ Kỹ thuật",
		phone: "0777208215",
		displayPhone: "0777.208.215",
		photoUrl: "/branding/contacts/contact-02.avif",
	},
];

interface ContactSectionProps {
	contacts?: Contact[];
	title?: string;
	description?: string;
	type?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
	title = "Đặt in theo yêu cầu",
	description = "Liên hệ ngay để nhận báo giá nhanh và tư vấn mẫu thiết kế phù hợp nhất với nhu cầu của bạn.",
	contacts = CONTACTS,
	type,
}) => {
	return (
		<Box id="order" sx={{ scrollMarginTop: "100px" }}>
			<Typography variant="h5" fontWeight={800} gutterBottom sx={{ fontSize: "1.5rem" }}>
				{title}
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
				{description}
			</Typography>

			<Stack spacing={4} alignItems="center">
				<Link
					href={`/contact/form?from=${type}`}
					sx={{ textDecoration: "none" }}
					onClick={() => trackContactClick("form", String(type))}
				>
					<Button
						variant="contained"
						color="primary"
						size="large"
						sx={{
							fontWeight: 700,
							px: { xs: 4, md: 8 },
							py: 1.5,
							fontSize: "1rem",
							borderRadius: 2,
							minWidth: { xs: "100%", sm: 350 },
						}}
					>
						Gửi thông tin yêu cầu cho INUT
					</Button>
				</Link>

				<Grid container spacing={2}>
					{contacts.map((contact) => (
						<Grid item xs={12} sm={6} key={contact.phone}>
							<Link
								href={`https://zalo.me/${contact.phone}`}
								target="_blank"
								rel="noopener noreferrer"
								onClick={() => trackContactClick("zalo", String(type))}
								sx={{
									display: "block",
									transition: "transform 0.2s ease",
									"&:hover": { transform: "translateY(-4px)" },
								}}
							>
								<Image
									src={contact.photoUrl}
									alt={`${contact.name} contact`}
									width={1000}
									height={250}
									style={{ width: "100%", height: "auto", borderRadius: "8px" }}
								/>
							</Link>
						</Grid>
					))}
				</Grid>
			</Stack>
		</Box>
	);
};
