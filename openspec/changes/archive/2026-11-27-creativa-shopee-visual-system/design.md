# Design

## Context

See `proposal.md` for the motivation and `specs/creativa-shopee-visual-system/spec.md` for the acceptance contract.

Three existing sources inform this change:

- Shopee competitor screenshots show commerce patterns: product-forward covers, category grouping, repeated section bars, and multi-variant listings.
- The live Creativa site provides the current product categories, supported model/coverage data, palette, lifestyle references, and store voice.
- `references/marketing/Untitledzxczxc.jpg` provides the closest approved visual direction: pastel editorial backgrounds, compact black pill labels, serif-italic emotional headlines, pattern cards, and concise Vietnamese storytelling.

The source image set and the exploratory prompt library remain valuable, but the approved design assets and exact product data must remain separate from creative interpretation.

## Goals / Non-Goals

**Goals:**

- Make the Shopee storefront feel recognizably Creativa while adapting the language for commerce and mobile scanning.
- Create reusable templates rather than one-off artwork.
- Preserve exact approved product patterns in every product image.
- Reduce the number of unsupported or manually invented claims.
- Define a practical order of production from shared shop assets to listing assets.
- Keep source references traceable inside the OpenSpec change.

**Non-Goals:**

- Modifying the Creativa website, catalog, checkout, Sanity data, or pricing.
- Producing or publishing final images as part of this change.
- Rebuilding third-party brand artwork or inventing unavailable packaging.
- Treating competitor visuals as a brand kit to copy.
- Granting legal or commercial permission for third-party character, vehicle, or brand designs.

## Decisions

### 1. Use the Instagram grid as the brand source and the competitor shop as the commerce structure

The Shopee work SHALL derive color, typography, pill treatment, editorial pacing, and print-card framing from `Untitledzxczxc.jpg`. The competitor screenshots SHALL contribute only observable commerce conventions: grouped categories, clear first images, repeated section rhythm, and collection-oriented presentation.

**Why:** this avoids creating a second Creativa identity while retaining useful Shopee patterns.

**Alternatives considered:** copying the competitor's green-led visual system would be easier to execute but would weaken Creativa recognition and create avoidable brand confusion.

### 2. Keep generative imagery in the image layer, not the information layer

ChatGPT or another image generator MAY create backgrounds, props, lighting, collage compositions, and realistic staging. Canva/Figma SHALL add final Vietnamese copy, logos, category pills, model labels, coverage labels, CTA, and factual overlays.

**Why:** generative text is error-prone and product facts change independently from imagery.

**Alternatives considered:** generating complete finished slides is faster, but it produces unreliable diacritics, labels, and claims and makes later catalog updates expensive.

### 3. Preserve approved artwork through source-guided compositing

The team SHALL supply the approved top/interior/bottom product images for each prompt and explicitly require the output to preserve reference A. Image generation SHALL not invent a new interpretation of Bape, Gundam, Naruto, cars, floral patterns, stripes, or gingham.

**Why:** the asset is a sales representation of an existing product, not a new concept illustration.

**Alternatives considered:** prompt-only recreation is simpler but has unacceptable pattern, logo, and silhouette drift.

### 4. Organize the storefront around grouped collections first

Phase 1 SHALL define five collection targets:

1. Elegant
2. Daisy Quilt
3. Car
4. Anime / Street
5. Retro

Publishing any target remains subject to its evidence and rights gate. Phase 2 MAY expand selected high-traffic groups into individual design listings. The grouped model reduces duplicated production and mirrors how the competitor shop communicates variants.

**Why:** 22 individual listings with 6–7 assets each would require more than 130 files before the visual system has been validated.

**Alternatives considered:** creating 22 SKU-specific listings immediately gives maximum search specificity but adds production cost, review burden, and inconsistent-template risk.

### 5. Use a stable minimum slide sequence

Every listing SHALL target this order:

