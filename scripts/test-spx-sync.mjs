/* eslint-disable camelcase */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
	buildSpxSyncNote,
	decideFailedSpxSync,
	decideSuccessfulSpxSync,
	formatSpxEventTimeGmt7,
	inspectSpxAdminNotesMarkers,
	removeLegacySpxAdminNotesBlock,
	sanitizeSpxDescription,
	SPX_NOTES_END_MARKER,
	SPX_NOTES_START_MARKER,
} from "../utils/spx/admin-notes.ts";
import {
	authorizeSpxCronRequest,
	buildDraftPublishMutations,
	classifySanityError,
	getPublishedOrderId,
	getSpxSyncHttpStatus,
	hasSpxCapacityOverflow,
	mapWithConcurrency,
	SANITY_DRAFT_ORDERS_QUERY,
	SPX_ELIGIBLE_ORDERS_QUERY,
	stripServerManagedSpxFields,
} from "../utils/spx/sync.ts";
import {
	fetchSpxTracking,
	normalizeSpxProviderResponse,
	parseSpxTrackingInput,
	SPX_MAX_CODE_LENGTH,
	SPX_MAX_RESPONSE_BYTES,
	SPX_MAX_TRACKING_RECORDS,
	SPX_TRACKING_ENDPOINT,
} from "../utils/spx/tracking.ts";
import { SPX_SYNC_ERROR_CODES } from "../models/spxTracking.ts";
import { formatSpxSyncErrorMessage } from "../utils/telegram/formatSpxSyncErrorMessage.ts";
import { sendWithRetry } from "../utils/telegram/index.ts";
import { validateTelegramCredentials } from "../utils/telegram/validateTelegramEnv.ts";
import {
	conflictingStatusFixture,
	deliveredFixture,
	emptyRecordsFixture,
	EVENT_TIMESTAMPS,
	invalidCodeFixture,
	invalidTimestampFixture,
	malformedResponseFixture,
	returningFixture,
	TRACKING_CODES,
	unsortedHistoryFixture,
} from "./fixtures/spx-tracking-fixtures.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
process.env.SANITY_PROJECT_ID ||= "test-project";
process.env.SANITY_DATASET ||= "test";
const { runAuthorizedSpxSync } = await import(
	"../pages/api/cron/sync-spx-orders.ts"
);
let passed = 0;

async function test(name, callback) {
	await callback();
	passed += 1;
	console.log(`✓ ${name}`);
}

function snapshotFrom(fixture, trackingNumber = TRACKING_CODES.delivered) {
	const result = normalizeSpxProviderResponse(fixture, trackingNumber);
	assert.equal(result.kind, "success");
	return result.snapshot;
}

function eligibleOrder(overrides = {}) {
	return {
		_id: "synthetic-order-id",
		_rev: "synthetic-revision",
		status: "in_transit",
		trackingNumber: TRACKING_CODES.delivered,
		...overrides,
	};
}

function draftOrder(id, overrides = {}) {
	return {
		_id: `drafts.${id}`,
		_rev: `revision-${id}`,
		_type: "ordersLighter",
		_createdAt: "2026-08-28T00:00:00.000Z",
		_updatedAt: "2026-08-28T01:00:00.000Z",
		orderNumber: `ORDER-${id}`,
		status: "pending",
		orderItems: [{ _key: "item-1", quantity: 1 }],
		customerName: "Must not appear in compact output",
		customerPhone: "0900000000",
		...overrides,
	};
}

function processedOrderResult(orderId, overrides = {}) {
	return {
		result: { orderId, result: "unchanged" },
		checked: 1,
		changed: 0,
		completed: 0,
		unchanged: 1,
		skipped: 0,
		failed: 0,
		attentionRequired: 0,
		transientProviderFailure: false,
		sanityFailure: false,
		failures: [],
		...overrides,
	};
}

function authorizedRunInput(dependencies) {
	const now = Date.now();
	return {
		startedAt: new Date(now),
		responseDeadlineAt: now + 29000,
		workDeadlineAt: now + 25000,
		dependencies,
	};
}

await test("parses raw, lowercase, URL-key, named, and encoded SPX inputs", () => {
	assert.deepEqual(parseSpxTrackingInput(` ${TRACKING_CODES.delivered.toLowerCase()} `), {
		kind: "valid",
		trackingNumber: TRACKING_CODES.delivered,
	});
	assert.equal(
		parseSpxTrackingInput(`https://spx.vn/track?${TRACKING_CODES.delivered}`).kind,
		"valid"
	);
	assert.equal(
		parseSpxTrackingInput(
			`https://www.spx.vn/track?spx_tn=${TRACKING_CODES.delivered}`
		).kind,
		"valid"
	);
	assert.equal(
		parseSpxTrackingInput(
			`https://spx.vn/track?${encodeURIComponent(TRACKING_CODES.delivered)}`
		).kind,
		"valid"
	);
});

await test("rejects wrong hosts, protocols, whitespace, ambiguity, and oversized codes", () => {
	assert.deepEqual(parseSpxTrackingInput(`http://spx.vn/track?${TRACKING_CODES.delivered}`), {
		kind: "skip",
		reason: "not_spx",
	});
	assert.deepEqual(parseSpxTrackingInput(`https://example.com/?${TRACKING_CODES.delivered}`), {
		kind: "skip",
		reason: "not_spx",
	});
	assert.equal(parseSpxTrackingInput("SPXVN123 456").kind, "skip");
	assert.deepEqual(
		parseSpxTrackingInput(
			`https://spx.vn/track?a=${TRACKING_CODES.delivered}&b=${TRACKING_CODES.returning}`
		),
		{ kind: "skip", reason: "ambiguous_spx" }
	);
	assert.equal(parseSpxTrackingInput(`SPXVN${"1".repeat(33)}`).kind, "skip");
	assert.equal(`SPXVN${"1".repeat(32)}`.length, SPX_MAX_CODE_LENGTH);
});

