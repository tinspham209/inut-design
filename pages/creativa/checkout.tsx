/* eslint-disable camelcase */
import {
	Alert,
	Autocomplete,
	Box,
	Button,
	CircularProgress,
	Container,
	Dialog,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	Grid,
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

const PAYMENT_METHODS = [
	{ value: "bank_transfer", label: "Chuyển khoản ngân hàng" },
	{ value: "cod", label: "Thanh toán khi nhận hàng (COD)" },
] as const;

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
	const interactionLocked = busy || !!attempt || !!accepted || corrupt;
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
						<Typography role="status" aria-live="polite">
							INUT đang chuẩn bị trang thanh toán cho bạn…
						</Typography>
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
					) : !cart.items.length ? (
						attempt ? (
							<Alert
								severity={busy ? "info" : "warning"}
								action={
									!busy && (
										<Button onClick={() => void resolve(attempt)}>Kiểm tra lại trạng thái</Button>
									)
								}
							>
								{busy
									? "INUT đang kiểm tra kết quả đơn hàng của bạn. Vui lòng chờ trong giây lát."
									: "Đơn hàng chưa có kết quả cuối cùng. Hãy kiểm tra lại trạng thái để tránh tạo đơn trùng."}
							</Alert>
						) : (
							<Alert severity="info">
								Giỏ hàng chưa có sản phẩm.{" "}
								<Link href="/creativa/skin-laptop">Khám phá thiết kế</Link>
							</Alert>
						)
					) : (
						<Box component="form" onSubmit={submit} noValidate aria-busy={busy}>
							{attempt && !busy && (
								<Alert
									severity="warning"
									action={
										<Button type="button" onClick={() => void resolve(attempt)}>
											Kiểm tra lại trạng thái
										</Button>
									}
								>
									INUT chưa nhận được kết quả cuối cùng cho đơn hàng này. Đơn có thể đã được ghi
									nhận; hãy kiểm tra lại trạng thái trước khi đặt tiếp để tránh tạo đơn trùng.
								</Alert>
							)}
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
													disabled={interactionLocked}
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
												<Autocomplete
													id="creativa-payment"
													fullWidth
													disablePortal
													disableClearable
													disabled={interactionLocked}
													options={PAYMENT_METHODS}
													getOptionLabel={(option) => option.label}
													isOptionEqualToValue={(option, value) => option.value === value.value}
													getOptionDisabled={(option) =>
														option.value === "bank_transfer" && bankAvailable === false
													}
													value={
														PAYMENT_METHODS.find((option) => option.value === field.value) || null
													}
													onBlur={field.onBlur}
													onChange={(_, option) => changePayment(option.value)}
													renderInput={(params) => (
														<TextField
															{...params}
															name={field.name}
															inputRef={field.ref}
															label="Phương thức thanh toán"
															error={!!errors.paymentMethod}
															helperText={errors.paymentMethod?.message}
														/>
													)}
												/>
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
													disabled={interactionLocked}
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
													{quote && (
														<Typography variant="body2">
															{formatCreativaPrice(line.unitPrice * line.quantity)}
														</Typography>
													)}
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
											disabled={interactionLocked || quoteLoading || !quote || !!cart.error}
										>
											Đặt hàng
										</Button>
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
			<Dialog
				open={busy}
				onClose={() => undefined}
				disableEscapeKeyDown
				fullWidth
				maxWidth="xs"
				aria-labelledby="creativa-checkout-progress-title"
				aria-describedby="creativa-checkout-progress-description"
			>
				<DialogTitle id="creativa-checkout-progress-title">
					INUT đang xác nhận đơn hàng của bạn
				</DialogTitle>
				<DialogContent>
					<Stack direction="row" spacing={2} alignItems="center" sx={{ pb: 2 }}>
						<CircularProgress size={28} aria-label="Đang xử lý đơn hàng" />
						<DialogContentText id="creativa-checkout-progress-description">
							Bạn vui lòng chờ trong giây lát và đừng gửi lại đơn hàng để tránh tạo đơn trùng nhé.
						</DialogContentText>
					</Stack>
				</DialogContent>
			</Dialog>
		</>
	);
};
Checkout.Layout = CreativaLayout;
export default Checkout;
