---
name: EVENTIFY
description: Discover events, competitions, hackathons, internships and courses — matched to you by AI.
colors:
  accent: "#ff4d2e"
  accent-dark: "#e23b1c"
  accent-soft: "#ffe4dd"
  ink: "#0e1116"
  ink-2: "#4a5058"
  bg: "#fafaf8"
  surface: "#ffffff"
  surface-2: "#f4f3ef"
  success: "#1e7a4f"
  error: "#b3261e"
typography:
  display:
    fontFamily: "Outfit, Inter, system-ui, sans-serif"
    fontSize: "clamp(44px, 7vw, 84px)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Outfit, Inter, system-ui, sans-serif"
    fontSize: "clamp(30px, 4vw, 48px)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Outfit, Inter, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "28px"
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "26px"
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    lineHeight: "16px"
    letterSpacing: "0.06em"
  mono:
    fontFamily: "'JetBrains Mono', ui-monospace, monospace"
    fontWeight: 500
rounded:
  sm: "6px"
  md: "12px"
  lg: "20px"
  pill: "9999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  6: "24px"
  8: "32px"
  12: "48px"
  20: "80px"
  32: "128px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.25rem"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.25rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.accent}"
    rounded: "{rounded.pill}"
    padding: "0.7rem 1.25rem"
  card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.6}"
  input-primary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.7rem 0.9rem"
---

# Design System: EVENTIFY