await test("accepts repeated occurrences of the same SPX code", () => {
	assert.deepEqual(
		parseSpxTrackingInput(
			`https://spx.vn/track?${TRACKING_CODES.delivered}&spx_tn=${TRACKING_CODES.delivered}`
		),
		{ kind: "valid", trackingNumber: TRACKING_CODES.delivered }
	);
});

await test("normalizes delivered and returning fixtures without PII", () => {
	const delivered = normalizeSpxProviderResponse(deliveredFixture, TRACKING_CODES.delivered);
	const returning = normalizeSpxProviderResponse(returningFixture, TRACKING_CODES.returning);
	assert.equal(delivered.kind, "success");
	assert.equal(delivered.snapshot.shouldComplete, true);
	assert.equal(delivered.snapshot.eventCode, "F980");
	assert.equal(returning.kind, "success");
	assert.equal(returning.snapshot.shouldComplete, false);
	assert.deepEqual(Object.keys(delivered.snapshot).sort(), [
		"description",
		"eventAt",
		"eventCode",
		"eventTimestamp",
		"fingerprint",
		"group",
		"shouldComplete",
		"status",
		"subgroup",
		"trackingNumber",
	]);
});

await test("selects the newest valid record independently of array order", () => {
	const result = normalizeSpxProviderResponse(
		unsortedHistoryFixture,
		TRACKING_CODES.delivered
	);
	assert.equal(result.kind, "success");
	assert.equal(result.snapshot.eventCode, "NEWEST");
	assert.equal(result.snapshot.eventTimestamp, EVENT_TIMESTAMPS.newest);
});

await test("fails safe for equal-timestamp Delivered and Return events in either order", () => {
	const deliveredRecord = deliveredFixture.data.sls_tracking_info.records[0];
	const returnRecord = returningFixture.data.sls_tracking_info.records[0];
	for (const records of [
		[deliveredRecord, returnRecord],
		[returnRecord, deliveredRecord],
	]) {
		const fixture = {
			retcode: 0,
			data: {
				order_info: {
					tracking_code_group_name: "Delivered",
					tracking_code_subgroup_name: "Delivered",
				},
				sls_tracking_info: { records },
			},
		};
		assert.deepEqual(normalizeSpxProviderResponse(fixture, TRACKING_CODES.delivered), {
			kind: "data_error",
			errorCode: SPX_SYNC_ERROR_CODES.STATUS_CONFLICT,
		});
	}
});

await test("rejects mixed valid and invalid timestamps before completion", () => {
	const fixture = {
		retcode: 0,
		data: {
			order_info: {
				tracking_code_group_name: "Delivered",
				tracking_code_subgroup_name: "Delivered",
			},
			sls_tracking_info: {
				records: [
					deliveredFixture.data.sls_tracking_info.records[0],
					{
						...returningFixture.data.sls_tracking_info.records[0],
						actual_time: -1,
					},
				],
			},
		},
	};
	assert.deepEqual(normalizeSpxProviderResponse(fixture, TRACKING_CODES.delivered), {
		kind: "invalid_response",
		errorCode: SPX_SYNC_ERROR_CODES.INVALID_RESPONSE,
	});
});

await test("classifies retcode, empty records, missing fields, timestamps, and conflicts", () => {
	assert.deepEqual(
		normalizeSpxProviderResponse(invalidCodeFixture, TRACKING_CODES.delivered),
		{ kind: "data_error", errorCode: SPX_SYNC_ERROR_CODES.NOT_FOUND }
	);
	for (const fixture of [
		emptyRecordsFixture,
		malformedResponseFixture,
		invalidTimestampFixture,
	]) {
		assert.deepEqual(normalizeSpxProviderResponse(fixture, TRACKING_CODES.delivered), {
			kind: "invalid_response",
			errorCode: SPX_SYNC_ERROR_CODES.INVALID_RESPONSE,
		});
	}
	assert.deepEqual(
		normalizeSpxProviderResponse(conflictingStatusFixture, TRACKING_CODES.delivered),
		{ kind: "data_error", errorCode: SPX_SYNC_ERROR_CODES.STATUS_CONFLICT }
	);
	assert.deepEqual(
		normalizeSpxProviderResponse(
			{
				...deliveredFixture,
				data: {
					...deliveredFixture.data,
					sls_tracking_info: {
						records: Array.from(
							{ length: SPX_MAX_TRACKING_RECORDS + 1 },
							() => deliveredFixture.data.sls_tracking_info.records[0]
						),
					},
				},
			},
			TRACKING_CODES.delivered
		),
		{ kind: "invalid_response", errorCode: SPX_SYNC_ERROR_CODES.INVALID_RESPONSE }
	);
});

await test("uses the fixed endpoint and retries one transient HTTP failure", async () => {
	let attempts = 0;
	const result = await fetchSpxTracking(TRACKING_CODES.delivered, {
		maxAttempts: 2,
		timeoutMs: 100,
		deadlineAt: Date.now() + 1000,
		fetchImpl: async (url) => {
			attempts += 1;
			const parsed = new URL(url);
			assert.equal(`${parsed.origin}${parsed.pathname}`, SPX_TRACKING_ENDPOINT);
			assert.equal(parsed.searchParams.get("spx_tn"), TRACKING_CODES.delivered);
			assert.equal(parsed.searchParams.get("language_code"), "vi");
			if (attempts === 1) return { ok: false, status: 503 };
			return { ok: true, status: 200, json: async () => deliveredFixture };
		},
	});
	assert.equal(attempts, 2);
	assert.equal(result.kind, "success");
});

