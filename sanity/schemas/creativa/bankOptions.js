const banks = [
	{ code: "TCB", name: "Ngân hàng TMCP Kỹ thương Việt Nam", shortName: "Techcombank" },
	{ code: "COOPBANK", name: "Ngân hàng Hợp tác xã Việt Nam", shortName: "COOPBANK" },
	{ code: "ACB", name: "Ngân hàng TMCP Á Châu", shortName: "ACB" },
	{ code: "KBHN", name: "Ngân hàng Kookmin - Chi nhánh Hà Nội", shortName: "KookminHN" },
	{ code: "IBK", name: "Ngân hàng Công nghiệp Hàn Quốc", shortName: "IBK" },
	{ code: "VAB", name: "Ngân hàng TMCP Việt Á", shortName: "VietABank" },
	{ code: "MSB", name: "Ngân hàng TMCP Hàng Hải", shortName: "MSB" },
	{ code: "ABB", name: "Ngân hàng TMCP An Bình", shortName: "ABBANK" },
	{ code: "LIOBANK", name: "Ngân hàng số LioBank", shortName: "LioBank" },
	{ code: "VPB", name: "Ngân hàng TMCP Việt Nam Thịnh Vượng", shortName: "VPBank" },
	{ code: "CBB", name: "Ngân hàng Thương mại TNHH MTV Xây dựng Việt Nam", shortName: "CBBank" },
	{
		code: "KPB",
		name: "Ngân hàng Đại chúng Kasikornbank - Chi nhánh TP. Hồ Chí Minh",
		shortName: "KBank",
	},
	{ code: "WRB", name: "Ngân hàng TNHH MTV Woori Việt Nam", shortName: "Woori" },
	{ code: "HSBC", name: "Ngân hàng TNHH MTV HSBC (Việt Nam)", shortName: "HSBC" },
	{ code: "BNPHCM", name: "Ngân hàng BNP Paribas - Chi nhánh TP. Hồ Chí Minh", shortName: "BNPHCM" },
	{ code: "GPB", name: "Ngân hàng Thương mại TNHH MTV Dầu Khí Toàn Cầu", shortName: "GPBank" },
	{ code: "PBVN", name: "Ngân hàng TNHH MTV Public Việt Nam", shortName: "PublicBank" },
	{ code: "CAKE", name: "TMCP Việt Nam Thịnh Vượng - Ngân hàng số CAKE by VPBank", shortName: "CAKE" },
	{ code: "VTB", name: "Ngân hàng TMCP Công thương Việt Nam", shortName: "Vietinbank" },
	{ code: "BVB", name: "Ngân hàng TMCP Bảo Việt", shortName: "BaoVietBank" },
	{ code: "HONGLEONG", name: "Ngân hàng TNHH MTV Hongleong Việt Nam", shortName: "HongLeong" },
	{ code: "KEBHCM", name: "Ngân hàng Keb Hana - Chi nhánh TP. Hồ Chí Minh", shortName: "KEBHanaHCMBank" },
	{ code: "BNPHN", name: "Ngân hàng BNP Paribas - Chi nhánh Hà Nội", shortName: "BNPHN" },
	{ code: "VIB", name: "Ngân hàng TMCP Quốc tế Việt Nam", shortName: "VIB" },
	{ code: "VRB", name: "Ngân hàng Liên doanh Việt - Nga", shortName: "VRB" },
	{ code: "OCB", name: "Ngân hàng TMCP Phương Đông", shortName: "OCB" },
	{ code: "BAB", name: "Ngân hàng TMCP Bắc Á", shortName: "BacABank" },
	{
		code: "KBHCM",
		name: "Ngân hàng Kookmin - Chi nhánh Thành phố Hồ Chí Minh",
		shortName: "KookminHCM",
	},
	{ code: "DAB", name: "Ngân hàng TMCP Đông Á", shortName: "DongABank" },
	{ code: "CITIBANK", name: "Ngân hàng Citibank - Chi nhánh Hà Nội", shortName: "CitibankHN" },
	{ code: "NCB", name: "Ngân hàng TMCP Quốc Dân", shortName: "NCB" },
	{ code: "VCAB", name: "Ngân hàng TMCP Bản Việt", shortName: "VietCapitalBank" },
	{ code: "DBS", name: "DBS Bank Ltd - Chi nhánh Thành phố Hồ Chí Minh", shortName: "DBSBank" },
	{ code: "NHB", name: "Ngân hàng Nonghyup - Chi nhánh Hà Nội", shortName: "Nonghyup" },
	{
		code: "VTLMONEY",
		name: "Tổng Công ty Dịch vụ số Viettel - Chi nhánh tập đoàn công nghiệp viễn thông Quân Đội",
		shortName: "ViettelMoney",
	},
	{ code: "LPB", name: "Ngân hàng TMCP Lộc Phát Việt Nam", shortName: "LPBank" },
	{ code: "STB", name: "Ngân hàng TMCP Sài Gòn Thương Tín", shortName: "Sacombank" },
	{
		code: "Ubank",
		name: "TMCP Việt Nam Thịnh Vượng - Ngân hàng số Ubank by VPBank",
		shortName: "Ubank",
	},
	{ code: "SHINHAN", name: "Ngân hàng TNHH MTV Shinhan Việt Nam", shortName: "ShinhanBank" },
	{ code: "SBC", name: "Ngân hàng TMCP Sài Gòn Công Thương", shortName: "SaigonBank" },
	{
		code: "AGR",
		name: "Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam",
		shortName: "Agribank",
	},
	{ code: "HDB", name: "Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh", shortName: "HDBank" },
	{ code: "PGB", name: "Ngân hàng TMCP Xăng dầu Petrolimex", shortName: "PGBank" },
	{ code: "MB", name: "Ngân hàng TMCP Quân đội", shortName: "MBBank" },
	{ code: "BIDC", name: "Ngân hàng Đầu tư và Phát triển Campuchia – Chi nhánh Hà Nội", shortName: "BIDC" },
	{ code: "SAB", name: "Ngân hàng TMCP Đông Nam Á", shortName: "SeABank" },
	{
		code: "VNPTMONEY",
		name: "Trung tâm dịch vụ tài chính số VNPT- Chi nhánh Tổng công ty truyền thông (VNPT Fintech)",
		shortName: "VNPTMoney",
	},
	{ code: "SHB", name: "Ngân hàng TMCP Sài Gòn - Hà Nội", shortName: "SHB" },
	{ code: "NAB", name: "Ngân hàng TMCP Nam Á", shortName: "NamABank" },
	{
		code: "CUBHCM",
		name: "Ngân hàng Cathay United Bank – Chi nhánh TP. Hồ Chí Minh",
		shortName: "CathayUnitedBank",
	},
	{ code: "PVCB", name: "Ngân hàng TMCP Đại Chúng Việt Nam", shortName: "PVcomBank" },
	{ code: "VBC", name: "Ngân hàng TMCP Việt Nam Thương Tín", shortName: "VietBank" },
	{ code: "UOB", name: "Ngân hàng United Overseas - Chi nhánh TP. Hồ Chí Minh", shortName: "UnitedOverseas" },
	{ code: "TPB", name: "Ngân hàng TMCP Tiên Phong", shortName: "TPBank" },
	{ code: "UMEE", name: "Ngân hàng số Umee – Kiên Long Bank", shortName: "KienLongBank" },
	{ code: "CIMB", name: "Ngân hàng TNHH MTV CIMB Việt Nam", shortName: "CIMB" },
	{ code: "KLB", name: "Ngân hàng TMCP Kiên Long", shortName: "KienLongBank" },
	{ code: "VCB", name: "Ngân hàng TMCP Ngoại Thương Việt Nam", shortName: "Vietcombank" },
	{ code: "TIMO", name: "Ngân hàng số Timo by Ban Viet Bank (Timo by Ban Viet Bank)", shortName: "Timo" },
	{ code: "IVB", name: "Ngân hàng TNHH Indovina", shortName: "IndovinaBank" },
	{ code: "SCB", name: "Ngân hàng TMCP Sài Gòn", shortName: "SCB" },
	{ code: "BIDV", name: "Ngân hàng TMCP Đầu tư và Phát triển Việt Nam", shortName: "BIDV" },
	{ code: "EIB", name: "Ngân hàng TMCP Xuất Nhập khẩu Việt Nam", shortName: "Eximbank" },
	{
		code: "SCVN",
		name: "Ngân hàng TNHH MTV Standard Chartered Bank Việt Nam",
		shortName: "StandardChartered",
	},
	{ code: "MBV", name: "Ngân hàng Thương mại TNHH MTV Đại Dương", shortName: "Oceanbank" },
	{ code: "KEBHN", name: "Ngân hàng Keb Hana - Chi nhánh Hà Nội", shortName: "KEBHanaHNBank" },
];

const uniqueOptions = (key) =>
	Array.from(
		new Map(
			banks.map((bank) => [
				bank[key],
				{ title: bank[key], value: bank[key] },
			])
		).values()
	);

export const bankNameOptions = banks.map(({ code, name }) => ({
	title: `${name} (${code})`,
	value: name,
}));
export const bankShortNameOptions = uniqueOptions("shortName");
export const bankCodeOptions = banks.map(({ code, shortName }) => ({
	title: `${shortName} (${code})`,
	value: code,
}));
