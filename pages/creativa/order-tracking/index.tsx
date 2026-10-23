/* eslint-disable camelcase */
import { Button, Container, Stack, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { CreativaLayout } from "@/components/layout";
import { CreativaSeo } from "@/components/creativa/Seo";
import { RecentCreativaOrders } from "@/components/creativa/RecentOrders";
import type { NextPageWithLayout } from "@/models/common";
import { creativaReferenceSchema } from "@/utils/creativa/forms";
import { CreativaBreadcrumbs } from "@/components/creativa/Breadcrumbs";
import { trackCreativa } from "@/utils/creativa/analytics";

const TrackingSearch: NextPageWithLayout = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: { reference: "" },
		resolver: yupResolver(creativaReferenceSchema),
	});
	const { ref, ...field } = register("reference");
	const router = useRouter();
	return (
		<>
			<CreativaSeo title="Tra cứu đơn hàng" path="/creativa/order-tracking" noindex />
			<Container maxWidth="sm" sx={{ py: { xs: 2, md: 3 } }}>
				<CreativaBreadcrumbs current="Tra cứu đơn hàng" />
				<Stack gap={1.5}>
					<Typography variant="h3" component="h1">
						Tra cứu đơn hàng
					</Typography>
					<Typography>Nhập mã 10 ký tự. Chữ hoa và chữ thường được phân biệt.</Typography>
					<Stack
						component="form"
						gap={2}
						noValidate
						onSubmit={handleSubmit(({ reference }) => {
							const id = reference.trim();
							trackCreativa("order_tracking_search", {
								entry_point: "creativa",
								lookup_source: "manual",
							});
							void router.push({
								pathname: `/creativa/order-tracking/${encodeURIComponent(id)}`,
								query: { source: "manual", entry: "creativa" },
							});
						})}
					>
						<TextField
							{...field}
							inputRef={ref}
							fullWidth
							label="Mã đơn hàng"
							required
							error={!!errors.reference}
							helperText={errors.reference?.message}
							inputProps={{ autoCapitalize: "none", autoCorrect: "off", spellCheck: false }}
						/>
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
