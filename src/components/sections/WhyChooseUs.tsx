import { CtaLink, Section, SectionHeader } from "@/components/ui";
import { whyChooseUs } from "@/content/home";

/**
 * Six reasons on a blue band. Deliberately not cards — Services already owns
 * that treatment, so these are open, separated by a short rule instead of a
 * box.
 *
 * Nothing here names a colour: the rule is `--rule` and the button is
 * `--action`, so moving this section from green to blue re-coloured both
 * without touching either. On blue the rule is white at 75% and the pill goes
 * white carrying navy.
 */
export function WhyChooseUs() {
  return (
    <Section id="why-us" ground="blue" labelledBy="why-us-title">
      <SectionHeader
        eyebrow={whyChooseUs.eyebrow}
        title={whyChooseUs.title}
        titleId="why-us-title"
        intro={whyChooseUs.intro}
      />

      <ul className="grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {whyChooseUs.benefits.map((benefit) => (
          <li key={benefit.title}>
            <span aria-hidden="true" className="block h-1 w-10 rounded-full bg-(--rule)" />
            <h3 className="mt-5">{benefit.title}</h3>
            <p className="mt-2 text-(--on-ground-muted)">{benefit.body}</p>
          </li>
        ))}
      </ul>

      <CtaLink href="#quote" className="mt-14">
        {whyChooseUs.cta}
      </CtaLink>
    </Section>
  );
}
