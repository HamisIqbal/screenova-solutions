/**
 * Single source of truth for site-wide metadata. Update the URL before the
 * first production deploy so Open Graph tags resolve correctly.
 */
export const siteConfig = {
  name: "Screenova Solutions",
  description:
    "Professional window screen replacement, rescreening, and custom screen installation for homes and businesses throughout the Tampa Bay Area.",
  url: "https://screenova.solutions",
} as const;

export type SiteConfig = typeof siteConfig;

/**
 * Where the business actually is, and how to reach it. Placeholder values —
 * swap the street, phone, and mailbox for the real ones before launch; the
 * `href` forms are derived from the display strings so they stay in step.
 */
export const contact = {
  address: {
    lines: ["4830 W Kennedy Blvd, Suite 600", "Tampa, FL 33609"],
    /** Opens the pin rather than a search result page. */
    href: "https://maps.google.com/?q=4830+W+Kennedy+Blvd+Suite+600+Tampa+FL+33609",
  },
  phone: {
    label: "(813) 555-0142",
    href: "tel:+18135550142",
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
