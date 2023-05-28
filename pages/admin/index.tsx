import { JsonView, Seo } from "@/components/common";
import { AdminLayout } from "@/components/layout";
import { NextPageWithLayout } from "@/models/common";
import { Box, Button, Card, CardActions, CardContent, Container, Typography } from "@mui/material";
import { useSession } from "next-auth/react";
import Link from "next/link";
const Admin: NextPageWithLayout = () => {
	const session = useSession();

	return (
		<Box>
			<Seo
				data={{
					title: "Admin | INUT Design",
					description:
						"Tiệm may đo skin laptop theo yêu cầu, Cửa Hàng Thời Trang Dành Cho Laptop, skin laptop da nang, skin laptop đà nẵng",
					url: "https://inutdesign.com",
					thumbnailUrl:
						"https://res.cloudinary.com/dmspucdtf/image/upload/v1663573733/294864835_731768937929745_7146257828673250026_n_fv3uhz.webp",
				}}
			/>

			<Container>
				<Card
					sx={{
						p: 1,
						background: `linear-gradient(250.38deg, rgb(17, 26, 44) 2.39%, rgb(21, 65, 126) 34.42%, rgb(22, 104, 220) 60.95%, rgb(60, 137, 232) 84.83%, rgb(141, 197, 248) 104.37%)`,
					}}
				>
					<CardContent>
						<Typography variant="h5" color="text.secondary">
							Welcome {session?.data?.user.email || "to INUT Admin"}!
						</Typography>
					</CardContent>
					<CardActions>
						<Link href="/incomes">
							<Button variant="contained">doanh thu</Button>
						</Link>
						<Link href="/costs">
							<Button variant="contained">chi phí</Button>
						</Link>
					</CardActions>
				</Card>

				<JsonView src={session} />
			</Container>
		</Box>
	);
};

Admin.Layout = AdminLayout;

export default Admin;
