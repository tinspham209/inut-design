import { Income } from "@/models";
import { getPrice } from "@/utils";
import {
	Box,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import { format } from "date-fns";
import React from "react";
const IncomesTable: React.FC<Props> = ({ incomes }) => {
	const getOptionLabel = ({ matPhim, matDay, matLung, vienManHinh }) => {
		const options = [];
		if (matPhim) {
			options.push("Mặt phím");
		}
		if (matDay) {
			options.push("Mặt đáy");
		}
		if (matLung) {
			options.push("Mặt lưng");
		}
		if (vienManHinh) {
			options.push("Viền màn hình");
		}
		return options.join(", ");
	};

	return (
		<Box my={3}>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							{["Date", "Title", "Option", "Discount", "Price"].map((item) => (
								<TableCell key={item}>{item}</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{!incomes || incomes.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5}>Không có sản phẩm</TableCell>
							</TableRow>
						) : (
							incomes
								.sort((prev, cur) => {
									const curDate = new Date(cur.date).getTime();
									const prevDate = new Date(prev.date).getTime();
									return curDate - prevDate;
								})
								.map((income) => (
									<TableRow key={income.id}>
										<TableCell>{format(new Date(income.date), "dd-MM-yyyy")}</TableCell>
										<TableCell>{income.title || "--"}</TableCell>
										<TableCell>
											{getOptionLabel({
												matPhim: income.matPhim,
												matDay: income.matDay,
												matLung: income.matLung,
												vienManHinh: income.vienManHinh,
											})}
										</TableCell>
										<TableCell>{income.discount ? `${income.discount}%` : "--"}</TableCell>
										<TableCell>
											{`${getPrice({
												discount: income.discount,
												matPhim: income.matPhim,
												matDay: income.matDay,
												matLung: income.matLung,
												vienManHinh: income.vienManHinh,
											})}.000VND`}
										</TableCell>
									</TableRow>
								))
						)}
					</TableBody>
				</Table>
			</TableContainer>

			{/* <JsonView src={incomes} /> */}
		</Box>
	);
};

type Props = {
	incomes: Income[];
};

export default IncomesTable;
