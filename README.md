# Screenova Solutions

One-page marketing site. Next.js (App Router) + TypeScript + Tailwind v4, with GSAP for
scroll choreography and Motion for component-level animation.

## Commands

```bash
npm run dev        # dev server at http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run format     # prettier
```

## Structure

```
public/                  static assets served from /
  fonts/ icons/ images/ videos/
src/
  app/
    layout.tsx           root layout: metadata, header, <main>, footer
    page.tsx             the one page — sections are composed here in order
  components/
    layout/              Header, Footer — site chrome
    sections/            one directory per page section
    ui/                  reusable primitives shared across sections
  animations/
    gsap.ts              GSAP singleton + plugin registration (import from here)
    tokens.ts            durations, easings, staggers for JS animation
  hooks/                 reusable React hooks
  lib/                   framework-agnostic helpers (cn, siteConfig)
  styles/
    tokens.css           design tokens (@theme) — colour, type, spacing, motion
    globals.css          base layer only
  types/                 shared cross-cutting types
```

## Conventions

- **Path alias:** import via `@/...`, never relative paths that climb out of a directory.
- **Adding a section:** create `src/components/sections/<Name>/`, export it from
  `sections/index.ts`, then render it in `app/page.tsx`. Sections own their own styles
  and animations; nothing section-specific goes in `globals.css`.
- **Server by default:** components are React Server Components unless they need
  state, effects or animation — those get `"use client"`.
- **GSAP:** import `{ gsap, ScrollTrigger }` from `@/animations`, never from `gsap`
  directly. Scope tweens with `gsap.context()` and revert on cleanup.
- **Tokens over literals:** colour, type and motion values come from `tokens.css` /
  `animations/tokens.ts`. The two motion token files mirror each other — update both.
- **Reduced motion:** `usePrefersReducedMotion()` for JS animation; CSS is already
  handled by the media query in `globals.css`.
