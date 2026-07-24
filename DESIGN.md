---
name: Fireballing
colors:
  # Primary Hot Core
  primary: '#FF5A26'
  primary-deep: '#FF2E00'
  primary-amber: '#FF9F1C'
  on-primary: '#0D0B0A'
  # Ember Charcoal & Neutrals
  background: '#0D0B0A'
  surface: '#171311'
  outline: '#261E1C'
  cool-charcoal: '#9E928E'
  white-smoke: '#F4EFEF'
  cream-soft: '#FAF8F5'
  on-surface: '#F4EFEF'
  on-surface-variant: '#9E928E'
  # Yield Semantics
  profit: '#00E676'
  loss: '#FF1744'
  info: '#2979FF'
  error: '#FF1744'
  on-error: '#FFFFFF'
typography:
  h1:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 110%
    letterSpacing: -0.02em
  h2:
    fontFamily: Outfit
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 120%
    letterSpacing: -0.01em
  h3:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 130%
  body:
    fontFamily: Outfit
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 150%
  caption:
    fontFamily: Outfit
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 140%
  mono:
    fontFamily: Geist Mono
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 110%
  label-md:
    fontFamily: Outfit
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Outfit
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

Fireballing is a dark-themed portfolio valuation interface built around high-contrast fiery tones. The design system conveys intensity and momentum — a visual metaphor for compound growth and financial "fire." It targets dividend-focused investors who want to track their F.I.R.E. (Financial Independence, Retire Early) journey.

The aesthetic blends **Dark Mode** with **Hot Core** accents. The deep charcoal backgrounds (#0D0B0A, #171311) create a dramatic canvas where orange/red primary colors (#FF5A26, #FF2E00) and amber accents (#FF9F1C) represent energy, growth, and urgency.

## Colors

The palette is anchored by a near-black canvas (Void Space #0D0B0A) with elevated surfaces in Ember Surface (#171311).

- **Primary Hot Core:** Magma Core (#FF5A26) is the main accent, with Molten Lava (#FF2E00) for deep tones and Amber Yield (#FF9F1C) for warm highlights. Gradients flow from #FF2E00 → #FF9F1C.
- **Typography:** White Smoke (#F4EFEF) for primary text on dark backgrounds, Cool Charcoal (#9E928E) for secondary/muted text.
- **Financial Status:** Yield Gain (#00E676, green) for profits and positive indicators; Ember Loss (#FF1744, red) for losses and negative indicators; System Info (#2979FF, blue) for neutral information.
- **Borders:** Ashes Border (#261E1C) for all dividers and container outlines.

## Typography

This design system uses **Outfit** as the universal sans-serif for both headings and body text, providing a clean, modern, and highly legible interface. **Geist Mono** is used exclusively for financial figures, numbers, and technical labels to ensure tabular alignment and numerical clarity.

- H1: Outfit 48px, ExtraBold (800), 110% line-height — hero statements
- H2: Outfit 32px, Bold (700), 120% — section headings
- H3: Outfit 20px, SemiBold (600), 130% — subsection headings
- Body: Outfit 15px, Regular (400), 150% — readable content
- Caption: Outfit 11px, SemiBold (600), 140% — meta labels, uppercase
- Numbers: Geist Mono 28px, Bold (700), 110% — financial figures

## Layout & Spacing

The layout follows a **Fluid Grid** model based on a 4px baseline shift.

- **Mobile:** 4-column layout with 16px side margins and 16px gutters.
- **Tablet/Desktop:** 12-column layout. Max-width for content is 1200px.
- **Vertical Rhythm:** Use `16px` (md) for standard element spacing and `24px` (lg) for section spacing, `48px` (2xl) for major sections.

Layouts should favor generous padding (56px on desktop) to let the dark backgrounds breathe.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layers** on the dark canvas and subtle **Fire Glow** shadows.

1. **Base:** Void Space #0D0B0A (Global background).
2. **Level 1 (Cards/Sections):** Ember Surface #171311 with a 1px border of Ashes Border #261E1C.
3. **Level 2 (Popovers/Modals):** Ember Surface with a warm ambient glow: `0px 12px 16px rgba(255, 90, 38, 0.03)`.

Use Ashes Border (#261E1C) for all structural dividers. Avoid heavy shadows — prefer subtle orange-tinted ambient glow for elevated elements.

## Shapes

The design system utilizes a **Rounded** corner strategy with the following conventions:

- **Small elements (badges, indicators):** 6px (`0.375rem`).
- **Buttons & Inputs:** 8px (`0.5rem`).
- **Cards & Containers:** 16px (`1rem`).
- **Feature Banners:** 24px (`1.5rem`).

## Components

### Buttons
- **Primary:** Solid Magma Core (#FF5A26) background, Void Space (#0D0B0A) text, bold uppercase. 8px rounded, 44px height.
- **Secondary:** Transparent with 1px Magma Core border, Magma Core text.
- **Ghost:** Transparent background with Cool Charcoal (#9E928E) text.

### Cards
Cards use Ember Surface (#171311) background with 1px Ashes Border (#261E1C), 16px rounding, and subtle warm glow shadow.

### Status Badges
- **Positive:** 10% opacity Yield Gain background with solid Yield Gain text.
- **Negative:** 10% opacity Ember Loss background with solid Ember Loss text.

### Progress Bars
Dark track (Void Space #0D0B0A with Ashes Border), gradient fill from Molten Lava (#FF2E00) to Magma Core (#FF5A26).
