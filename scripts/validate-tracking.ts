#!/usr/bin/env ts-node
/**
 * Analytics Tracking Validation Script
 * Validates tracking implementation and identifies issues
 * Run with: npx ts-node scripts/validate-tracking.ts
 */

import * as fs from "fs";
import * as path from "path";

// Types
interface ValidationIssue {
	type: "error" | "warning" | "info";
	file?: string;
	line?: number;
	message: string;
	suggestion?: string;
}

interface ValidationReport {
	timestamp: string;
	summary: {
		totalFiles: number;
		issuesFound: number;
		errors: number;
		warnings: number;
		infos: number;
	};
	issues: ValidationIssue[];
	recommendations: string[];
}

// Analytics function names to check
const ANALYTICS_FUNCTIONS = [
	"trackPageView",
	"trackViewProduct",
	"trackSelectProduct",
	"trackAddToCart",
	"trackRemoveFromCart",
	"trackBeginCheckout",
	"trackPurchase",
	"trackFormSubmit",
	"trackContactClick",
	"trackPhoneClick",
	"trackZaloClick",
	"trackOrderButtonClick",
	"trackSearch",
	"trackEvent",
];

/**
 * Get all TypeScript/TSX files in a directory
 */
const getFiles = (dir: string, extensions: string[] = [".ts", ".tsx"]): string[] => {
	const files: string[] = [];

	const items = fs.readdirSync(dir, { withFileTypes: true });

	for (const item of items) {
		const fullPath = path.join(dir, item.name);

		if (item.isDirectory()) {
			// Skip node_modules, .next, etc.
			if (["node_modules", ".next", ".git", "sanity"].includes(item.name)) {
				continue;
			}
			files.push(...getFiles(fullPath, extensions));
		} else if (extensions.some((ext) => item.name.endsWith(ext))) {
			files.push(fullPath);
		}
	}

	return files;
};

/**
 * Read file content
 */
const readFile = (filePath: string): string => {
	try {
		return fs.readFileSync(filePath, "utf-8");
	} catch (error) {
		console.error(`Failed to read ${filePath}:`, error);
		return "";
	}
};

/**
 * Check if file imports analytics functions
 */
const checkAnalyticsImports = (content: string, filePath: string): ValidationIssue[] => {
	const issues: ValidationIssue[] = [];

	// Check for analytics imports
	const hasAnalyticsImport =
		content.includes("from '@/utils/analytics'") ||
		content.includes("from '@/utils'") ||
		content.includes("from '../utils/analytics'") ||
		content.includes("from '../../utils/analytics'");

	if (!hasAnalyticsImport) {
		// Check if file uses tracking functions without importing
		const usesTracking = ANALYTICS_FUNCTIONS.some((fn) => content.includes(fn));
		if (usesTracking) {
			issues.push({
				type: "error",
				file: filePath,
				message: "File uses analytics functions but doesn't import them properly",
				suggestion: "Add import from '@/utils/analytics' or '@/utils'",
			});
		}
	}

	return issues;
};

/**
 * Check for duplicate tracking
 */
const checkDuplicateTracking = (content: string, filePath: string): ValidationIssue[] => {
	const issues: ValidationIssue[] = [];
	const lines = content.split("\n");

	// Check for multiple calls to same tracking function in close proximity
	let lastTrackingLine = -1;
	let lastTrackingFn = "";

	lines.forEach((line, index) => {
		ANALYTICS_FUNCTIONS.forEach((fn) => {
			if (line.includes(fn)) {
				if (fn === lastTrackingFn && index - lastTrackingLine < 5) {
					issues.push({
						type: "warning",
						file: filePath,
						line: index + 1,
						message: `Potential duplicate tracking: ${fn} called twice within 5 lines`,
						suggestion: "Review if both calls are necessary",
					});
				}
				lastTrackingLine = index;
				lastTrackingFn = fn;
			}
		});
	});

	return issues;
};

/**
 * Check for proper event parameters
 */
