import { about, faq, howItWorks, screenOptions, serviceArea, services, whyChooseUs } from "./home";
import { navLinks } from "./nav";

/**
 * What the desktop rail shows when a section's name is hovered: the section's
 * own describing line, a line of its copy, and the short list of what is inside
 * it — the six services, the four steps, the cities.
 *
 * Every value here is read from `home.ts` rather than written again, so the
 * rail cannot drift from the page. It is a *preview*, not a copy of the band:
 * the real section is the thing on the page, and the rail's job is to say what
 * is down there so the reader can decide whether to go.
 *
 * The order and the labels come from `navLinks`, so the rail lists exactly what
 * the header lists, in the same order, under the same names. A nav entry with no
 * preview written for it is skipped rather than rendered empty.
 */
export type SectionPreview = {
  label: string;
  href: string;
  /** The section's own heading — the same line the band opens with. */
  title: string;
  /** One line of the section's copy. */
  blurb: string;
  /** What is inside it, named. Rendered as a short list under the blurb. */
  items: readonly string[];
};

const PREVIEWS: Record<string, Omit<SectionPreview, "label" | "href">> = {
  "#services": {
    title: services.title,
    blurb: services.intro,
    items: services.items.map((item) => item.title),
  },
  "#how-it-works": {
    title: howItWorks.title,
    blurb: howItWorks.steps[0]?.body[0] ?? "",
    items: howItWorks.steps.map((step) => `${String(step.number).padStart(2, "0")}  ${step.title}`),
  },
  "#why-us": {
    title: whyChooseUs.title,
    blurb: whyChooseUs.intro[0],
    items: whyChooseUs.benefits.map((benefit) => benefit.title),
  },
  "#screen-options": {
    title: screenOptions.title,
    blurb: screenOptions.intro,
    items: screenOptions.options.map((option) => option.title),
  },
  "#about": {
    title: about.title,
    blurb: about.body[0],
    items: [],
  },
  "#service-area": {
    title: serviceArea.title,
    blurb: serviceArea.intro,
    items: serviceArea.featured.map((city) => city.name),
  },
  "#faq": {
    // The FAQ has no describing line of its own — the questions are the
    // description — so its name does the job here.
    title: faq.eyebrow,
    blurb: faq.items[0]?.answer ?? "",
    items: faq.items.slice(0, 4).map((item) => item.question),
  },
};

export const sectionIndex: readonly SectionPreview[] = navLinks.flatMap((link) => {
  const preview = PREVIEWS[link.href];
  return preview ? [{ label: link.label, href: link.href, ...preview }] : [];
});
