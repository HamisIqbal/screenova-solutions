import {
  About,
  Faq,
  FinalCta,
  Hero,
  HowItWorks,
  QuoteForm,
  ScreenOptions,
  ServiceArea,
  Services,
  WhyChooseUs,
} from "@/components/sections";

/**
 * The single page. Each section owns its own layout and copy; this file only
 * decides the order they appear in.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <HowItWorks />
      <WhyChooseUs />
      <ScreenOptions />
      <About />
      <ServiceArea />
      <Faq />
      <QuoteForm />
      <FinalCta />
    </>
  );
}