await test("classifies timeout, network, HTTP, and invalid JSON failures deterministically", async () => {
	const timeoutResult = await fetchSpxTracking(TRACKING_CODES.delivered, {
		maxAttempts: 1,
		timeoutMs: 10,
		deadlineAt: Date.now() + 100,
		fetchImpl: async (_url, options) =>
			new Promise((_resolve, reject) => {
				options.signal.addEventListener("abort", () => {
					const error = new Error("synthetic abort");
					error.name = "AbortError";
					reject(error);
				});
			}),
	});
	assert.deepEqual(timeoutResult, {
		kind: "transient_error",
		errorCode: SPX_SYNC_ERROR_CODES.TIMEOUT,
	});

	const networkResult = await fetchSpxTracking(TRACKING_CODES.delivered, {
		maxAttempts: 1,
		fetchImpl: async () => {
			throw new Error("synthetic network failure");
		},
	});
	assert.equal(networkResult.errorCode, SPX_SYNC_ERROR_CODES.NETWORK_ERROR);

	const httpResult = await fetchSpxTracking(TRACKING_CODES.delivered, {
		maxAttempts: 1,
		fetchImpl: async () => ({ ok: false, status: 400 }),
	});
	assert.equal(httpResult.errorCode, SPX_SYNC_ERROR_CODES.HTTP_ERROR);

	const jsonResult = await fetchSpxTracking(TRACKING_CODES.delivered, {
		maxAttempts: 1,
		fetchImpl: async () => ({
			ok: true,
			status: 200,
			json: async () => {
				throw new Error("synthetic invalid JSON");
			},
		}),
	});
	assert.equal(jsonResult.errorCode, SPX_SYNC_ERROR_CODES.INVALID_RESPONSE);

	const oversizedResult = await fetchSpxTracking(TRACKING_CODES.delivered, {
		maxAttempts: 1,
		fetchImpl: async () => ({
			ok: true,
			status: 200,
			headers: { get: () => null },
			text: async () => "x".repeat(SPX_MAX_RESPONSE_BYTES + 1),
		}),
	});
	assert.equal(oversizedResult.errorCode, SPX_SYNC_ERROR_CODES.INVALID_RESPONSE);
});

await test("builds a dedicated marker-free SPX snapshot", () => {
	const snapshot = snapshotFrom(deliveredFixture);
	const note = buildSpxSyncNote(snapshot);
	assert.equal(note.includes(SPX_NOTES_START_MARKER), false);
	assert.equal(note.includes(SPX_NOTES_END_MARKER), false);
	assert.equal(
		note,
		[
			"tracking order status: Delivered - Giao hàng thành công",
			"updated_time: 2026-08-28T17:05:41+07:00",
			"updated_by: spx-cron-job",
		].join("\n")
	);
});

await test("migrates one valid legacy block with minimum boundary cleanup", () => {
	const original = `prefix\n${SPX_NOTES_START_MARKER}\nold\n${SPX_NOTES_END_MARKER}\nsuffix`;
	const migrated = removeLegacySpxAdminNotesBlock(original);
	assert.equal(migrated.kind, "removed");
	assert.equal(migrated.adminNotes, "prefix\nsuffix");
	assert.deepEqual(removeLegacySpxAdminNotesBlock("manual only"), { kind: "none" });

	const snapshot = { ...snapshotFrom(deliveredFixture), shouldComplete: false };
	const migratedOrder = eligibleOrder({
		adminNotes: migrated.adminNotes,
		spxSyncNote: buildSpxSyncNote(snapshot),
		spxTrackingNumber: snapshot.trackingNumber,
		spxTrackingStatus: snapshot.status,
		spxTrackingEventCode: snapshot.eventCode,
		spxTrackingEventAt: snapshot.eventAt,
	});
	assert.equal(decideSuccessfulSpxSync(migratedOrder, snapshot).type, "no_change");
});

await test("leaves partial, reversed, nested, and duplicate legacy markers untouched", () => {
	const malformed = [
		SPX_NOTES_START_MARKER,
		SPX_NOTES_END_MARKER,
		`${SPX_NOTES_END_MARKER}\n${SPX_NOTES_START_MARKER}`,
		`${SPX_NOTES_START_MARKER}\n${SPX_NOTES_START_MARKER}\n${SPX_NOTES_END_MARKER}`,
		`${SPX_NOTES_START_MARKER}\n${SPX_NOTES_END_MARKER}\n${SPX_NOTES_END_MARKER}`,
		`manual ${SPX_NOTES_START_MARKER}\nlegacy\n${SPX_NOTES_END_MARKER}`,
	];
	malformed.forEach((notes) => {
		assert.equal(inspectSpxAdminNotesMarkers(notes).kind, "malformed");
		assert.deepEqual(removeLegacySpxAdminNotesBlock(notes), { kind: "malformed" });
	});
});

await test("sanitizes marker injection, controls, multiline text, and length", () => {
	const sanitized = sanitizeSpxDescription(
		`Dòng 1\n${SPX_NOTES_START_MARKER}\u0000 Dòng 2 ${"x".repeat(400)}`
	);
	assert.equal(sanitized.includes(SPX_NOTES_START_MARKER), false);
	assert.equal(sanitized.includes("\n"), false);
	assert.equal(Array.from(sanitized).length, 240);
});

