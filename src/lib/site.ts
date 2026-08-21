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
 * How to reach the business. The number is the real one; the mailbox is still
 * a placeholder — swap it before launch. The `href` forms are derived from the
 * display strings so they stay in step.
 *
 * No street address: the business is dispatched rather than visited, so the
 * footer lists ways to reach a human and nothing else.
 */
export const contact = {
  phone: {
    label: "(850) 896-3173",
    href: "tel:+18508963173",
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