const checkEventParameters = (content: string, filePath: string): ValidationIssue[] => {
	const issues: ValidationIssue[] = [];
	const lines = content.split("\n");

	lines.forEach((line, index) => {
		// Check trackAddToCart calls
		if (line.includes("trackAddToCart")) {
			if (!line.includes("price") && !content.substring(Math.max(0, index - 5), Math.min(content.length, index + 5)).includes("price")) {
				issues.push({
					type: "warning",
					file: filePath,
					line: index + 1,
					message: "trackAddToCart called without price parameter",
					suggestion: "Include product price for accurate revenue tracking",
				});
			}
		}

		// Check trackPurchase calls
		if (line.includes("trackPurchase")) {
			if (!line.includes("transactionId") && !line.includes("transaction_id")) {
				issues.push({
					type: "error",
					file: filePath,
					line: index + 1,
					message: "trackPurchase called without transaction ID",
					suggestion: "Include unique transaction ID for deduplication",
				});
			}
		}

		// Check trackViewProduct calls
		if (line.includes("trackViewProduct")) {
			if (!line.includes("id") && !line.includes("item_id")) {
				issues.push({
					type: "warning",
					file: filePath,
					line: index + 1,
					message: "trackViewProduct called without product ID",
					suggestion: "Include product ID for accurate tracking",
				});
			}
		}
	});

	return issues;
};

/**
 * Check for proper Umami integration
 */
const checkUmamiIntegration = (content: string, filePath: string): ValidationIssue[] => {
	const issues: ValidationIssue[] = [];

	// Check if analytics.ts properly imports Umami functions
	if (filePath.includes("analytics.ts")) {
		const umamiFunctions = [
			"trackUmamiProductView",
			"trackUmamiAddToCart",
			"trackUmamiPurchase",
			"trackUmamiContact",
			"trackUmamiFormSubmit",
		];

		umamiFunctions.forEach((fn) => {
			if (!content.includes(fn)) {
				issues.push({
					type: "warning",
					file: filePath,
					message: `Analytics file missing Umami function: ${fn}`,
					suggestion: "Add corresponding Umami tracking for dual tracking",
				});
			}
		});
	}

	return issues;
};

/**
 * Check for consent management integration
 */
const checkConsentIntegration = (content: string, filePath: string): ValidationIssue[] => {
	const issues: ValidationIssue[] = [];

	// Check if _app.tsx initializes consent
	if (filePath.includes("_app.tsx")) {
		if (!content.includes("initializeConsentMode") && !content.includes("consent")) {
			issues.push({
				type: "warning",
				file: filePath,
				message: "_app.tsx doesn't initialize consent mode",
				suggestion: "Add consent initialization for GDPR compliance",
			});
		}
	}

	return issues;
};

/**
 * Check for DataLayer integration
 */
const checkDataLayerIntegration = (content: string, filePath: string): ValidationIssue[] => {
	const issues: ValidationIssue[] = [];

	// Check if analytics.ts uses dataLayer
	if (filePath.includes("analytics.ts")) {
		if (!content.includes("pushToDataLayer") && !content.includes("dataLayer")) {
			issues.push({
				type: "info",
				file: filePath,
				message: "Analytics file doesn't use dataLayer",
				suggestion: "Consider adding dataLayer support for GTM",
			});
		}
	}

	return issues;
};

/**
 * Check environment configuration
 */
const checkEnvConfiguration = (): ValidationIssue[] => {
	const issues: ValidationIssue[] = [];
	const envPath = path.join(process.cwd(), ".env.local");
	const envExamplePath = path.join(process.cwd(), ".env.example");

	// Check if .env.local exists
	if (!fs.existsSync(envPath)) {
		issues.push({
			type: "warning",
			message: ".env.local file not found",
			suggestion: "Copy .env.example to .env.local and configure values",
		});
	}

	// Check .env.example for required variables
	if (fs.existsSync(envExamplePath)) {
		const envContent = readFile(envExamplePath);
		const requiredVars = [
			"NEXT_PUBLIC_GA_MEASUREMENT_ID",
			"NEXT_PUBLIC_GTM_ID",
			"NEXT_PUBLIC_ENABLE_UMAMI",
			"NEXT_PUBLIC_UMAMI_WEBSITE_ID",
		];

		requiredVars.forEach((varName) => {
			if (!envContent.includes(varName)) {
				issues.push({
					type: "error",
					message: `.env.example missing required variable: ${varName}`,
					suggestion: `Add ${varName} to .env.example`,
				});
			}
		});
	}

	return issues;
};

/**
 * Generate recommendations based on issues
 */
