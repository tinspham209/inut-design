import React from "react";
import FormField from "part:@sanity/components/formfields/default";
import Select from "part:@sanity/components/selects/default";
import { withDocument } from "part:@sanity/form-builder";
import PatchEvent, { set, unset } from "part:@sanity/form-builder/patch-event";

const STATUS_GUIDE = {
	pending: 'Bước tiếp theo: Sau khi đã gọi/chốt đơn với khách, chuyển sang "Confirmed".',
	confirmed: 'Bước tiếp theo: Khi bắt đầu đóng hàng, chuyển sang "Processing".',
	processing: 'Bước tiếp theo: Khi đóng hàng xong và có mã vận đơn, chuyển sang "In transit".',
	in_transit: 'Bước tiếp theo: Khi giao hàng thành công, chuyển sang "Completed".',
	completed: "Đơn đã hoàn tất. Chỉ cập nhật lại khi có phát sinh đặc biệt.",
	cancelled: "Đơn đã hủy. Chỉ mở lại quy trình nếu tạo đơn mới hoặc có xác nhận lại từ khách.",
};

function StatusSelectWithGuide(props) {
	const { type, value, onChange, readOnly, markers, presence, compareValue, document } = props;
	const options = type?.options?.list || [];
	const items = options.map((option) => ({ title: option.title, value: option.value }));
	const currentItem = items.find((item) => item.value === value);
	const currentStatus = document?.status || value;
	const dynamicGuide =
		STATUS_GUIDE[currentStatus] ||
		"Chọn trạng thái phù hợp theo tiến độ xử lý đơn để team theo dõi chính xác.";

	const handleChange = (nextItem) => {
		const nextValue = nextItem?.value;
		onChange(PatchEvent.from(typeof nextValue === "undefined" ? unset() : set(nextValue)));
	};

	return (
		<FormField
			label={type.title}
			description={dynamicGuide}
			markers={markers}
			presence={presence}
			compareValue={compareValue}
		>
			<Select value={currentItem} items={items} onChange={handleChange} readOnly={readOnly} />
		</FormField>
	);
}

export default withDocument(StatusSelectWithGuide);