await test("formats SPX event time at a deterministic GMT+7 date boundary", () => {
	assert.equal(
		formatSpxEventTimeGmt7(EVENT_TIMESTAMPS.dateBoundary),
		"2026-01-02T01:30:00+07:00"
	);
});

await test("makes deterministic no-op, tracking-change, error, and recovery decisions", () => {
	const snapshot = snapshotFrom(deliveredFixture);
	const note = buildSpxSyncNote(snapshot);
	const stored = eligibleOrder({
		adminNotes: "manual only",
		spxSyncNote: note,
		spxTrackingNumber: snapshot.trackingNumber,
		spxTrackingStatus: snapshot.status,
		spxTrackingEventCode: snapshot.eventCode,
		spxTrackingEventAt: snapshot.eventAt,
	});
	const nonDeliveredSnapshot = { ...snapshot, shouldComplete: false };
	assert.equal(decideSuccessfulSpxSync(stored, nonDeliveredSnapshot).type, "no_change");

	const missingNote = decideSuccessfulSpxSync(
		eligibleOrder({
			adminNotes: "manual only",
			spxTrackingNumber: snapshot.trackingNumber,
			spxTrackingStatus: snapshot.status,
			spxTrackingEventCode: snapshot.eventCode,
			spxTrackingEventAt: snapshot.eventAt,
		}),
		nonDeliveredSnapshot
	);
	assert.equal(missingNote.type, "status_changed");
	assert.equal(missingNote.set.spxSyncNote, note);
	assert.equal(Object.hasOwn(missingNote.set, "adminNotes"), false);

	const differentNote = decideSuccessfulSpxSync(
		{ ...stored, spxSyncNote: "stale automated snapshot" },
		nonDeliveredSnapshot
	);
	assert.equal(differentNote.type, "status_changed");
	assert.equal(differentNote.set.spxSyncNote, note);

	const replacementSnapshot = {
		...nonDeliveredSnapshot,
		trackingNumber: TRACKING_CODES.replacement,
		fingerprint: nonDeliveredSnapshot.fingerprint.replace(
			TRACKING_CODES.delivered,
			TRACKING_CODES.replacement
		),
	};
	assert.equal(
		decideSuccessfulSpxSync(stored, replacementSnapshot).type,
		"status_changed"
	);

	const newError = decideFailedSpxSync(stored, SPX_SYNC_ERROR_CODES.TIMEOUT);
	assert.equal(newError.shouldMutate, true);
	const sameErrorOrder = { ...stored, spxSyncError: SPX_SYNC_ERROR_CODES.TIMEOUT };
	assert.equal(
		decideFailedSpxSync(sameErrorOrder, SPX_SYNC_ERROR_CODES.TIMEOUT).shouldMutate,
		false
	);
	assert.equal(
		decideSuccessfulSpxSync(sameErrorOrder, nonDeliveredSnapshot).type,
		"clear_error"
	);
});

await test("builds one atomic delivered decision with valid legacy migration", () => {
	const legacyNotes =
		`manual prefix\n${SPX_NOTES_START_MARKER}\nold snapshot\n` +
		`${SPX_NOTES_END_MARKER}\nmanual suffix`;
	const decision = decideSuccessfulSpxSync(
		eligibleOrder({ adminNotes: legacyNotes }),
		snapshotFrom(deliveredFixture)
	);
	assert.equal(decision.type, "complete_order");
	assert.equal(decision.set.status, "completed");
	assert.equal(decision.set.spxTrackingNumber, TRACKING_CODES.delivered);
	assert.equal(decision.set.spxSyncNote, buildSpxSyncNote(snapshotFrom(deliveredFixture)));
	assert.equal(decision.set.adminNotes, "manual prefix\nmanual suffix");
});

await test("updates and completes despite malformed legacy markers", () => {
	const malformedNotes = `${SPX_NOTES_START_MARKER}\nmanual cleanup required`;
	const decision = decideSuccessfulSpxSync(
		eligibleOrder({
			adminNotes: malformedNotes,
			spxSyncError: SPX_SYNC_ERROR_CODES.TIMEOUT,
		}),
		snapshotFrom(deliveredFixture)
	);
	assert.equal(decision.type, "complete_order");
	assert.equal(decision.set.status, "completed");
	assert.equal(typeof decision.set.spxSyncNote, "string");
	assert.equal(Object.hasOwn(decision.set, "adminNotes"), false);
	assert.deepEqual(decision.unset, ["spxSyncError"]);
	assert.equal(decision.attentionErrorCode, SPX_SYNC_ERROR_CODES.MARKER_ERROR);
});

await test("provider errors preserve the last successful notes", () => {
	const order = eligibleOrder({
		adminNotes: `${SPX_NOTES_START_MARKER}\nlegacy\n${SPX_NOTES_END_MARKER}`,
		spxSyncNote: "last successful snapshot",
	});
	const decision = decideFailedSpxSync(order, SPX_SYNC_ERROR_CODES.TIMEOUT);
	assert.deepEqual(decision.set, { spxSyncError: SPX_SYNC_ERROR_CODES.TIMEOUT });
	assert.equal(Object.hasOwn(decision.set, "adminNotes"), false);
	assert.equal(Object.hasOwn(decision.set, "spxSyncNote"), false);
});

