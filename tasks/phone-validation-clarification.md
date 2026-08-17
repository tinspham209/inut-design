# Phone Validation — Quote Request Form (Clarification)

Files in scope: `components/contact/QuoteRequestForm.tsx` · `pages/contact/form/index.tsx`

## Business Goal

Eliminate lost sales leads caused by invalid phone numbers submitted via the quote
request ("Nhận báo giá") form. Today the form accepts syntactically-passable but
unreachable numbers (e.g. `12`, `9999`, partial digits), so the sales team has no
way to contact the lead — only the phone field is required, and email is optional
unless the user picks "Email" as the channel. Approximately 20+ leads have already
been lost this way.

## User Story

As a sales representative at INUT Design, I want every quote request to contain a
valid, reachable Vietnamese phone number so I can contact the customer for
consultation and pricing.

## Investigation Findings (idea #1 — Zalo probe)

Empirically tested `curl -sL https://zalo.me/<phone>` on 17 Aug 2026. Results:

| Phone | Result | Meaning |
| --- | --- | --- |
| `0932535175` (valid) | `200` → stays at `https://zalo.me/0932535175` | Registered on Zalo |
| `08683612311` (invalid, 11-digit) | `301` → `itunes.apple.com/.../zalo...` | Not found on Zalo |
| `0000000000` (bogus 10-digit) | `301` → `itunes.apple.com/...` | Not found on Zalo |
| `0912345678` (classic dummy) | `200` → stays at `zalo.me/0912345678` | **Registered on Zalo** |
| `01234567890` (11-digit legacy) | `200` → stays at `zalo.me/01234567890` | **Registered on Zalo** |

Conclusions:

1. **A usable signal exists, but only with a mobile User-Agent.** With a desktop UA,
   both valid and invalid numbers redirect identically to a Zalo login wall
   (`id.zalo.me/account/login?continue=...`) — no differentiation. With an iPhone UA,
   registered numbers resolve to `zalo.me/<phone>` (200) and unregistered ones get
   shunted to the iOS App Store link (301).
2. **The check is "exists as a Zalo account", not "phone is valid".** A well-formed
   dummy number that happens to be a real Zalo account (`0912345678`) **passes** — so
   this probe does not catch every fake/typo number.
3. **False-rejection risk is real.** Vietnamese customers who do not use Zalo will
   "fail" the probe even with a perfectly valid phone. If the probe is a hard block,
   we lose exactly the leads we're trying to save. It must be **advisory** at most.
4. **11-digit legacy numbers are on Zalo** (`01234567890` passes). If we gate on Zalo
   existence we'd be forced to accept 11-digit numbers, conflicting with the strict
   10-digit rule.
5. **Reliability is shaky on the "not found" path.** In this environment the App
   Store redirect connection reset on 2/3 attempts for the invalid number; the valid
   path was stable. A production form check needs retries + fail-open on errors.
6. **It is an unofficial scrape of Zalo.** ToS-gray, no SLA, susceptible to rate
   limiting / bot detection, and it sends each customer's phone number to Zalo
   servers.

**Verdict:** viable as an *advisory hint*, not as the sole validity gate. Do NOT use
it as a hard blocker.

## Solution Candidates (from investigation)

- **S1 — Strict format validation (baseline).** Require exactly 10 digits, prefix
  `03/05/07/08/09`, `+84`→`0` normalization, per Ambiguity A1/A2. This alone already
  rejects the majority of bad submissions (e.g. `08683612311`, `12`, `9999`).
