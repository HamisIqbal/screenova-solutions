import { CtaLink, Section, SectionHeader } from "@/components/ui";
import { about } from "@/content/home";

/**
 * Long-form copy on a blue band, so it splits into two columns: the header
 * holds the left rail and the prose runs down the right at a comfortable
 * measure. It's the only section on the page with a genuinely asymmetric
 * layout, which is what keeps it from reading as another grid of boxes.
 *
 * The prose sits straight on the blue rather than in a white card, because this
 * is the one blue band with a single short column to read. White gives 4.7:1 on
 * blue and no more, which means there is no dimmed secondary tint available
 * here — the body copy is full white and the header does the stepping down.
 */
export function About() {
  return (
    <Section id="about" ground="blue" labelledBy="about-title">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <SectionHeader eyebrow={about.eyebrow} title={about.title} titleId="about-title" />

        <div>
          <div className="flex flex-col gap-4">
            {about.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <CtaLink href="#quote" className="mt-10">
            {about.cta}
          </CtaLink>
        </div>
      </div>
    </Section>
  );
}
