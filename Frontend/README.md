# EVENTIFY — React port

A 1:1 React/JSX port of `Frontend-Eventifiy` (the original static HTML/CSS/JS site),
with full bilingual (Arabic/English, real RTL) support. Vite + React 19 +
React Router v7 + Tailwind CSS v4 + i18next. No TypeScript, no animation library.

- `src/pages/visitor/*` — public marketing pages (done)
- `src/pages/auth/*` — login/signup/password-recovery/org-verification (done)
- `src/pages/app|org|admin/*` — not started yet (currently `ComingSoon` placeholders in `App.jsx`)

## Animations — how they work and how to port a new page

**There is no animation library anywhere in this project (no GSAP, no Framer
Motion, no AOS) — and none should be added.** The original static site did all
of its motion with one small hand-written file,
`Frontend-Eventifiy/assets/js/motion.js`, plus a handful of CSS classes. That
file has been ported to a single hook: `src/hooks/useMotion.js`. Every page
component calls it once:

```jsx
useMotion([])
```

That one call wires up **four automatic, no-markup-needed behaviors** for the
whole page:

1. **Scroll-reveal.** `main section`, `.card`, and `.empty-state` elements are
   auto-tagged with `data-reveal` and fade/slide in via `IntersectionObserver`
   the first time they scroll into view. CSS lives in `src/styles/theme.css`
   under `[data-reveal]` / `[data-reveal-children]`. You don't add classes for
   this — it just happens. Opt an element out with `data-no-reveal`; opt an
   arbitrary element in manually with `data-reveal`; stagger a list of
   children instead of the whole block with `data-reveal-children` on the
   parent (each child gets an increasing delay, up to 8 children). Respects
   `prefers-reduced-motion` automatically.
2. **`.spotlight` cards.** Add the class `spotlight` to any card and the
   pointer position is tracked automatically to drive a cursor-lit glow
   (`--mx`/`--my` custom properties, styled in `theme.css`).
3. **Magnetic `.btn-primary` buttons.** Any element with class `btn-primary`
   automatically gets the pointer-following "magnetic" nudge. Nothing else to
   do.
4. **`[title]` → styled tooltip.** Any element with a plain `title="..."`
   attribute automatically gets swapped to the custom floating tooltip
   (`.premium-tooltip`). Just add `title="..."` like normal HTML.
5. **Image skeletons.** Any `<img>` not yet loaded gets `.loading-skeleton`
   until it loads or errors. Automatic, no markup needed.

### The *other* system: `.ev-fade-up` / `.ev-stagger-N`

This one is **pure CSS, not part of `useMotion` at all** — a CSS keyframe
animation defined in `src/styles/app-shell.css` that plays once on mount (no
scroll trigger). The original static site used this on dashboard-style pages
(app/org/admin) where content should animate in immediately rather than on
scroll into view.

Porting this is literal: copy the `ev-fade-up ev-stagger-N` classes straight
from the original HTML into the JSX, unchanged (`N` is 1–5, and controls the
animation delay). No hook call, no JS — just make sure the page imports
`app-shell.css`.

### Checklist for porting an app/org/admin page

1. Call `useMotion([])` once at the top of the page component (copy the
   pattern from any existing page, e.g. `src/pages/auth/Login.jsx`).
2. Import `../../styles/app-shell.css` if the original HTML page used
   `ev-fade-up`/`ev-stagger-N` classes (most dashboard pages did).
3. Copy `ev-fade-up ev-stagger-N` classes 1:1 from the original HTML — don't
   try to reinterpret or "improve" them, they're already correct.
4. Don't hand-add scroll-reveal classes to `section`/`.card`/`.empty-state`
   elements — `useMotion()` tags those automatically. Only touch
   `data-reveal` / `data-reveal-children` / `data-no-reveal` for the
   non-default cases (e.g. a `.card` that should NOT reveal on scroll).
5. Don't install an animation library. If something doesn't look right,
   compare against `motion.js` in the original static site first — the
   behavior almost certainly already exists there and just needs porting.
