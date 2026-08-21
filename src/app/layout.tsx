import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { fontVariables } from "@/app/fonts";
import { Footer, Header, MobileCtaBar } from "@/components/layout";
import { siteConfig } from "@/lib/site";

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
  },
};

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
