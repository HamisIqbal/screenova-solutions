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
  fonts/                 the two variable woff2 faces, and their licences
  images/                photographs, the logo, service and city pictures
src/
  app/
    layout.tsx           root layout: metadata, cover, header, <main>, footer
    page.tsx             the one page — sections are composed here in order
  components/
    layout/              Cover, Header, Footer — site chrome
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

## Identity

**Palette — taken from the logo**, so the page and the mark are the same brand. There is no dark
mode.

| Token       | Value     | Role                                                                    |
| ----------- | --------- | ----------------------------------------------------------------------- |
| `paper`     | `#FFFFFF` | a ground in its own right, plus the cards and pills on coloured bands   |
| `blue`      | `#0B6FE8` | a ground; on white it is structure — links, rules, step numerals, focus |
| `green`     | `#3FAE12` | action — every primary button on a white band. No longer a ground       |
| `sunset`    | `#FF7A18` | the spark, rationed to two appearances, both of them on white           |
| `navy`      | `#071A2F` | the ink: all text on white bands                                        |
| `black`     | `#000000` | chrome, not brand: the hero ground, the header backdrop, the menu       |
| `blue-soft` | `#6FB6FF` | nav link hover, on the black chrome only                                |
| `mist`      | `#F1F6FC` | cards and form fields — separation from paper without a shadow          |

### The ground system

The page is built as ten full-bleed bands and two colours take turns being the floor — white, blue,
white, blue, white, blue, blue, white, blue, white. Five each. The single repeat is About →
ServiceArea, which is deliberate: who we are and where we work are one answer, so they share a
floor and the heading between them does the separating.

**Green is no longer a ground.** It is still a third of the brand and still the loudest thing on
the page, but it appears as the action pill on every white band rather than as a floor — which is
the one surface where it is unambiguous, and where it never has to give way to navy to stay
readable the way it did on a green band. The `green` ground is still defined in `globals.css` and
still in the `Ground` union, unused, so bringing a green band back is a one-word edit.

A band declares itself with `<Section ground="paper|blue|green">`, which sets `data-ground`. The
`[data-ground]` block in `globals.css` then re-points every role for that band — `--on-ground`,
`--on-ground-muted`, `--rule`, `--raised`, `--action`, `--on-action`, `--link-underline`,
`--focus-ring`, `--spark`. **Components name roles, never colours**, which is what lets a section
change ground without any of its children being touched. A white card on a coloured band carries
`data-ground="paper"` itself, so everything inside it flips back to the white set.

| Ground | Text  | Rule  | Card  | Action pill   | Spark  | h1 accent   |
| ------ | ----- | ----- | ----- | ------------- | ------ | ----------- |
| white  | navy  | blue  | mist  | green / navy  | sunset | blue        |
| blue   | white | white | white | white / navy  | —      | white       |
| green  | navy  | navy  | white | navy / white  | —      | navy        |
| sky    | white | white | white | white / black | —      | `blue-soft` |

`sky` is black. It is the chrome ground — the header bar and the full-screen menu, so the CTA
inside them resolves like any other rather than being hand-painted — and it is also **the hero's
ground**, because the hero's floor is a photograph and a dark photograph needs a dark ground's text
roles. White on it is 21:1, the strongest pairing on the site.

It was navy, and the change is worth naming: navy chrome reads as a fourth brand colour, one more
blue competing with the blue that actually _is_ the brand. Black does not compete — the eye files
it as structure rather than as a band, which leaves the logo blue as the only blue on the page
carrying meaning.

The action pill changes colour with the band and each is forced by measurement, not taste. Green is
the action wherever it can be — but green on blue is 1.82:1, so there the pill goes white at
4.72:1. The shape, radius and type never change, so it stays one button. With green off the floor,
the green pill on white is now the only place the colour appears at full strength, and the page's
closing CTA is a white band chosen for exactly that.

Measured contrast: navy on paper 17.5:1, navy on green 6.77:1, navy on sunset 6.7:1, blue on paper
4.7:1, paper on blue 4.72:1, `navy-muted` on paper 5.9:1, navy at 82% on green 5.2:1. Four pairs
fail and the system is built around avoiding them — **paper on green 2.59:1**, **sunset on paper
2.6:1**, **green on blue 1.82:1**, **sunset on green 1.04:1**. So green never carries light text,
sunset is a fill on white and nowhere else, and blue and green only ever meet as two grounds with a
straight edge between them, never as a mark on a field. Links keep the ground's text colour and
spend the accent on the underline for the same reason: recolouring navy text to blue would trade
17.5:1 for 4.7:1 to gain nothing.

**The logo** (`public/images/Screenova-solution-Window-And-Door-Screens-LOGO.png`, wired through
`logo` in `src/content/nav.ts`) is half white lettering on transparent, so it needs something dark
under it at all times. Over the hero that is the scrim; past the hero it is the header's scroll
backdrop — which is why that backdrop exists. On black the mark's white lettering is 21:1 and
stands on its own with no drop shadow propping it up.

### The header

No bar. A transparent overlay carrying three things over the top of the hero photograph: the mark
at the left, a glass capsule of links centred on the window, the quote button at the right. It
takes `data-ground="sky"` for the roles but `bg-transparent` to refuse the ground's own fill —
utilities sort after the base layer, so the class wins at equal specificity with no `!important`.

The capsule is centred on the **window**, not on the space between the mark and the button, so it
is positioned rather than laid out — those two are different widths, and a flex row would have put
it visibly off-centre. The glass is `backdrop-blur-xl` + `backdrop-saturate-150` + a 10% white wash

- a 15% white border: the blur alone drains the colour out of what is behind it, and a wash alone
  has no defocus. All four are needed.

