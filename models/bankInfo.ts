import { SanityImage } from "./image";

export type BankInfo = {
	_id: string;
	_type: "bankInfo";
	_createdAt: string;
	_updatedAt: string;

	// Display & Identification
	name: string;
	image?: SanityImage;

	// Bank Details
	bankName: string;
	bankShortName: string;
	accountNumber: string;
	accountHolderName: string;

	// Status & Display
	isActive: boolean;
	isPrimary: boolean;
	displayOrder: number;

	// Notes
	notes?: string;

	// Metadata
	createdAt: string;
};

export type BankInfoInput = Omit<
	BankInfo,
	"_id" | "_type" | "_createdAt" | "_updatedAt" | "createdAt"
>;