await test("enforces published-only discovery, overflow sentinel, and bounded concurrency", async () => {
	assert.equal(SANITY_DRAFT_ORDERS_QUERY.includes('_type == "ordersLighter"'), true);
	assert.equal(SANITY_DRAFT_ORDERS_QUERY.includes('_id in path("drafts.**")'), true);
	assert.equal(SANITY_DRAFT_ORDERS_QUERY.includes("{\n  ...\n}"), true);
	assert.equal(SANITY_DRAFT_ORDERS_QUERY.includes("status =="), false);
	assert.equal(SANITY_DRAFT_ORDERS_QUERY.includes("trackingNumber"), false);
	assert.equal(SPX_ELIGIBLE_ORDERS_QUERY.includes('!(_id in path("drafts.**"))'), true);
	assert.equal(SPX_ELIGIBLE_ORDERS_QUERY.includes("[0...26]"), true);
	assert.equal(SPX_ELIGIBLE_ORDERS_QUERY.includes("spxSyncNote"), true);
	assert.equal(hasSpxCapacityOverflow(25), false);
	assert.equal(hasSpxCapacityOverflow(26), true);

	let active = 0;
	let maxActive = 0;
	const results = await mapWithConcurrency([1, 2, 3, 4, 5, 6], 2, async (value) => {
		active += 1;
		maxActive = Math.max(maxActive, active);
		await new Promise((resolve) => setTimeout(resolve, 2));
		active -= 1;
		return value * 2;
	});
	assert.deepEqual(results, [2, 4, 6, 8, 10, 12]);
	assert.equal(maxActive, 2);
});

await test("builds a revision-guarded atomic draft publish transaction", () => {
	const draft = draftOrder("publish-me", {
		customCompleteField: { nested: ["preserved"] },
	});
	const mutations = buildDraftPublishMutations(draft);
	assert.equal(getPublishedOrderId(draft._id), "publish-me");
	assert.equal(getPublishedOrderId("publish-me"), null);
	assert.deepEqual(mutations[0], {
		patch: {
			id: "drafts.publish-me",
			ifRevisionID: "revision-publish-me",
			set: { spxCronPublishGuard: "revision-publish-me" },
		},
	});
	assert.equal(mutations[1].createOrReplace._id, "publish-me");
	assert.equal(mutations[1].createOrReplace._type, "ordersLighter");
	assert.deepEqual(mutations[1].createOrReplace.customCompleteField, {
		nested: ["preserved"],
	});
	assert.equal("_rev" in mutations[1].createOrReplace, false);
	assert.equal("_updatedAt" in mutations[1].createOrReplace, false);
	assert.deepEqual(mutations[2], { delete: { id: "drafts.publish-me" } });
	assert.throws(
		() => buildDraftPublishMutations({ ...draft, _type: "otherType" }),
		/INVALID_ORDERS_LIGHTER_DRAFT/
	);
	assert.throws(
		() => buildDraftPublishMutations({ ...draft, _id: "published-id" }),
		/INVALID_ORDERS_LIGHTER_DRAFT/
	);
});

await test("runs cleanly with no drafts and no eligible SPX orders", async () => {
	let publishCalls = 0;
	let alertCalls = 0;
	const result = await runAuthorizedSpxSync(
		authorizedRunInput({
			getDraftOrders: async () => [],
			publishDraftOrder: async () => {
				publishCalls += 1;
			},
			getEligibleOrders: async () => [],
			processEligibleOrder: async () => {
				throw new Error("No order should be processed");
			},
			sendAlert: async (failures) => {
				alertCalls += 1;
				assert.deepEqual(failures, []);
				return { status: "not_required" };
			},
		})
	);
	assert.equal(result.httpStatus, 200);
	assert.deepEqual(result.publishing, {
		queried: 0,
		attempted: 0,
		published: 0,
		failed: 0,
	});
	assert.equal(result.summary.checked, 0);
	assert.equal(publishCalls, 0);
	assert.equal(alertCalls, 1);
});

await test("publishes drafts before SPX discovery so new records participate", async () => {
	const drafts = [draftOrder("new-a"), draftOrder("new-b")];
	const published = [];
	const processed = [];
	const result = await runAuthorizedSpxSync(
		authorizedRunInput({
			getDraftOrders: async () => drafts,
			publishDraftOrder: async (draft) => {
				published.push(getPublishedOrderId(draft._id));
			},
			getEligibleOrders: async () => {
				assert.deepEqual(published.sort(), ["new-a", "new-b"]);
				return [eligibleOrder({ _id: "new-a" })];
			},
			processEligibleOrder: async (order) => {
				processed.push(order._id);
				return processedOrderResult(order._id);
			},
			sendAlert: async (failures) => {
				assert.deepEqual(failures, []);
				return { status: "not_required" };
			},
		})
	);
	assert.equal(result.httpStatus, 200);
	assert.deepEqual(result.publishing, {
		queried: 2,
		attempted: 2,
		published: 2,
		failed: 0,
	});
	assert.deepEqual(processed, ["new-a"]);
	assert.equal(result.summary.queried, 1);
	assert.equal(result.summary.checked, 1);
});

await test("bounds concurrent Sanity draft publish mutations", async () => {
	let active = 0;
	let maxActive = 0;
	const result = await runAuthorizedSpxSync(
		authorizedRunInput({
			getDraftOrders: async () =>
				Array.from({ length: 7 }, (_, index) => draftOrder(`bounded-${index}`)),
			publishDraftOrder: async () => {
				active += 1;
				maxActive = Math.max(maxActive, active);
				await new Promise((resolve) => setTimeout(resolve, 2));
				active -= 1;
			},
			getEligibleOrders: async () => [],
			processEligibleOrder: async () => {
				throw new Error("No order should be processed");
			},
			sendAlert: async () => ({ status: "not_required" }),
		})
	);
	assert.equal(result.publishing.published, 7);
	assert.equal(maxActive, 3);
});

