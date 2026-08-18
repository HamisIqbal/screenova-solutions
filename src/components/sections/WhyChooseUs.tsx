import {
  CardStage,
  CtaLink,
  RevealCard,
  Section,
  SectionHeader,
  Typewriter,
} from "@/components/ui";
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
 *
 * This is the band where the backdrop had to be argued rather than assumed.
 * Nothing here is in a card — every one of these six is white copy sitting
 * straight on the blue, and white on blue is 4.72:1 with nothing to spare. A
 * photograph laid over it with normal blending at even 10% opacity drops it to
 * 4.03:1 and fails. `mix-blend-multiply` is what makes it safe: it can only
 * darken the band, so the contrast under this copy can only go up. See
 * `CardStage` for the full working.
 */
export function WhyChooseUs() {
  return (
    <Section id="why-us" ground="blue" labelledBy="why-us-title" bandClassName="relative isolate">
      <SectionHeader
        eyebrow={whyChooseUs.eyebrow}
        title={whyChooseUs.title}
        titleId="why-us-title"
        intro={whyChooseUs.intro}
      />

      <CardStage
        images={whyChooseUs.benefits.map((benefit) => benefit.image)}
        columns={3}
        className="mt-14 grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3"
      >
        {whyChooseUs.benefits.map((benefit, index) => (
          <RevealCard
            key={benefit.title}
            index={index}
            className="group transition-transform duration-500 ease-(--ease-out-expo) hover:-translate-y-1"
          >
            {/* The rule is the interactive part here, for the same reason it is
                in How It Works: with no box to lift, the mark is what can move.
                It runs out from 2.5rem to 4rem on hover and on active. */}
            <span
              aria-hidden="true"
              className="block h-1 w-10 rounded-full bg-(--rule) transition-[width] duration-500 ease-(--ease-out-expo) group-hover:w-16 group-data-[active=true]:w-16"
            />
            <h3 className="mt-5">
              <Typewriter text={benefit.title} />
            </h3>
            <p className="mt-2 text-(--on-ground-muted)">{benefit.body}</p>
          </RevealCard>
        ))}
      </CardStage>

      <CtaLink href="#quote" className="mt-14">
        {whyChooseUs.cta}
      </CtaLink>
    </Section>
  );
}
