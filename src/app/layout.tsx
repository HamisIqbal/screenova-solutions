import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { fontVariables } from "@/app/fonts";
import { Footer, Header, MobileCtaBar } from "@/components/layout";
import { Intro, introArmingScript } from "@/components/ui";
import { ogImage, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: "website",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [ogImage],
  },
  /**
   * X reads the Open Graph tags when these are absent, but only the ones it
   * recognises — and `summary_large_image` is the difference between the card
   * being the width of the post and being a thumbnail beside two lines of text.
   * It is worth the four lines.
   */
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [ogImage.url],
  },
};

/**
 * The tab icon, and the icon iOS puts on a home screen.
 *
 * Both are files rather than entries here: `src/app/icon.png` and
 * `src/app/apple-icon.png` are App Router conventions, and Next writes the
 * `<link>` tags, the sizes and the cache-busting hashes itself. Both are cut
 * from the logo by `scripts/brand-assets.mjs` — the emblem only, because the
 * wordmark beside it is two thirds of a 3:1 image and is illegible the moment
 * it is 16px wide.
 */

export const viewport: Viewport = {
  colorScheme: "light",
  // The black of the header pill, not the paper of the page: on mobile the
  // browser chrome sits directly above it, and matching the pill is what makes
  // the two read as one surface. Tracks `--color-black`.
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        {/* First thing in the body, and synchronous: it has to arm the
            entrance before the browser has parsed the header, or the rule that
            hides the first screen arrives too late to hide anything. See
            `Intro` for what it does and every way it fails safe. */}
        <script dangerouslySetInnerHTML={{ __html: introArmingScript }} />
        <Intro />

        <a href="#main" className="sr-only focus:not-sr-only">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        {/* The sticky CALL / FREE QUOTE bar. Last in the DOM and `fixed`, so it
            sits over the page rather than in it; `lg:hidden` inside means it
            does not exist at all on a desktop. The body carries a matching
            bottom padding under the same breakpoint — see `globals.css` — so
            nothing on any page can end up underneath it. */}
        <MobileCtaBar />
      </body>
    </html>
  );
}
