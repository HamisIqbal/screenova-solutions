import { BandPhoto, CtaLink, Section, SectionHeader } from "@/components/ui";
import { about, bandImages } from "@/content/home";
import { quoteHref } from "@/content/nav";

/**
 * Long-form copy on a photograph, so it splits into two columns: the header
 * holds the left rail and the prose runs down the right at a comfortable
 * measure. It's the only section on the page with a genuinely asymmetric
 * layout, which is what keeps it from reading as another grid of boxes.
 *
 * The floor is one of Screenova's own photographs — a screened room seen from
 * its corner — under the same measured scrim as every other photo band, which
 * is why the band is `sky` rather than the blue it used to be: a
 * photograph needs the text roles a dark ground provides, and black is the
 * right thing to be waiting under while it loads. The prose sits straight on
 * the picture rather than in a white card, full white at every role.
 *
 * The frame is pinned, as Screen Options' is: on a phone this band is taller
 * than the window, and a landscape photograph covering all of it would be
 * cropped to a sliver. See `pinned` in `BandPhoto`.
 */
export function About() {
  return (
    <Section
      id="about"
      ground="sky"
      labelledBy="about-title"
      bandClassName="relative overflow-clip"
      floor={<BandPhoto {...bandImages.about} pinned />}
    >
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <SectionHeader title={about.title} titleId="about-title" />

        <div>
          <div className="flex flex-col gap-4">
            {about.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <CtaLink href={quoteHref} className="mt-10">
            {about.cta}
          </CtaLink>
        </div>
      </div>
    </Section>
  );
}
