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
import { useEffect, useRef, useState } from "react";
import { CreativaLayout } from "@/components/layout";
import { CreativaSeo } from "@/components/creativa/Seo";
import { useHydratedCreativaCart } from "@/hooks/creativa/useBrowserState";
import { isReserved, type CreativaCartLine } from "@/store/cart/creativaCart";
import type { CreativaQuote } from "@/models/creativa";
import type { NextPageWithLayout } from "@/models/common";
import { creativaApi, CreativaRequestError } from "@/api-client/creativa-checkout";
import { formatCreativaPrice, lineIdentity, safeQuantity } from "@/utils/creativa/contracts";
import { measureCreativaLine, trackCreativa } from "@/utils/creativa/analytics";

function CartLine({
	item,
	price,
	availabilityError,
	update,
	remove,
}: {
	item: CreativaCartLine;
	price: number;
	availabilityError?: string;
	update: (id: string, quantity: number) => void;
	remove: (id: string) => void;
}) {
	const [quantity, setQuantity] = useState(String(item.quantity));
	const [error, setError] = useState<string | null>(null);
	useEffect(() => setQuantity(String(item.quantity)), [item.quantity]);
	return (
		<Box sx={{ py: 2, borderBottom: "1px solid #e5d7ce" }}>
			<Stack direction="row" justifyContent="space-between" gap={2}>
				<Box>
					<Link href={`/creativa/skin-laptop/${item.productSlug}`}>
						<Typography component="span" fontWeight={500}>
							{item.productName}
						</Typography>
					</Link>
					<Typography variant="body2" color="text.secondary">
						{item.modelName} / {item.coverageName}
					</Typography>
					<Typography variant="body2" mt={1}>
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
					<DeleteOutlineIcon />
				</IconButton>
			</Stack>
			<Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
				<TextField
					size="small"
					label="Số lượng"
					type="number"
					value={quantity}
					disabled={isReserved(item)}
					inputProps={{ min: 1, step: 1 }}
					sx={{ width: 110 }}
					onChange={(event) => setQuantity(event.target.value)}
					onBlur={() => {
						try {
							const next = safeQuantity(Number(quantity));
							if (next !== item.quantity) {
								update(item.instanceId, next);
								trackCreativa("quantity_change", {
									product_id: item.productId,
									previous_quantity: item.quantity,
									quantity: next,
									surface: "cart",
								});
							}
							setError(null);
						} catch (failure) {
							setError(failure instanceof Error ? failure.message : "Số lượng không hợp lệ.");
							setQuantity(String(item.quantity));
						}
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
	const cart = useHydratedCreativaCart();
	const [quote, setQuote] = useState<CreativaQuote | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [reviewed, setReviewed] = useState("");
	const [retry, setRetry] = useState(0);
	const [lineErrors, setLineErrors] = useState<Record<string, string>>({});
	const viewed = useRef(false);
	useEffect(() => {
		if (!cart.hydrated) return;
		function reportView(currentQuote?: CreativaQuote, reason?: string) {
			if (viewed.current) return;
			viewed.current = true;
			const empty = !cart.error && !cart.items.length;
			trackCreativa(
				"cart_view",
				{
					item_count: cart.items.length,
					unit_count: cart.items.reduce((sum, item) => sum + item.quantity, 0),
					price_basis: currentQuote ? "current_quote" : empty ? "empty" : "unavailable",
					...(currentQuote ? { value: currentQuote.merchandiseTotal } : empty && { value: 0 }),
					...(reason && { reason }),
				},
				currentQuote
					? currentQuote.lines.map(measureCreativaLine)
					: cart.items.map((item) => {
							const measurement = measureCreativaLine(item);
							delete measurement.price;
							return measurement;
					  })
			);
		}
		if (cart.error || !cart.items.length) {
			setQuote(null);
			setLoading(false);
			setError(null);
			setLineErrors({});
			reportView(undefined, cart.error ? "invalid_cart" : undefined);
			return;
		}
		let current = true;
		setLoading(true);
		setError(null);
		setLineErrors({});
		void creativaApi
			.quote(cart.items, "", "cod")
			.then((next) => {
				if (!current) return;
				setQuote(next);
				reportView(next);
				const changedItems = cart.items.filter(
					(item) =>
						next.lines.find((line) => lineIdentity(line) === lineIdentity(item))?.unitPrice !==
						item.unitPrice
				);
				if (changedItems.length) {
					trackCreativa("cart_revalidation", {
						reason: "price_changed",
						item_count: changedItems.length,
					});
				}
			})
			.catch((failure: Error) => {
				if (current) {
					setQuote(null);
					setError(failure.message);
					const affected = failure instanceof CreativaRequestError ? failure.fieldErrors || {} : {};
					setLineErrors(affected);
					const count = cart.items.filter((item) => affected[lineIdentity(item)]).length;
					if (count)
						trackCreativa("cart_revalidation", { reason: "item_unavailable", item_count: count });
					reportView(undefined, "quote_unavailable");
				}
			})
			.finally(() => {
				if (current) setLoading(false);
			});
		return () => {
			current = false;
		};
	}, [cart.hydrated, cart.error, cart.items, retry]);
	const changed =
		quote &&
		cart.items.some(
			(item) =>
				quote.lines.find((line) => lineIdentity(line) === lineIdentity(item))?.unitPrice !==
				item.unitPrice
		);
	return (
		<>
			<CreativaSeo title="Giỏ hàng" path="/creativa/cart" noindex />
			<Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
				<Stack gap={2}>
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
											return;
										}
										if (
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
						<Alert
							severity="error"
							action={<Button onClick={() => setRetry((value) => value + 1)}>Thử lại</Button>}
						>
							{error} Vui lòng kiểm tra lựa chọn hoặc xóa sản phẩm không còn hỗ trợ.
						</Alert>
					)}
					{cart.hydrated && !cart.error && !cart.items.length && (
						<Alert severity="info">Giỏ hàng chưa có sản phẩm.</Alert>
					)}
					{cart.items.map((item) => (
						<CartLine
							key={item.instanceId}
							item={item}
							availabilityError={lineErrors[lineIdentity(item)]}
							price={
								quote?.lines.find((line) => lineIdentity(line) === lineIdentity(item))?.unitPrice ??
								item.unitPrice
							}
							update={cart.update}
							remove={cart.remove}
						/>
					))}
					{changed && reviewed !== quote.digest && (
						<Alert
							severity="warning"
							action={<Button onClick={() => setReviewed(quote.digest)}>Đã kiểm tra</Button>}
						>
							Giá đã được cập nhật. Vui lòng kiểm tra các giá mới trước khi tiếp tục.
						</Alert>
					)}
					{quote && (
						<Stack gap={1} py={2}>
							<Stack direction="row" justifyContent="space-between">
								<Typography>Tổng sản phẩm</Typography>
								<Typography>{formatCreativaPrice(quote.merchandiseTotal)}</Typography>
							</Stack>
							<Typography variant="caption" color="text.secondary">
								Phí vận chuyển được xác nhận ở bước thanh toán.
							</Typography>
							<Divider sx={{ my: 1 }} />
							<Link href="/creativa/checkout" passHref>
								<Button
									component="a"
									variant="contained"
									size="large"
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
						<Button component="a" variant="text" sx={{ alignSelf: "flex-start" }}>
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
