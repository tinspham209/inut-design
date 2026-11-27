# Creativa Shopee visual kit

## Master canvases

| Use | Master size | Safe export |
| --- | ---: | --- |
| Shop avatar | `1600 x 1600` | `800 x 800` and `200 x 200` previews |
| Listing and collection slides | `1600 x 1600` | 1:1 JPG/PNG |
| Shop hero | `2400 x 800` | desktop 3:1 plus 1:1 center crop |
| Mobile story source | `1600 x 1600` | 1:1; avoid placing critical content outside the inner 80% |

## Palette

| Token | Value | Use |
| --- | --- | --- |
| `cream` | `#FFFCF2` | Main background |
| `pale-blue` | `#CBE7F7` | Current-site bridge and cool background |
| `pale-sage` | `#E5ECD7` | Approved marketing-grid background |
| `dusty-blush` | `#E7D2C9` | Warm storytelling background |
| `salmon-cta` | `#F06450` | CTA panels and limited campaign accents |
| `burnt-orange` | `#AE3500` | Strong site-brand accent |
| `deep-brown` | `#49261D` | Primary dark text |
| `pill-dark` | `#241D18` | Small category pill |
| `paper-white` | `#FFFDF8` | Card surfaces and Polaroid frames |

Use one dominant pastel per slide plus cream/white. Do not combine more than one strong accent with one pastel.

## Typography

| Role | Primary | Fallback | Rules |
| --- | --- | --- | --- |
| Emotional headline | Cormorant Garamond Semibold Italic | Georgia Italic | 56–92 px on 1600 square; maximum 3 lines |
| Brand/store headline | Cormorant Garamond Medium | Georgia | 48–76 px; sentence case where possible |
| Information | Be Vietnam Pro Bold | Arial Bold | Model, coverage, price, badges, CTA |
| Supporting copy | Be Vietnam Pro Regular | Arial | Minimum 28 px on 1600 square |
| Pill label | Be Vietnam Pro Semibold | Arial Bold | Uppercase, 18–24 px, 18–28 px internal padding |

Confirm font availability and export embedding in Canva/Figma before production. All Vietnamese diacritics use the editable overlay layer.

## Pill treatment

- Position: upper-right.
- Fill: `pill-dark` with 92–100% opacity.
- Text: `paper-white`.
- Radius: 999 px.
- Maximum width: 38% of square canvas or 28% of hero canvas.
- Use one pill per slide unless the slide is a factual selector matrix.

## Safe zones

### Square listing / collection

```text
+--------------------------------+
|  96px                          |
|        HEADLINE/PILL SAFE      |
|                                |
|  96px  +----------------+  96  |
|        | PRODUCT SAFE   |      |
|        | no overlay     |      |
|        +----------------+      |
|                                |
|        FOOTER / COPY SAFE       |
|  96px                          |
+--------------------------------+
```

- Keep product artwork at least `96 px` from all edges.
- Keep the first image's primary pattern inside the central 72–78% area.
- Reserve top `240 px` for an optional headline and pill.
- Reserve bottom `180 px` for optional short copy.
- Do not place badges, text, paper cards, or props over the main pattern.

### 3:1 hero

```text
+----------------+----------------------------------+
| COPY SAFE      | PRODUCT / LIFESTYLE SAFE         |
| left 35%       | right 65%                        |
+----------------+----------------------------------+
```

- Keep headline and CTA in the left 33–35%.
- Keep no product-critical detail in the center 45% of the canvas; this is the most conservative mobile center crop.
- Pill must remain inside the upper-right `320 x 140` zone.

## Product rules

- Preserve approved artwork and crop intent.
- Use one primary product angle: 3/4 rear or clean flat-lay.
- Use 1 product for a SKU cover; use 3–5 products only for collection covers.
- Main pattern remains readable at `120 x 120` thumbnail.
- No generated Apple logo, typography, model labels, badges, or product marks.
- No generated packaging unless an approved package photograph is supplied.

## Review exports

Every template or source image requires:

1. Native 1600 px square or 2400 x 800 hero.
2. A `1200 x 1200` review preview.
3. A `200 x 200` or `120 x 120` thumbnail review.
4. A mobile crop preview for the hero.

## File naming

```text
batch-01_collection-elegant_cover_chatgpt_v01.png
batch-01_sku-elegant-soc-xanh-bo_03-macro_v01.png
batch-01_shared_model-selector_edited_v01.png
batch-01_shared_model-selector_approved_v01.png
```

Use lowercase kebab-case tokens, a numeric slide role, tool/source, and version.
