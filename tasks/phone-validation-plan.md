# Phone Validation — Quote Request Form (Implementation Plan)

Source: `tasks/phone-validation-clarification.md` (recommended defaults A1–A10 = approved
scope).

Scope: **S1 required** · **S2 in scope (A3 advisory / A7 fail-open / A9 server-side)** ·
**S3 in scope (A6 / A10)**.

> **This document is the source of truth.** The review section below (Gap Report,
> Assumption Report, Over-engineering Report) validates the plan in reverse against
> the clarification; the **Revised Implementation Tasks** supersede the original
> task list.

## Reverse Validation Summary

Walking backwards from the clarification: **if all Revised Tasks 1–8 are complete,
every acceptance criterion and the business goal are satisfied.**

| AC | Satisfied by |
| --- | --- |
| AC1 (invalid blocked inline; no Sanity/Telegram) | Task 2 (client-side gate — see Assumption A-1) |
| AC2 (valid submits; Sanity + Telegram unchanged) | Tasks 2, 6, 7 |
| AC3 (VN error w/ example) | Task 2 |
| AC4 (normalized canonical stored) | Task 2 |
| AC5 (S2 advisory, never blocks, fail-open) | Tasks 3, 4, 5 |
| AC6 (S3 dialog only zalo, post-validation, cancel/confirm) | Task 6 |
| AC7 (regression: valid flow unchanged) | Tasks 2, 6, 7, 8 |
| AC8 (lint) | Task 7 |
| AC9 (no duplicate/new analytics) | Tasks 5, 6 |

Gaps found and closed: stale advisory-hint state, helperText error/hint precedence,
fail-open at the HTTP layer (429/network), probe-classifier robustness, dialog
double-submit guard, production-environment probe verification, and automated
regression coverage for the form (Task 8).

## Architecture Overview

```
Browser  ── GET /contact/form ──►  pages/contact/form/index.tsx
                                   └── components/contact/QuoteRequestForm.tsx   (react-hook-form + MUI)
                                        │
                                        │ react-hook-form rules (format)   [S1]
                                        │ normalizePhone() at submit       [S1/A2]
                                        │ debounced advisory check         [S2]
                                        │   └─► hooks/usePhoneZaloCheck.ts
                                        │         └─► POST /api/validate-phone
                                        │               └─► utils/zalo/index.ts (probe + retry)
                                        │                                    └─► zalo.me/<phone> (mobile UA)
                                        │
                                        │ dialog intercept when channel=zalo [S3]
                                        │   └─► store/dialog (global Zustand) showDialog(YESNO)
                                        │
                                        ▼
                        submit(data) ──► useSubmitQuoteRequest ──► quoteRequestApi.create
                                                                        └─► Sanity (form-nhan-bao-gia)
                        + useTelegramQuoteNotification ──► POST /api/telegram/send-quote-notification
```

Key decisions from the clarification:
- **S1** is the hard gate: strict 10-digit VN mobile format (A1) + normalization (A2).
- **S2** is strictly **advisory**: never blocks (A3), fails open (A7), server-side only
  with no phone logging (A9).
- **S3** is a confirmation dialog shown **only** for the `zalo` channel (A6), reusing
  the existing global dialog system; analytics reuse `cta_click` (A10).
- Existing submit pipeline (Sanity write + Telegram + toast + success card) is
  untouched and fires only on final confirm.

## Files to Modify

1. `components/contact/QuoteRequestForm.tsx` — phone rules + normalization, advisory
   hint, submit interception, analytics. (All S1/S2/S3 client work lands here.)
2. `scripts/regression-test.sh` (or new `scripts/regression-test-quote-form.sh`) —
   new regression phase (Task 8).
3. `pages/contact/form/index.tsx` — **likely no change**; verify only.

## New Files

1. `utils/phone.ts` — `normalizePhone()`, `isValidVietnamesePhone()` (S1).
2. `utils/zalo/index.ts` — `checkZaloRegistered()` probe, mobile UA, one retry,
   fail-open, no logging (S2).
3. `pages/api/validate-phone.ts` — server-side API route (S2), following
   `pages/api/telegram/*` conventions (rateLimit, `x-api-key`, method guard).
4. `hooks/usePhoneZaloCheck.ts` — debounced client hook (S2).

## Database Changes

- **None.** Sanity schema and `phone` field type unchanged. Existing docs keep old
  values; recovery of >20 bad-number leads is out of scope (A5).

## API Changes

