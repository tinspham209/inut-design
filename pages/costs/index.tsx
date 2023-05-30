import { AdminLayout } from "@/components/layout";
import { swrCosts } from "@/components/swr";
import { NextPageWithLayout } from "@/models/common";
import { getSumPriceCosts } from "@/utils";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import CountUp from "react-countup";
import SelectDate from "../incomes/selectDate";
import CreateCostDialog from "./createDialog";
import CostsHeader from "./header";
import CostsSeo from "./seo";
import IncomesTable from "./table";

const Costs: NextPageWithLayout = () => {
	const router = useRouter();
	const { startDate, endDate } = router.query;

	const { costs } = swrCosts.useGetByDateRange(
		new Date((startDate as string) || null),
		new Date((endDate as string) || null)
	);

	return (
		<>
			<CostsSeo />

			<Box>
				<Container>
					<CostsHeader />

					<Stack direction="row" justifyContent={"space-between"} alignItems={"center"} my={2}>
						<Typography variant="h6">
							Tổng: <CountUp end={getSumPriceCosts(costs)} decimal="." decimals={3} duration={1} />{" "}
							VND
						</Typography>
						<Stack flexDirection={"row"} alignItems={"center"}>
							<CreateCostDialog />
							<SelectDate path="/costs" />
						</Stack>
					</Stack>

					<IncomesTable costs={costs} />
				</Container>
			</Box>
		</>
	);
};

Costs.Layout = AdminLayout;

export default Costs;
