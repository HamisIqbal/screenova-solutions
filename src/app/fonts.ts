import localFont from "next/font/local";

/**
 * Two families, both by Indian Type Foundry, both variable, both self-hosted
 * from `public/fonts/` under the ITF Free Font License — commercial use and
 * self-hosting expressly permitted, licence text shipped in the repo.
 *
 *   Satoshi — the page. Black 900 for the hero headline, Regular 400 for
 *     everything under it.
 *   Chillax — the header, and only the header. It is the one surface that was
 *     designed against it, so it keeps it.
 *
 * That split is the reason the two exist at all. A header set in a different
 * face to the page reads as chrome rather than as the first line of content,
 * which is exactly what it is.
 *
 * Both ship as their variable file rather than as statics: Satoshi carries
 * 300–900 in 43KB and Chillax 200–700 in 55KB, which is less than either family
 * would cost as the three static cuts the page uses, and it makes any weight on
 * either axis free to reach for.
 */

/** The page. Its own fvar axis is wght 300–900. */
export const satoshi = localFont({
  src: "../../public/fonts/Satoshi_Complete/Fonts/WEB/fonts/Satoshi-Variable.woff2",
  weight: "300 900",
  style: "normal",
  variable: "--font-satoshi-face",
  display: "swap",
  // The face's own metrics, so the fallback is scaled to match and swapping
  // does not shift the page.
  adjustFontFallback: "Arial",
});

/** The header. Its own fvar axis is wght 200–700. */
export const chillax = localFont({
  src: "../../public/fonts/Chillax_Complete/Fonts/WEB/fonts/Chillax-Variable.woff2",
  weight: "200 700",
  style: "normal",
  variable: "--font-chillax-face",
  display: "swap",
  adjustFontFallback: "Arial",
});

export const fontVariables = `${satoshi.variable} ${chillax.variable}`;
