import { BandPhoto, CtaLink, Section, SectionHeader } from "@/components/ui";
import { bandImages, whyChooseUs } from "@/content/home";

/**
 * Six reasons, on a photograph. Deliberately not cards — Services already owns
 * that treatment, so these are open, separated by a short rule instead of a
 * box.
 *
 * The band was blue and is now `sky`, because its floor is a picture and a
 * photograph needs the text roles a dark ground provides. That is the same
 * trade the hero makes, and it is the whole reason `sky` exists as a ground
 * rather than as a colour: the band colour is only ever seen behind the image
 * while it loads.
 *
 * Nothing here names a colour, which is why the move cost nothing. The rule is
 * `--rule` and the button is `--action`; on blue they resolved to white at 75%
 * and a white pill carrying navy, and on the chrome ground they resolve to
 * white at 75% and a white pill carrying black. Six paragraphs, a rule and a
 * button changed ground without a single one of them being edited.
 *
 * The photograph is four windows in a row seen flat on, with the lower half of
 * the frame plain siding. That flat half is the reason it is this section's and
 * not another's: three columns of text need somewhere quiet to land.
 */
export function WhyChooseUs() {
  return (
    <Section
      id="why-us"
      ground="sky"
      labelledBy="why-us-title"
      // `clip` rather than `hidden`: it holds the cropped edges of the
      // photograph without making a scroll container.
      bandClassName="relative overflow-clip"
    >
      <BandPhoto {...bandImages.whyChooseUs} />

      {/* `relative`, so the content paints above the picture and its scrim —
          both are positioned, and a static sibling would sit under them. */}
      <div className="relative">
        <SectionHeader title={whyChooseUs.title} titleId="why-us-title" intro={whyChooseUs.intro} />

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
      </div>
    </Section>
  );
}