<!-- Scan-mode extraction from the current codebase (assets/css/theme.css, assets/js/tw-config.js, app/nav.css, org/*.css, admin.css). The qualitative language below (North Star, color/component character) is INFERRED from the code's own comments and visual choices, not confirmed by the user — treat as a starting description to correct, not settled doctrine. -->

> **THEME LOCK (user directive, confirmed 2026-09-07).** Every token in this file's frontmatter — colors, typography (Outfit display / Inter body / JetBrains Mono data), rounded, spacing — plus the light/dark palette pair and the wordmark/logo are frozen as of this scan. Future work on this project ("polish", "audit", "layout", etc.) may not change a hex value, font family, radius step, or spacing value, and may not introduce a new accent hue. Allowed craft-level work — spacing/alignment precision *within* the existing scale, visual hierarchy, component consistency, hover/focus/active micro-interactions, transitions, loading and empty states, responsive behavior, and accessibility — must be expressed using only the tokens and components already documented below. If a task appears to require a new token, stop and ask rather than inventing one.

## Overview

**Creative North Star (inferred): "The One-Accent Newsroom"**

The system's own stylesheet states its intent in a comment: *"high-contrast ink on paper, one accent, no brand gradient."* Nearly the entire interface is built from two non-colors — near-black ink (`#0e1116`) and warm off-white paper (`#fafaf8`/`#ffffff`) — with a single hot accent, safety-orange-red (`#ff4d2e`), doing all of the chromatic work: primary actions, links, focus rings, the wordmark's full stop. Depth comes from soft, ink-tinted shadows and translucent glass panels rather than color. A fine SVG noise grain is layered under every page so large flat areas never read as dead vector space — a deliberate, unusual touch for a product this young.

The visual world is confident and editorial rather than playful: heavy, tight, "unapologetic" display type (the codebase's own words) paired with a restrained, quiet body face. Micro-motion is everywhere but small — buttons press down 1px on click, cards lift 4-6px on hover, content reveals in a soft staggered cascade — giving the product a tactile, responsive feel without ever feeling loud.

**Key Characteristics:**
- One chromatic accent (`#ff4d2e`) against ink-on-paper neutrals; no second brand hue, no gradient logo.
- Heavy/tight display type (Outfit, weight 700-800, negative tracking) over a plain, legible body face (Inter).
- Numbers always render in a monospace, tabular-nums face (JetBrains Mono) so data reads as data.
- Flat paper at rest; shadows and blur (`backdrop-filter`) appear only under floating chrome (nav, sidebars) and on hover.
- A visible film-grain texture sits under the whole app — the system is deliberately not sterile-flat.
- Pill-shaped (`9999px`) buttons and chips everywhere; rectangular radii step down as elements nest (20px → 12px → 6px).
- A full light/dark pair (`html.dark`) with every token re-mapped, not just inverted.
- Four role-scoped surfaces (public/Visitor, participant App, Org, Admin) share one token system but each carries a distinct identity accent or panel treatment (see Components → Role Surfaces).

## Colors

The palette is almost monochrome by design — ink and paper — with one hot accent carrying every call to action, and small, named status hues reserved strictly for success/error feedback.

### Primary
- **Signal Orange** (`#ff4d2e` / `--accent`, `--primary`): the only chromatic color used at any real coverage. Primary buttons, links, active nav states, focus rings, form-field focus glow, the wordmark's trailing square, selection highlight (`::selection`).
- **Signal Orange, Dark** (`#e23b1c` / `--accent-dark`): hover/active shading and the dark end of `--grad-brand`.
- **Signal Orange, Soft** (`#ffe4dd` / `--accent-soft`): tinted fill for empty-state icon wells and other very-low-emphasis accent surfaces.

### Neutral
- **Ink** (`#0e1116` / `--ink`, `--secondary`): primary text, headline color, and — doubling as a "secondary brand color" — dark UI chrome (buttons, footers, the admin identity accent) instead of a second hue.
- **Ink, Muted** (`#4a5058` / `--ink-2`, `--tertiary`): secondary text, metadata, quiet labels.
- **Paper** (`#fafaf8` / `--bg`): page background.
- **Paper, Bright** (`#ffffff` / `--surface`): card and panel background.
- **Paper, Dim** (`#f4f3ef` / `--surface-2`): recessed surfaces — skeleton loaders, empty-state wells.
- **Hairline** (`rgba(14,17,22,.1)` / `--border`) and **Hairline, Strong** (`rgba(14,17,22,.2)` / `--border-strong`): all dividers and default input/button borders, always ink-tinted rather than gray.

### Status
- **Success** (`#1e7a4f`): success toasts, "done" button state (`rgba(0,105,71,.12)` fill).
- **Error** (`#b3261e`, toast variant `#8c1d18`): error toasts, "rejected" action state (`rgba(186,26,26,.1)` fill).

### Dark mode
`html.dark` remaps ink↔paper (ink becomes `#f5f4f1`, background becomes `#0b0c0e`, surfaces `#16181c`/`#1c1f24`) and re-derives every shadow with darker, higher-opacity black rather than reusing the light-mode values. The accent orange is not changed in dark mode — it is the one constant across both themes.

### Named Rules
**The One Voice Rule.** Orange is the only hue in the system. Every other color is ink, paper, or a status color reserved for success/error feedback — never introduce a second decorative brand hue.

## Typography

**Display Font:** Outfit (weights 500-800), falling back to Inter, then system UI.
**Body Font:** Inter (weights 400-700), falling back to system UI / Segoe UI.
**Mono Font:** JetBrains Mono (weights 500, 700), for anything numeric.

**Character:** Outfit is heavy, tight and geometric where it appears (headlines only); Inter stays plain and highly legible everywhere else. The two are never blended within one text run — display uses only Outfit, everything else only Inter.

### Hierarchy
- **Display** (800, `clamp(44px,7vw,84px)`, line-height 0.95, tracking -0.04em): hero/marketing headlines only (`h1`, `.font-display-lg`).
- **Headline** (700-800, `clamp(30-64px)` depending on scale step, tracking -0.03 to -0.035em): section headers.
- **Title** (600, 18-20px, tracking -0.01 to -0.015em): card titles, panel headers.
- **Body** (400, 14-18px, line-height 22-30px): all running text; unconstrained paragraphs cap at `68ch` measure.
- **Label** (600-700, 12-15px, uppercase-capable, tracking up to +0.06em): buttons, badges, form labels, the `.demo-badge`/`.admin-badge` uppercase pill text.

### Named Rules
**The Data-Is-Mono Rule.** Any numeric value shown as data — stat counters, tabular figures, `[data-count]` elements — renders in JetBrains Mono with `font-variant-numeric: tabular-nums`, never in the display or body face. It marks the number as measured, not decorative.

## Layout

Max content width is `1280px` (`container_max_width`), with responsive side margins of `20px` on mobile and `48px` on desktop. The App shell reserves a `280px` fixed sidebar (`sidebar_width`) that never shrinks under flex pressure — a top-level rule in `theme.css` exists specifically to pin it against being squeezed by wide siblings like embedded charts.

Spacing follows a loose 4px-based scale (4/8/12/16/24/32/48/80/128px) rather than a strict geometric ratio — small UI gaps stay tight (4-16px) while section rhythm on marketing pages jumps to 80-128px. Marketing-page section padding is `120px` vertical on desktop, stepping down to `80px` and `60px` at the 768px and 480px breakpoints.

Navigation is responsive by component swap, not just reflow: a fixed top navbar (`.app-navbar`, 64px tall, glass blur) on desktop/tablet (≥768px) is fully replaced by a fixed bottom tab bar (`.app-bottom-nav`) below that width, each hidden via `display:none` rather than resized.

## Elevation & Depth

Hybrid: the base UI is flat (cards sit on `1px` hairline borders more than shadow), but floating chrome — navbars, sidebars, headers, modals, toasts — uses real elevation plus `backdrop-filter: blur()` glass. Shadows are never neutral black; they always carry the ink hue (`rgba(14,17,22, …)`) or, on hover states near the accent, a faint orange tint.

### Shadow Vocabulary
- **Card** (`0 1px 2px rgba(14,17,22,.04), 0 8px 24px -16px rgba(14,17,22,.18)`): resting card elevation.
- **Card, Hover** (`0 2px 4px rgba(14,17,22,.05), 0 20px 40px -20px rgba(14,17,22,.28)`): card lift on hover, paired with a `-4px` translateY.
- **Elevated** (`0 24px 60px -24px rgba(14,17,22,.36)`): toasts and top-level overlays.
- **Accent** (`0 12px 28px -12px rgba(255,77,46,.5)`): reserved for accent-colored elevated elements.
- **Glass edge** (`inset 0 1px 0 rgba(255,255,255,.6), 0 1px 0 var(--border)`): every glass surface (nav, header, sidebar, panel) gets an inner top highlight plus a crisp bottom hairline so the blur reads as a real pane of glass, not just a fog.

### Named Rules
**The Ink-Shadow Rule.** No shadow in the system uses pure black. Every `box-shadow` color is `rgba(14,17,22, …)`, keeping elevation warm and consistent with the ink/paper palette even at low opacity.

## Shapes

Radius steps down as elements nest: `20px` (`--radius-lg`, page-level shells/panels) → `12px` (`--radius`, cards, wells) → `6px` (`--radius-sm`, inputs, tight controls) → `9999px` (`--radius-pill`, every button, chip, badge, and toast). There is no sharp-cornered (0px) surface anywhere in the system. Avatars use a `30%` "squircle" radius instead of a full circle — a deliberate, recurring signature shape, not a default.

## Components

### Buttons
- **Shape:** fully pill (`9999px`), regardless of variant.
- **Primary:** `--grad-brand` (orange → orange-dark diagonal gradient), white text, ink-tinted shadow (`0 10px 24px -14px rgba(14,17,22,.55)`).
- **Secondary:** paper surface, ink text, `1px` strong hairline border; on hover the border and text switch to accent orange.
- **Ghost:** transparent, accent-colored text; hover fills with a faint `rgba(255,77,46,.08)` wash.
- **Hover / Focus:** every button lifts `translateY(-1px)` and brightens `1.03-1.05x` on hover, presses down `translateY(1px) scale(.985)` on active/click. All interactive elements share one `:focus-visible` treatment — a `2px` accent-orange outline, `2-3px` offset.
- **Persisted state:** buttons that record an outcome (approve/reject-style actions) switch to a flat, shadow-less "done" (muted success tint) or "rejected" (muted error tint) state via a `data-state` attribute, and lose their hover lift once disabled.

### Cards
- **Corner Style:** 12px (`--radius`).
- **Background:** paper-bright surface with a `1px` hairline border.
- **Shadow Strategy:** Card → Card-Hover from the Elevation vocabulary, paired with a `-4px` hover lift.
- **Variant — "soft card":** a frosted, gradient-tinted variant (`rgba(255,255,255,.97)` → faint lavender, `blur(12px)`) used for premium/organizer-facing panels, with an inner diagonal orange-to-ink gradient wash.

### Inputs / Fields
- **Style:** `6px` radius, `1px` strong hairline border, paper-bright background.
- **Focus:** border switches to accent orange plus a soft `3px` orange glow ring (`box-shadow: 0 0 0 3px rgba(255,77,46,.12)`); org-section inputs additionally nudge `-1px` on focus.

### Navigation
- **Desktop (App shell):** fixed 64px glass navbar with underline-on-active links (2px accent underline, `aria-current="page"`); label text 14px/600.
- **Mobile (App shell):** navbar is swapped entirely for a fixed bottom tab bar with icon+label items, active item gets a tinted background pill; press state scales down to `0.92`.
- **Org / Admin:** a fixed `280px` glass sidebar (blur, translucent white/ink), with a role-specific accent border — a top border stripe for headers, a leading-edge stripe for sidebars.

### Toasts
- Pill-shaped, dark (`#16181c`) by default with white text; success/error variants swap to solid `#0f5132` / `#8c1d18`. Enter by fading in and rising 12px from below; stack bottom-center.

### Empty States
- A dashed-border, recessed-surface well (`--radius-lg`, `--surface-2`) with a squared accent-soft icon tile, a display-font heading, and body copy capped at `42ch` — empty states are explicitly designed, not left blank.

### Role Surfaces (signature pattern)
Each of the four sections shares every token above but signals its role through one accent device rather than a different palette: the public Visitor pages use full-bleed hero glow/mesh backgrounds; the participant App uses the standard glass navbar/bottom-nav pair; Org pages get a warm orange-tinted "org-hero" panel and orange-outlined pills; Admin pages get an ink-colored (not orange) top/side accent stripe (`--accent-admin: #0e1116`) specifically so admin chrome reads as authority rather than brand marketing.

## Do's and Don'ts

### Do:
- **Do** treat every value in this file's frontmatter as locked; polish, layout, and component work happens *within* these tokens, never by adding or replacing one.
- **Do** keep every new chromatic decision to the single accent orange (`#ff4d2e`); express secondary emphasis in ink, not a second hue.
- **Do** use pill radius (`9999px`) for every button, chip, and badge; reserve `6/12/20px` for inputs, cards, and page-level shells respectively.
- **Do** tint shadows with ink (`rgba(14,17,22,…)`), never pure black.
- **Do** render any numeric/data value in the mono, tabular-nums face.
- **Do** give every interactive element a visible `:focus-visible` ring — this system already treats accessibility as load-bearing, not optional.
- **Do** design empty states with an icon, headline, and short copy rather than leaving a blank area.

### Don't:
- **Don't** introduce a second brand-color gradient or hue — the stylesheet's own comment explicitly rejects "brand gradient" as a direction.
- **Don't** use a sharp (0px) corner anywhere; the system has no rectangular-cornered surface at any scale.
- **Don't** mix Outfit into body copy or Inter into headlines — the two faces are role-exclusive, never blended in one run.
- **Don't** treat the film-grain background texture, the admin ink-accent stripe, or the squircle avatar as decorative one-offs to drop — they are recurring, deliberate signatures of this system.
