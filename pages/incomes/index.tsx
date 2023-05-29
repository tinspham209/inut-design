import { AdminLayout } from "@/components/layout";
import { swrIncomes } from "@/components/swr";
import { NextPageWithLayout } from "@/models/common";
import { getSumPriceIncomes } from "@/utils";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import CountUp from "react-countup";
import IncomesHeader from "./header";
import SelectDate from "./selectDate";
import IncomesSeo from "./seo";
import IncomesTable from "./table";
import CreateIncomeDialog from "./createDialog";

const Incomes: NextPageWithLayout = () => {
	const router = useRouter();
	const { startDate, endDate } = router.query;

	const { incomes } = swrIncomes.useIncomeWithDateRange(
		new Date((startDate as string) || null),
		new Date((endDate as string) || null)
	);

	return (
		<>
			<IncomesSeo />

			<Box>
				<Container>
					<IncomesHeader />

					<Stack direction="row" justifyContent={"space-between"} alignItems={"center"} my={2}>
						<Typography variant="h6">
							Tổng:{" "}
							<CountUp end={getSumPriceIncomes(incomes)} decimal="." decimals={3} duration={1} />{" "}
							VND
						</Typography>
						<Stack flexDirection={"row"} alignItems={"center"}>
							<CreateIncomeDialog />
							<SelectDate />
						</Stack>
					</Stack>

					<IncomesTable incomes={incomes} />
				</Container>
			</Box>
		</>
	);
};

Incomes.Layout = AdminLayout;

export default Incomes;
