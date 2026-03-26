import { MessengerIcon } from "@/components/icons/MessengerIcon";
import { ZaloIcon } from "@/components/icons/ZaloIcon";
import ChromeReaderMode from "@mui/icons-material/ChromeReaderMode";
import Facebook from "@mui/icons-material/Facebook";
import Instagram from "@mui/icons-material/Instagram";
import MapsHomeWork from "@mui/icons-material/MapsHomeWork";
import Phone from "@mui/icons-material/Phone";
import { AiFillTikTok } from "react-icons/ai";

const TikTokIcon = AiFillTikTok as any;

export const LIST_CONTACTS = [
	{
		link: "https://zalo.me/0327124321",
		trackingType: "zalo" as const,
		icon: <ZaloIcon />,
		title: "Nhắn tin tư vấn Zalo",
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
	},
	{
		link: "https://m.me/INUTdesign1003",
		trackingType: "messenger" as const,
		icon: <MessengerIcon />,
		title: "Nhắn tin tư vấn Messenger",
	},
	{
		link: "https://m.me/inutdesign",
		trackingType: "messenger" as const,
		icon: <MessengerIcon />,
		title: "Nhắn tin tư vấn Messenger",
	},

	...[
		{ label: "Mr TOM", value: "0792359996" },
		{ label: "Ms BOO", value: "0777208215" },
	].map((item) => ({
		link: `https://zalo.me/${item.value}/`,
		trackingType: "social" as const,
		icon: <ZaloIcon />,
		title: `Zalo ${item.label}`,
	})),

	...[
		{ label: "INUT Design", value: "INUTdesign1003" },
		{ label: "INUT", value: "inutdesign" },
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
	})),
	...["@inut.design", "@inut176b"].map((item) => ({
		link: `https://www.tiktok.com/${item}/`,
		trackingType: "social" as const,
		icon: <TikTokIcon size={40} />,
		title: `Tiktok ${item}`,
	})),

	...["inut_design", "inut.studiodn", "inut_skin", "inut.gift"].map((item) => ({
		link: `https://www.instagram.com/${item}/`,
		trackingType: "social" as const,
		icon: (
			<Instagram
				sx={{
					fontSize: 40,
				}}
			/>
		),
		title: `Instagram @${item}`,
	})),
];
