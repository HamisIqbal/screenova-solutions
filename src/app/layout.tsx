import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { fontVariables } from "@/app/fonts";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SectionWheel } from "@/components/layout/SectionWheel";
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
        <SectionWheel />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