1. Product-forward cover
2. Full three-face view or available coverage explanation
3. Pattern close-up
4. Lifestyle/editorial use
5. Supported model selector
6. Coverage selector and application guidance
7. Packaging or real unboxing only when authoritative images exist

The first three slides carry purchase clarity; the remaining slides answer choice and trust questions.

**Why:** the sequence gives Shopee users immediate product recognition before richer storytelling.

**Alternatives considered:** copying the Instagram 9-tile narrative from beginning to end would prioritize brand story but delay the practical product explanation.

### 6. Use one master visual kit with controlled crop variants

Each generated source composition SHALL be designed from a square master. Shop hero assets MAY use a 3:1 master with reserved left-side copy space. Avatar assets SHALL use a simple centered mark-safe background. Listing templates SHALL include product-safe, headline-safe, and mobile-crop-safe zones.

**Why:** one master system prevents separate visual drift across shop cover, collections, and listings.

**Alternatives considered:** designing every placement independently supports exact optimization but creates excessive duplication and difficult brand maintenance.

### 7. Gate third-party artwork before production

Car, Bape, Gundam, Naruto, and other recognizable third-party designs SHALL enter an explicit rights-review state before the team generates publishable sales assets.

**Why:** the design may be available in the internal catalog without being proven safe for every advertising channel.

**Alternatives considered:** assuming catalog presence equals publication approval would transfer an unsupported legal decision into marketing production.

### 8. Treat the exploratory file as an input library

`idea.md` SHALL remain in the change as the detailed prompt and asset-inventory library. `design.md` owns the decisions; the spec owns the acceptance contract; `tasks.md` owns execution order.

**Why:** keeping all four avoids losing useful source prompts while preventing one large brainstorming file from becoming the only source of truth.

## Asset Architecture

```text
[Approved product artwork]
          |
          v
+------------------------+
| Source verification    |
| catalog / rights / use |
+------------------------+
          |
          v
+------------------------+
| AI staging source      |
| no text / exact pattern|
+------------------------+
          |
          v
+------------------------+
| Editable composition   |
| Canva / Figma overlays |
+------------------------+
          |
          v
+------------------------+
| Thumbnail + fact review|
+------------------------+
          |
          v
+------------------------+
| Shopee-ready exports   |
+------------------------+
```

## Risks / Trade-offs

- [Generated artwork drift] → Require approved source images in every prompt and reject changed patterns.
- [Text and model inaccuracies] → Generate without text; add labels from current catalog data in editable files.
- [Brand mismatch from overusing Instagram pacing] → Keep the first listing image product-forward and use story-heavy layouts after it.
- [Rights ambiguity] → Block third-party artwork until the usage decision is recorded.
- [Production volume] → Start with 5 grouped listings and only expand per-SKU after the template proves consistent.
- [Unsupported product claims] → Use neutral visual guidance and remove claims not backed by product evidence.
- [Color drift between export tools] → Keep named palette values and inspect screenshots at mobile size.
- [Reference leakage] → Store competitor and marketing images in separate reference directories with explicit purposes.

## Migration Plan

1. Create the OpenSpec change and all planning artifacts. Complete.
2. Move `tasks/creativa/idea.md` to the change root. Complete.
3. Move the competitor screenshots into `references/competitor/`. Complete.
4. Move the team-marketing grid into `references/marketing/`. Complete.
5. Produce and review the first shared batch: avatar, hero, five collection covers, model explainer, coverage explainer, and three story slides.
6. Approve one golden listing template using `Elegant - Sọc xanh bơ`.
7. Replicate the approved template across the remaining grouped collections.
8. Reassess per-design listings after grouped-listing review.

Rollback for planning is non-destructive: keep the move in one Git change so the files can be moved back without content loss. Rollback for future visual production means retaining the prior Shopee assets and uploading a replacement only after the full batch has passed review.

## Open Questions

- Which collection targets are approved for publication if third-party artwork remains blocked? The production system can still be completed without changing the requirements; blocked targets remain unpublished.
