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
