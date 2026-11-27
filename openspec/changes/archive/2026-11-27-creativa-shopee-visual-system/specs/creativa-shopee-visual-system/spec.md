# Spec Delta

## Purpose

Defines a repeatable, reviewable visual system for producing INUT Creativa Shopee assets while preserving product accuracy, approved brand language, and evidence-backed claims.

## ADDED Requirements

### Requirement: Product artwork remains source-faithful

The production system SHALL use approved Creativa product images as the visual source of truth and SHALL preserve the pattern, palette, proportions, crop intent, and recognizable details of each design. Generative tools MUST provide backgrounds, lighting, staging, or layout support without redesigning the product artwork.

#### Scenario: Approved product image is available

- **WHEN** a team member creates an asset from an approved Creativa design
- **THEN** the output SHALL show the same artwork without added symbols, characters, logos, colors, or altered pattern layout

#### Scenario: Generation changes the design

- **WHEN** a generated result changes, invents, or obscures the approved artwork
- **THEN** the result SHALL be rejected and the generation SHALL be repeated from the approved source

### Requirement: The first listing image communicates the product immediately

Every listing SHALL use a square first image that makes the MacBook skin or collection recognizable at mobile thumbnail size. Decorative mood, text, and collage elements MUST NOT obscure the product's primary readable area.

#### Scenario: Reviewing a listing cover at mobile size

- **WHEN** the cover is displayed at small mobile-thumbnail size
- **THEN** the laptop skin pattern SHALL remain identifiable without relying on the title or later slides

#### Scenario: Lifestyle treatment reduces recognition

- **WHEN** a lifestyle composition or background element competes with the product
- **THEN** the asset SHALL be simplified or replaced with a product-forward composition

### Requirement: Marketing text uses an authoritative overlay workflow

Generated imagery SHALL not be used as the source of Vietnamese copy, logos, badges, prices, model labels, dimensions, or factual claims. Final wording and brand marks MUST be added from approved text using editable design tools.

#### Scenario: An asset requires Vietnamese copy

- **WHEN** a production asset needs a headline, model name, coverage label, or call to action
- **THEN** the generated background SHALL be text-free and the final text SHALL be added in a separate editable layer

#### Scenario: Generated text is incorrect

- **WHEN** a generated result contains misspelled, distorted, or unsupported text
- **THEN** the text-bearing result SHALL not be published and the team SHALL use a clean image plus verified overlay text

### Requirement: Shopee assets inherit the approved Creativa visual language

Shopee imagery SHALL adapt the approved marketing grid's cream, muted blush, pale-sage, deep-brown, serif-italic editorial, pill-label, and print-card language while maintaining Shopee-specific product clarity. It SHALL not reproduce a competitor shop's colors, mascot, interface, logo, or layout verbatim.

#### Scenario: A storefront banner is designed

- **WHEN** a new banner or category asset is based on the Creativa marketing reference
- **THEN** the result SHALL use the approved color and typography direction while remaining visibly distinct from the referenced competitor shop

#### Scenario: A competitor reference is introduced

- **WHEN** a competitor image is used during ideation
- **THEN** it SHALL inform commerce structure only and SHALL not contribute copied branding or protected presentation

### Requirement: Each listing includes a minimum conversion set

Each published grouped listing or individual product listing SHALL include a product-forward cover, a complete-face explanation, a pattern-detail or lifestyle view, a model-selection view, a coverage-selection view, and a guidance or packaging view based on real product evidence.

#### Scenario: A listing is prepared for publication

- **WHEN** a listing reaches visual production review
- **THEN** the set SHALL contain the required roles or SHALL identify a documented blocker for any missing role

#### Scenario: Packaging evidence is unavailable

- **WHEN** the real package or included items have not been photographed
- **THEN** the listing SHALL omit fabricated packaging imagery and SHALL not imply unverified contents

### Requirement: Product and claim information is evidence-backed

Product names, supported MacBook models, coverage choices, application instructions, and marketing claims SHALL come from authoritative product data or approved operating guidance. Unverified durability, adhesion, removability, delivery, price, minimum-order, or material claims MUST NOT be added to visual assets.

#### Scenario: A model or coverage label is added

- **WHEN** an asset displays supported models or coverage options
- **THEN** the labels SHALL match the current approved Creativa catalog data

#### Scenario: A claim has no approved source

- **WHEN** proposed copy makes a production or durability claim without evidence
- **THEN** the claim SHALL be removed or replaced with neutral guidance before publication

### Requirement: Third-party artwork requires rights review

Any Bape, Gundam, Naruto, automotive, or other artwork containing recognizable third-party characters, marks, vehicles, or branding SHALL have an explicit usage decision before its visual assets are published.

#### Scenario: Rights status is approved

- **WHEN** the artwork has a documented approval for the intended sales and advertising use
- **THEN** the team MAY produce and publish the approved visual treatment

#### Scenario: Rights status is unknown

- **WHEN** no documented approval exists for the artwork
- **THEN** the asset SHALL remain in a blocked review state and SHALL not be published