- **New:** `POST /api/validate-phone`
  - Request: `{ phone: string }`; Response:
    `{ success: boolean; formatValid: boolean; zaloRegistered: boolean | null; error?: string }`
  - `zaloRegistered: null` = probe failed / unknown / **route rate-limited (429)** →
    never an error (A7).
  - POST-only (405), `x-api-key` (401), rate-limited via `@/utils/rateLimit`.
  - No logging of the phone number (A9).
- **Unchanged:** `POST /api/telegram/send-quote-notification`.
- Client sends `x-api-key` automatically via the existing axios interceptor.

## State Changes

- New local state in `QuoteRequestForm` / `usePhoneZaloCheck`:
  `"idle" | "checking" | "registered" | "not_registered" | "unknown"` for the Zalo
  hint. No persistence, no localStorage.
- S3 reuses the existing global Zustand dialog store (`DIALOG_TYPES.YESNO_DIALOG` via
  `showDialog({ type, data: { onOk, onCancel } })`) — no new store or reducer.
- `submitSuccess`, `isLoading`, `isSubmitting` behavior unchanged.

## Risks

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Zalo probe breaks / rate-limits / ToS change | Medium | Low | Advisory only + fail-open; optional env kill-switch |
| Flaky "not found" path (connection resets) | High | Low | 1 retry + fail-open → `null` |
| Zalo blocks production/datacenter IPs | Medium | Low | Fail-open; verify from deployed env (Task 7) |
| False "not registered" for legit non-Zalo users | Medium | Low | Never blocks; advisory copy lets user proceed |
| Regress the business-critical submit flow | Low | High | Dialog only intercepts `zalo` channel; existing pipeline intact; regression phase (Task 8) |
| Debounce/abort bugs → stale hints or check spam | Low | Medium | Debounce ~500ms, format-gated, reset-to-idle on change, abort/cleanup |
| `form_submit` fired twice or double dialog on rapid submit | Low | Medium | `form_submit` fires once in real submit; dialog-open guard |
| Privacy: numbers sent to Zalo | — | — | Server-side only, no logging (A9) |

## Dependencies

- **No new npm packages.** `axios`, `lru-cache`, `react-hook-form`, MUI `Dialog`,
  Zustand dialog store, `agent-browser` (regression script) all exist.
- **External:** Zalo public `zalo.me` endpoint (unofficial, no SLA) — handled by
  advisory + fail-open.
- **Optional env flag** (recommended): `NEXT_PUBLIC_ENABLE_ZALO_PHONE_CHECK` to
  disable S2/S3 without a deploy (matches existing `ENABLE_UMAMI`/`ENABLE_FB_CHAT`
  pattern in `utils/env-const.ts`).

## Rollback Strategy

- Each slice is independently revertible (no DB migration):
  - **S1:** restore the original `pattern` rule in `QuoteRequestForm.tsx`.
  - **S2:** remove `pages/api/validate-phone.ts` + `utils/zalo/` + hook + hint block;
    or flip the env flag off.
  - **S3:** remove the submit-intercept block in `QuoteRequestForm.tsx`.
- Rollback = revert commit (or delete new files) + `pnpm lint` re-check. Historical
  data untouched; no data rollback required.

---

# Review — Gap Report

1. **Stale advisory hint (G-1).** Task 5 aborts the in-flight check on phone change but
   doesn't reset status to `idle`. A stale "chưa đăng ký Zalo" hint would linger while
   the user types a new number. → **Task 5 AC amended:** reset to `idle` on any change.
2. **helperText precedence (G-2).** When S1 format error and the advisory hint coexist,
   the required-format error must win; the hint must never mask a blocking error.
   → **Task 5 AC amended.**
3. **Fail-open at the HTTP layer (G-3).** Task 4 fails open on probe errors, but a route
   **429 (rate limit)** or client network/HTTP error also occurs outside the probe. The
   client must treat non-2xx and network errors as `unknown` → silent.
   → **Task 5 AC amended.**
4. **Probe classifier robustness (G-4).** Task 3 classifies `zalo.me` (true) and
   app-store hosts (false); any other final host (login wall, unknown) is unspecified.
   Zalo behavior can change → anything unexpected must map to `null`.
   → **Task 3 AC amended.**
5. **No automated regression coverage for the form (G-5).** AC7 is only manual; the
   repo's `scripts/regression-test.sh` (agent-browser) has **no contact/quote phase**.
   → **New Task 8:** extend the regression script with a quote-form phase.
6. **Dialog double-submit guard (G-6).** Rapid double-click on submit could stack two
   dialogs via the global store. → **Task 6 AC amended:** guard against showing when
   already open/loading.
