/* eslint-disable camelcase */
import {
	Alert,
	Box,
	Button,
	Container,
	Divider,
	IconButton,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CreativaLayout } from "@/components/layout";
import { CreativaSeo } from "@/components/creativa/Seo";
import { CreativaBreadcrumbs } from "@/components/creativa/Breadcrumbs";
import { CreativaProductThumbnail } from "@/components/creativa/ProductThumbnail";
import { useCreativaCartPage } from "@/hooks/creativa/useCart";
import { isReserved, type CreativaCartLine } from "@/store/cart/creativaCart";
import type { CreativaImage } from "@/models/creativa";
import type { NextPageWithLayout } from "@/models/common";
import { formatCreativaPrice, lineIdentity } from "@/utils/creativa/contracts";
import { creativaQuantitySchema } from "@/utils/creativa/forms";
import { measureCreativaLine, trackCreativa } from "@/utils/creativa/analytics";

const quantitySchema = yup.object({ quantity: creativaQuantitySchema });

function CartLine({
	item,
	price,
	image,
	availabilityError,
	update,
	remove,
}: {
	item: CreativaCartLine;
	price: number;
	image?: CreativaImage;
	availabilityError?: string;
	update: (id: string, quantity: number) => void;
	remove: (id: string) => void;
}) {
	const [error, setError] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(quantitySchema),
		defaultValues: { quantity: item.quantity },
	});
	const { ref, ...quantityField } = register("quantity", { valueAsNumber: true });
	return (
		<Box sx={{ py: 1.5, borderBottom: "1px solid", borderColor: "divider" }}>
			<Stack direction="row" gap={1.5} alignItems="flex-start">
				<CreativaProductThumbnail image={image} name={item.productName} />
				<Box sx={{ flex: 1, minWidth: 0, overflowWrap: "anywhere" }}>
					<Link href={`/creativa/skin-laptop/${item.productSlug}`} passHref>
						<Typography component="a" fontWeight={500}>
							{item.productName}
						</Typography>
					</Link>
					<Typography variant="body2" color="text.secondary">
						{item.modelName} / {item.coverageName}
					</Typography>
					<Typography variant="body2" mt={0.5}>
						{formatCreativaPrice(price)} / sản phẩm
					</Typography>
				</Box>
				<IconButton
					aria-label={`Xóa ${item.productName}`}
					disabled={isReserved(item)}
					onClick={() => {
						try {
							remove(item.instanceId);
							trackCreativa(
								"remove_from_cart",
								{
									product_id: item.productId,
									quantity: item.quantity,
									value: price * item.quantity,
								},
								[measureCreativaLine({ ...item, unitPrice: price })]
							);
						} catch (failure) {
							setError(failure instanceof Error ? failure.message : "Không thể xóa.");
						}
					}}
				>
					<DeleteOutlineIcon fontSize="small" />
				</IconButton>
			</Stack>
			<Stack direction="row" justifyContent="space-between" alignItems="center" mt={1.5} gap={1}>
				<TextField
					{...quantityField}
					inputRef={ref}
					label="Số lượng"
					type="number"
					disabled={isReserved(item)}
					inputProps={{ min: 1, step: 1 }}
					error={!!errors.quantity}
					helperText={errors.quantity?.message}
					sx={{ width: 120 }}
					onBlur={(event) => {
						void quantityField.onBlur(event);
						void handleSubmit(({ quantity }) => {
							try {
								if (quantity !== item.quantity) {
									update(item.instanceId, quantity);
									trackCreativa("quantity_change", {
										product_id: item.productId,
										previous_quantity: item.quantity,
										quantity,
										surface: "cart",
									});
								}
								setError(null);
							} catch (failure) {
								setError(failure instanceof Error ? failure.message : "Số lượng không hợp lệ.");
							}
						})();
					}}
				/>
				<Typography>{formatCreativaPrice(price * item.quantity)}</Typography>
			</Stack>
			{isReserved(item) && (
				<Typography variant="caption">Sản phẩm đang chờ xác nhận lần đặt hàng trước.</Typography>
			)}
			{(error || availabilityError) && (
				<Alert severity="error" sx={{ mt: 1 }}>
					{error || availabilityError}
				</Alert>
			)}
		</Box>
	);
}

