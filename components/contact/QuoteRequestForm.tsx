import { useSubmitQuoteRequest } from "@/hooks/useSubmitQuoteRequest";
import { useTelegramQuoteNotification } from "@/hooks/useTelegramQuoteNotification";
import {
	CreateQuoteRequestInput,
	DesignStatusValue,
	PriorityLevelValue,
	UsagePurposeValue,
} from "@/models/quoteRequest";
import { COLOR_CODE } from "@/utils";
import {
	Alert,
	Button,
	Card,
	CardContent,
	CircularProgress,
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid,
	Radio,
	RadioGroup,
	TextareaAutosize,
	TextField,
	Typography,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function QuoteRequestFormComponent() {
	const { submit, isSubmitting } = useSubmitQuoteRequest();
	const { sendNotification } = useTelegramQuoteNotification();
	const [submitSuccess, setSubmitSuccess] = React.useState(false);

	const {
		control,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm<CreateQuoteRequestInput>({
		defaultValues: {
			customerName: "",
			companyBrand: "",
			phone: "",
			email: "",
			usagePurpose: undefined,
			usagePurposeOtherDetail: "",
			designStatus: undefined,
			priorityLevel: undefined,
			urgentDate: "",
			notes: "",
		},
	});

	const usagePurpose = watch("usagePurpose");
	const priorityLevel = watch("priorityLevel");

	const onSubmit = async (data: CreateQuoteRequestInput) => {
		try {
			const result = await submit(data);
			toast.success("Gửi yêu cầu báo giá thành công!");

			// Send Telegram notification
			try {
				await sendNotification({ quoteData: result });
			} catch (telegramError) {
				console.error("Failed to send Telegram notification:", telegramError);
				// Don't fail the whole flow if Telegram fails
			}

			setSubmitSuccess(true);
			reset();
		} catch (error) {
			console.error("Error submitting quote request:", error);
			toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
		}
	};

	if (submitSuccess) {
		return (
			<Card>
				<CardContent>
					<Alert severity="success" sx={{ mb: 2 }}>
						<Typography variant="h6" gutterBottom>
							Cảm ơn bạn đã gửi yêu cầu báo giá!
						</Typography>
						<Typography variant="body1">
							Chúng tôi đã nhận được thông tin và sẽ liên hệ với bạn trong thời gian sớm nhất.
						</Typography>
					</Alert>
					<Button
						variant="outlined"
						color="primary"
						onClick={() => setSubmitSuccess(false)}
						fullWidth
					>
						Gửi yêu cầu khác
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardContent>
				<Typography variant="h5" fontWeight="bold" gutterBottom>
					Đăng ký nhận báo giá
				</Typography>
				<Typography variant="body2" color="text.secondary" mb={3}>
					Vui lòng điền đầy đủ thông tin bên dưới, chúng tôi sẽ liên hệ tư vấn báo giá cho bạn.
				</Typography>

				<form onSubmit={handleSubmit(onSubmit)}>
					<Grid container spacing={3}>
						{/* Customer Name */}
						<Grid item xs={12} md={6}>
							<Controller
								name="customerName"
								control={control}
								rules={{ required: "Vui lòng nhập tên khách hàng" }}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										label="Tên khách hàng *"
										error={!!errors.customerName}
										helperText={errors.customerName?.message}
									/>
								)}
							/>
						</Grid>

						{/* Company/Brand */}
						<Grid item xs={12} md={6}>
							<Controller
								name="companyBrand"
								control={control}
								render={({ field }) => (
									<TextField {...field} fullWidth label="Tên Công ty hoặc Brand (nếu có)" />
								)}
							/>
						</Grid>

						{/* Phone */}
						<Grid item xs={12} md={6}>
							<Controller
								name="phone"
								control={control}
								rules={{
									required: "Vui lòng nhập số điện thoại",
									pattern: {
										value: /^[0-9+()\s-]+$/,
										message: "Số điện thoại không hợp lệ",
									},
								}}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										label="Số điện thoại *"
										error={!!errors.phone}
										helperText={errors.phone?.message}
									/>
								)}
							/>
						</Grid>

						{/* Email */}
						<Grid item xs={12} md={6}>
							<Controller
								name="email"
								control={control}
								rules={{
									required: "Vui lòng nhập email",
									pattern: {
										value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
										message: "Email không hợp lệ",
									},
								}}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										label="Email *"
										type="email"
										error={!!errors.email}
										helperText={errors.email?.message}
									/>
								)}
							/>
						</Grid>

						{/* Usage Purpose */}
						<Grid item xs={12}>
							<FormControl component="fieldset" error={!!errors.usagePurpose}>
								<FormLabel component="legend">Mục đích sử dụng *</FormLabel>
								<Controller
									name="usagePurpose"
									control={control}
									rules={{ required: "Vui lòng chọn mục đích sử dụng" }}
									render={({ field }) => (
										<RadioGroup {...field}>
											<FormControlLabel
												value={UsagePurposeValue.KINH_DOANH}
												control={<Radio />}
												label="Kinh doanh"
											/>
											<FormControlLabel
												value={UsagePurposeValue.CA_NHAN}
												control={<Radio />}
												label="Cá nhân"
											/>
											<FormControlLabel
												value={UsagePurposeValue.NHAN_DAN_BAO_BI}
												control={<Radio />}
												label="Nhãn dán bao bì"
											/>
											<FormControlLabel
												value={UsagePurposeValue.STICKER}
												control={<Radio />}
												label="Sticker"
											/>
											<FormControlLabel
												value={UsagePurposeValue.OTHER}
												control={<Radio />}
												label="Khác"
											/>
										</RadioGroup>
									)}
								/>
								{errors.usagePurpose && (
									<Typography variant="caption" color="error">
										{errors.usagePurpose.message}
									</Typography>
								)}
							</FormControl>
						</Grid>

						{/* Other Purpose Detail */}
						{usagePurpose === UsagePurposeValue.OTHER && (
							<Grid item xs={12}>
								<Controller
									name="usagePurposeOtherDetail"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											fullWidth
											multiline
											rows={2}
											label="Vui lòng mô tả mục đích sử dụng"
										/>
									)}
								/>
							</Grid>
						)}

						{/* Design Status */}
						<Grid item xs={12}>
							<FormControl component="fieldset">
								<FormLabel component="legend">Bạn đã có thiết kế chưa?</FormLabel>
								<Controller
									name="designStatus"
									control={control}
									render={({ field }) => (
										<RadioGroup {...field}>
											<FormControlLabel
												value={DesignStatusValue.HAVE_DESIGN}
												control={<Radio />}
												label="Đã có, chỉ cần tư vấn in ấn"
											/>
											<FormControlLabel
												value={DesignStatusValue.NEED_DESIGN_AND_PRINT}
												control={<Radio />}
												label="Chưa có, cần tư vấn thiết kế và in ấn"
											/>
										</RadioGroup>
									)}
								/>
							</FormControl>
						</Grid>

						{/* Priority Level */}
						<Grid item xs={12}>
							<FormControl component="fieldset">
								<FormLabel component="legend">Mức độ ưu tiên</FormLabel>
								<Controller
									name="priorityLevel"
									control={control}
									render={({ field }) => (
										<RadioGroup {...field}>
											<FormControlLabel
												value={PriorityLevelValue.BINH_THUONG}
												control={<Radio />}
												label="Bình thường"
											/>
											<FormControlLabel
												value={PriorityLevelValue.GAP}
												control={<Radio />}
												label="Gấp (vui lòng điền ngày bạn cần)"
											/>
										</RadioGroup>
									)}
								/>
							</FormControl>
						</Grid>

						{/* Urgent Date */}
						{priorityLevel === PriorityLevelValue.GAP && (
							<Grid item xs={12} md={6}>
								<Controller
									name="urgentDate"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											fullWidth
											type="date"
											label="Ngày cần"
											InputLabelProps={{ shrink: true }}
										/>
									)}
								/>
							</Grid>
						)}

						{/* Notes */}
						<Grid item xs={12}>
							<Typography variant="body2" color="text.secondary" mb={1}>
								Ghi chú thêm
							</Typography>
							<Controller
								name="notes"
								control={control}
								render={({ field }) => (
									<TextareaAutosize
										{...field}
										minRows={3}
										placeholder="Nhập ghi chú của bạn..."
										style={{
											width: "100%",
											padding: "12px",
											fontSize: "1rem",
											fontFamily: "inherit",
											borderRadius: "4px",
											border: "1px solid",
											borderColor: "rgba(0, 0, 0, 0.23)",
											resize: "vertical",
											backgroundColor: "transparent",
											color: "inherit",
										}}
										onFocus={(e) => {
											e.target.style.outlineColor = COLOR_CODE.PRIMARY;
										}}
										onBlur={(e) => {
											e.target.style.outlineColor = "rgba(0, 0, 0, 0.23)";
										}}
									/>
								)}
							/>
						</Grid>

						{/* Submit Button */}
						<Grid item xs={12}>
							<Button
								type="submit"
								variant="contained"
								color="primary"
								size="large"
								fullWidth
								disabled={isSubmitting}
								startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
							>
								{isSubmitting ? "Đang gửi..." : "Gửi yêu cầu báo giá"}
							</Button>
						</Grid>
					</Grid>
				</form>
			</CardContent>
		</Card>
	);
}
