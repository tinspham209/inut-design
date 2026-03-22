import { Seo } from "@/components/common";
import { MainLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import { COLOR_CODE, trackEvent, trackOutboundClick, trackUmamiEvent } from "@/utils";
import {
	AccountBalanceOutlined,
	BadgeOutlined,
	EmailOutlined,
	ExpandMore,
	LocationOnOutlined,
	PhoneOutlined,
	ReceiptLongOutlined,
} from "@mui/icons-material";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	Breadcrumbs,
	Container,
	Grid,
	Icon,
	Link as MuiLink,
	Paper,
	Stack,
	Typography,
} from "@mui/material";
import Link from "next/link";
import { useEffect, useRef } from "react";

const PAGE_PATH = "/policies-terms/faqs";
const PAGE_TITLE = "FAQS - Câu hỏi thường gặp";

const FaqsPage: NextPageWithLayout = () => {
	const hasTrackedRef = useRef(false);

	useEffect(() => {
		if (hasTrackedRef.current) return;
		hasTrackedRef.current = true;

		trackEvent("faqs_view", {
			category: "engagement",
			label: "faqs_page",
			page_path: PAGE_PATH,
			page_title: PAGE_TITLE,
		});
		trackUmamiEvent("faqs_view", { pagePath: PAGE_PATH });
	}, []);

	return (
		<Box component="section" bgcolor="secondary.dark" pt={4} pb={10}>
			<Seo
				data={{
					title: `${PAGE_TITLE} - INUT Design`,
					description: "FAQS - Câu hỏi thường gặp về INUT Design",
					url: `https://inutdesign.com${PAGE_PATH}`,
					thumbnailUrl: "/branding/ogImage.jpg",
				}}
			/>
			<Container maxWidth="md">
				<Breadcrumbs sx={{ mb: 4 }}>
					<Link href="/" passHref>
						<MuiLink color="inherit" underline="hover">
							Trang chủ
						</MuiLink>
					</Link>
					<Link href="/policies-terms" passHref>
						<MuiLink color="inherit" underline="hover">
							Chính sách và Điều khoản
						</MuiLink>
					</Link>
					<Typography color="text.primary">{PAGE_TITLE}</Typography>
				</Breadcrumbs>

				<Box mb={6} textAlign="center">
					<Typography variant="h3" component="h1" fontWeight="800" gutterBottom>
						{PAGE_TITLE}
					</Typography>
					<Typography variant="subtitle1" color="text.secondary">
						Những câu hỏi thường gặp về INUT Design
					</Typography>
				</Box>

				<Accordion>
					<AccordionSummary expandIcon={<ExpandMore />}>
						<Typography>Question 1</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Typography>Content 1</Typography>
					</AccordionDetails>
				</Accordion>
			</Container>
		</Box>
	);
};

FaqsPage.Layout = MainLayout;

export default FaqsPage;