7. **Dialog restates canonical number (G-7).** Dialog should restate the normalized
   phone (the stored value), not the raw input. → **Task 6 AC amended.**
8. **Production probe verification (G-8).** Investigation ran from a dev machine; Zalo
   may treat the production server differently. → **Task 7 AC amended:** verify the
   probe (and its fail-open path) from the deployed environment.

# Review — Assumption Report

- **A-1 (client-only gate):** AC1 is satisfied at the UI layer; there is **no
  server-side enforcement** of phone format on the Sanity write (`quoteRequestApi.create`
  is a public browser call). A crafted direct write can bypass. Accepted: matches the
  existing architecture and A3/A4; server-side re-architecture is explicitly out of
  scope.
- **A-2 (probe semantics):** the Zalo probe answers "does this number exist as a Zalo
  account", not "is this a correct phone". Advisory only; `0912345678` (a registered
  Zalo account) passes the probe and may still be a dummy lead.
- **A-3 (unexpected probe responses):** any final host other than `zalo.me` /
  app-store hosts (e.g. a future login wall) is treated as `unknown` → silent, per A7.
- **A-4 (prefix handling):** only `+84` → `0` is normalized (A2). `0084`, `84`
  (without `+`), and landline numbers (incl. Da Nang `0236`) are **rejected** (A1).
