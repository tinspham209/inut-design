/* eslint-disable @typescript-eslint/no-explicit-any */
export const isEmpty = (value): boolean =>
	value === undefined ||
	value === null ||
	(typeof value === "object" && Object.keys(value).length === 0) ||
	(typeof value === "string" && value === "") ||
	(Array.isArray(value) && value.length === 0);

// eslint-disable-next-line no-unused-vars
export type Callback = (...args: any[]) => void;

export * from "./create-emotion-cache";
export * from "./theme";
export * from "./posts";
export * from "./date";
export * from "./error";
