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

const CONTACTS: Contact[] = [
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

export interface ContactSectionProps {
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
		<Box id="order" sx={{ scrollMarginTop: "100px", textAlign: "center" }}>
			<Typography
				variant="h3"
				fontWeight={900}
				gutterBottom
				sx={{ fontSize: { xs: "2rem", md: "2.75rem" }, color: "inherit" }}
			>
				{title}
			</Typography>
			<Typography
				variant="h6"
				sx={{ mb: 6, maxWidth: 700, mx: "auto", fontWeight: 400, opacity: 0.9, color: "inherit" }}
			>
				{description}
			</Typography>

			<Stack spacing={{ xs: 6, md: 8 }} alignItems="center">
				<Link
					href={`/contact/form?from=${type}`}
					sx={{ textDecoration: "none" }}
					onClick={() => trackContactClick("form", String(type))}
				>
					<Button
						variant="contained"
						size="large"
						sx={{
							bgcolor: "white",
							color: "primary.main",
							fontWeight: 900,
							px: { xs: 6, md: 10 },
							py: { xs: 2, md: 2.5 },
							fontSize: { xs: "1.1rem", md: "1.35rem" },
							borderRadius: 4,
							boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
							"&:hover": {
								bgcolor: "grey.100",
								transform: "translateY(-5px)",
								boxShadow: "0 25px 45px rgba(0,0,0,0.25)",
							},
							transition: "all 0.3s ease-in-out",
						}}
					>
						Bắt đầu dự án của bạn
					</Button>
				</Link>

				<Box sx={{ width: "100%", maxWidth: 1000 }}>
					<Typography variant="subtitle1" fontWeight={800} sx={{ mb: 4, opacity: 0.8, color: "inherit" }}>
						Hoặc chat trực tiếp với chúng tôi qua Zalo
					</Typography>
					<Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
						{contacts.map((contact) => (
							<Grid item xs={12} sm={6} key={contact.phone}>
								<Link
									href={`https://zalo.me/${contact.phone}`}
									target="_blank"
									rel="noopener noreferrer"
									onClick={() => trackContactClick("zalo", String(type))}
									sx={{
										display: "block",
										borderRadius: 4,
										overflow: "hidden",
										transition: "all 0.3s ease-in-out",
										boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
										"&:hover": {
											transform: "translateY(-8px) scale(1.02)",
											boxShadow: "0 22px 55px rgba(0,0,0,0.35)",
										},
									}}
								>
									<Image
										src={contact.photoUrl}
										alt={`${contact.name} contact`}
										width={1000}
										height={250}
										layout="responsive"
										objectFit="cover"
										unoptimized
									/>
								</Link>
							</Grid>
						))}
					</Grid>
				</Box>
			</Stack>
		</Box>
	);
};
