/**
 * Single source of truth for site-wide metadata. Update the URL before the
 * first production deploy so Open Graph tags resolve correctly.
 */
export const siteConfig = {
  name: "Screenova Solutions",
  description:
    "Custom window screens, screen repair, rescreening and replacement throughout Tampa Bay. Mobile service — we come to you. Get a free quote from Screenova Solutions.",
  url: "https://screenova.solutions",
} as const;

export type SiteConfig = typeof siteConfig;

/**
 * The one card every link to this site unfurls with — the same picture whether
 * somebody pastes the home page, a service page or a city page into Messages,
 * WhatsApp, Slack, Facebook or X.
 *
 * One card and not one per page, deliberately. A per-page image is worth having
 * when the pages are genuinely different things to look at; these are the same
 * business described at different lengths, and eight variations of the same
 * photograph with different words on it is eight things to keep in step for no
 * gain. The title and description under the card are already per-page — see
 * `pageMetadata` — so the card carries the brand and the words carry the page.
 *
 * It is built by `scripts/brand-assets.mjs` from two things already in the
 * repository: the hero photograph, and the logo over a scrim dark enough to
 * carry the wordmark's white lettering. Re-run that script after changing
 * either, and keep the dimensions here in step with it — every platform reads
 * these numbers to reserve the space before the image itself has loaded.
 *
 * 1200x630 is the size every platform crops from rather than to.
 */
export const ogImage = {
  url: "/og.jpg",
  width: 1200,
  height: 630,
  alt: "Screenova Solutions — window and door screens across Tampa Bay",
} as const;

/**
 * How to reach the business. The number is the real one; the mailbox is still
 * a placeholder — swap it before launch. The `href` forms are derived from the
 * display strings so they stay in step.
 *
 * No street address: the business is dispatched rather than visited, so the
 * footer lists ways to reach a human and nothing else.
 */
export const contact = {
  phone: {
    label: "(813) 513-0111",
    href: "tel:+18135130111",
  },
  email: {
    label: "info@screenova.solutions",
    href: "mailto:info@screenova.solutions",
  },
} as const;

/**
 * The three handles the footer lists, in the order it lists them. Each carries
 * its own mark — see `SocialIcon` in the footer — so adding a fourth means
 * adding a path there too.
 */
export const socials = [
  { label: "Facebook", href: "https://facebook.com/screenovasolutions" },
  { label: "Instagram", href: "https://instagram.com/screenovasolutions" },
  { label: "LinkedIn", href: "https://linkedin.com/company/screenovasolutions" },
] as const;

export type Social = (typeof socials)[number];