const generateRecommendations = (issues: ValidationIssue[]): string[] => {
	const recommendations: string[] = [];

	const errorCount = issues.filter((i) => i.type === "error").length;
	const warningCount = issues.filter((i) => i.type === "warning").length;

	if (errorCount > 0) {
		recommendations.push("Fix all errors before deploying to production");
	}

	if (warningCount > 5) {
		recommendations.push("Review warnings to improve tracking quality");
	}

	const duplicateIssues = issues.filter((i) => i.message.includes("duplicate"));
	if (duplicateIssues.length > 0) {
		recommendations.push("Review duplicate tracking calls to prevent inflated metrics");
	}

	const parameterIssues = issues.filter((i) => i.message.includes("parameter"));
	if (parameterIssues.length > 0) {
		recommendations.push("Ensure all tracking calls include required parameters");
	}

	if (issues.some((i) => i.message.includes("Umami"))) {
		recommendations.push("Verify Umami dual tracking is properly implemented");
	}

	if (issues.some((i) => i.message.includes("consent"))) {
		recommendations.push("Implement consent management for GDPR compliance");
	}

	return recommendations;
};

/**
 * Main validation function
 */
const validate = (): ValidationReport => {
	console.log("🔍 Starting analytics tracking validation...\n");

	const issues: ValidationIssue[] = [];
	const srcDir = path.join(process.cwd(), "");

	// Get all relevant files
	const files = getFiles(srcDir);
	console.log(`Found ${files.length} TypeScript/TSX files to analyze\n`);

	// Check environment configuration
	issues.push(...checkEnvConfiguration());

	// Analyze each file
	files.forEach((filePath) => {
		const content = readFile(filePath);
		if (!content) return;

		const relativePath = path.relative(process.cwd(), filePath);

		issues.push(...checkAnalyticsImports(content, relativePath));
		issues.push(...checkDuplicateTracking(content, relativePath));
		issues.push(...checkEventParameters(content, relativePath));
		issues.push(...checkUmamiIntegration(content, relativePath));
		issues.push(...checkConsentIntegration(content, relativePath));
		issues.push(...checkDataLayerIntegration(content, relativePath));
	});

	// Generate report
	const report: ValidationReport = {
		timestamp: new Date().toISOString(),
		summary: {
			totalFiles: files.length,
			issuesFound: issues.length,
			errors: issues.filter((i) => i.type === "error").length,
			warnings: issues.filter((i) => i.type === "warning").length,
			infos: issues.filter((i) => i.type === "info").length,
		},
		issues,
		recommendations: generateRecommendations(issues),
	};

	return report;
};

/**
 * Print report to console
 */
const printReport = (report: ValidationReport): void => {
	console.log("═══════════════════════════════════════════════════════════════");
	console.log("📊 ANALYTICS TRACKING VALIDATION REPORT");
	console.log("═══════════════════════════════════════════════════════════════\n");

	console.log(`Timestamp: ${report.timestamp}`);
	console.log(`Files Analyzed: ${report.summary.totalFiles}`);
	console.log(`Issues Found: ${report.summary.issuesFound}`);
	console.log(`  ❌ Errors: ${report.summary.errors}`);
	console.log(`  ⚠️  Warnings: ${report.summary.warnings}`);
	console.log(`  ℹ️  Info: ${report.summary.infos}\n`);

	if (report.issues.length > 0) {
		console.log("───────────────────────────────────────────────────────────────");
		console.log("ISSUES");
		console.log("───────────────────────────────────────────────────────────────\n");

		report.issues.forEach((issue, index) => {
			const icon = issue.type === "error" ? "❌" : issue.type === "warning" ? "⚠️" : "ℹ️";
			console.log(`${icon} ${index + 1}. ${issue.message}`);
			if (issue.file) {
				console.log(`   File: ${issue.file}${issue.line ? `:${issue.line}` : ""}`);
			}
			if (issue.suggestion) {
				console.log(`   💡 ${issue.suggestion}`);
			}
			console.log("");
		});
	}

	if (report.recommendations.length > 0) {
		console.log("───────────────────────────────────────────────────────────────");
		console.log("RECOMMENDATIONS");
		console.log("───────────────────────────────────────────────────────────────\n");

		report.recommendations.forEach((rec, index) => {
			console.log(`${index + 1}. ${rec}`);
		});
		console.log("");
	}

	console.log("═══════════════════════════════════════════════════════════════");

	if (report.summary.errors > 0) {
		console.log("\n❌ Validation FAILED - Fix errors before deploying");
		process.exit(1);
	} else if (report.summary.warnings > 0) {
		console.log("\n⚠️  Validation PASSED with warnings");
		process.exit(0);
	} else {
		console.log("\n✅ Validation PASSED");
		process.exit(0);
	}
};

// Run validation
const report = validate();
printReport(report);