import { MessengerIcon } from "@/components/icons/MessengerIcon";
import { ZaloIcon } from "@/components/icons/ZaloIcon";
import ChromeReaderMode from "@mui/icons-material/ChromeReaderMode";
import Facebook from "@mui/icons-material/Facebook";
import Instagram from "@mui/icons-material/Instagram";
import MapsHomeWork from "@mui/icons-material/MapsHomeWork";
import Phone from "@mui/icons-material/Phone";
import { AiFillTikTok } from "react-icons/ai";

const TikTokIcon = AiFillTikTok as any;

type ContactItem = {
	link: string;
	title: string;
	icon: React.ReactNode;
	isInternalUrl?: boolean;
	trackingType?: "zalo" | "messenger" | "phone" | "social";
	isShowInHomepage?: boolean;
};

export const LIST_CONTACTS: ContactItem[] = [
	{
		link: "https://zalo.me/0327124321",
		trackingType: "zalo" as const,
		icon: <ZaloIcon />,
		title: "Nhắn tin tư vấn Zalo",
		isShowInHomepage: true,
	},
	{
		link: "/contact/form",
		isInternalUrl: true,
		icon: (
			<ChromeReaderMode
				sx={{
					fontSize: 40,
				}}
			/>
		),
		title: "Nhận báo giá",
		isShowInHomepage: false,
	},
	{
		link: "https://maps.app.goo.gl/dAdKSbnBEvarx6LK8",
		icon: (
			<MapsHomeWork
				sx={{
					fontSize: 40,
				}}
			/>
		),
		title: "Địa chỉ (Bản đồ)",
		isShowInHomepage: true,
	},
	{
		link: "tel:+84327124321",
		trackingType: "phone" as const,
		icon: (
			<Phone
				sx={{
					fontSize: 40,
				}}
			/>
		),
		title: "Số điện thoại",
		isShowInHomepage: true,
	},
	{
		link: "https://m.me/INUTdesign1003",
		trackingType: "messenger" as const,
		icon: <MessengerIcon />,
		title: "Nhắn tin tư vấn Messenger",
		isShowInHomepage: true,
	},
	{
		link: "https://m.me/inutdesign",
		trackingType: "messenger" as const,
		icon: <MessengerIcon />,
		title: "Nhắn tin tư vấn Messenger",
		isShowInHomepage: false,
	},

	...[
		{ label: "Mr TOM", value: "0792359996" },
		{ label: "Ms BOO", value: "0777208215" },
	].map((item) => ({
		link: `https://zalo.me/${item.value}/`,
		trackingType: "social" as const,
		icon: <ZaloIcon />,
		title: `Zalo ${item.label}`,
		isShowInHomepage: false,
	})),

	...[
		{ label: "INUT Design", value: "INUTdesign1003", isShowInHomepage: true },
		{ label: "INUT", value: "inutdesign", isShowInHomepage: false },
	].map((item) => ({
		link: `https://www.facebook.com/${item.value}/`,
		trackingType: "social" as const,
		icon: (
			<Facebook
				sx={{
					fontSize: 40,
				}}
			/>
		),
		title: `Facebook ${item.label}`,
		isShowInHomepage: item.isShowInHomepage,
	})),
	...[
		{ label: "@inut.design", value: "@inut.design", isShowInHomepage: false },
		{
			label: "@inut176b",
			value: "@inut176b",
			isShowInHomepage: false,
		},
	].map((item) => ({
		link: `https://www.tiktok.com/${item.value}/`,
		trackingType: "social" as const,
		icon: <TikTokIcon size={40} />,
		title: `TikTok ${item.label}`,
		isShowInHomepage: item.isShowInHomepage,
	})),

	...[
		{ label: "inut_design", value: "inut_design", isShowInHomepage: true },
		{ label: "inut.studiodn", value: "inut.studiodn", isShowInHomepage: false },
		{ label: "inut_skin", value: "inut_skin", isShowInHomepage: false },
		{ label: "inut.gift", value: "inut.gift", isShowInHomepage: false },
	].map((item) => ({
		link: `https://www.instagram.com/${item.value}/`,
		trackingType: "social" as const,
		icon: (
			<Instagram
				sx={{
					fontSize: 40,
				}}
			/>
		),
		title: `Instagram @${item.label}`,
		isShowInHomepage: item.isShowInHomepage,
	})),
];
