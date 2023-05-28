import { Income } from "@/models";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const isEmpty = (value): boolean =>
	value === undefined ||
	value === null ||
	(typeof value === "object" && Object.keys(value).length === 0) ||
	(typeof value === "string" && value === "") ||
	(Array.isArray(value) && value.length === 0);

// eslint-disable-next-line no-unused-vars
export type Callback = (...args: any[]) => void;

type Price = Omit<Income, "id" | "createdAt" | "title" | "date">;

export const getPrice = ({ discount, matDay, matLung, matPhim, vienManHinh }: Price): number => {
	let price = 0;
	if (matDay) {
		price += 150;
	}
	if (matLung) {
		price += 120;
	}
	if (matPhim) {
		price += 180;
	}
	if (vienManHinh) {
		price += 100;
	}

	if (discount && discount !== 0) {
		const discountPercentage = discount / 100;
		price -= price * discountPercentage;
	}
	return price;
};

export const getSumPriceIncomes = (_incomes: Income[]): number => {
	let sum = 0;
	if (_incomes) {
		_incomes.forEach((income) => {
			sum += getPrice({
				discount: income.discount,
				matPhim: income.matPhim,
				matDay: income.matDay,
				matLung: income.matLung,
				vienManHinh: income.vienManHinh,
			});
		});
	}
	return sum;
};

export * from "./create-emotion-cache";
export * from "./theme";
export * from "./posts";
export * from "./date";
