import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

/**
 * `/robots.txt`. Everything is public — there is nothing on this site that is
 * not meant to be indexed — so the only thing worth saying is where the sitemap
 * is.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
