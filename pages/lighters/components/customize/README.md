# Lighters Customize Page Components

This folder contains modular components for the lighters customize page, making it easier to maintain and update individual sections.

## Component Structure

```
customize/
├── HeroSection.tsx              # Hero banner with CTA buttons
├── IntroductionSection.tsx      # Product bullets & highlights
├── LighterTypesSection.tsx      # Visual grid of lighter types with images
├── ProductGallery.tsx           # Product images gallery
├── WhyInutSection.tsx           # Combined section (production + applications + quality)
├── ContactSection.tsx           # Contact cards with Zalo links
├── index.ts                     # Component exports
└── README.md                    # This file
```

## Components Overview

### 1. HeroSection
**Purpose:** Main hero banner with gradient background, product title, and call-to-action buttons.

**Props:**
- `heroImage: string` - URL of the hero image

**Usage:**
```tsx
<HeroSection heroImage={HERO_IMAGE} />
```

---

### 2. IntroductionSection
**Purpose:** Displays product features as bullet points and highlights in cards.

**Props:**
- `bullets: string[]` - Array of bullet point text
- `highlights: Highlight[]` - Array of highlight objects with title, description, and icon

**Usage:**
```tsx
<IntroductionSection bullets={CUSTOM_BULLETS} highlights={HIGHLIGHTS} />
```

---

### 3. LighterTypesSection
**Purpose:** Visual grid showcasing different lighter types with images, names, and descriptions. Includes coating options below.

**Props:**
- `lighterTypes: LighterType[]` - Array of lighter types with name, description, and image
- `coatingOptions: string[]` - Array of coating option descriptions

**Features:**
- Responsive grid (4 cards on desktop, 2 on tablet, 1 on mobile)
- Hover effects (border color, elevation, transform)
- Coating options displayed in a separate paper card

**Usage:**
```tsx
<LighterTypesSection 
  lighterTypes={LIGHTER_TYPES} 
  coatingOptions={COATING_OPTIONS} 
/>
```

---

### 4. ProductGallery
**Purpose:** Displays a responsive grid of product images.

**Props:**
- `images: string[]` - Array of image URLs

**Usage:**
```tsx
<ProductGallery images={GALLERY_IMAGES} />
```

---

### 5. WhyInutSection
**Purpose:** Combined section explaining why customers should choose INUT Design. Includes:
- Introduction paragraph
- Production process card (timeline, quantity, design consultation)
- Applications grid (events, gifts, retail, personal use)
- Quality assurance commitment

**Props:**
- `applications: Application[]` - Array of application use cases with title, description, and icon

**Layout:**
- 12 columns total
- Production card: 4 columns (left side)
- Applications: 8 columns (right side)
- Quality assurance: 12 columns (bottom)

**Usage:**
```tsx
<WhyInutSection applications={APPLICATIONS} />
```

---

### 6. ContactSection
**Purpose:** Contact cards with clickable images linking to Zalo.

**Props:**
- `contacts: Contact[]` - Array of contact objects with name, role, phone, and photoUrl

**Usage:**
```tsx
<ContactSection contacts={CONTACTS} />
```

---

## Maintenance Tips

### Adding a New Section
1. Create a new component file in this folder
2. Export it from `index.ts`
3. Import and use it in the main page

### Modifying a Section
- Each component is self-contained with its own props interface
- Update only the specific component file you need to change
- The main page only needs data updates if structure remains the same

### Styling Updates
- All components use Material-UI's `sx` prop for styling
- Modify spacing with `spacing` prop on Grid/Stack
- Color scheme uses theme colors (primary, secondary, text.primary, etc.)

### Data Updates
The main page (`pages/lighters/customize.tsx`) contains all data constants:
- `HERO_IMAGE` - Hero banner image
- `GALLERY_IMAGES` - Product gallery images
- `HIGHLIGHTS` - Feature highlights with icons
- `CUSTOM_BULLETS` - Product feature bullets
- `LIGHTER_TYPES` - Lighter types with images
- `COATING_OPTIONS` - Coating options list
- `APPLICATIONS` - Use case applications
- `CONTACTS` - Contact information

Simply update these constants to change content across all components.

## TypeScript Types

Each component includes its own TypeScript interfaces for type safety:

```typescript
// HeroSection
interface HeroSectionProps {
  heroImage: string;
}

// IntroductionSection
interface Highlight {
  title: string;
  description: string;
  icon: React.ReactNode;
}

// LighterTypesSection
interface LighterType {
  name: string;
  description: string;
  image: string;
}

// WhyInutSection
interface Application {
  title: string;
  description: string;
  icon: React.ReactNode;
}

// ContactSection
interface Contact {
  name: string;
  role: string;
  phone: string;
  photoUrl: string;
}
```

## Best Practices

1. **Keep components focused** - Each component should handle one section
2. **Use props for data** - Never hardcode data in components
3. **Maintain consistency** - Use MUI components and theme values
4. **Test responsiveness** - Check all breakpoints (xs, sm, md)
5. **Document changes** - Update this README when adding new components
