/**
 * Consent Management Utility
 * Implements Google Consent Mode v2 for GDPR/CCPA compliance
 * Manages analytics and advertising consent states
 */

// Consent state types
export type ConsentState = "granted" | "denied";

export interface ConsentSettings {
	analytics_storage?: ConsentState;
	ad_storage?: ConsentState;
	ad_user_data?: ConsentState;
	ad_personalization?: ConsentState;
	functionality_storage?: ConsentState;
	personalization_storage?: ConsentState;
	security_storage?: ConsentState;
}

// Storage key for consent preferences
const CONSENT_STORAGE_KEY = "inut_consent_preferences";

// Default consent state (all denied for privacy-first approach)
const DEFAULT_CONSENT: ConsentSettings = {
	analytics_storage: "denied",
	ad_storage: "denied",
	ad_user_data: "denied",
	ad_personalization: "denied",
	functionality_storage: "granted",
	personalization_storage: "denied",
	security_storage: "granted",
};

/**
 * Check if gtag is available
 */
const isGtagAvailable = (): boolean => {
	return typeof window !== "undefined" && typeof window.gtag === "function";
};

/**
 * Initialize consent mode with default settings
 * Should be called before any analytics scripts load
 */
export const initializeConsentMode = (): void => {
	if (!isGtagAvailable()) {
		console.warn("[Consent] gtag not available, skipping consent initialization");
		return;
	}

	// Set default consent state
	window.gtag!("consent", "default", {
		...DEFAULT_CONSENT,
		wait_for_update: 500,
	});

	// Load saved consent preferences
	const savedConsent = getSavedConsent();
	if (savedConsent) {
		updateConsent(savedConsent);
	}

	console.log("[Consent] Consent mode initialized with defaults");
};

/**
 * Update consent settings
 * @param settings - New consent settings
 */
export const updateConsent = (settings: ConsentSettings): void => {
	if (!isGtagAvailable()) {
		console.warn("[Consent] gtag not available, cannot update consent");
		return;
	}

	// Update gtag consent
	window.gtag!("consent", "update", settings);

	// Save to localStorage
	saveConsent(settings);

	// Push consent update to dataLayer
	if (typeof window !== "undefined" && window.dataLayer) {
		window.dataLayer.push({
			event: "consent_update",
			consent_settings: settings,
		});
	}

	console.log("[Consent] Consent updated:", settings);
};

/**
 * Grant all consent
 */
export const grantAllConsent = (): void => {
	updateConsent({
		analytics_storage: "granted",
		ad_storage: "granted",
		ad_user_data: "granted",
		ad_personalization: "granted",
		functionality_storage: "granted",
		personalization_storage: "granted",
		security_storage: "granted",
	});
};

/**
 * Deny all consent (except required)
 */
export const denyAllConsent = (): void => {
	updateConsent({
		analytics_storage: "denied",
		ad_storage: "denied",
		ad_user_data: "denied",
		ad_personalization: "denied",
		functionality_storage: "granted",
		personalization_storage: "denied",
		security_storage: "granted",
	});
};

/**
 * Grant analytics consent only
 */
export const grantAnalyticsConsent = (): void => {
	updateConsent({
		analytics_storage: "granted",
		ad_storage: "denied",
		ad_user_data: "denied",
		ad_personalization: "denied",
		functionality_storage: "granted",
		personalization_storage: "denied",
		security_storage: "granted",
	});
};

/**
 * Get current consent state
 * @returns Current consent settings or null if not set
 */
export const getCurrentConsent = (): ConsentSettings | null => {
	return getSavedConsent();
};

/**
 * Check if analytics consent is granted
 * @returns boolean
 */
export const hasAnalyticsConsent = (): boolean => {
	const consent = getSavedConsent();
	return consent?.analytics_storage === "granted";
};

/**
 * Check if ad consent is granted
 * @returns boolean
 */
export const hasAdConsent = (): boolean => {
	const consent = getSavedConsent();
	return consent?.ad_storage === "granted";
};

/**
 * Save consent to localStorage
 * @param settings - Consent settings to save
 */
const saveConsent = (settings: ConsentSettings): void => {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(
			CONSENT_STORAGE_KEY,
			JSON.stringify({
				...settings,
				timestamp: Date.now(),
			})
		);
	} catch (error) {
		console.error("[Consent] Failed to save consent:", error);
	}
};

/**
 * Get saved consent from localStorage
 * @returns Saved consent settings or null
 */
const getSavedConsent = (): ConsentSettings | null => {
	if (typeof window === "undefined") return null;
	try {
		const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
		if (saved) {
			const parsed = JSON.parse(saved);
			// Remove timestamp before returning
			const { timestamp, ...consent } = parsed;
			return consent as ConsentSettings;
		}
	} catch (error) {
		console.error("[Consent] Failed to load consent:", error);
	}
	return null;
};

/**
 * Clear saved consent
 */
export const clearConsent = (): void => {
	if (typeof window === "undefined") return;
	try {
		localStorage.removeItem(CONSENT_STORAGE_KEY);
		console.log("[Consent] Consent cleared");
	} catch (error) {
		console.error("[Consent] Failed to clear consent:", error);
	}
};

/**
 * Check if consent has been explicitly set
 * @returns boolean
 */
export const hasConsentBeenSet = (): boolean => {
	return getSavedConsent() !== null;
};

/**
 * Get consent age in days
 * @returns number of days since consent was last set, or -1 if not set
 */
export const getConsentAge = (): number => {
	if (typeof window === "undefined") return -1;
	try {
		const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
		if (saved) {
			const parsed = JSON.parse(saved);
			if (parsed.timestamp) {
				const ageMs = Date.now() - parsed.timestamp;
				return Math.floor(ageMs / (1000 * 60 * 60 * 24));
			}
		}
	} catch (error) {
		console.error("[Consent] Failed to get consent age:", error);
	}
	return -1;
};

/**
 * Check if consent needs renewal (older than 365 days)
 * @returns boolean
 */
export const needsConsentRenewal = (): boolean => {
	const age = getConsentAge();
	return age >= 365 || age === -1;
};

const consentUtils = {
	initializeConsentMode,
	updateConsent,
	grantAllConsent,
	denyAllConsent,
	grantAnalyticsConsent,
	getCurrentConsent,
	hasAnalyticsConsent,
	hasAdConsent,
	clearConsent,
	hasConsentBeenSet,
	getConsentAge,
	needsConsentRenewal,
};

export default consentUtils;