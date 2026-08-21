import type { Metadata } from "next";
import { InfoPage } from "@/components/pages/InfoPage";
import { getPageContent, pageMetadata } from "@/lib/pageMeta";

/**
 * `/window-screen-replacement/` — the screen and frame replacement service page.
 *
 * The route file holds no copy. Everything this page says lives in
 * `src/content/pages.ts` under this same href, and everything it looks like
 * lives in `InfoPage`. The one thing that is here is the href itself, which is
 * the key joining the folder name to its content — `getPageContent` throws at
 * build time if the two ever stop matching.
 */
const HREF = "/window-screen-replacement/";

export const metadata: Metadata = pageMetadata(HREF);

export default function Page() {
  return <InfoPage content={getPageContent(HREF)} />;
}
