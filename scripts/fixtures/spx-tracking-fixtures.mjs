/* eslint-disable camelcase */
export const TRACKING_CODES = {
	delivered: "SPXVN100000000001",
	returning: "SPXVN100000000002",
	replacement: "SPXVN100000000003",
	returned: "SPXVN100000000004",
};

export const EVENT_TIMESTAMPS = {
	old: 1787800000,
	newest: 1787911541,
	dateBoundary: Math.floor(Date.parse("2026-01-01T18:30:00.000Z") / 1000),
};

function record(overrides = {}) {
	return {
		tracking_code: "F100",
		tracking_name: "In Transit",
		description: "Đơn hàng đang được vận chuyển",
		seller_description: "Đơn hàng đang được vận chuyển",
		milestone_name: "In Transit",
		actual_time: EVENT_TIMESTAMPS.old,
		...overrides,
	};
}

function response(group, subgroup, records) {
	return {
		retcode: 0,
		data: {
			order_info: {
				tracking_code_group_name: group,
				tracking_code_subgroup_name: subgroup,
			},
			sls_tracking_info: { records },
		},
	};
}

export const deliveredFixture = response("Delivered", "Delivered", [
	record({
		tracking_code: "F980",
		tracking_name: "Delivered",
		seller_description: "Giao hàng thành công",
		milestone_name: "Delivered",
		actual_time: EVENT_TIMESTAMPS.newest,
	}),
]);

export const returningFixture = response("Return", "Returning", [
	record({
		tracking_code: "R200",
		tracking_name: "Returning",
		seller_description: "Đơn hàng đang được hoàn về kho",
		milestone_name: "Returning",
		actual_time: EVENT_TIMESTAMPS.newest,
	}),
]);

// Canonical terminal return: order-info group is exactly "Return" and subgroup
// is exactly "Returned". Only this exact combination should cancel the order.
export const returnedFixture = response("Return", "Returned", [
	record({
		tracking_code: "R980",
		tracking_name: "Returned",
		seller_description: "Đơn hàng đã hoàn trả thành công",
		milestone_name: "Returned",
		actual_time: EVENT_TIMESTAMPS.newest,
	}),
]);

// A seller_description that mentions a completed return in Vietnamese, while the
// canonical group/subgroup remain non-terminal. Description text alone must never
// cancel an order.
export const descriptionOnlyReturnFixture = response("In Transit", "Transporting", [
	record({
		tracking_code: "F150",
		tracking_name: "In Transit",
		seller_description: "Đơn hàng đã hoàn trả thành công",
		milestone_name: "In Transit",
		actual_time: EVENT_TIMESTAMPS.newest,
	}),
]);

export const unsortedHistoryFixture = response("In Transit", "Transporting", [
	record({
		tracking_code: "NEWEST",
		seller_description: "Sự kiện mới nhất",
		actual_time: EVENT_TIMESTAMPS.newest,
	}),
	record({
		tracking_code: "OLDEST",
		seller_description: "Sự kiện cũ",
		actual_time: EVENT_TIMESTAMPS.old,
	}),
]);

export const invalidCodeFixture = {
	retcode: 10003,
	message: "synthetic not found",
	data: {},
};

export const conflictingStatusFixture = response("Delivered", "Return", [
	record({
		tracking_code: "CONFLICT",
		tracking_name: "Returning",
		milestone_name: "Returning",
		actual_time: EVENT_TIMESTAMPS.newest,
	}),
]);

export const emptyRecordsFixture = response("In Transit", "Transporting", []);

export const malformedResponseFixture = {
	retcode: 0,
	data: {
		order_info: {
			tracking_code_group_name: "In Transit",
		},
		sls_tracking_info: { records: [record()] },
	},
};

export const invalidTimestampFixture = response("In Transit", "Transporting", [
	record({ actual_time: -1 }),
]);
