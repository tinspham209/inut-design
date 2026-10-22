/* eslint-disable camelcase */
import { Alert, Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { CreativaLayout } from "@/components/layout";
import { CreativaSeo } from "@/components/creativa/Seo";
import { RecentCreativaOrders } from "@/components/creativa/RecentOrders";
import type { NextPageWithLayout } from "@/models/common";
import { CREATIVA_PUBLIC_ID } from "@/utils/creativa/contracts";
import { trackCreativa } from "@/utils/creativa/analytics";

const TrackingSearch: NextPageWithLayout = () => {
	const [reference, setReference] = useState("");
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	return (
		<>
			<CreativaSeo title="Tra cứu đơn hàng" path="/creativa/order-tracking" noindex />
			<Container maxWidth="sm" sx={{ py: { xs: 5, md: 9 } }}>
				<Stack gap={3}>
					<Typography variant="h3" component="h1">
						Tra cứu đơn hàng
					</Typography>
					<Typography>Nhập mã 10 ký tự. Chữ hoa và chữ thường được phân biệt.</Typography>
					<Stack
						component="form"
						gap={2}
						onSubmit={(event) => {
							event.preventDefault();
							const id = reference.trim();
							if (!CREATIVA_PUBLIC_ID.test(id)) {
								setError("Mã Creativa gồm đúng 10 ký tự chữ, số, dấu _ hoặc -.");
								return;
							}
							setError(null);
							trackCreativa("order_tracking_search", {
								entry_point: "creativa",
								lookup_source: "manual",
							});
							void router.push({
								pathname: `/creativa/order-tracking/${encodeURIComponent(id)}`,
								query: { source: "manual", entry: "creativa" },
							});
						}}
					>
						<TextField
							fullWidth
							label="Mã đơn hàng"
							required
							value={reference}
							onChange={(event) => setReference(event.target.value)}
							inputProps={{ autoCapitalize: "none", autoCorrect: "off", spellCheck: false }}
						/>
						{error && <Alert severity="error">{error}</Alert>}
						<RecentCreativaOrders />
						<Button type="submit" variant="contained" size="large">
							Tra cứu
						</Button>
					</Stack>
					<Typography variant="body2" color="text.secondary">
						Mã đơn hàng cũng là đường dẫn tra cứu. Chỉ chia sẻ với người bạn tin tưởng.
					</Typography>
				</Stack>
			</Container>
		</>
	);
};
TrackingSearch.Layout = CreativaLayout;
export default TrackingSearch;
