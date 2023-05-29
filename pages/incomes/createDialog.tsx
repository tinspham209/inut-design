import { swrIncomes } from "@/components/swr";
import { Box, Button } from "@mui/material";
import { toast } from "react-hot-toast";

const CreateIncomeDialog = () => {
	const { refetch } = swrIncomes.useIncomeWithDateRange();
	const { createIncome, isLoading } = swrIncomes.useCreateIncome();

	const handleCreateIncome = () => {
		createIncome(
			{
				_type: "income",
				date: "2023-05-29",
				matLung: true,
				vienManHinh: true,
				matPhim: false,
				title: "Test 8",
				matDay: true,
				discount: 30,
			},
			{
				onSuccess() {
					refetch();
					toast.success("Create successfully!");
				},
			}
		);
	};

	return (
		<Box mr={2}>
			<Button variant="contained" onClick={() => handleCreateIncome()} disabled={isLoading}>
				Tạo mới
			</Button>
		</Box>
	);
};

export default CreateIncomeDialog;
