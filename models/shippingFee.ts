export interface ShippingFee {
	_id: string;
	name: string;
	slug: string; // slug.current from Sanity
	fee: number;
	note?: string;
}
