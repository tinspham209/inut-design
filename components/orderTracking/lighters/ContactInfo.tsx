import { Box, Typography, Stack, Link as MuiLink } from "@mui/material";
import Link from "next/link";
import React from "react";

const ContactInfo: React.FC = () => (
	<Box sx={{ mt: 4, textAlign: "center" }}>
		<Typography variant="body2" color="text.secondary" gutterBottom>
			Cần hỗ trợ?{" "}
			<Link href="/contact" passHref>
				<MuiLink>Liên hệ với chúng tôi</MuiLink>
			</Link>
		</Typography>
		<Stack
			direction={{ xs: "column", sm: "row" }}
			spacing={2}
			justifyContent="center"
			sx={{ mt: 1 }}
		>
			<Typography variant="body2" fontWeight="bold">
				📞 SĐT/Zalo: <MuiLink href="tel:0327124321">0327 124 321</MuiLink>
			</Typography>
			<Typography variant="body2" fontWeight="bold">
				📧 Facebook:{" "}
				<MuiLink target="_blank" href="https://www.facebook.com/inutdesign">
					facebook.com/inutdesign
				</MuiLink>
			</Typography>
		</Stack>
	</Box>
);

export default ContactInfo;
