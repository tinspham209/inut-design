import { SanityImage } from './image';

export type SanitySlug = {
	current: string;
	_type: string;
};

export type Product = {
	details: string;
	image: SanityImage[];
	name: string;
	productType: {
		_ref: string;
		_type: string;
	};
	slug: SanitySlug;
	special: boolean;
	_createAt: string;
	_id: string;
	_rev: string;
	_type: string;
	_updatedAt: string;
};

export type Products = Product[];

export type ProductType = {
	name: string;
	slug: SanitySlug;
	_createdAt: string;
	_id: string;
	_rev: string;
	_type: string;
	_updatedAt: string;
};
