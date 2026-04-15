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
	Autocomplete,
	Button,
	Card,
	CardContent,
	CircularProgress,
	FormControl,
	FormControlLabel,
	FormLabel,
	Grid,
	Link as MuiLink,
	Radio,
	RadioGroup,
	TextareaAutosize,
	TextField,
	Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

const USAGE_PURPOSE_OPTIONS = [
	{ title: "Bật lửa custom theo yêu cầu", value: UsagePurposeValue.LIGHTER_CUSTOMIZE },
	{ title: "Skin laptop custom theo yêu cầu", value: UsagePurposeValue.LAPTOP_CUSTOMIZE },
	{ title: "Nút phím custom theo yêu cầu", value: UsagePurposeValue.MACNUT_CUSTOMIZE },
	{ title: "Skin phone custom theo yêu cầu", value: UsagePurposeValue.PHONE_CUSTOMIZE },

	{ title: "Sticker", value: UsagePurposeValue.STICKER },
	{ title: "Sticker sheet", value: UsagePurposeValue.STICKER_SHEET },
	{ title: "Sticker magnet", value: UsagePurposeValue.STICKER_MAGNET },
	{ title: "Sticker diecut", value: UsagePurposeValue.STICKER_DIECUT },
	{ title: "Sticker kisscut", value: UsagePurposeValue.STICKER_KISSCUT },

	{ title: "Móc khóa mica", value: UsagePurposeValue.MOC_KHOA_MICA },
	{ title: "Pin cài áo mica", value: UsagePurposeValue.PIN_CAI_AO_MICA },
	{ title: "Acrylic magnet", value: UsagePurposeValue.ACRYLIC_MAGNET },

	{
		title: "Thiết kế in ấn cửa hàng trọn gói",
		value: UsagePurposeValue.THIET_KE_IN_AN_CUA_HANG_TRON_GOI,
	},
	{ title: "Sự Kiện Trọn Gói", value: UsagePurposeValue.SU_KIEN_TRON_GOI },

	{ title: "Banner & Standee", value: UsagePurposeValue.BANNER_STANDEE },
	{ title: "Poster & Decal", value: UsagePurposeValue.POSTER_DECAL },
	{ title: "Hashtag Cầm Tay", value: UsagePurposeValue.HASHTAG_CAM_TAY },

	{ title: "Thiết Kế & In Menu", value: UsagePurposeValue.THIET_KE_IN_MENU },
	{ title: "Decal Nhãn Mác", value: UsagePurposeValue.DECAL_NHAN_MAC },
	{ title: "Hộp Sản Phẩm", value: UsagePurposeValue.HOP_SAN_PHAM },
	{ title: "Tem Bảo Hành", value: UsagePurposeValue.TEM_BAO_HANH },
	{ title: "Nhãn dán bao bì", value: UsagePurposeValue.NHAN_DAN_BAO_BI },

	{ title: "In Card Visit", value: UsagePurposeValue.IN_CARD_VISIT },
	{ title: "In Catalogue, Brochure", value: UsagePurposeValue.CATALOGUE_BROCHURE },
	{
		title: "In Voucher, Vé Mời, Thẻ Tích Điểm, Tờ Rơi",
		value: UsagePurposeValue.IN_VOUCHER_VE_MOI_SU_KIEN_THE_TICH_DIEM,
	},
	{ title: "In Bì Thư", value: UsagePurposeValue.IN_BI_THU },
	{ title: "Giấy Khen & Giấy Chứng Nhận", value: UsagePurposeValue.GIAY_KHEN_GIAY_CHUNG_NHAN },
	{ title: "In ảnh", value: UsagePurposeValue.IN_ANH },
	{ title: "In Postcard", value: UsagePurposeValue.IN_POSTCARD },
	{ title: "Thank Card & Gift Card", value: UsagePurposeValue.THANK_CARD_GIFT_CARD },
	{ title: "Huy chương", value: UsagePurposeValue.HUY_CHUONG },
	{ title: "Sản Phẩm Decor", value: UsagePurposeValue.SAN_PHAM_DECOR },
	{ title: "Tấm Lót Bàn Ăn", value: UsagePurposeValue.TAM_LOT_BAN_AN },
	{ title: "Phiếu, Vé & Hóa Đơn GTGT", value: UsagePurposeValue.PHIEU_VE_HOA_DON_GTGT },
	{ title: "Sổ Tay, Kỷ Yếu & Sổ Bấm Ghim", value: UsagePurposeValue.SO_TAY_KY_YEU_SO_BAM_GHIM },
	{ title: "Bảng cứng in thông tin", value: UsagePurposeValue.BANG_CUNG_IN_THONG_TIN },

	{ title: "Kinh doanh", value: UsagePurposeValue.KINH_DOANH },
	{ title: "Cá nhân", value: UsagePurposeValue.CA_NHAN },
	{ title: "Khác", value: UsagePurposeValue.OTHER },
];

const DEVICE_MODEL_PURPOSE = [
	UsagePurposeValue.MACNUT_CUSTOMIZE,
	UsagePurposeValue.LAPTOP_CUSTOMIZE,
	UsagePurposeValue.PHONE_CUSTOMIZE,
];

