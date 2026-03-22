import { Stack, Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import HomeIcon from "@mui/icons-material/Home";
import React from "react";
import { useRouter } from "next/router";

const ActionButtons: React.FC = () => {
	const router = useRouter();
	return (
		<Stack
			direction={{ xs: "column", sm: "row" }}
			spacing={2}
			sx={{ mt: 4 }}
			justifyContent="center"
		>
			<Button
				variant="outlined"
				startIcon={<PrintIcon />}
				onClick={() => window.print()}
				size="large"
			>
				In đơn hàng
			</Button>
			<Button
				variant="outlined"
				startIcon={<ShoppingBagIcon />}
				onClick={() => router.push("/san-pham/lighters")}
				size="large"
			>
				Tiếp tục mua sắm
			</Button>
			<Button
				variant="contained"
				startIcon={<HomeIcon />}
				onClick={() => router.push("/")}
				size="large"
			>
				Về trang chủ
			</Button>
		</Stack>
	);
};

export default ActionButtons;
