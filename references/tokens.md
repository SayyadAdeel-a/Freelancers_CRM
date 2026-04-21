# Nothing Design Tokens — Nudge CRM

## 1. Typography

### Fonts
- **Primary:** Space Grotesk (body, labels, UI)
- **Secondary:** Space Mono (numbers, data, code)
- **Hero:** Doto (ONE per screen max for hero numbers)

### Type Scale
| Use | Size | Weight | Family | Example |
|-----|------|--------|--------|--------|
| Display/Hero | 48-96px | Light/Regular | Doto OR Space Grotesk | 72px headline |
| Heading | 24-32px | Medium | Space Grotesk | Section titles |
| Body | 16px | Regular | Space Grotesk | Main content |
| Labels | 14px | Regular | Space Mono (ALL CAPS) | Field labels |
| Data/Code | 13-15px | Medium | Space Mono | Numbers, stats |

**Rule of thumb:** If reaching for a new font-size, it's a spacing problem. Add distance instead.

## 2. Color System

### Monochrome Scale
| Shade | Hex | Use Case |
|-------|-----|----------|
| Gray-900 | #111827 | Primary text, headings |
| Gray-700 | #374151 | Primary content text |
| Gray-500 | #6B7280 | Secondary text, labels |
| Gray-400 | #9CA3AF | Tertiary, metadata |
| Gray-200 | #D1D5DB | Light borders, dividers |
| Gray-100 | #F3F4F6 | Light surfaces, backgrounds |
| Gray-800 | #1F2937 | Dark surfaces, backgrounds |
| Gray-50 | #F9FAFB | Subtle backgrounds |

### Data Status Colors (exempt from one-accent rule)
- **Success:** #10B981 (green-500) — used on values only
- **Warning:** #F59E0B (amber-500) — used on values only  
- **Error:** #EF4444 (red-500) — used on values only

**Red (#D71921) is NOT used** — it's an interrupt for urgent actions only.

## 3. Spacing Scale
| Value | Use Case |
|-------|----------|
| 4px | Tight - icon + label, micro-spacing |
| 8px | Tight - small gaps between related elements |
| 16px | Medium - list items, form fields, card padding |
| 32px | Wide - section breaks, major divisions |
| 48px | Vast - hero to content separation |
| 64px | Vast - major section transitions |
| 96px | Vast - primary breathing room |

**If a divider line is needed, the spacing is wrong.** Use spacing contrast instead.

## 4. Component Rules

### Cards & Containers
- **No shadows** — use border separation only
- **Border-radius:** Max 16px on cards
- **Buttons:** Pill (999px radius) or technical (4-8px radius)
- **Surfaces:** Flat colors, no gradients

### Loading States
- Use `[LOADING...]` text only
- NO skeleton screens

### Notifications  
- Use inline status text: `[SAVED]`, `[ERROR: ...]`
- NO toast popups

### Data Visualization
- Use **opacity** (100%/60%/30%) or **patterns** (solid/striped/dotted) before introducing color
- Color only on the **value itself**, not backgrounds or labels

### Form Controls
- Flat borders only
- Focus with border-color change only
- No floating labels, use inline labels

## 5. Implementation Notes

### Font Loading (Google Fonts)
```html
<!-- In _app.tsx or layout -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600&family=Space+Mono:wght@400;500;700&family=Doto:wght@400;500;600&display=swap" rel="stylesheet">
```

### CSS Variables
```css
:root {
  /* Typography */
  --font-primary: 'Space Grotesk', sans-serif;
  --font-secondary: 'Space Mono', monospace;
  --font-hero: 'Doto', sans-serif;
  
  /* Monochrome scale */
  --text-display: #111827; /* 100% - hero numbers */
  --text-primary: #374151;  /* 90% - body text */
  --text-secondary: #6B7280; /* 60% - labels, metadata */
  --text-tertiary: #9CA3AF; /* 40% - disabled, hints */
  --text-disabled: #D1D5DB; /* 20% - disabled states */
  
  /* Surfaces */
  --bg-primary: #F9FAFB;    /* light mode background */
  --bg-secondary: #1F2937;  /* dark mode background */
  --bg-card: #FFFFFF;       /* light card */
  --bg-card-dark: #111827;  /* dark card */
  
  /* Borders */
  --border-light: #E5E7EB;
  --border-dark: #374151;
  
  /* Data status (exempt from one-accent) */
  --status-success: #10B981;
  --status-warning: #F59E0B;
  --status-error: #EF4444;
}

[data-theme="dark"] {
  --text-display: #F9FAFB;
  --text-primary: #D1D5DB;
  --text-secondary: #9CA3AF;
  --text-tertiary: #6B7280;
  --text-disabled: #4B5563;
  --bg-primary: #111827;
  --bg-secondary: #F3F4F6;
  --bg-card: #1F2937;
  --bg-card-dark: #FFFFFF;
  --border-light: #374151;
  --border-dark: #E5E7EB;
}
```

### Responsive Typography
```css
/* Base mobile-first */
.text-display { font-size: 2rem; line-height: 1.1; }
.text-heading { font-size: 1.5rem; }
.text-body { font-size: 1rem; }
.text-label { font-size: 0.875rem; }

/* Tablet+ */
@media (min-width: 768px) {
  .text-display { font-size: 3rem; }
  .text-heading { font-size: 1.875rem; }
}

/* Desktop+ */
@media (min-width: 1024px) {
  .text-display { font-size: 3.75rem; }
  .text-heading { font-size: 2.25rem; }
}
```

### Utility Classes
```css
/* Spacing helpers */
.tight { gap: 8px; }
.medium { gap: 16px; }
.wide { gap: 32px; }
.vast { gap: 64px; }

/* Typography helpers */
.font-mono { font-family: var(--font-secondary); }
.font-body { font-family: var(--font-primary); }
.font-hero { font-family: var(--font-hero); }

/* Monochrome text */
.text-display { color: var(--text-display); }
.text-primary { color: var(--text-primary); }
.text-secondary { color: var(--text-secondary); }
.text-tertiary { color: var(--text-tertiary); }
.text-disabled { color: var(--text-disabled); }

/* Data status (exempt from one-accent rule) */
.text-success { color: var(--status-success); }
.text-warning { color: var(--status-warning); }
.text-error { color: var(--status-error); }

/* No visual noise */
.no-shadow { box-shadow: none !important; }
.no-radius { border-radius: 0 !important; }
.border-none { border: none !important; }

/* ALL CAPS for labels */
.uppercase-label { text-transform: uppercase; letter-spacing: 0.05em; }
```

## 6. Platform Mapping

### Next.js/React
- Use `className` with CSS variables
- Server components for static content
- Client components for interactive states

### Priority Order
1. Spacing adjustments
2. Typography scale  
3. Color roles (data status only)
4. Component shapes (minimal)