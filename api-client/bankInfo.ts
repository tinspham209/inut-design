import { BankInfo } from "@/models/bankInfo";
import { client } from "./sanity-browser";

const BANK_INFO_FIELDS = `_id, _type, _createdAt, _updatedAt, name, image{_type, asset, crop, hotspot}, bankName, bankShortName, accountNumber, accountHolderName, isActive, isPrimary, displayOrder, notes, createdAt`;

export const bankInfoApi = {
	/**
	 * Get all active bank accounts ordered by display order and primary status
	 */
	async getActiveBankAccounts(): Promise<BankInfo[]> {
		const query = `*[_type == "bankInfo" && isActive == true]{${BANK_INFO_FIELDS}} | order(isPrimary desc, displayOrder asc)`;
		const bankAccounts = await client.fetch(query);
		return bankAccounts;
	},

	/**
	 * Get all bank accounts (including inactive)
	 */
	async getAllBankAccounts(): Promise<BankInfo[]> {
		const query = `*[_type == "bankInfo"]{${BANK_INFO_FIELDS}} | order(isPrimary desc, displayOrder asc)`;
		const bankAccounts = await client.fetch(query);
		return bankAccounts;
	},

	/**
	 * Get primary bank account
	 */
	async getPrimaryBankAccount(): Promise<BankInfo | null> {
		const query = `*[_type == "bankInfo" && isPrimary == true && isActive == true][0]{${BANK_INFO_FIELDS}}`;
		const bankAccount = await client.fetch(query);
		return bankAccount;
	},

	/**
	 * Get bank account by ID
	 */
	async getBankAccountById(id: string): Promise<BankInfo | null> {
		const query = `*[_type == "bankInfo" && _id == $id][0]{${BANK_INFO_FIELDS}}`;
		const bankAccount = await client.fetch(query, { id });
		return bankAccount;
	},

	/**
	 * Get bank accounts by bank name
	 */
	async getBankAccountsByBankName(bankName: string): Promise<BankInfo[]> {
		const query = `*[_type == "bankInfo" && bankName match $bankName && isActive == true]{${BANK_INFO_FIELDS}} | order(displayOrder asc)`;
		const bankAccounts = await client.fetch(query, { bankName: `*${bankName}*` });
		return bankAccounts;
	},
};