await test("continues SPX work after a draft conflict and returns compact non-PII failure output", async () => {
	const drafts = [draftOrder("conflict"), draftOrder("published")];
	let spxDiscoveryCalls = 0;
	let spxProcessCalls = 0;
	let alertCalls = 0;
	const result = await runAuthorizedSpxSync(
		authorizedRunInput({
			getDraftOrders: async () => drafts,
			publishDraftOrder: async (draft) => {
				if (draft._id === "drafts.conflict") {
					const error = new Error("synthetic conflict");
					error.statusCode = 409;
					throw error;
				}
			},
			getEligibleOrders: async () => {
				spxDiscoveryCalls += 1;
				return [eligibleOrder({ _id: "published" })];
			},
			processEligibleOrder: async (order) => {
				spxProcessCalls += 1;
				return processedOrderResult(order._id);
			},
			sendAlert: async (failures, summary, publishing) => {
				alertCalls += 1;
				assert.equal(failures.length, 1);
				assert.equal(failures[0].phase, "sanity_publish");
				assert.equal(
					failures[0].errorCode,
					SPX_SYNC_ERROR_CODES.SANITY_DRAFT_REVISION_CONFLICT
				);
				assert.equal(summary.failed, 1);
				assert.equal(publishing.failed, 1);
				return { status: "sent" };
			},
		})
	);
	assert.equal(result.httpStatus, 500);
	assert.equal(result.error, "sanity_publish_failed");
	assert.equal(spxDiscoveryCalls, 1);
	assert.equal(spxProcessCalls, 1);
	assert.equal(alertCalls, 1);
	assert.deepEqual(result.publishing, {
		queried: 2,
		attempted: 2,
		published: 1,
		failed: 1,
	});
	assert.equal(result.results[0].orderId, "conflict");
	assert.equal(result.results[0].result, "draft_publish_conflict");
	const compactOutput = JSON.stringify(result);
	assert.equal(compactOutput.includes("Must not appear"), false);
	assert.equal(compactOutput.includes("0900000000"), false);
	assert.equal(compactOutput.includes("orderItems"), false);
});

await test("aborts after draft discovery failure and sends one Sanity publish alert", async () => {
	let publishCalls = 0;
	let spxDiscoveryCalls = 0;
	let alertCalls = 0;
	const result = await runAuthorizedSpxSync(
		authorizedRunInput({
			getDraftOrders: async () => {
				throw new Error("synthetic draft query failure");
			},
			publishDraftOrder: async () => {
				publishCalls += 1;
			},
			getEligibleOrders: async () => {
				spxDiscoveryCalls += 1;
				return [];
			},
			processEligibleOrder: async () => {
				throw new Error("No order should be processed");
			},
			sendAlert: async (failures) => {
				alertCalls += 1;
				assert.deepEqual(failures, [
					{
						phase: "sanity_publish",
						errorCode: SPX_SYNC_ERROR_CODES.SANITY_DRAFT_QUERY_ERROR,
					},
				]);
				return { status: "sent" };
			},
		})
	);
	assert.equal(result.httpStatus, 500);
	assert.equal(result.error, "sanity_draft_query_failed");
	assert.equal(result.summary.failed, 1);
	assert.equal(publishCalls, 0);
	assert.equal(spxDiscoveryCalls, 0);
	assert.equal(alertCalls, 1);
});

await test("reports capacity overflow after publishing without processing SPX orders", async () => {
	let processCalls = 0;
	let alertCalls = 0;
	const result = await runAuthorizedSpxSync(
		authorizedRunInput({
			getDraftOrders: async () => [draftOrder("capacity")],
			publishDraftOrder: async () => undefined,
			getEligibleOrders: async () =>
				Array.from({ length: 26 }, (_, index) =>
					eligibleOrder({ _id: `capacity-${index}` })
				),
			processEligibleOrder: async () => {
				processCalls += 1;
				return processedOrderResult("unexpected");
			},
			sendAlert: async (failures, _summary, publishing) => {
				alertCalls += 1;
				assert.equal(
					failures.some(
						(failure) =>
							failure.errorCode === SPX_SYNC_ERROR_CODES.CAPACITY_EXCEEDED
					),
					true
				);
				assert.equal(publishing.published, 1);
				return { status: "sent" };
			},
		})
	);
	assert.equal(result.httpStatus, 409);
	assert.equal(result.error, "capacity_exceeded");
	assert.equal(result.summary.queried, 26);
	assert.equal(result.publishing.published, 1);
	assert.equal(processCalls, 0);
	assert.equal(alertCalls, 1);

	const combined = await runAuthorizedSpxSync(
		authorizedRunInput({
			getDraftOrders: async () => [draftOrder("capacity-failure")],
			publishDraftOrder: async () => {
				throw new Error("synthetic publish failure before capacity check");
			},
			getEligibleOrders: async () =>
				Array.from({ length: 26 }, (_, index) =>
					eligibleOrder({ _id: `combined-capacity-${index}` })
				),
			processEligibleOrder: async () => {
				throw new Error("Capacity overflow must stop SPX processing");
			},
			sendAlert: async () => ({ status: "sent" }),
		})
	);
	assert.equal(combined.httpStatus, 500);
	assert.equal(combined.error, "draft_publish_failed_and_capacity_exceeded");
});

