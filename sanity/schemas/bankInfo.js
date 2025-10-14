export default {
	name: "bankInfo",
	title: "Bank Information 🏦",
	type: "document",
	fields: [
		// Display Name
		{
			name: "name",
			title: "Display Name",
			type: "string",
			description: "Display name for this bank account (e.g., 'Primary Account', 'VCB - Business')",
			validation: (Rule) => Rule.required(),
		},
		{
			name: "image",
			title: "QR Code / Bank Logo",
			type: "image",
			description: "QR code for payment or bank logo",
			options: {
				hotspot: true,
			},
		},

		// Bank Details
		{
			name: "bankName",
			title: "Bank Name",
			type: "string",
			description: "Full name of the bank (e.g., Vietcombank, Techcombank, MB Bank)",
			validation: (Rule) => Rule.required(),
		},
		{
			name: "bankShortName",
			title: "Bank Short Name",
			type: "string",
			description: "Bank code or short name (e.g., VCB, TCB, MB)",
			validation: (Rule) => Rule.required(),
		},
		{
			name: "accountNumber",
			title: "Account Number",
			type: "string",
			description: "Bank account number",
			validation: (Rule) => Rule.required(),
		},
		{
			name: "accountHolderName",
			title: "Account Holder Name",
			type: "string",
			description: "Full name of the account holder as registered with the bank",
			validation: (Rule) => Rule.required(),
		},

		// Status & Display
		{
			name: "isActive",
			title: "Active Status",
			type: "boolean",
			description: "Set to active to display this bank account for payments",
			initialValue: true,
		},
		{
			name: "isPrimary",
			title: "Primary Account",
			type: "boolean",
			description: "Set as primary account (will be displayed first)",
			initialValue: false,
		},
		{
			name: "displayOrder",
			title: "Display Order",
			type: "number",
			description: "Order in which this bank account appears (lower numbers appear first)",
			validation: (Rule) => Rule.min(0),
			initialValue: 0,
		},

		// Notes
		{
			name: "notes",
			title: "Internal Notes",
			type: "text",
			description: "Internal notes or instructions (not visible to customers)",
		},

		// Metadata
		{
			name: "createdAt",
			title: "Created At",
			type: "datetime",
			description: "When this bank account was added",
			initialValue: () => new Date().toISOString(),
			readOnly: true,
		},
	],

	// Preview Configuration
	preview: {
		select: {
			name: "name",
			accountHolderName: "accountHolderName",
			bankName: "bankName",
			bankShortName: "bankShortName",
			accountNumber: "accountNumber",
			isActive: "isActive",
			isPrimary: "isPrimary",
			image: "image",
		},
		prepare(selection) {
			const {
				name,
				accountHolderName,
				bankName,
				bankShortName,
				accountNumber,
				isActive,
				isPrimary,
				image,
			} = selection;

			// Format account number to show only last 4 digits
			const maskedAccount = accountNumber ? `****${accountNumber.slice(-4)}` : "No account number";

			// Status indicators
			const statusEmoji = isActive ? "✅" : "⏸️";
			const primaryEmoji = isPrimary ? "⭐" : "";

			return {
				title: `${statusEmoji} ${primaryEmoji} ${name}`,
				subtitle: `${accountHolderName} - ${bankShortName || bankName} - ${maskedAccount}`,
				media: image,
			};
		},
	},

	// Ordering
	orderings: [
		{
			title: "Display Order",
			name: "displayOrder",
			by: [
				{ field: "displayOrder", direction: "asc" },
				{ field: "isPrimary", direction: "desc" },
			],
		},
		{
			title: "Bank Name",
			name: "bankName",
			by: [{ field: "bankName", direction: "asc" }],
		},
		{
			title: "Recently Added",
			name: "createdAtDesc",
			by: [{ field: "createdAt", direction: "desc" }],
		},
	],
};
