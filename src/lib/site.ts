/**
 * The domain the site will live on once DNS points at it. It is the fallback
 * rather than the answer — see `resolveSiteUrl` directly below.
 */
const INTENDED_DOMAIN = "https://screenova.solutions";

/**
 * Where this build of the site actually is.
 *
 * This matters more than it looks. Every absolute URL the site emits is built
 * from it — the canonical tags, the sitemap, and `og:image`, which is the one
 * that fails loudly. A share card's image URL is fetched by WhatsApp, Facebook
 * or iMessage from their own servers, not from the reader's browser, so it has
 * to be an absolute URL that resolves from the public internet. Point it at a
 * domain that does not exist yet and the link unfurls with a title, a
 * description, and no picture — which is exactly what a hardcoded
 * `INTENDED_DOMAIN` did while DNS was still unset.
 *
 * So it is resolved, in this order:
 *
 *   1. `NEXT_PUBLIC_SITE_URL`, if it is set. The override, and the way to pin
 *      this to something specific from the Vercel dashboard or a local `.env`.
 *   2. Vercel's own answer. `VERCEL_PROJECT_PRODUCTION_URL` is the project's
 *      production domain — the custom one once a custom one is attached, and
 *      the `.vercel.app` one until then, which is the whole point: the site
 *      unfurls correctly at whatever address it is genuinely reachable at, on
 *      the day it is deployed rather than on the day DNS is finished.
 *      `VERCEL_URL` is the per-deployment address and covers previews.
 *   3. `INTENDED_DOMAIN`, for a local build with neither set.
 *
 * All three are read at build time. A change of domain therefore needs a
 * redeploy, not just a DNS change — and the platforms cache what they fetched,
 * so see the note on `ogImage` about forcing them to look again.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercelDomain) return `https://${vercelDomain}`;

  return INTENDED_DOMAIN;
}

/** Single source of truth for site-wide metadata. */
export const siteConfig = {
  name: "Screenova Solutions",
  description:
    "Custom window screens, screen repair, rescreening and replacement throughout Tampa Bay. Mobile service — we come to you. Get a free quote from Screenova Solutions.",
  url: resolveSiteUrl(),
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
 *
 * ---------------------------------------------------------------------------
 * If a link stops showing the card, the cache is usually the reason. WhatsApp,
 * Facebook and iMessage each fetch a URL's tags once and hold the result for
 * days, so a fix deployed after somebody has already shared the link does not
 * reach the copy they are looking at. Two ways round it:
 *
 *   - Share the URL with anything appended to it — `?x=1` — which is a
 *     different string to the cache and is fetched fresh.
 *   - For Facebook and WhatsApp, which share an index, re-scrape the URL at
 *     developers.facebook.com/tools/debug/.
 *
 * The other reason is the domain: the image URL below is made absolute against
 * `siteConfig.url`, and a domain that does not resolve yet cannot serve a
 * picture to anybody's link preview. See `resolveSiteUrl` above.
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