await test("combines draft-publish and SPX failures into one alert and prefers HTTP 500", async () => {
	let alertCalls = 0;
	const result = await runAuthorizedSpxSync(
		authorizedRunInput({
			getDraftOrders: async () => [draftOrder("publish-failure")],
			publishDraftOrder: async () => {
				throw new Error("synthetic publish failure");
			},
			getEligibleOrders: async () => [eligibleOrder({ _id: "spx-failure" })],
			processEligibleOrder: async (order) =>
				processedOrderResult(order._id, {
					result: {
						orderId: order._id,
						result: "provider_error",
						errorCode: SPX_SYNC_ERROR_CODES.TIMEOUT,
					},
					unchanged: 0,
					failed: 1,
					attentionRequired: 1,
					transientProviderFailure: true,
					failures: [
						{
							phase: "spx_api",
							errorCode: SPX_SYNC_ERROR_CODES.TIMEOUT,
							orderId: order._id,
						},
					],
				}),
			sendAlert: async (failures) => {
				alertCalls += 1;
				assert.deepEqual(
					new Set(failures.map((failure) => failure.phase)),
					new Set(["sanity_publish", "spx_api"])
				);
				return { status: "sent" };
			},
		})
	);
	assert.equal(result.httpStatus, 500);
	assert.equal(result.error, "sanity_publish_failed");
	assert.equal(result.summary.failed, 2);
	assert.equal(result.summary.attentionRequired, 2);
	assert.equal(alertCalls, 1);
});

await test("aggregates malformed legacy markers as non-provider attention", async () => {
	let observedFailures = [];
	const result = await runAuthorizedSpxSync(
		authorizedRunInput({
			getDraftOrders: async () => [],
			publishDraftOrder: async () => {
				throw new Error("No draft publish expected");
			},
			getEligibleOrders: async () => [eligibleOrder({ _id: "marker-attention" })],
			processEligibleOrder: async (order) =>
				processedOrderResult(order._id, {
					result: {
						orderId: order._id,
						result: "completed",
						errorCode: SPX_SYNC_ERROR_CODES.MARKER_ERROR,
					},
					changed: 1,
					completed: 1,
					unchanged: 0,
					attentionRequired: 1,
					failures: [
						{
							phase: "orchestration",
							errorCode: SPX_SYNC_ERROR_CODES.MARKER_ERROR,
							orderId: order._id,
						},
					],
				}),
			sendAlert: async (failures) => {
				observedFailures = failures;
				return { status: "sent" };
			},
		})
	);
	assert.equal(result.httpStatus, 200);
	assert.equal(result.summary.changed, 1);
	assert.equal(result.summary.completed, 1);
	assert.equal(result.summary.failed, 0);
	assert.equal(result.summary.attentionRequired, 1);
	assert.equal(observedFailures[0].errorCode, SPX_SYNC_ERROR_CODES.MARKER_ERROR);
});

await test("strips crafted SPX metadata from order creation input", () => {
	const sanitized = stripServerManagedSpxFields({
		customerName: "Synthetic",
		spxSyncNote: "injected automated snapshot",
		spxTrackingNumber: TRACKING_CODES.delivered,
		spxTrackingStatus: "Delivered",
		spxTrackingEventCode: "F980",
		spxTrackingEventAt: "2026-01-01T00:00:00.000Z",
		spxSyncError: SPX_SYNC_ERROR_CODES.TIMEOUT,
	});
	assert.deepEqual(sanitized, { customerName: "Synthetic" });
});

await test("classifies auth, HTTP policies, revision conflicts, and Sanity timeouts", () => {
	const compare = (left, right) => left === right;
	assert.equal(authorizeSpxCronRequest("GET", "secret", "secret", compare), "method_not_allowed");
	assert.equal(authorizeSpxCronRequest("POST", undefined, "secret", compare), "server_misconfigured");
	assert.equal(authorizeSpxCronRequest("POST", "secret", "wrong", compare), "unauthorized");
	assert.equal(authorizeSpxCronRequest("POST", "secret", "secret", compare), "authorized");
	assert.equal(getSpxSyncHttpStatus({}), 200);
	assert.equal(getSpxSyncHttpStatus({ capacityOverflow: true }), 409);
	assert.equal(getSpxSyncHttpStatus({ sanityFailure: true }), 500);
	assert.equal(getSpxSyncHttpStatus({ transientProviderFailure: true }), 502);
	assert.equal(
		classifySanityError({ statusCode: 409 }, "update"),
		SPX_SYNC_ERROR_CODES.SANITY_REVISION_CONFLICT
	);
	assert.equal(
		classifySanityError({ response: { statusCode: 409 } }, "draft_publish"),
		SPX_SYNC_ERROR_CODES.SANITY_DRAFT_REVISION_CONFLICT
	);
	assert.equal(
		classifySanityError({ name: "AbortError" }, "draft_query"),
		SPX_SYNC_ERROR_CODES.SANITY_DRAFT_QUERY_TIMEOUT
	);
	assert.equal(
		classifySanityError({ message: "request timed out" }, "draft_publish"),
		SPX_SYNC_ERROR_CODES.SANITY_DRAFT_PUBLISH_TIMEOUT
	);
	assert.equal(
		classifySanityError({ message: "request timeout" }, "query"),
		SPX_SYNC_ERROR_CODES.SANITY_QUERY_TIMEOUT
	);
	assert.equal(
		classifySanityError({ name: "AbortError" }, "update"),
		SPX_SYNC_ERROR_CODES.SANITY_UPDATE_TIMEOUT
	);
	assert.equal(
		classifySanityError(
			{ code: "ESOCKETTIMEDOUT", message: "Socket timed out on request" },
			"query"
		),
		SPX_SYNC_ERROR_CODES.SANITY_QUERY_TIMEOUT
	);
});

