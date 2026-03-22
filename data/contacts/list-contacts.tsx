import {
	ChromeReaderMode,
	Facebook,
	Instagram,
	MapsHomeWork,
	Message,
	Phone,
} from "@mui/icons-material";

export const LIST_CONTACTS = [
	{
		link: "https://m.me/642209429738886",
		trackingType: "messenger" as const,
		icon: (
			<Message
				sx={{
					fontSize: 48,
				}}
			/>
		),
		title: "Nhắn tin tư vấn",
	},
	{
		link: "/contact/form",
		isInternalUrl: true,
		icon: (
			<ChromeReaderMode
				sx={{
					fontSize: 48,
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
					fontSize: 48,
				}}
			/>
		),
		title: "Địa chỉ",
	},
	{
		link: "tel:+84327124321",
		trackingType: "phone" as const,
		icon: (
			<Phone
				sx={{
					fontSize: 48,
				}}
			/>
		),
		title: "Số điện thoại",
	},
	{
		link: "https://www.facebook.com/INUTdesign1003",
		trackingType: "social" as const,
		icon: (
			<Facebook
				sx={{
					fontSize: 48,
				}}
			/>
		),
		title: "Facebook",
	},
	{
		link: "https://www.facebook.com/inutdesign",
		trackingType: "social" as const,
		icon: (
			<Facebook
				sx={{
					fontSize: 48,
				}}
			/>
		),
		title: "Facebook",
	},
	{
		link: "https://www.instagram.com/inut_skin/",
		trackingType: "social" as const,
		icon: (
			<Instagram
				sx={{
					fontSize: 48,
				}}
			/>
		),
		title: "Instagram",
	},
];
