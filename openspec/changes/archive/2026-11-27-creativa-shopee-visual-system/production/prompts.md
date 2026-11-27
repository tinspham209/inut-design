# Source-only prompt library

This library generates staging, lighting, composition, and background sources only. Add Vietnamese copy, names, model labels, prices, badges, logos, and calls to action later in Canva/Figma.

## Required inputs

For every product generation:

1. Attach the approved Creativa top/interior/bottom image needed for the slide.
2. Attach `references/marketing/Untitledzxczxc.jpg` as the brand moodboard.
3. Name the selected SVG from `production/templates/`.
4. State: `Use uploaded image A as the exact product artwork. Preserve it without redesign.`

Never ask a model to recreate a pattern from text alone.

## Shared generation prompt

```text
Create a text-free ecommerce source image for INUT Creativa, following the attached marketing moodboard and the selected layout template.

Use the exact uploaded product artwork as reference A. Preserve its colors, pattern scale, crop intent, silhouette, recognizable marks, and all approved details without redesign. Add only realistic product staging, lighting, paper-card framing, or background composition.

Visual direction:
- warm cream, pale sage, muted blush, pale blue, deep brown, limited burnt orange
- modern editorial product photography
- soft natural daylight and grounded shadows
- realistic aluminum MacBook proportions and accurate lid edges
- clean paper-like surfaces and restrained rounded shapes
- product-first clarity at 120 px mobile thumbnail size

Canvas: use the selected template's exact dimensions.

No text, no letters, no numbers, no logo, no watermark, no badge, no UI, no generated brand mark, no fake Apple logo, no extra vehicles, characters, symbols, or packaging.
```

## Shared negative prompt

```text
Avoid altered artwork, invented pattern, recoloring, warped pattern, distorted laptop proportions, impossible hinge, warped keyboard, extra screens, extra USB ports, melted logo area, duplicate product, unreadable tiny details, fake text, generated typography, watermark, competitor logo, mascot, copied app UI, cartoon 3D rendering, harsh HDR, neon colors, excessive glitter, clutter, props covering the main pattern, unsupported packaging, and product-performance claims.
```

## Avatar source

```text
Use template avatar-1600.svg. Create a clean 1600 by 1600 abstract brand background. Keep the center 55 percent empty and visually calm for a real wordmark to be added later. Use cream paper, pale blue, dusty blush, and one burnt-orange accent. Soft tactile shadow, simple rounded forms, no letters and no logo.
```

## Shop hero source

```text
Use template hero-2400x800.svg. Create a realistic editorial lifestyle composition with one primary 3/4 rear-view MacBook at the right and two smaller pattern-only paper cutouts behind it. Use reference A exactly for the primary product. Keep the left 35 percent clean for later copy and preserve a clear center crop. Soft daylight, warm sofa or pale studio environment, no text or logo.
```

## Collection cover source

```text
Use template collection-cover-1600.svg. Arrange three to five approved designs in a readable fan or collage. Give each design enough exposed area to remain distinguishable. Use cream paper cards, one pale background block, and subtle grounded shadows. Preserve every uploaded product pattern exactly. No text or badge.
```

## Product cover source

```text
Use template product-cover-1600.svg. Place one exact approved MacBook skin as the dominant 3/4 rear-view product. Keep the main pattern unobstructed, reserve top and lower copy-safe areas, and keep the product readable at 120 px. Natural daylight, restrained pale background, no props that cross the pattern.
```

## Story slide source

```text
Use template story-slide-1600.svg. Create a calm editorial source with one headline-safe empty area and three to four product-pattern cards in the lower area. Follow the attached marketing grid rhythm. The product artwork must remain exact and thumbnail-readable. No text, number, logo, or badge.
```

## Three-face source

```text
Use reference A for the approved top, reference B for interior, and reference C for bottom. Present them as separated realistic layers on a cream or pale-sage studio background. Preserve all edges and artwork exactly. Leave clear gaps for labels to be added later. No arrows, numbers, text, or invented hardware.
```

## Model selector source

```text
Use template model-explainer-1600.svg. Show three clean, distinguishable silver laptop proportion placeholders in one row, all using the same approved pattern. Keep a large empty label zone under each product. Do not infer or display exact dimensions, years, model names, ports, or logos.
```

## Coverage selector source

```text
Use template coverage-explainer-1600.svg. Show four separated product diagrams with the exact approved pattern: lid, bottom, interior, and three-face full set. Keep large empty zones for verified labels and prices. No generated text or invented internal hardware.
```

## Application guide source

```text
Use template application-guide-1600.svg. Create a six-panel sequence using only real supplied application evidence or intentionally empty product-photo placeholders. Keep movements simple and avoid showing unsupported glue, tools, material behavior, or finished claims. No text, numbers, arrows, or before/after promises.
```

## Generation workflow

1. Save the untouched output in `outputs/generated/batch-XX/<tool>/`.
2. Reject results that alter the product pattern, add marks, distort the device, or contain text.
3. Create a maximum of four controlled alternatives per brief.
4. Add copy, logo, model data, coverage data, and badges only in `outputs/edited/`.
5. Move an image to `outputs/approved/` only after brand, product, fact, rights, and thumbnail review.
