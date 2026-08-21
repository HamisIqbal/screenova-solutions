import type { MetadataRoute } from "next";
import { allInfoPages } from "@/content/pages";
import { siteConfig } from "@/lib/site";

/**
 * `/sitemap.xml`, built from the same list the footer links from — so a page
 * exists in the sitemap if and only if it exists as a route, and neither can
 * drift from the other.
 *
 * The home page is first and carries the higher priority: it is the page every
 * other one hands off to, and the only one with the quote form on it.
 *
 * URLs are written with the trailing slash the site is canonical on (see
 * `trailingSlash` in `next.config.ts`), which is also the spelling every
 * `alternates.canonical` in the app uses.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${siteConfig.url}/`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...allInfoPages.map((page) => ({
      url: `${siteConfig.url}${page.href}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
