import { Seo } from "@/components/common";
import { AdminLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import { Box, Container, Typography } from "@mui/material";
import { useSession } from "next-auth/react";

const Admin: NextPageWithLayout = () => {
	const session = useSession();
	console.log("session: ", session);

	return (
		<Box>
			<Seo
				data={{
					title: "Admin | INUT Design | Skin laptop da nang",
					description:
						"Tiệm may đo skin laptop theo yêu cầu, Cửa Hàng Thời Trang Dành Cho Laptop, skin laptop da nang, skin laptop đà nẵng",
					url: "https://inutdesign.com",
					thumbnailUrl:
						"https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp",
				}}
			/>

			<Container maxWidth="xs">
				<Typography>Admin</Typography>
				<Typography>{JSON.stringify(session)}</Typography>
			</Container>
		</Box>
	);
};

Admin.Layout = AdminLayout;

export default Admin;
