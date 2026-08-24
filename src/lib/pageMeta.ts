import type { Metadata } from "next";
import { allInfoPages, type InfoPageContent } from "@/content/pages";
import { ogImage } from "@/lib/site";

/**
 * Look a page's content up by its route, and fail loudly if it is not there.
 *
 * Every route file passes its own href, which is also the key in
 * `content/pages.ts`. Throwing rather than returning `undefined` is deliberate:
 * a mismatch between a folder name and an `href` is a build-time typo, and a
 * build that stops is a great deal better than a page that renders blank.
 */
export function getPageContent(href: string): InfoPageContent {
  const content = allInfoPages.find((page) => page.href === href);
  if (!content) throw new Error(`No page content registered for ${href}`);
  return content;
}

/**
 * The `<head>` for one of those pages.
 *
 * `title` is the bare string; the root layout's template appends
 * " | Screenova Solutions", so the brand is never written twice and every page
 * on the site carries the same suffix. The canonical is the page's own route —
 * the site is canonical on the trailing-slash spelling, which `trailingSlash`
 * in `next.config.ts` enforces.
 */
export function pageMetadata(href: string): Metadata {
  const { metaTitle, metaDescription } = getPageContent(href);

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: { canonical: href },
    openGraph: {
      title: `${metaTitle} | Screenova Solutions`,
      description: metaDescription,
      url: href,
      // Repeated rather than inherited, and it has to be: a route that declares
      // `openGraph` replaces the layout's object outright instead of merging
      // into it, so a page that left this out would unfurl with no picture at
      // all. `ogImage` is the single source — see `lib/site.ts`.
      images: [ogImage],
    },
  };
}
