import sanityClient from "@sanity/client";
import fs from "fs/promises";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const SANITY_DIR = path.resolve(__dirname, "..");
const ENV_PATH = path.join(SANITY_DIR, ".env");
const SANITY_JSON_PATH = path.join(SANITY_DIR, "sanity.json");
const REPORTS_DIR = path.join(SANITY_DIR, "reports");

const VIETNAM_TIMEZONE = "Asia/Ho_Chi_Minh";
const VIETNAM_OFFSET_HOURS = 7;

const FORM_CONFIG = {
	quote: {
		key: "quote",
		type: "form-nhan-bao-gia",
		title: "Form Nhận Báo Giá 📝",
		dateField: "createdAt",
		titleField: "customerName",
		notesField: "usagePurpose",
		notesFallback: "notes",
	},
	ordersLighter: {
		key: "ordersLighter",
		type: "ordersLighter",
		title: "Orders - Lighters 🔥",
		dateField: "orderDate",
		titleField: "orderNumber",
		notesField: "status",
		notesFallback: null,
	},
	lighter: {
		key: "lighter",
		type: "ordersLighter",
		title: "Orders - Lighters 🔥",
		dateField: "orderDate",
		titleField: "orderNumber",
		notesField: "status",
		notesFallback: null,
	},
};

const ALL_CONFIG = {
	key: "all",
	title: "All Reports",
	forms: [FORM_CONFIG.quote, FORM_CONFIG.ordersLighter],
};

const ALL_FORM_KEYS = [FORM_CONFIG.quote.key, FORM_CONFIG.ordersLighter.key];

function printUsage() {
	console.log("Usage: node sanity/scripts/report.mjs [options]");
	console.log("");
	console.log("Options:");
	console.log(
		"  --form=<value>     Form type: quote | ordersLighter | lighter | all (default: all)"
	);
	console.log("  --start=YYYY-MM-DD Start date (default: first day of current month)");
	console.log("  --end=YYYY-MM-DD   End date (default: last day of current month)");
	console.log("  --help             Show this help message");
	console.log("");
	console.log("Examples:");
	console.log("  node sanity/scripts/report.mjs");
	console.log("  node sanity/scripts/report.mjs --form=quote");
	console.log("  node sanity/scripts/report.mjs --form=ordersLighter");
	console.log("  node sanity/scripts/report.mjs --form=all --start=2026-07-01 --end=2026-07-31");
}

async function loadEnv(filePath) {
	try {
		const content = await fs.readFile(filePath, "utf8");
		const env = {};
		for (const line of content.split(/\r?\n/)) {
			const trimmed = line.trim();
			if (!trimmed || trimmed.startsWith("#")) continue;
			const index = trimmed.indexOf("=");
			if (index === -1) continue;
			const key = trimmed.slice(0, index).trim();
			const value = trimmed.slice(index + 1).trim();
			env[key] = value;
		}
		return env;
	} catch (err) {
		return {};
	}
}

function parseArgs() {
	const args = process.argv.slice(2);
	const result = {};
	for (const arg of args) {
		if (arg === "--help" || arg === "-h") {
			result.help = true;
			continue;
		}
		if (arg.startsWith("--")) {
			const [key, value] = arg.slice(2).split("=");
			result[key] = value;
		}
	}
	return result;
}

function validateDateInput(input, name) {
	if (!input) return;
	const regex = /^\d{4}-\d{2}-\d{2}$/;
	if (!regex.test(input)) {
		throw new Error(`Invalid ${name}: "${input}". Expected format: YYYY-MM-DD`);
	}
}

function vietnamDateToISO(dateStr, isEnd = false) {
	const [year, month, day] = dateStr.split("-").map(Number);
	const hour = isEnd ? 23 : 0;
	const minute = isEnd ? 59 : 0;
	const second = isEnd ? 59 : 0;
	const ms = isEnd ? 999 : 0;
	const utcDate = new Date(
		Date.UTC(year, month - 1, day, hour - VIETNAM_OFFSET_HOURS, minute, second, ms)
	);
	return utcDate.toISOString();
}

function formatToVietnamParts(date) {
	const formatter = new Intl.DateTimeFormat("en-GB", {
		timeZone: VIETNAM_TIMEZONE,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: false,
	});
	const parts = formatter.formatToParts(date);
	const map = {};
	for (const part of parts) {
		if (part.type !== "literal") {
			map[part.type] = part.value;
		}
	}
	return map;
}

function formatLocalDateTime(date) {
	const parts = formatToVietnamParts(date);
	return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`;
}

function formatISOToVietnamDateTime(isoString) {
	const date = new Date(isoString);
	const parts = formatToVietnamParts(date);
	return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}`;
}

function getDefaultDateRange() {
	const now = new Date();
	const parts = formatToVietnamParts(now);
	const year = Number(parts.year);
	const month = Number(parts.month);
	const start = new Date(Date.UTC(year, month - 1, 1, -VIETNAM_OFFSET_HOURS, 0, 0, 0));
	const end = new Date(Date.UTC(year, month, 0, 23 - VIETNAM_OFFSET_HOURS, 59, 59, 999));
	return {
		startDate: formatLocalDateTime(start),
		endDate: formatLocalDateTime(end),
		startISO: start.toISOString(),
		endISO: end.toISOString(),
	};
}

