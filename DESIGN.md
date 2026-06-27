---
name: Luminous Fintech
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf3'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d5e3fc'
  on-surface: '#0d1c2e'
  on-surface-variant: '#3d494c'
  inverse-surface: '#233144'
  inverse-on-surface: '#eaf1ff'
  outline: '#6d797d'
  outline-variant: '#bcc9cd'
  surface-tint: '#00687a'
  primary: '#00687a'
  on-primary: '#ffffff'
  primary-container: '#06b6d4'
  on-primary-container: '#00424f'
  inverse-primary: '#4cd7f6'
  secondary: '#006b5f'
  on-secondary: '#ffffff'
  secondary-container: '#62fae3'
  on-secondary-container: '#007165'
  tertiary: '#565e74'
  on-tertiary: '#ffffff'
  tertiary-container: '#9ea6bf'
  on-tertiary-container: '#343c50'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#acedff'
  primary-fixed-dim: '#4cd7f6'
  on-primary-fixed: '#001f26'
  on-primary-fixed-variant: '#004e5c'
  secondary-fixed: '#62fae3'
  secondary-fixed-dim: '#3cddc7'
  on-secondary-fixed: '#00201c'
  on-secondary-fixed-variant: '#005047'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f8f9ff'
  on-background: '#0d1c2e'
  surface-variant: '#d5e3fc'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
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

The design system is engineered for a premium Korean fintech experience, emphasizing clarity, speed, and absolute trust. It targets a digitally-native audience that demands professional-grade financial tools delivered with an approachable, modern interface.

The aesthetic blends **Minimalism** with **Modern Corporate** sensibilities. By utilizing expansive white space and high-contrast typography, the UI remains legible even when displaying complex data. The emotional response is one of calm confidence—reducing the cognitive load often associated with personal finance and investment.

## Colors

The palette is anchored by a pristine `#ffffff` canvas, utilizing `#f8fafc` for container elevation and structural grouping. 

- **Primary Accent:** A vibrant gradient from Ice Blue (#06b6d4) to Mint (#2dd4bf) is reserved for primary calls-to-action and positive growth momentum.
- **Typography:** Dark Navy (#0f172a) ensures peak readability for headlines, while Slate Gray (#475569) softens body content.
- **Financial Status:** Strictly follows Korean market conventions: **Red (#ef4444)** for profit, gains, and "up" indicators; **Blue (#3b82f6)** for loss, expenses, and "down" indicators.

## Typography

This design system uses **Plus Jakarta Sans** for headlines to provide a modern, friendly, and slightly geometric personality. **Inter** is used for all functional body and label text to ensure maximum legibility and a systematic, clean feel.

Large display headings should use tighter letter spacing to maintain a cohesive look. Financial figures and labels should prioritize `Inter` to ensure numerical clarity.

## Layout & Spacing

The layout follows a **Fluid Grid** model based on a 4px baseline shift. 

- **Mobile:** 4-column layout with 16px side margins and 16px gutters.
- **Tablet/Desktop:** 12-column layout. Max-width for content is 1200px.
- **Vertical Rhythm:** Use `16px` (md) for standard element spacing and `24px` (lg) for section spacing.

Layouts should favor generous top/bottom padding to reinforce the airy, minimalist fintech aesthetic.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layers** and extremely subtle **Ambient Shadows**.

1.  **Base:** `#ffffff` (Global background).
2.  **Level 1 (Cards/Sections):** `#f8fafc` surface or a white card with a 1px border of `#f1f5f9`.
3.  **Level 2 (Popovers/Modals):** White surface with a soft, diffused shadow: `0px 10px 25px -5px rgba(15, 23, 42, 0.08)`.

Avoid heavy shadows or dark overlays. Use 1px borders in very light gray to define boundaries without adding visual weight.

## Shapes

The design system utilizes a **Rounded** (0.5rem / 8px) corner strategy to soften the professional tone and make the application feel accessible.

- **Buttons & Small Inputs:** 8px (`0.5rem`).
- **Cards & Modals:** 16px (`1rem`).
- **Feature Banners:** 24px (`1.5rem`).
- **Search Bars:** Often use pill-shaped (100px) for a modern, mobile-first look.

## Components

### Buttons
- **Primary:** Gradient background (#06b6d4 to #2dd4bf), white text, no border. Subtle scale-down effect on tap.
- **Secondary:** Surface #f1f5f9 with #0f172a text.
- **Ghost:** Transparent background with #475569 text.

### Cards
Cards are the primary container. They should use a white background with a subtle border (#f1f5f9) or a very light tint (#f8fafc) to separate from the main background.

### Input Fields
Inputs use a white background, 1px border (#e2e8f0), and 8px rounding. On focus, the border transitions to the primary Ice Blue (#06b6d4) with a subtle outer glow.

### Chips & Badges
Small, high-radius (pill) shapes. Use light tints of the status colors for backgrounds (e.g., light red for negative trends) with high-contrast text.

### Lists
Clean, borderless lists with 16px vertical padding. Use horizontal dividers only when content is dense, using color #f1f5f9.