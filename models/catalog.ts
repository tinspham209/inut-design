export type CatalogPage<T> = {
	items: T[];
	total: number;
	page: number;
	pageSize: number;
};
