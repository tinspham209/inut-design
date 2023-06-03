import { Seo } from "@/components/common";
import { AdminLayout } from "@/components/layout";
import { swrCosts, swrIncomes } from "@/components/swr";
import { NextPageWithLayout } from "@/models/common";
import { firstDateOfMonth, getSumPriceCosts, getSumPriceIncomes, lastDateOfMonth } from "@/utils";
import { Box, Card, CardContent, Container, Grid, Typography } from "@mui/material";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import CountUp from "react-countup";
import React from "react";
const Admin: NextPageWithLayout = () => {
	const session = useSession();
	const router = useRouter();

	const { costs } = swrCosts.useGetByDateRange(
		new Date(firstDateOfMonth),
		new Date(lastDateOfMonth)
	);

	const { incomes } = swrIncomes.useIncomeWithDateRange(
		new Date(firstDateOfMonth),
		new Date(lastDateOfMonth)
	);

	const userName = React.useMemo(() => {
		if (session) {
			return session?.data?.user.name || session?.data?.user.email || "Anonymous";
		}
	}, [session]);

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
						<Typography variant="h6" color="text.secondary">
							Xin chào {userName} !
						</Typography>
					</CardContent>
				</Card>

				<Box mt={3}>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={3}>
							<Link href="/incomes">
								<Card sx={{ border: "1px solid rgba(255,255,255,0.23)", cursor: "pointer" }}>
									<CardContent>
										<Typography variant="body1" color="text.secondary">
											Tổng doanh thu tháng {format(new Date(), "M")}
										</Typography>
										<Typography variant="h5" fontWeight={"bold"} mt={1} color="success.main">
											<CountUp
												end={getSumPriceIncomes(incomes)}
												decimal="."
												decimals={3}
												duration={1}
											/>{" "}
											VND
										</Typography>
									</CardContent>
								</Card>
							</Link>
						</Grid>
						<Grid item xs={12} sm={3}>
							<Link href="/incomes">
								<Card
									sx={{ border: "1px solid rgba(255,255,255,0.23)", cursor: "pointer" }}
									onClick={() => {
										router.push("/costs");
									}}
								>
									<CardContent>
										<Typography variant="body1" color="text.secondary">
											Tổng sản phẩm tháng {format(new Date(), "M")}
										</Typography>
										<Typography variant="h5" fontWeight={"bold"} mt={1} color="info.light">
											<CountUp end={incomes?.length} duration={1} /> sản phẩm
										</Typography>
									</CardContent>
								</Card>
							</Link>
						</Grid>
						<Grid item xs={12} sm={3}>
							<Link href="/costs">
								<Card
									sx={{ border: "1px solid rgba(255,255,255,0.23)", cursor: "pointer" }}
									onClick={() => {
										router.push("/costs");
									}}
								>
									<CardContent>
										<Typography variant="body1" color="text.secondary">
											Tổng chi phí tháng {format(new Date(), "M")}
										</Typography>
										<Typography variant="h5" fontWeight={"bold"} mt={1} color="error.light">
											<CountUp
												end={getSumPriceCosts(costs)}
												decimal="."
												decimals={3}
												duration={1}
											/>{" "}
											VND
										</Typography>
									</CardContent>
								</Card>
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Container>
		</Box>
	);
};

Admin.Layout = AdminLayout;

export default Admin;