export default function QuoteRequestFormComponent() {
	const { submit, isSubmitting } = useSubmitQuoteRequest();
	const { sendNotification } = useTelegramQuoteNotification();
	const [submitSuccess, setSubmitSuccess] = React.useState(false);

	const router = useRouter();
	const fromQuery = router.query.from as string;
	const noteQuery = router.query.note as string;

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
			quantity: 1,
			deviceModel: "",
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
		if (noteQuery) {
			setValue("notes", noteQuery, { shouldValidate: true });
		}
	}, [fromQuery, noteQuery, setValue]);

	const onSubmit = async (data: CreateQuoteRequestInput) => {
		try {
			const result = await submit(data);

			trackFormSubmit("quote_request", data.usagePurpose);

			toast.success("Gửi yêu cầu báo giá thành công!");

			// Send Telegram notification
			try {
				await sendNotification({ quoteData: result });
			} catch (telegramError) {
				console.error("Failed to send Telegram notification:", telegramError);
				// Don't fail the whole flow if Telegram fails
			}

			setSubmitSuccess(true);
			window.scrollTo(0, 0);
			reset();
		} catch (error) {
			console.error("Error submitting quote request:", error);
			toast.error("Có lỗi xảy ra. Vui lòng thử lại!");
		}
	};

	if (submitSuccess) {
		return (
			<Card sx={{ bgcolor: COLOR_CODE.INK_3, border: `1px solid ${COLOR_CODE.INK_4}` }}>
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
				<Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
					Vui lòng điền đầy đủ thông tin bên dưới, chúng tôi sẽ liên hệ tư vấn báo giá cho bạn.
				</Typography>

				<form onSubmit={handleSubmit(onSubmit)}>
					<Grid container spacing={1.5}>
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
						{receiveQuoteChannel === "email" && (
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
						)}

						{/* Usage Purpose */}
						<Grid item xs={12}>
							<Controller
								name="usagePurpose"
								control={control}
								rules={{ required: "Vui lòng chọn mục đích sử dụng" }}
								render={({ field: { onChange, value, ...field } }) => (
									<Autocomplete
										{...field}
										options={USAGE_PURPOSE_OPTIONS}
										getOptionLabel={(option) => option.title}
										value={USAGE_PURPOSE_OPTIONS.find((option) => option.value === value) || null}
										onChange={(_, newValue) => {
											onChange(newValue ? newValue.value : null);
											setValue("deviceModel", "");
										}}
										isOptionEqualToValue={(option, value) => option.value === value.value}
										renderInput={(params) => (
											<TextField
												{...params}
												label="Mục đích sử dụng *"
												error={!!errors.usagePurpose}
												helperText={errors.usagePurpose?.message}
												placeholder="Tìm kiếm hoặc chọn mục đích sử dụng"
											/>
										)}
										fullWidth
									/>
								)}
							/>
						</Grid>

						{/* Quantity */}
						<Grid item xs={12} md={6}>
							<Controller
								name="quantity"
								control={control}
								rules={{
									required: "Vui lòng nhập số lượng",
									min: { value: 1, message: "Số lượng phải lớn hơn hoặc bằng 1" },
									validate: (value) =>
										Number.isInteger(Number(value)) || "Số lượng phải là số nguyên",
								}}
								render={({ field }) => (
									<TextField
										{...field}
										fullWidth
										type="number"
										label="Số lượng *"
										error={!!errors.quantity}
										helperText={errors.quantity?.message}
										inputProps={{ min: 1, step: 1 }}
									/>
								)}
							/>
						</Grid>

						{/* Device Model (Conditional) */}
						{usagePurpose && DEVICE_MODEL_PURPOSE.includes(usagePurpose) && (
							<Grid item xs={12} md={6}>
								<Controller
									name="deviceModel"
									control={control}
									render={({ field }) => (
										<TextField
											{...field}
											fullWidth
											label="Model thiết bị"
											placeholder={"Ví dụ: MacBook Air 13, iPhone 15..."}
											helperText={
												<Link passHref href="/blog/huong-dan-xem-doi-may-ten-model-may-tinh-laptop">
													<MuiLink target="_blank">
														Hướng dẫn xem đời máy, tên model máy tính Laptop
													</MuiLink>
												</Link>
											}
										/>
									)}
								/>
							</Grid>
						)}

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
											<FormControlLabel value="phone" control={<Radio />} label="Số điện thoại" />
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
							<FormControl component="fieldset" error={!!errors.designStatus}>
								<FormLabel component="legend">Bạn đã có thiết kế chưa? *</FormLabel>
								<Controller
									name="designStatus"
									control={control}
									rules={{ required: "Vui lòng chọn trạng thái thiết kế" }}
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
								{errors.designStatus && (
									<Typography variant="caption" color="error">
										{errors.designStatus.message}
									</Typography>
								)}
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
									rules={{
										required: "Vui lòng chọn ngày bạn cần",
										validate: (value) => {
											if (!value) return true;
											const selectedDate = new Date(value);
											selectedDate.setHours(0, 0, 0, 0);
											const today = new Date();
											today.setHours(0, 0, 0, 0);
											return selectedDate >= today || "Ngày cần không hợp lệ";
										},
									}}
									render={({ field }) => (
										<TextField
											{...field}
											fullWidth
											type="date"
											label="Ngày cần"
											InputLabelProps={{ shrink: true }}
											inputProps={{ min: new Date().toISOString().split("T")[0] }}
											error={!!errors.urgentDate}
											helperText={errors.urgentDate?.message}
										/>
									)}
								/>
							</Grid>
						)}

						{/* Notes */}
						<Grid item xs={12}>
							<Typography variant="body2" sx={{ color: COLOR_CODE.TEXT_MUTED, mb: 1 }}>
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
											border: `1px solid rgba(0,0,0,0.23)`,
											resize: "vertical",
											backgroundColor: "transparent",
											color: "inherit",
										}}
										onFocus={(e) => {
											e.target.style.outlineColor = COLOR_CODE.PRIMARY;
										}}
										onBlur={(e) => {
											e.target.style.outlineColor = "rgba(0,0,0,0.23";
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
								{isSubmitting ? "Đang gửi..." : "Gửi yêu cầu báo giá - Phản hồi trong 15 phút"}
							</Button>
						</Grid>
					</Grid>
				</form>
			</CardContent>
		</Card>
	);
}