const Cart: NextPageWithLayout = () => {
	const { cart, quote, error, loading, reviewed, review, retry, lineErrors, changed } =
		useCreativaCartPage();
	return (
		<>
			<CreativaSeo title="Giỏ hàng" path="/creativa/cart" noindex />
			<Container maxWidth="md" sx={{ py: { xs: 2, md: 3 } }}>
				<CreativaBreadcrumbs current="Giỏ hàng" />
				<Stack gap={1.5}>
					<Typography variant="h3" component="h1">
						Giỏ hàng Creativa
					</Typography>
					{!cart.hydrated && <Typography>Đang đọc giỏ hàng đã lưu…</Typography>}
					{cart.error && (
						<Alert
							severity="error"
							action={
								<Button
									onClick={() => {
										if (cart.quarantinedCount) {
											if (
												window.confirm(
													"Chỉ loại bỏ các mục không hợp lệ và giữ nguyên sản phẩm hợp lệ? Thao tác này không hủy đơn đã gửi."
												)
											)
												cart.discardInvalid();
										} else if (
											window.confirm("Chỉ xóa giỏ Creativa lỗi? Đơn hàng và lịch sử không bị xóa.")
										)
											cart.resetCorrupt();
									}}
								>
									{cart.quarantinedCount ? "Loại bỏ mục lỗi" : "Khôi phục giỏ lỗi"}
								</Button>
							}
						>
							{cart.error}
						</Alert>
					)}
					{error && (
						<Alert severity="error" action={<Button onClick={retry}>Thử lại</Button>}>
							{error} Vui lòng kiểm tra lựa chọn hoặc xóa sản phẩm không còn hỗ trợ.
						</Alert>
					)}
					{cart.hydrated && !cart.error && !cart.items.length && (
						<Alert severity="info">Giỏ hàng chưa có sản phẩm.</Alert>
					)}
					{cart.items.map((item) => {
						const current = quote?.lines.find((line) => lineIdentity(line) === lineIdentity(item));
						return (
							<CartLine
								key={`${item.instanceId}:${item.quantity}`}
								item={item}
								image={current?.productImage || item.productImage}
								availabilityError={lineErrors[lineIdentity(item)]}
								price={current?.unitPrice ?? item.unitPrice}
								update={cart.update}
								remove={cart.remove}
							/>
						);
					})}
					{changed && reviewed !== quote.digest && (
						<Alert severity="warning" action={<Button onClick={review}>Đã kiểm tra</Button>}>
							Giá đã được cập nhật. Vui lòng kiểm tra các giá mới trước khi tiếp tục.
						</Alert>
					)}
					{quote && (
						<Stack gap={1} py={1}>
							<Stack direction="row" justifyContent="space-between">
								<Typography>Tổng sản phẩm</Typography>
								<Typography>{formatCreativaPrice(quote.merchandiseTotal)}</Typography>
							</Stack>
							<Typography variant="caption" color="text.secondary">
								Phí vận chuyển được xác nhận ở bước thanh toán.
							</Typography>
							<Divider sx={{ my: 0.5 }} />
							<Link href="/creativa/checkout" passHref>
								<Button
									component="a"
									variant="contained"
									disabled={
										loading || !!cart.error || !!error || (!!changed && reviewed !== quote.digest)
									}
								>
									Tiếp tục thanh toán
								</Button>
							</Link>
						</Stack>
					)}
					{loading && (
						<Typography variant="body2">Đang kiểm tra giá và lựa chọn hiện tại…</Typography>
					)}
					<Link href="/creativa/skin-laptop" passHref>
						<Button component="a" sx={{ alignSelf: "flex-start" }}>
							Tiếp tục xem thiết kế
						</Button>
					</Link>
					<Link href="/creativa/checkout">Khôi phục lần đặt hàng trước</Link>
				</Stack>
			</Container>
		</>
	);
};
Cart.Layout = CreativaLayout;
export default Cart;
