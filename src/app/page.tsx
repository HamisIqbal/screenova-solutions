import type { Metadata } from "next";
import {
  About,
  Faq,
  FinalCta,
  Hero,
  HowItWorks,
  Projects,
  QuoteForm,
  Reviews,
  ScreenOptions,
  ServiceArea,
  Services,
  TrustBar,
  WhyChooseUs,
} from "@/components/sections";
import { siteConfig } from "@/lib/site";

/**
 * The home page's own title and description, overriding the root layout's
 * defaults.
 *
 * The title is written out in full here, brand included, and that is not an
 * oversight. `title.template` in the root layout applies to *child* segments;
 * this page is in the same route segment as that layout, so the template never
 * runs on it and a bare "Window Screen Repair & Replacement Tampa Bay" would
 * have shipped with no brand at all. Verified against the built HTML rather
 * than assumed. Every other page in the app is a child segment and does get the
 * template, which is why only this one spells the suffix out.
 *
 * The Open Graph title is set explicitly rather than inherited, because the
 * layout's `openGraph.title` is the bare brand name and a share card headed
 * "Screenova Solutions" says nothing about what the page is.
 */
export const metadata: Metadata = {
  title: "Window Screen Repair & Replacement Tampa Bay | Screenova Solutions",
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Window Screen Repair & Replacement Tampa Bay | Screenova Solutions",
    description: siteConfig.description,
    url: "/",
  },
};

/**
 * The home page. Each section owns its own layout and copy; this file only
 * decides the order they appear in.
 *
 * The order is a reading, not a list. The hero asks, the trust strip answers
 * "who is this", the services say what is on offer, and from there the page
 * alternates between telling and asking — every second or third band closes on
 * an action so that nobody has to reach the foot of the page to start.
 *
 * `Reviews` renders nothing at all while there are no genuine reviews to show;
 * it is in the order so that the day real ones are pasted into
 * `content/home.ts` they appear in the right place with no code change. See
 * `Reviews.tsx`.
 *
 * Exactly one H1 lives on this page and it is the hero's. Every other section
 * opens on an H2 through `SectionHeader`.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Services />
      <HowItWorks />
      <WhyChooseUs />
      <ScreenOptions />
      <Projects />
      <About />
      <ServiceArea />
      <Faq />
      <Reviews />
      <QuoteForm />
      <FinalCta />
    </>
  );
}
