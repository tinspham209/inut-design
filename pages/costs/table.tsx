import { Cost } from "@/models";
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
const CostsTable: React.FC<Props> = ({ costs }) => {
	return (
		<Box my={3}>
			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							{["Date", "Title", "Price"].map((item) => (
								<TableCell key={item}>{item}</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{!costs || costs.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5}>Không có sản phẩm</TableCell>
							</TableRow>
						) : (
							costs
								.sort((prev, cur) => {
									const curDate = new Date(cur.date).getTime();
									const prevDate = new Date(prev.date).getTime();
									return curDate - prevDate;
								})
								.map((cost) => (
									<TableRow key={cost.id}>
										<TableCell>{format(new Date(cost.date), "dd-MM-yyyy")}</TableCell>
										<TableCell>{cost.title || "--"}</TableCell>

										<TableCell>{`${cost.price}.000VND`}</TableCell>
									</TableRow>
								))
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
};

type Props = {
	costs: Cost[];
};

export default CostsTable;
