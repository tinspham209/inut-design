<!--
Sync Impact Report

- Version change: unratified template → 1.0.0
- Modified principles: five placeholders → Evidence-Bounded Scope, Server and Data
  Integrity, Commerce Contract Stability, Privacy-Safe Observability, Verifiable
  Delivery
- Added sections: Technical and Security Constraints; Development Workflow and
  Quality Gates
- Removed sections: placeholder-only Section 2 and Section 3
- Templates requiring updates:
  - ✅ updated .specify/templates/plan-template.md
  - ✅ updated .specify/templates/spec-template.md
  - ✅ updated .specify/templates/tasks-template.md
- Runtime guidance requiring updates:
  - ✅ updated AGENTS.md
  - ✅ updated README.md
- Follow-up TODOs: none
-->

# Inut Design Constitution

## Core Principles

### I. Evidence-Bounded Scope

Changes MUST be derived from inspected source code, tests, approved feature
artifacts, or authoritative product data. Product copy, prices, minimum order
quantities, delivery promises, performance claims, and production capabilities
MUST NOT be invented. Unknowns MUST be recorded as verification gaps or
clarification questions rather than treated as requirements.

Implementation MUST be minimal and scoped to the requested behavior. Existing
user changes, route/layout conventions, public contracts, and unrelated behavior
MUST be preserved. Broad rewrites, speculative abstractions, and unrelated
cleanup are prohibited unless separately approved.

**Rationale**: The repository combines commerce, CMS, analytics, and generated
content. Evidence and narrow changes reduce unsupported claims and regression
risk.

### II. Server and Data Integrity

Secrets and privileged Sanity operations MUST remain on the server. Browser code
MUST NOT contain server tokens, credentials, private keys, or hardcoded project
secrets. Public reads, writes, and image access MUST use the established
`api-client/*` boundaries and consumer-compatible data shapes.

Sanity references MUST retain valid `_ref` and `_type` values, every written
array item MUST receive a unique `_key`, and destructive schema or document
changes MUST require an explicit requirement. Inputs crossing an API boundary
MUST be validated for type, size, finite values, supported formats, authorization
context, and idempotency where retries are possible.

**Rationale**: A valid-looking payload is insufficient if it breaks references,
duplicates orders, exposes credentials, or accepts malformed client input.

### III. Commerce Contract Stability

Cart, pricing, checkout, order, contact, and confirmation behavior MUST be
treated as protected contracts. Changes MUST preserve the `inut-lighters-cart`
storage key, recalculated unit prices and subtotals, unique Sanity `_key` values,
required customer fields, order numbering, reference integrity, successful
server writes, and confirmation behavior.

Tests MUST NOT create real orders or publish sensitive payloads without explicit
authorization. A feature that does not require commerce work MUST avoid changing
these contracts rather than reimplementing them.

**Rationale**: Small-looking UI changes can affect persisted carts and order
payloads, so explicit invariants are required.

### IV. Privacy-Safe Observability

New user actions and pages MUST use the established GA4/GTM and Umami wrappers.
Each action MUST emit at most once per analytics system at its source. Page-view
instrumentation MUST account for existing automatic, initial-load, and SPA
tracking before adding another event.

Event properties MUST be allow-listed and MUST exclude credentials, customer
contact data, uploaded image contents, asset URLs, share links, design
identifiers, and sensitive query parameters unless an approved requirement
explicitly defines lawful collection and its safeguards. Tracking MUST fail
safely when SSR or a disabled analytics provider is present.

**Rationale**: Dual observability is intentional, but duplicate events and
accidental URL or payload disclosure make analytics data unreliable and unsafe.

### V. Verifiable Delivery

Every feature MUST be organized into independently testable increments, with
acceptance criteria and exact file paths for implementation tasks. Requirements
with measurable performance, accessibility, security, persistence, or privacy
outcomes MUST have executable validation tasks and retained evidence.

Runtime code changes MUST pass the narrowest relevant checks, then lint; changes
to runtime or routing MUST also pass the production build. Browser or device
claims MUST be supported by browser/device evidence, not only parsing or static
inspection. Failures MUST remain visible; success-shaped fallbacks and silent
catch-all behavior are prohibited.

**Rationale**: Delivery is complete only when the requested behavior is proven
and persistent, not when files merely compile.

## Technical and Security Constraints

- The application MUST use the existing Next.js 12 pages router, React 18,
  TypeScript with `strict: false`, MUI 5, Sanity v2, and repository-local
  component and API patterns unless a separately approved plan records an
  explicit migration.
- Package operations MUST use pnpm at the version declared by `package.json`;
  the `package.json` engine range is authoritative for Node compatibility.
- Imports MUST use `@/` where path aliasing is applicable; shared API access MUST
  use `api-client/*`; shared
  image URL construction MUST use the existing Sanity image helpers.
- New dependencies MUST be justified by an unmet requirement and reviewed for
  Next.js 12 compatibility, runtime/browser cost, maintenance, and license.
- Browser-facing code MUST preserve keyboard operation, meaningful non-color
  affordances, responsive behavior, SEO, loading/error/empty states, and reduced
  motion where animation is introduced.
- Runtime instructions remain in `.agents/skills/` and its task-specific
  references. Duplicated editor prompt trees, private mirrors, or unsupported
  wrappers MUST NOT be created.

## Development Workflow and Quality Gates

1. Investigate the relevant source, consumers, schemas, analytics lifecycle, and
   existing tests before editing.
2. Map user stories to requirements and create tasks with exact paths,
   dependencies, and independent completion criteria.
3. Implement incrementally, surfacing compatibility, privacy, security, and
   performance risks before they are hidden in integration work.
4. Run focused regression checks for changed behavior. Run
   `rtk pnpm lint` for code changes and `rtk pnpm build` when runtime, routing,
   worker, or production integration behavior changes.
5. Use browser or device automation for claims about rendering, touch,
   responsiveness, accessibility interaction, or visual consistency.
6. Synchronize directly affected documentation, especially analytics and runtime
   operational guidance.
7. Report the evidence, risks, and remaining manual checks without overstating
   what static checks or fixtures prove.

## Governance

This constitution governs Spec Kit artifacts, implementation plans, tasks, and
code review for the repository. A conflicting requirement MUST be corrected or
rejected; the constitution MUST NOT be silently reinterpreted or diluted.

Amendments require an explicit proposal describing the changed principle, the
reason, affected artifacts, and migration work. The version MUST follow semantic
versioning: MAJOR for backward-incompatible principle removal or redefinition,
MINOR for new principles or materially expanded governance, and PATCH for
clarifications that do not change meaning.

Every amendment MUST update this Sync Impact Report, dependent templates, and
directly affected runtime guidance in the same change. Compliance review MUST
verify requirement coverage, protected contracts, server/data boundaries,
analytics privacy and deduplication, measurable acceptance criteria, and
validation evidence before implementation is approved complete.

**Version**: 1.0.0 | **Ratified**: 2026-11-18 | **Last Amended**: 2026-11-18