Because the header paints nothing, the hero photograph reaches the top of the window. It always
ran the full height of its band — the image is `inset-0` — but a solid bar was covering its first
88px.

**One addition that is not in the design:** a black backdrop fades in behind the whole overlay as
soon as the page scrolls. A transparent header is drawn against a dark picture, and 200px down the
page is white, where white lettering, a white quote pill and a half-white mark all disappear. The
trigger is 8px of scroll, so only the resting state at the very top is left bare. Delete
`scrolled` and the element it gates to remove it.

**Type — one family, three roles.** Everything on the site is **Chillax** (Indian Type Foundry),
self-hosted from `public/fonts/` under the ITF Free Font License — commercial use and self-hosting
both expressly permitted; the licence text ships in the repo at
`public/fonts/Chillax_Complete/License/FFL.txt`.

The roles survive as tokens — `--font-hero`, `--font-title`, `--font-body` — and every component
still references those rather than a face. They just all resolve to the same family now, because
the roles are carried by weight and size instead of by three typefaces.

| Role  | Weight        | Where                                             |
| ----- | ------------- | ------------------------------------------------- |
| Hero  | Semibold, 600 | `h1` only — sentence case, in blue                |
| Title | Regular, 400  | `h2`, `h3`                                        |
| Body  | Regular, 400  | paragraphs, leads, nav links, labels, form fields |

**Regular is the site's voice.** Semibold appears in exactly one place — the h1 — which is what
makes it read as the one heavy thing rather than the heaviest of many. Headings do not need weight
on top of size: 33.6px against 14px is already a 2.4x step. The single other exception is the
action pill at Medium 500, because a filled button at 14px in Regular reads as a label with a
background rather than as a control.

One file ships, not six: `Chillax-Variable.woff2` carries the whole 200–700 axis in 55KB, where
Regular, Medium and Semibold as separate statics would be 67KB for three fixed points. Adjusting a
weight anywhere on the site therefore costs nothing at the network.

**The line breaks and the hero size ceiling are one decision**, solved together against Chillax
Semibold's real advance widths. The widest authored line is 8.01em, the hero column is 46% of the
measure, and the binding width is 1024px — where the two-column layout switches on before the
measure has reached its cap. That is where the 54px ceiling comes from. The same four lines in the
previous face were 10.73em and could only carry 40px; Chillax is a much narrower drawing and the
whole of that difference went into size. Re-measure and re-solve both if the wording or the face
changes; the numbers are recorded beside the copy in `src/content/home.ts` and beside the token in
`src/styles/tokens.css`.

Blue on white is 4.7:1 — under the 4.5:1 threshold body text needs, but the h1 is 54px at weight
600, which is WCAG large text at 3:1 with room over. It is the one place the accent is spent on
type rather than on an underline, and it works because it is the largest thing on the page.

**Which blue is the ground's decision**, not the h1's — hence `--hero-ink` rather than a named
colour. On the hero's black ground the logo blue collapses: `#0B6FE8` is itself a dark colour
(relative luminance 0.17) and measures 1.6:1 against the scrim. `blue-soft` at luminance 0.44
clears 4.2:1 against the darkest part of that scrim. The headline is still blue; the ground picks
the one that survives it.

### The hero scrim

The hero photograph fills the band and the copy stands on it, which makes the scrim between them a
measurement rather than a taste call. The room is bright and every window in it is blown out —
highlights sit around sRGB 0.95, effectively white. Compositing in sRGB and converting to relative
luminance:

| Scrim | Worst pixel behind type | White on it | `blue-soft` on it |
| ----- | ----------------------- | ----------- | ----------------- |
| 45%   | sRGB 0.95 → L 0.235     | 3.7:1       | 1.4:1             |
| 55%   | sRGB 0.95 → L 0.153     | 5.2:1       | 2.4:1             |
| 70%   | sRGB 0.95 → L 0.066     | 9.1:1       | 4.2:1             |

70% is what carries it, and `blue-soft` is the binding case rather than the white body copy — a
light blue has far less room over a dark ground than white does. It ships as two layers so the
photograph survives: a uniform 70% below `lg`, where the words run full width; and above `lg` a
55% flat plus a left-weighted gradient that multiplies out to 70.75% behind the words and falls
back to 55% by the right edge, where the windows are still windows.

## Conventions

- **Path alias:** import via `@/...`, never relative paths that climb out of a directory.
- **Adding a section:** create `src/components/sections/<Name>.tsx`, export it from
  `sections/index.ts`, then render it in `app/page.tsx`. Sections own their own styles
  and animations; nothing section-specific goes in `globals.css`.
- **Section anatomy:** wrap in `<Section ground="…">` — it owns the band colour, the container
  and the gutter — then open with `<SectionHeader>` (eyebrow, title, intro) and use `<CtaLink>`
  for any primary action. Those three primitives are what make the sections read as one page;
  reach for them before writing bespoke markup, and keep the band rotation alternating.
- **Colour by role:** inside a section write `text-(--on-ground-muted)`, `bg-(--action)`,
  `bg-(--rule)`, never `text-muted` or `bg-green`. A literal colour is a section that breaks
  when its ground changes.
- **Server by default:** components are React Server Components unless they need
  state, effects or animation — those get `"use client"`.
- **GSAP:** import `{ gsap, ScrollTrigger }` from `@/animations`, never from `gsap`
  directly. Scope tweens with `gsap.context()` and revert on cleanup.
- **Tokens over literals:** colour, type and motion values come from `tokens.css` /
  `animations/tokens.ts`. The two motion token files mirror each other — update both.
- **Reduced motion:** `usePrefersReducedMotion()` for JS animation; CSS is already
  handled by the media query in `globals.css`.
