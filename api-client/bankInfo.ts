import { BankInfo } from "@/models/bankInfo";
import { client } from "./sanity-client";

export const bankInfoApi = {
	/**
	 * Get all active bank accounts ordered by display order and primary status
	 */
	async getActiveBankAccounts(): Promise<BankInfo[]> {
		const query = `*[_type == "bankInfo" && isActive == true] | order(isPrimary desc, displayOrder asc)`;
		const bankAccounts = await client.fetch(query);
		return bankAccounts;
	},

	/**
	 * Get all bank accounts (including inactive)
	 */
	async getAllBankAccounts(): Promise<BankInfo[]> {
		const query = `*[_type == "bankInfo"] | order(isPrimary desc, displayOrder asc)`;
		const bankAccounts = await client.fetch(query);
		return bankAccounts;
	},

	/**
	 * Get primary bank account
	 */
	async getPrimaryBankAccount(): Promise<BankInfo | null> {
		const query = `*[_type == "bankInfo" && isPrimary == true && isActive == true][0]`;
		const bankAccount = await client.fetch(query);
		return bankAccount;
	},

	/**
	 * Get bank account by ID
	 */
	async getBankAccountById(id: string): Promise<BankInfo | null> {
		const query = `*[_type == "bankInfo" && _id == $id][0]`;
		const bankAccount = await client.fetch(query, { id });
		return bankAccount;
	},

	/**
	 * Get bank accounts by bank name
	 */
	async getBankAccountsByBankName(bankName: string): Promise<BankInfo[]> {
		const query = `*[_type == "bankInfo" && bankName match $bankName && isActive == true] | order(displayOrder asc)`;
		const bankAccounts = await client.fetch(query, { bankName: `*${bankName}*` });
		return bankAccounts;
	},
};
