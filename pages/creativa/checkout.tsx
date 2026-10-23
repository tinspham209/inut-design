/* eslint-disable camelcase */
import {
	Alert,
	Box,
	Button,
	Container,
	Divider,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";
import Link from "next/link";
import { Controller } from "react-hook-form";
import { CreativaLayout } from "@/components/layout";
import { CreativaSeo } from "@/components/creativa/Seo";
import { CreativaBreadcrumbs } from "@/components/creativa/Breadcrumbs";
import { CreativaProductThumbnail } from "@/components/creativa/ProductThumbnail";
import { useCreativaCheckout } from "@/hooks/creativa/useCheckout";
import type { NextPageWithLayout } from "@/models/common";
import { formatCreativaPrice } from "@/utils/creativa/contracts";
import { trackCreativa } from "@/utils/creativa/analytics";

const Checkout: NextPageWithLayout = () => {
	const {
		cart,
		form,
		ready,
		accepted,
		attempt,
		warning,
		error,
		corrupt,
		busy,
		quote,
		quoteLoading,
		bankAvailable,
		address,
		submit,
		resolve,
		changeAddress,
		changePayment,
		retry,
	} = useCreativaCheckout();
	const { errors } = form.formState;
	return (
		<>
			<CreativaSeo title="Thanh toán" path="/creativa/checkout" noindex />
			<Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
				<CreativaBreadcrumbs
					ancestors={[
						{ label: "Creativa", href: "/creativa" },
						{ label: "Giỏ hàng", href: "/creativa/cart" },
					]}
					current="Thanh toán"
				/>
				<Stack gap={1.5}>
					<Typography component="h1" variant="h3">
						Thanh toán
					</Typography>
					{warning && <Alert severity="warning">{warning}</Alert>}
					{(error || cart.error) && (
						<Alert
							severity="error"
							action={!attempt && !accepted ? <Button onClick={retry}>Thử lại</Button> : undefined}
						>
							{error || cart.error}
						</Alert>
					)}
					{!cart.hydrated || !ready ? (
						<Typography>Đang khôi phục tiến trình…</Typography>
					) : accepted ? (
						<Box sx={{ p: 2, bgcolor: "background.paper" }}>
							<Typography component="h2" variant="h5">
								Đơn hàng đã được tiếp nhận
							</Typography>
							<Typography
								sx={{ fontFamily: "monospace", userSelect: "all", fontSize: 22, my: 1.5 }}
							>
								{accepted.publicId}
							</Typography>
							<Typography variant="body2" mb={1.5}>
								Lỗi lưu trữ hoặc đo lường không làm hủy đơn đã tiếp nhận. Không đặt lại đơn này.
							</Typography>
							<Link href={`/creativa/order-tracking/${accepted.publicId}`} passHref>
								<Button component="a" variant="contained">
									Xem đơn và sao chép mã
								</Button>
							</Link>
							{attempt && (
								<Button disabled={busy} onClick={() => void resolve(attempt)} sx={{ mt: 1 }}>
									Thử khôi phục giỏ cục bộ (không đặt lại)
								</Button>
							)}
						</Box>
					) : attempt ? (
						<Alert
							severity="info"
							action={
								<Button disabled={busy} onClick={() => void resolve(attempt)}>
									Khôi phục kết quả
								</Button>
							}
						>
							{busy
								? "Đang xác nhận kết quả của lần đặt hàng này…"
								: "Lần đặt hàng trước chưa được xác định. Khôi phục cùng tiến trình trước khi đặt tiếp."}
						</Alert>
					) : !cart.items.length ? (
						<Alert severity="info">
							Giỏ hàng chưa có sản phẩm. <Link href="/creativa/skin-laptop">Khám phá thiết kế</Link>
						</Alert>
					) : (
						<Box component="form" onSubmit={submit} noValidate>
							<Grid container spacing={{ xs: 2, md: 3 }}>
								<Grid item xs={12} md={7}>
									<Stack gap={1.5}>
										<Typography component="h2" variant="h5">
											Thông tin khách hàng
										</Typography>
										{(
											[
												{
													name: "name",
													label: "Họ và tên",
													autoComplete: "name",
													max: 200,
													required: true,
												},
												{
													name: "phone",
													label: "Số điện thoại",
													autoComplete: "tel",
													max: 32,
													required: true,
												},
												{
													name: "email",
													label: "Email (không bắt buộc)",
													autoComplete: "email",
													max: 254,
												},
												{
													name: "address",
													label: "Địa chỉ giao hàng (không bắt buộc)",
													autoComplete: "street-address",
													max: 2000,
												},
											] as const
										).map((input) => {
											const { ref, ...field } = form.register(
												input.name,
												input.name === "address"
													? {
															onChange: (event) => changeAddress(event.target.value),
													  }
													: undefined
											);
											return (
												<TextField
													key={input.name}
													{...field}
													inputRef={ref}
													label={input.label}
													autoComplete={input.autoComplete}
													required={input.name === "name" || input.name === "phone"}
													type={
														input.name === "phone"
															? "tel"
															: input.name === "email"
															? "email"
															: "text"
													}
													multiline={input.name === "address"}
													rows={input.name === "address" ? 2 : undefined}
													error={!!errors[input.name]}
													helperText={
														errors[input.name]?.message ||
														(input.name === "phone" ? "Gồm đúng 10 chữ số." : undefined)
													}
													inputProps={{
														maxLength: input.max,
														...(input.name === "phone" && {
															inputMode: "numeric",
															pattern: "[0-9]{10}",
														}),
													}}
												/>
											);
										})}
										{!address && (
											<Typography variant="caption">
												Nếu chưa nhập địa chỉ, phí vận chuyển mặc định được áp dụng. Nhân viên sẽ
												xác nhận thông tin giao hàng với bạn.
											</Typography>
										)}
										<Controller
											name="paymentMethod"
											control={form.control}
											render={({ field }) => (
												<FormControl fullWidth>
													<InputLabel id="creativa-payment">Phương thức thanh toán</InputLabel>
													<Select
														labelId="creativa-payment"
														label="Phương thức thanh toán"
														name={field.name}
														value={field.value}
														onBlur={field.onBlur}
														inputRef={field.ref}
														onChange={(event) =>
															changePayment(event.target.value === "cod" ? "cod" : "bank_transfer")
														}
													>
														<MenuItem value="bank_transfer" disabled={bankAvailable === false}>
															Chuyển khoản ngân hàng
														</MenuItem>
														<MenuItem value="cod">Thanh toán khi nhận hàng (COD)</MenuItem>
													</Select>
												</FormControl>
											)}
										/>
										{bankAvailable === false && (
											<Alert severity="info">
												Chuyển khoản cần đúng một tài khoản Creativa hợp lệ đang bật và được đặt làm
												tài khoản chính. Hiện chưa có thông tin sẵn sàng; bạn có thể chọn COD.
											</Alert>
										)}
										{(() => {
											const { ref, ...field } = form.register("note");
											return (
												<TextField
													{...field}
													inputRef={ref}
													label="Ghi chú (không bắt buộc)"
													multiline
													rows={2}
													error={!!errors.note}
													helperText={errors.note?.message}
													inputProps={{ maxLength: 2000 }}
												/>
											);
										})()}
									</Stack>
								</Grid>
								<Grid item xs={12} md={5}>
									<Stack
										gap={1.5}
										sx={{
											bgcolor: "background.paper",
											p: 2,
											border: "1px solid",
											borderColor: "divider",
										}}
									>
										<Typography component="h2" variant="h5">
											Đơn hàng của bạn
										</Typography>
										{quoteLoading && (
											<Typography variant="body2">Đang xác nhận giá và phí vận chuyển…</Typography>
										)}
										{(quote?.lines || cart.items).map((line) => (
											<Stack
												key={"lineKey" in line ? line.lineKey : line.instanceId}
												direction="row"
												gap={1.5}
											>
												<CreativaProductThumbnail
													image={line.productImage}
													name={line.productName}
												/>
												<Stack gap={0.25} sx={{ minWidth: 0, overflowWrap: "anywhere" }}>
													<Typography fontWeight={500}>{line.productName}</Typography>
													<Typography variant="body2">
														{"modelName" in line ? line.modelName : line.selection.modelName} /{" "}
														{"coverageName" in line
															? line.coverageName
															: line.selection.coverageName}{" "}
														× {line.quantity}
													</Typography>
													<Typography variant="body2">
														{formatCreativaPrice(line.unitPrice * line.quantity)}
													</Typography>
												</Stack>
											</Stack>
										))}
										{quote && (
											<>
												<Divider />
												<Stack direction="row" justifyContent="space-between" gap={1}>
													<Typography>Sản phẩm</Typography>
													<Typography>{formatCreativaPrice(quote.merchandiseTotal)}</Typography>
												</Stack>
												<Stack direction="row" justifyContent="space-between" gap={1}>
													<Typography>Vận chuyển: {quote.shipping.name}</Typography>
													<Typography>{formatCreativaPrice(quote.shippingFee)}</Typography>
												</Stack>
												<Stack direction="row" justifyContent="space-between" gap={1}>
													<Typography fontWeight={700}>Tổng thanh toán</Typography>
													<Typography fontWeight={700}>
														{formatCreativaPrice(quote.finalAmount)}
													</Typography>
												</Stack>
											</>
										)}
										<Button
											type="submit"
											variant="contained"
											disabled={busy || quoteLoading || !quote || !!cart.error || corrupt}
										>
											Đặt hàng
										</Button>
										<Typography variant="caption">
											Bạn đặt một đơn Creativa cho toàn bộ sản phẩm trong giỏ. Đặt hàng không đồng
											nghĩa thanh toán đã được xác nhận.
										</Typography>
									</Stack>
								</Grid>
							</Grid>
						</Box>
					)}
					<Stack direction="row" gap={1.5} flexWrap="wrap">
						<Link href="/creativa/cart">Về giỏ hàng</Link>
						<Link href="/creativa/order-tracking">Tra cứu đơn</Link>
						<Link href="/contact">
							<a
								onClick={() =>
									trackCreativa("contact_click", { method: "form", surface: "checkout" })
								}
							>
								Liên hệ hỗ trợ
							</a>
						</Link>
					</Stack>
				</Stack>
			</Container>
		</>
	);
};
Checkout.Layout = CreativaLayout;
export default Checkout;