- **A-5 (cta_click analytics):** existing `cta_click` usages fire GA-only via
  `trackEvent` (no Umami handler exists for it). A10's "reuse cta_click" follows this
  project-wide pattern; no new Umami event is introduced (consistent with "no new
  events", AC9).
- **A-6 (no test framework):** no unit-test runner is introduced. Verification is
  `pnpm lint` → `pnpm build` → agent-browser regression script + manual flow check
  (repo convention). Pure helpers (`utils/phone.ts`) are covered by the regression
  phase and lint/build, not by a new framework.
- **A-7 (dialog infra):** the global dialog store's `showDialog`/`hideDialog` stack
  behavior is reused as-is; no store changes. YESNO_DIALOG is used without `reconfirm`
  to avoid the reconfirm stack behavior.
- **A-8 (no persisted probe result):** the Zalo result is ephemeral/advisory; it is
  **not** stored in Sanity (schema changes are excluded).
- **A-9 (11-digit legacy):** per A8, 11-digit numbers are rejected by format
  validation **before** the probe runs, even though some exist on Zalo.

# Review — Over-engineering Report

- **No new validation library** — reuses react-hook-form `rules` + `utils/phone.ts`.
- **No server-side submission enforcement** — deliberately excluded (A3/A4); would
  require re-architecting the direct Sanity write.
- **No new analytics event names and no Umami handler for `cta_click`** — follows the
  existing `cta_click` pattern (A10).
- **Single retry only** for the probe — no exponential backoff machinery (A7 says
  "optionally one retry").
- **No test framework** — extends the existing agent-browser regression script instead.
- **No 11-digit / landline acceptance logic** — strict A1/A8 kept.
- **No phone auto-correction / suggestions / autocomplete** — out of scope.
- **No DB field to persist the Zalo result** — schema changes excluded; the hint is
  in-memory only.
- **Optional env kill-switch only** (not a full flag system) — matches existing
  `ENABLE_UMAMI`/`ENABLE_FB_CHAT` pattern; recommended, not mandatory.

---

# Revised Implementation Tasks

### Task 1 — Phone utility (format + normalization)

- **Objective:** Create `utils/phone.ts` with `normalizePhone()` and
  `isValidVietnamesePhone()` shared by the client rules and the API route.
- **Files:** `utils/phone.ts` (new)
- **Estimated complexity:** Low
- **Acceptance criteria:**
  - `normalizePhone` strips spaces/dashes/parens, converts `+84` → `0`.
  - `isValidVietnamesePhone` returns true only for exactly 10 digits starting with
    `03/05/07/08/09`; rejects short, long, 11-digit legacy, landline, `0084`, and `84`
    (no `+`) forms (A1, A8, A-4).
  - No TS errors under `strict: false`; no new dependencies.

- [x]

### Task 2 — Strict client-side phone validation (S1)

- **Objective:** Replace the loose pattern rule in `QuoteRequestForm.tsx` with the new
  format validation; normalize the phone before submit.
- **Files:** `components/contact/QuoteRequestForm.tsx` (modify), `utils/phone.ts`
- **Estimated complexity:** Low–Medium
- **Acceptance criteria:**
  - Invalid input (e.g. `12`, `9999`, `08683612311`, letters) blocked inline in
    Vietnamese (AC1, AC3); no Sanity doc, no Telegram.
  - Valid 10-digit numbers pass; stored value is canonical leading-`0` (AC2, AC4).
  - Error message includes a valid example (AC3).
  - Optional (recommended): `inputMode="tel"` + `maxLength` hint on the phone field to
    reduce wrong input at the source.
  - Existing valid submit flow (toast, Telegram, success card, `reset`) unchanged
     (AC7); `pnpm lint` passes (AC8).

- [x]

### Task 3 — Zalo probe utility (S2 server piece)

- **Objective:** Create `utils/zalo/index.ts` — `checkZaloRegistered(phone)` doing a
  mobile-UA `GET https://zalo.me/<normalized>` following redirects and classifying by
  final host.
- **Files:** `utils/zalo/index.ts` (new)
- **Estimated complexity:** Low
- **Acceptance criteria:**
  - Returns `boolean | null`; never throws.
  - Classification: final host `zalo.me` → `true`; app-store hosts
    (`apps.apple.com` / `itunes.apple.com`) → `false`; **any other host or any
    error/network failure → `null`** (G-4, A-3).
  - One retry on the flaky "not found" path (A7).
  - Does not log the phone number (A9).
  - Verified against reference numbers: `0932535175` → `true`;
     `08683612311` / `0000000000` → `false`.

- [x]

### Task 4 — `POST /api/validate-phone` route (S2 server piece)

- **Objective:** Add a Next.js API route wrapping the probe, following the
  `pages/api/telegram/*` conventions.
- **Files:** `pages/api/validate-phone.ts` (new), `utils/rateLimit.ts` (reuse)
- **Estimated complexity:** Medium
- **Acceptance criteria:**
  - POST-only (405), `x-api-key` check (401), rate-limited.
  - Response `{ success, formatValid, zaloRegistered: boolean | null }`; format-invalid
    input → `formatValid: false` without probing (A8).
  - Probe error → `zaloRegistered: null`, `success: true` (fail-open, A7).
  - **Rate-limit hit → return `200` with `zaloRegistered: null`** so the client never
    sees an error for an advisory check (G-3).
  - No phone value written to logs (A9).

- [x]

### Task 5 — Advisory Zalo hint in the form (S2 client piece)

- **Objective:** Add `hooks/usePhoneZaloCheck.ts` (debounced) and render the advisory
  result in the phone field's `helperText`.
- **Files:** `hooks/usePhoneZaloCheck.ts` (new),
  `components/contact/QuoteRequestForm.tsx` (modify)
- **Estimated complexity:** Medium
- **Acceptance criteria:**
  - Check only runs after format validation passes, debounced (~500ms) (AC5, A8).
  - **Status resets to `idle` on any phone change** (G-1).
  - Advisory message shown only when status is `not_registered` and there is **no S1
    format error**; format error always takes precedence in `helperText` (G-2).
  - Non-2xx responses, network errors, and `zaloRegistered: null` are all treated as
    `unknown` → silent, never an error (G-3, AC5).
  - Abort/cleanup on change and unmount; no stale in-flight results applied.
  - **Never blocks submission** (AC5); no new analytics events (AC9).

- [x]

### Task 6 — Zalo-channel confirmation dialog (S3)

- **Objective:** Intercept submit when `receiveQuoteChannel === "zalo"` and all field
  validation passes (guaranteed by react-hook-form running validation before
  `onSubmit`); show the global `YESNO_DIALOG`; only Confirm triggers the real submit.
- **Files:** `components/contact/QuoteRequestForm.tsx` (modify),
  `store/dialog/*` + `components/common/dialog/*` (reused, likely no change)
- **Estimated complexity:** Medium
- **Acceptance criteria:**
  - Dialog appears only for the `zalo` channel and only after all validation passes
    (A6).
  - Content restates the **normalized** phone (G-7) + Zalo "Nhận tin nhắn từ người
    lạ" reminder; Cancel aborts (hides dialog, no submit), Confirm proceeds.
  - **Guard against duplicate dialogs** on rapid double-submit (skip if already open /
    submitting) (G-6).
  - Real submit runs unchanged after Confirm — `form_submit` fires exactly once (AC6,
    AC7, AC9).
  - Confirm/Cancel each fire `cta_click` via `trackEvent` (A10, A-5); no new event
     names.

- [x]

### Task 7 — Verification & regression

- **Objective:** Full verification per AGENTS.md
  (`pnpm lint → pnpm build → manual flow check`); new API route makes `pnpm build`
  mandatory.
- **Files:** verification only
- **Estimated complexity:** Low
- **Acceptance criteria:**
  - `pnpm lint` and `pnpm build` pass (AC8).
  - Manual flows pass: valid non-zalo submit (no dialog); valid zalo submit (dialog →
    confirm → success); invalid phone blocked at format; advisory hint shows but never
    blocks; Sanity doc + Telegram only after final confirm (AC1, AC2, AC7).
  - **Zalo probe verified from the deployed environment**, including the fail-open path
    if the server is blocked by Zalo (G-8).
  - Optional: flip the S2/S3 env flag off and confirm the form falls back to
    format-only validation.

- [ ]

### Task 8 — Automated regression coverage for the quote form (NEW — closes G-5)

- **Objective:** Extend `scripts/regression-test.sh` (or add
  `scripts/regression-test-quote-form.sh`) with a quote-form phase using the existing
  `agent-browser` pattern, so AC1/AC2/AC6/AC7 are exercised automatically.
- **Files:** `scripts/regression-test.sh` (modify) or `scripts/regression-test-quote-form.sh` (new)
- **Estimated complexity:** Medium
- **Acceptance criteria:**
  - Phase navigates to `/contact/form` and asserts:
    1. invalid phone (e.g. `08683612311`) is blocked inline and no success toast /
       Sanity doc / Telegram (AC1);
    2. valid 10-digit phone submits with success toast (AC2);
    3. zalo channel shows the confirmation dialog; Cancel does not submit; Confirm
       submits (AC6, AC7).
  - Follows existing regression-script conventions (phases, `log_result`,
    screenshots, `test-results/`).
  - Idempotent / does not require seeded Sanity data beyond a normal      form run.

- [x]

---

# Audit Fixes Log

> Resolutions applied against `tasks/phone-validation-audit-report.md`. All
> implementation tasks (1–6, 8) remain `[x]`; Task 7 (verification) remains `[ ]`
> until the manual flow checks and deployed-environment probe run.

| # | Audit issue | Resolution | Status |
| --- | --- | --- | --- |
| 1 | `maxLength=15` truncates formatted numbers | `inputProps={{ inputMode: "tel", maxLength: 20 }}` in `QuoteRequestForm.tsx` | [x] |
| 2 | `inputMode` on `TextField` root | Moved into `inputProps` with #1 | [x] |
| 3 | Regression script not executable | `chmod +x scripts/regression-test-quote-form.sh` | [x] |
| 4 | Global rate-limit token | Per-IP token `PHONE_VALIDATE-${getClientIp(req)}`, limit 20/min in `pages/api/validate-phone.ts` | [x] |
| 5 | Duplicate response type | Shared `ValidatePhoneResponse` in `models/phoneValidation.ts`, imported by route + hook | [x] |
| 6 | Dialog guard only checks `FIRST` slot | `Object.values(dialogSlice.isVisible).some(Boolean)` in `QuoteRequestForm.tsx` | [x] |
| 7 | Missing advisory-hint / normalization test coverage | Added Phase 6 (+84 normalization → submit) and Phase 7 (no hint when format invalid) to `scripts/regression-test-quote-form.sh`; asserting a live "not registered" hint remains non-automatable (network-dependent) | [x] (partial) |
| 8 | Env flag only recognized as `"false"` | `isZaloPhoneCheckEnabled()` helper in `utils/env-const.ts` (case-insensitive) | [x] |
| 9 | `onOk` not awaited | `onOk` now `async` + `await onSubmit(payload)` | [x] |
| 10 | `zaloConfirmRef` not reset on `showDialog` throw | Wrapped in `try/catch` resetting the ref | [x] |
| 11 | Script not wired into `package.json` | Added `"regression:quote-form"` script | [x] |
| 12 | Runtime (post-audit): probe threw `TypeError: URL scheme must be a HTTP(S) scheme` | Zalo redirect chain ends in a non-HTTP `itms-appss://` `Location`. `utils/zalo/index.ts` now walks redirects manually (`redirect: "manual"`, max 5 hops) and treats non-HTTP `Location` as terminal (app-store host → `false`). Debug `console.log`s added during triage removed (A9: no phone in logs) | [x] |

Remaining: asserting a live "not registered" Zalo advisory hint in an automated
browser test cannot be done deterministically (depends on Zalo's live
registration data). Covered manually in Task 7.