function parseDateRange(startInput, endInput) {
	if (!startInput || !endInput) {
		return getDefaultDateRange();
	}
	validateDateInput(startInput, "start");
	validateDateInput(endInput, "end");
	return {
		startDate: `${startInput} 00:00`,
		endDate: `${endInput} 23:59`,
		startISO: vietnamDateToISO(startInput, false),
		endISO: vietnamDateToISO(endInput, true),
	};
}

function escapeMarkdownCell(value) {
	if (value === null || value === undefined || value === "") {
		return "-";
	}
	return String(value).replace(/\|/g, "\\|").replace(/\n/g, " ").replace(/\r/g, " ").trim();
}

function getNotes(record, config) {
	let notes = record[config.notesField];
	if (!notes && config.notesFallback) {
		notes = record[config.notesFallback];
	}
	if (Array.isArray(notes)) {
		notes = notes.join(", ");
	}
	return escapeMarkdownCell(notes);
}

function getTitle(record, config) {
	return escapeMarkdownCell(record[config.titleField]);
}

function generateSectionMarkdown(config, records) {
	const lines = [];
	lines.push(`## ${config.title} (${records.length} records)`);
	lines.push("");
	lines.push("| date | title | notes |");
	lines.push("| --- | --- | --- |");

	for (const record of records) {
		const date = formatISOToVietnamDateTime(record[config.dateField]);
		const title = getTitle(record, config);
		const notes = getNotes(record, config);
		lines.push(`| ${date} | ${title} | ${notes} |`);
	}

	return lines.join("\n");
}

function generateSingleMarkdown(config, range, records) {
	const lines = [];
	lines.push(`# ${config.title} Report`);
	lines.push(`**Form**: ${config.title}`);
	lines.push(`**Start**: ${range.startDate}`);
	lines.push(`**End**: ${range.endDate}`);
	lines.push(`**Total records**: ${records.length}`);
	lines.push("");
	lines.push(generateSectionMarkdown(config, records));
	return lines.join("\n");
}

function generateCombinedMarkdown(config, range, sections) {
	const totalRecords = sections.reduce((sum, section) => sum + section.records.length, 0);
	const lines = [];
	lines.push(`# ${config.title} Report`);
	lines.push(`**Form**: ${config.title}`);
	lines.push(`**Start**: ${range.startDate}`);
	lines.push(`**End**: ${range.endDate}`);
	lines.push(`**Total records**: ${totalRecords}`);
	lines.push("");

	for (const section of sections) {
		lines.push(generateSectionMarkdown(section.config, section.records));
		lines.push("");
	}

	return lines.join("\n");
}

function buildQuery(config) {
	const fallbackProjection = config.notesFallback ? `,${config.notesFallback}` : "";
	return `*[_type == $type && ${config.dateField} >= $start && ${config.dateField} <= $end] | order(${config.dateField} desc) {
		_id,
		${config.dateField},
		${config.titleField},
		${config.notesField}${fallbackProjection}
	}`;
}

async function fetchRecords(client, config, range) {
	const query = buildQuery(config);
	return client.fetch(query, {
		type: config.type,
		start: range.startISO,
		end: range.endISO,
	});
}

async function main() {
	const args = parseArgs();

	if (args.help) {
		printUsage();
		return;
	}

	const formKey = args.form || "all";
	const isAll = formKey === "all";
	const config = isAll ? ALL_CONFIG : FORM_CONFIG[formKey];

	if (!config) {
		console.error(`Invalid --form value: "${formKey}"`);
		console.error(`Supported values: ${Object.keys(FORM_CONFIG).join(", ")}, all`);
		process.exit(1);
	}

	const range = parseDateRange(args.start, args.end);

	const env = await loadEnv(ENV_PATH);
	const token = env.SANITY_TOKEN;
	if (!token) {
		console.error(`Missing SANITY_TOKEN in ${ENV_PATH}`);
		console.error("Create a token with read access at https://manage.sanity.io/");
		process.exit(1);
	}

	const sanityJson = JSON.parse(await fs.readFile(SANITY_JSON_PATH, "utf8"));
	const { projectId, dataset } = sanityJson.api;

	const client = sanityClient({
		projectId,
		dataset,
		apiVersion: "2022-09-19",
		token,
		useCdn: false,
	});

	let markdown;
	let totalRecords;
	let formTitle;

	if (isAll) {
		const sections = [];
		for (const formConfig of config.forms) {
			const records = await fetchRecords(client, formConfig, range);
			sections.push({ config: formConfig, records });
		}
		markdown = generateCombinedMarkdown(config, range, sections);
		totalRecords = sections.reduce((sum, section) => sum + section.records.length, 0);
		formTitle = config.title;
	} else {
		const records = await fetchRecords(client, config, range);
		markdown = generateSingleMarkdown(config, range, records);
		totalRecords = records.length;
		formTitle = config.title;
	}

	const startSlug = range.startDate.split(" ")[0];
	const endSlug = range.endDate.split(" ")[0];
	const filename = isAll
		? `all-${startSlug}-${endSlug}.md`
		: `${formKey}-${startSlug}-${endSlug}.md`;
	const outputPath = path.join(REPORTS_DIR, filename);

	await fs.mkdir(REPORTS_DIR, { recursive: true });
	await fs.writeFile(outputPath, markdown, "utf8");

	console.log("✅ Report generated");
	console.log(`Form: ${formTitle}`);
	console.log(`Range: ${range.startDate} → ${range.endDate}`);
	console.log(`Total records: ${totalRecords}`);
	console.log(`Output: ${outputPath}`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