await test("formats one bounded HTML-safe Telegram alert with ten-order cap", () => {
	const failures = Array.from({ length: 14 }, (_, index) => ({
		phase: index % 2 ? "spx_api" : "sanity_update",
		errorCode: index % 2 ? SPX_SYNC_ERROR_CODES.TIMEOUT : SPX_SYNC_ERROR_CODES.SANITY_UPDATE_ERROR,
		orderId: `order-${index}<unsafe>`,
		orderNumber: `ORDER-${index}<unsafe>`,
	}));
	const message = formatSpxSyncErrorMessage({
		runTime: new Date("2026-08-28T10:00:00.000Z"),
		environment: "production<script>",
		summary: {
			queried: 14,
			checked: 14,
			changed: 2,
			completed: 1,
			unchanged: 0,
			skipped: 0,
			failed: 14,
			attentionRequired: 14,
		},
		publishing: {
			queried: 3,
			attempted: 3,
			published: 2,
			failed: 1,
		},
		failures,
	});
	assert.equal(message.length <= 3500, true);
	assert.equal(message.includes("<script>"), false);
	assert.equal(message.includes("&lt;unsafe&gt;"), true);
	assert.equal(message.includes("4 additional affected order(s) omitted"), true);
	assert.equal((message.match(/<a href=/g) || []).length, 10);
	assert.equal(message.includes("publishing: 3 queried / 3 attempted / 2 published / 1 failed"), true);
});

await test("groups multiple failure categories for the same affected order", () => {
	const failures = Array.from({ length: 6 }, (_, index) => [
		{
			phase: "spx_api",
			errorCode: SPX_SYNC_ERROR_CODES.TIMEOUT,
			orderId: `order-${index}`,
		},
		{
			phase: "sanity_update",
			errorCode: SPX_SYNC_ERROR_CODES.SANITY_UPDATE_ERROR,
			orderId: `order-${index}`,
		},
	]).flat();
	const message = formatSpxSyncErrorMessage({
		runTime: new Date("2026-08-28T10:00:00.000Z"),
		environment: "production",
		summary: {
			queried: 6,
			checked: 6,
			changed: 0,
			completed: 0,
			unchanged: 0,
			skipped: 0,
			failed: 6,
			attentionRequired: 6,
		},
		failures,
	});
	assert.equal((message.match(/<a href=/g) || []).length, 6);
	assert.equal(message.includes("additional affected order"), false);
	assert.equal(message.includes("SPX_TIMEOUT, SANITY_UPDATE_ERROR"), true);
});

await test("validates dedicated server-only Telegram credentials", () => {
	const validToken = `123456:${"A".repeat(35)}`;
	assert.equal(validateTelegramCredentials(validToken, "-100123").isValid, true);
	assert.equal(validateTelegramCredentials("bad", "chat").isValid, false);
});

await test("bounds Telegram retries, request timeout, and insufficient budget", async () => {
	let attempts = 0;
	let observedTimeout = 0;
	const client = {
		sendMessage: async (_chatId, _message, options) => {
			attempts += 1;
			observedTimeout = options.requestTimeoutMs;
			return attempts === 1
				? { success: false, error: "synthetic" }
				: { success: true, messageId: 1 };
		},
	};
	const result = await sendWithRetry(client, "1", "message", {
		maxRetries: 2,
		baseDelayMs: 1,
		requestTimeoutMs: 50,
		deadlineAt: Date.now() + 500,
		suppressErrorLogs: true,
	});
	assert.equal(result.success, true);
	assert.equal(attempts, 2);
	assert.equal(observedTimeout <= 50, true);

	let exhaustedAttempts = 0;
	const exhausted = await sendWithRetry(
		{
			sendMessage: async () => {
				exhaustedAttempts += 1;
				return { success: false };
			},
		},
		"1",
		"message",
		{ deadlineAt: Date.now() - 1, suppressErrorLogs: true }
	);
	assert.equal(exhausted.error, "TELEGRAM_BUDGET_EXHAUSTED");
	assert.equal(exhaustedAttempts, 0);
});

await test("keeps route auth before external calls and Sanity mutations guarded/change-only", async () => {
	const routeSource = await readFile(
		path.join(repositoryRoot, "pages/api/cron/sync-spx-orders.ts"),
		"utf8"
	);
	const sanitySource = await readFile(
		path.join(repositoryRoot, "api-client/sanity-server.ts"),
		"utf8"
	);
	assert.equal(
		routeSource.indexOf("authorizeSpxCronRequest") <
			routeSource.lastIndexOf("runAuthorizedSpxSync({"),
		true
	);
	assert.equal(sanitySource.includes('visibility: "sync"'), true);
	assert.equal(sanitySource.includes("buildDraftPublishMutations(draft)"), true);
	assert.equal(sanitySource.includes(".ifRevisionId(order._rev)"), true);
	assert.equal(sanitySource.includes("returnDocuments: false"), true);
	assert.equal(sanitySource.includes('visibility: "async"'), true);
	assert.equal(sanitySource.includes("if (!decision.shouldMutate) return null"), true);
});

console.log(`\nSPX regression passed: ${passed} deterministic checks`);
