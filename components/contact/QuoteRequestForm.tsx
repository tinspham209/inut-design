import { useSubmitQuoteRequest } from "@/hooks/useSubmitQuoteRequest";
import { useTelegramQuoteNotification } from "@/hooks/useTelegramQuoteNotification";
import {
	CreateQuoteRequestInput,
	DesignStatusValue,
	PriorityLevelValue,
	UsagePurposeValue,
} from "@/models/quoteRequest";
import { COLOR_CODE } from "@/utils";
import { trackFormSubmit } from "@/utils/analytics";
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
	MenuItem,
	Radio,
	RadioGroup,
	TextareaAutosize,
	TextField,
	Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const USAGE_PURPOSE_OPTIONS = [
	{ title: "Kinh doanh", value: UsagePurposeValue.KINH_DOANH },
	{ title: "Cá nhân", value: UsagePurposeValue.CA_NHAN },
	{ title: "Nhãn dán bao bì", value: UsagePurposeValue.NHAN_DAN_BAO_BI },
	{ title: "Sticker", value: UsagePurposeValue.STICKER },
	{ title: "In ảnh", value: UsagePurposeValue.IN_ANH },
	{ title: "Bảng cứng in thông tin", value: UsagePurposeValue.BANG_CUNG_IN_THONG_TIN },
	{ title: "Móc khóa mica", value: UsagePurposeValue.MOC_KHOA_MICA },
	{ title: "Pin cài áo mica", value: UsagePurposeValue.PIN_CAI_AO_MICA },
	{ title: "Acrylic magnet", value: UsagePurposeValue.ACRYLIC_MAGNET },
	{ title: "Sticker sheet", value: UsagePurposeValue.STICKER_SHEET },
	{ title: "Sticker magnet", value: UsagePurposeValue.STICKER_MAGNET },
	{ title: "Sticker diecut", value: UsagePurposeValue.STICKER_DIECUT },
	{ title: "Sticker kisscut", value: UsagePurposeValue.STICKER_KISSCUT },
	{ title: "Skin laptop custom theo yêu cầu", value: UsagePurposeValue.LAPTOP_CUSTOMIZE },
	{ title: "Skin phone custom theo yêu cầu", value: UsagePurposeValue.PHONE_CUSTOMIZE },
	{ title: "Bật lửa custom theo yêu cầu", value: UsagePurposeValue.LIGHTER_CUSTOMIZE },
	{ title: "Nút phím custom theo yêu cầu", value: UsagePurposeValue.MACNUT_CUSTOMIZE },
	{ title: "Khác", value: UsagePurposeValue.OTHER },
];

export default function QuoteRequestFormComponent() {
	const { submit, isSubmitting } = useSubmitQuoteRequest();
	const { sendNotification } = useTelegramQuoteNotification();
	const [submitSuccess, setSubmitSuccess] = React.useState(false);

	const router = useRouter();
	const fromQuery = router.query.from as string;

	const {
		control,
		handleSubmit,
		watch,
		reset,
		setValue,
		formState: { errors },
	} = useForm<CreateQuoteRequestInput>({
		defaultValues: {
			customerName: "",
			companyBrand: "",
			phone: "",
			email: "",
			usagePurpose: undefined,
			usagePurposeOtherDetail: "",
			receiveQuoteChannel: undefined,
			receiveQuoteChannelOtherDetail: "",
			designStatus: undefined,
			priorityLevel: undefined,
			urgentDate: "",
			notes: "",
		},
	});

	const usagePurpose = watch("usagePurpose");
	const receiveQuoteChannel = watch("receiveQuoteChannel");
	const priorityLevel = watch("priorityLevel");

	useEffect(() => {
		if (fromQuery && Object.values(UsagePurposeValue).includes(fromQuery as UsagePurposeValue)) {
			setValue("usagePurpose", fromQuery as UsagePurposeValue, { shouldValidate: true });
		}
	}, [fromQuery, setValue]);

	const onSubmit = async (data: CreateQuoteRequestInput) => {
		try {
			const result = await submit(data);

			// Track successful quote request submission
			trackFormSubmit("quote_request");

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
							<Controller
								name="usagePurpose"
								control={control}
								rules={{ required: "Vui lòng chọn mục đích sử dụng" }}
								render={({ field }) => (
									<TextField
										{...field}
										select
										fullWidth
										label="Mục đích sử dụng *"
										error={!!errors.usagePurpose}
										helperText={errors.usagePurpose?.message}
										value={field.value || ""}
									>
										{USAGE_PURPOSE_OPTIONS.map((option) => (
											<MenuItem key={option.value} value={option.value}>
												{option.title}
											</MenuItem>
										))}
									</TextField>
								)}
							/>
						</Grid>

						{/* Other Purpose Detail */}
						{usagePurpose === UsagePurposeValue.OTHER && (
							<Grid item xs={12}>
								<Controller
									name="usagePurposeOtherDetail"
									control={control}
									rules={{ required: "Vui lòng mô tả mục đích sử dụng" }}
									render={({ field }) => (
										<TextField
											{...field}
											fullWidth
											multiline
											rows={2}
											label="Vui lòng mô tả mục đích sử dụng *"
											error={!!errors.usagePurposeOtherDetail}
											helperText={errors.usagePurposeOtherDetail?.message}
										/>
									)}
								/>
							</Grid>
						)}

						{/* Receive Quote Channel */}
						<Grid item xs={12}>
							<FormControl component="fieldset" error={!!errors.receiveQuoteChannel}>
								<FormLabel component="legend">Nhận bảng báo giá qua kênh *</FormLabel>
								<Controller
									name="receiveQuoteChannel"
									control={control}
									rules={{ required: "Vui lòng chọn kênh nhận báo giá" }}
									render={({ field }) => (
										<RadioGroup {...field} row>
											<FormControlLabel value="email" control={<Radio />} label="Email" />
											<FormControlLabel value="zalo" control={<Radio />} label="Zalo" />
											<FormControlLabel value="other" control={<Radio />} label="Khác" />
										</RadioGroup>
									)}
								/>
								{errors.receiveQuoteChannel && (
									<Typography variant="caption" color="error">
										{errors.receiveQuoteChannel.message}
									</Typography>
								)}
							</FormControl>
						</Grid>

						{/* Other Receive Quote Channel Detail */}
						{receiveQuoteChannel === "other" && (
							<Grid item xs={12}>
								<Controller
									name="receiveQuoteChannelOtherDetail"
									control={control}
									rules={{ required: "Vui lòng nhập nền tảng nhận báo giá" }}
									render={({ field }) => (
										<TextField
											{...field}
											fullWidth
											label="Vui lòng nhập nền tảng bạn muốn *"
											error={!!errors.receiveQuoteChannelOtherDetail}
											helperText={errors.receiveQuoteChannelOtherDetail?.message}
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
