# Specification Quality Checklist: Migrate Vinext sang Cloudflare

**Purpose**: Validate spec trước `/speckit-plan`  
**Created**: 2026-11-24  
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] Viết theo dạng Việt–Anh dễ đọc, giữ đúng technical terms
- [x] Tập trung vào user value, cost, operational safety và SEO
- [x] Không nhét implementation detail ngoài các technology constraints đã được yêu cầu
- [x] Đủ các mandatory sections

## Requirement Completeness

- [x] Không còn `[NEEDS CLARIFICATION]`
- [x] Requirements testable và rõ scope
- [x] Success criteria measurable
- [x] Có acceptance scenarios và edge cases
- [x] Scope `Vinext + Workers`, preview, DNS và registrar transfer tách rõ
- [x] Có cost basis, overage, Cloudflare quota và uncertainty
- [x] Có low-cost alternatives không làm mất tính năng
- [x] Có Cloudflare MCP account evidence và Vinext compatibility result
- [x] Có SEO/DNS/DNSSEC/email/registrar safeguards
- [x] Có Next/React target version và impact checklist
- [x] Public route rendering matrix có static/SSG/ISR/SSR decision
- [x] API Worker compatibility và cost actions được phân loại

## Feature Readiness

- [x] User stories cover app migration, operation, cost và domain
- [x] Mỗi FR có gate hoặc measurable outcome
- [x] Registrar transfer chỉ được trigger bằng explicit future owner request
- [x] Preview không indexable; canonical host vẫn là `inutdesign.com`

## Notes

- Bản spec đã rút gọn và chuyển sang Việt–Anh; hiện giữ FR-001 → FR-040 và SC-001 → SC-027.
- Estimate: Workers Paid $5/tháng, planning range $5–6/tháng; static-first baseline không dùng Response Store, R2 hoặc Durable Object.
- Account hiện chưa có Paid subscription, Worker, zone, preview subdomain hoặc spend policy; R2 không phải prerequisite của baseline.
- Vinext check: 85% compatible, còn 2 issues và 3 partial-support areas.
- Owner chọn local static build + CLI deploy vì content ít thay đổi; target mới là Next 15.5.x/React 19/Node 22, public pages static, không dùng Response Store/R2/DO.
- Spec đã ready cho `/speckit-plan`.
