import * as yup from "yup";
import { CREATIVA_PUBLIC_ID, CreativaError, parseCustomer } from "@/utils/creativa/contracts";
import type { CreativaCustomer } from "@/models/creativa";

function customerField(field: keyof CreativaCustomer) {
	return yup
		.string()
		.strict()
		.defined()
		.test("customer-contract", function validate(value) {
			try {
				parseCustomer({ name: "Customer", phone: "0901234567", [field]: value });
				return true;
			} catch (error) {
				if (error instanceof CreativaError && error.fieldErrors?.[field])
					return this.createError({ message: error.fieldErrors[field] });
				throw error;
			}
		});
}

export const creativaCheckoutSchema = yup.object({
	name: customerField("name"),
	phone: customerField("phone"),
	email: customerField("email"),
	address: customerField("address"),
	note: customerField("note"),
	paymentMethod: yup
		.mixed<"cod" | "bank_transfer">()
		.oneOf(["cod", "bank_transfer"], "Vui lòng chọn phương thức thanh toán.")
		.required("Vui lòng chọn phương thức thanh toán."),
});

export type CreativaCheckoutForm = yup.InferType<typeof creativaCheckoutSchema>;

export const creativaQuantitySchema = yup
	.number()
	.typeError("Số lượng phải là số nguyên dương hợp lệ.")
	.required("Vui lòng nhập số lượng.")
	.test(
		"safe-quantity",
		"Số lượng phải là số nguyên dương hợp lệ.",
		(value) => Number.isSafeInteger(value) && value > 0
	);

export const creativaProductSchema = yup.object({
	modelId: yup.string().required("Vui lòng chọn mẫu MacBook."),
	coverageId: yup.string().defined(),
	quantity: creativaQuantitySchema,
});

export const creativaSearchSchema = yup.object({
	query: yup.string().defined().max(80, "Vui lòng nhập tối đa 80 ký tự."),
});

export const creativaReferenceSchema = yup.object({
	reference: yup
		.string()
		.trim()
		.required("Vui lòng nhập mã đơn hàng.")
		.matches(CREATIVA_PUBLIC_ID, "Mã Creativa gồm đúng 10 ký tự chữ, số, dấu _ hoặc -."),
});