- **S2 — Zalo existence check (advisory, idea #1 + #2).** New server-side Next.js API
  route performs the Zalo probe (mobile UA) after format validation passes; result
  shown as a non-blocking hint in the phone field's `helperText`.
- **S3 — Confirmation dialog for the Zalo channel (idea #3).** On submit when
  `receiveQuoteChannel === "zalo"`, show a MUI `Dialog` restating the phone number
  and reminding the user to enable "Nhận tin nhắn từ người lạ" in Zalo settings
  before confirming.

## Scope

**In scope**
- S1 (required): strengthen client-side `phone` validation rules in
  `QuoteRequestForm.tsx` (react-hook-form `rules` on the `phone` field, currently a
  loose `/^[0-9+()\s-]+$/` pattern that ignores length/prefix).
- Optionally normalize the phone value before submit/storage (Ambiguity A2).
- S2 (candidate): new API route for the Zalo existence probe + debounced check in the
  form, shown as advisory helper text. Scope only if A3 resolves in favor.
- S3 (candidate): confirmation dialog on submit for the `zalo` channel. Scope only if
  A6 resolves in favor.
- Update inline Vietnamese error/helper copy for the phone field.

**Explicit exclusions**
- Hard-blocking submissions based on the Zalo probe (findings show it would reject
  legit non-Zalo users).
- Recovering / triaging the >20 already-lost leads (Ambiguity A5).
- Any change to the Sanity schema or the `phone` field type on `form-nhan-bao-gia`.
- Any change to other fields (email, name, quantity, etc.) or other pages/forms —
  `/contact/index.tsx` is static (no form); `QuoteRequestForm` is the only form.
- New required fields.

## Constraints

- Reuse existing patterns: react-hook-form `Controller` + MUI `TextField` with
  `rules`; MUI `Dialog` for the confirmation modal (no new libraries).
- Keep TypeScript compatible with `strict: false`.
- Preserve the Sanity data contract: `phone` remains a `string`.
- The Zalo probe runs **server-side only** (Next.js API route) — no CORS, no secrets
  exposed, and phone numbers are not written to API logs.
- Zalo probe must be **fail-open**: network errors/rate limits must never block a
  valid submission.
- Business-critical flow (AGENTS.md): keep `form_submit` analytics event, toast +
  Telegram notification + success screen behavior intact.
- Verification: `pnpm lint` (routing changes expected if S2 adds an API route).

## Acceptance Criteria

**Explicit (from the request)**
- AC1: Submitting an invalid/unreachable phone (short length, bad prefix, wrong
  format) is blocked with a clear inline error; no Sanity doc is created and no
  Telegram notification is sent.
- AC2: Valid Vietnamese phone numbers still submit successfully and reach Sanity +
  Telegram unchanged.

**Inferred (recommended to confirm via Ambiguities)**
- AC3: Error message is in Vietnamese and helps the user correct the value (e.g.
  shows a valid 10-digit example).
- AC4: If normalization is adopted (A2), the stored value is canonical and directly
  dialable (leading `0`, no spaces/dashes).
- AC5: If S2 is in scope, the Zalo existence result appears only after format
  validation passes and never blocks submission (advisory only, fail-open on errors).
- AC6: If S3 is in scope, the dialog appears only for the `zalo` channel and only
  after all field validation passes; Cancel aborts, Confirm submits.
- AC7: Regression: valid submit flow (toast, Telegram, success card, `reset()`) is
  unchanged.
- AC8: `pnpm lint` passes.
- AC9: No duplicate/new analytics events are emitted unless scoped in A10.

## Ambiguities

### A1 — Accepted phone formats
**Question:** Which phone formats must the form accept as valid?

**Recommended default:** Accept only Vietnamese mobile numbers — exactly 10 digits
after stripping spaces/dashes and converting `+84` → `0`, starting with one of `03`,
`05`, `07`, `08`, `09`. Reject 11-digit legacy and landline formats.

**Rationale:** Sales team is a Da Nang shop calling VN mobile numbers; this is the
reachable set. (Note: 11-digit legacy numbers exist on Zalo — see A8 — but we keep
format strictness and treat Zalo as advisory only.)

### A2 — Normalize stored value
**Question:** Should the phone be normalized (canonical 10-digit) before saving, or
stored as typed?

**Recommended default:** Normalize — strip spaces/dashes, convert `+84` → `0`, store
exactly 10 digits starting with `0`.

**Rationale:** Gives the sales team a directly dialable number and avoids duplicate
matching, without changing the Sanity field type.

### A3 — Zalo existence check: hard block vs advisory
**Question:** Should a phone that is NOT a registered Zalo account block submission
(hard error) or merely warn (soft, allow submit)?

**Recommended default:** Advisory (soft). Never block.

**Rationale:** Investigation proves Zalo registration ≠ valid phone: `0912345678` is a
registered Zalo account, and many legit VN customers don't use Zalo. Hard-blocking
rejects real leads — the exact opposite of the business goal.

### A4 — Fallback contact method
**Question:** Should a second contact method (e.g. email) become required as a
fallback?

**Recommended default:** No — keep phone as the sole required contact and validate it
strictly; the S3 confirmation dialog is the "second chance" mechanism.

**Rationale:** More required fields increase friction and reduce conversions.

### A5 — Recovery of existing lost leads
**Question:** Should this ticket include triaging/recovering the >20 existing leads?

**Recommended default:** Out of scope — a separate ops/data task.

**Rationale:** Lead recovery is data/outreach, not code; bundling it delays the fix.

### A6 — Confirmation dialog scope & content
**Question:** Should the S3 dialog appear only for the `zalo` channel, and what should
it contain?

**Recommended default:** Only when `receiveQuoteChannel === "zalo"`. Content: restate
the phone number (`Số điện thoại của bạn: <phone>`), a reminder to enable
"Nhận tin nhắn từ người lạ" in Zalo Settings, and Cancel/Confirm buttons.

**Rationale:** The dialog's value is the Zalo stranger-message reminder, which only
matters for the zalo channel; showing it for other channels adds needless friction.

### A7 — Zalo probe failure behavior
**Question:** When the Zalo probe errors out (connection reset, rate limit, timeout),
what should the form do?

**Recommended default:** Fail-open — treat the result as "unknown", show no error, and
allow submission. Optionally one retry for the flaky App Store redirect path.

**Rationale:** The "not found" path reset connections on 2/3 attempts in testing;
failing closed would block legit users on infrastructure flakiness.

### A8 — 11-digit legacy numbers on Zalo
**Question:** Since `01234567890` (11-digit legacy) resolves as a Zalo account, should
format validation accept 11-digit numbers?

**Recommended default:** No — enforce 10-digit VN mobile only (A1). If a user enters
an 11-digit number, format validation rejects it before the Zalo check runs.

**Rationale:** Consistent strictness; the Zalo check is advisory and shouldn't
expand the accepted format set.

### A9 — Privacy: sending numbers to Zalo
**Question:** Is proxying each submitted phone to Zalo's public endpoint acceptable
under the project's data/privacy constraints?

**Recommended default:** Acceptable for this feature, but only via the server-side API
route, with no logging of the phone number in API logs.

**Rationale:** The number is already stored in Sanity and sent to Telegram; the Zalo
probe adds a third-party hop, so containment (server-side, non-logging) is required.

### A10 — Analytics for new interactions
**Question:** Should the S3 dialog's Confirm/Cancel and the advisory Zalo hint emit
analytics, and under which event names?

**Recommended default:** Reuse existing `cta_click` on dialog Confirm/Cancel; no new
event names.

**Rationale:** AGENTS.md requires tracking for new interactive elements but forbids
duplicating events; reusing `cta_click` keeps GA4/UmamiJS consistent without new
schemas.
