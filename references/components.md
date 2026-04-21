# Nothing Design Components — Nudge CRM

## 1. Button
- **Pill shape:** `border-radius: 999px`
- **Technical shape:** `border-radius: 4-8px`
- **No gradients** — flat color or transparent
- **No shadows**
- **Variants:**
  - Primary: border + text color, hover bg fill
  - Ghost: transparent bg, border only
  - Minimal: no border, text color only on hover

## 2. Card
- **No shadow**
- **Border-only separation**
- **Border-radius:** max 16px
- **Padding:** 16-24px

## 3. Input
- **Border-only:** 1px solid var(--border-light)
- **Focus:** border-color to var(--text-primary), no outline
- **Label:** Space Mono ALL CAPS, 12px, above or inline
- **No floating labels**

## 4. Modal/Overlay
- **Simple border** instead of shadow
- **Dark overlay:** rgba(0,0,0,0.5) for light, rgba(255,255,255,0.05) for dark
- **No blur**

## 5. Table
- **No zebra striping**
- **Border-bottom** between rows only
- **Left-aligned** text
- **Font-mono** for numbers/IDs

## 6. Loader
- **`[LOADING...]`** text only
- No skeleton screens

## 7. Toast/Notification
- **Inline only** — no popups
- **Border + text** only
- Auto-dismiss after 4s

## 8. Empty State
- **Illustration:** simple emoji or minimal SVG
- **Title:** Doto headline
- **Subtitle:** Space Grotesk body
- **CTA:** Primary button

## 9. Alert Banner
- **Border + text color** only
- **No icon** (except for data status colors which are exempt)
- **Inline with content**

## 10. Progress Indicator
- **Linear bar** — border + fill color
- **No animation**
- **Compact:** 4-8px height
- **Label:** Space Mono percentage

## 11. Tag/Chip
- **Border + text** only
- **No background fill**
- **ALL CAPS, Space Mono, 11px

## 12. Navigation Link
- **Underline on hover** only
- **No active background**
- **Space Mono, 14px

## 13. Switch/Toggle
- **Slider:** gray to colored on active
- **Track:** border only
- **Size:** 40px wide, 24px tall

## 14. Date Picker
- **Border-only input**
- **Dropdown calendar** — no custom styling
- **Today:** bold day number

## 15. Scrollbar
- **Thin:** 4px width
- **Color:** var(--text-tertiary)
- **Hover:** var(--text-secondary)