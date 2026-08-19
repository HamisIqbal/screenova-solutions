import { BandPhoto, CtaLink, Section, SectionHeader } from "@/components/ui";
import { bandImages, whyChooseUs } from "@/content/home";

/**
 * Six reasons, on a photograph, and the one section that says the same six
 * things two different ways.
 *
 * The band was blue and is now `sky`, because its floor is a picture and a
 * photograph needs the text roles a dark ground provides. That is the same
 * trade the hero makes, and it is the whole reason `sky` exists as a ground
 * rather than as a colour: the band colour is only ever seen behind the image
 * while it loads.
 *
 * The blocks themselves are `data-ground="paper"`, so a white card on a dark
 * band is a ground change rather than a colour: the heading and the copy inside
 * resolve to navy on white without either of them naming a colour, exactly as
 * the Services card does.
 *
 * The photograph is four windows in a row seen flat on, with the lower half of
 * the frame plain siding. That flat half is the reason it is this section's and
 * not another's: two rows of white blocks need somewhere quiet to land.
 *
 * ---------------------------------------------------------------------------
 * Desktop: six blocks, three and three, closed to their headings.
 *
 * Closed, the section is six short phrases — the six reasons, readable in one
 * pass, which is what a list of reasons is for. Hovering a block opens it and
 * the sentence under the heading arrives. So the summary and the detail are the
 * same six objects rather than six headings with six paragraphs already spent
 * under them.
 *
 * It is done with grid rows rather than height, because `height: auto` cannot
 * be transitioned and a fixed height would have to be guessed for the longest
 * of the six: the copy sits in a row that goes from `0fr` to `1fr`, which is a
 * transition the browser can interpolate and which measures itself. Nothing is
 * removed from the DOM, so the sentences are read out in order whether or not
 * anything is hovered.
 *
 * `focus-within` opens a block as well, and each block is focusable, so the
 * detail is reachable from the keyboard and not only from a pointer.
 *
 * Mobile: the same six, in two rows that never stop moving.
 *
 * There is no hover on a phone, so nothing is hidden there — every block shows
 * its sentence, and the two rows carry three each and travel in opposite
 * directions, forever. Two blocks are in view at a time, which is what sets
 * their width. The loop is seamless because each row renders its three blocks
 * twice and travels exactly half its own width: at the end of the animation the
 * second copy is standing precisely where the first began, and the jump back is
 * invisible. The duplicate is `aria-hidden`, so a screen reader is handed six
 * reasons and not twelve.
 *
 * Both marquees stop dead under `prefers-reduced-motion` — the global rule in
 * `globals.css` caps every animation at one iteration — leaving the two rows
 * legible and still.
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

        {/* Desktop: three and three, closed to their headings. */}
        <ul className="hidden gap-5 lg:grid lg:grid-cols-3">
          {whyChooseUs.benefits.map((benefit) => (
            <li key={benefit.title} className="group">
              <div
                data-ground="paper"
                tabIndex={0}
                className="h-full rounded-2xl px-6 py-6 transition-[transform,box-shadow] duration-500 group-focus-within:-translate-y-1 group-focus-within:shadow-[0_18px_40px_rgba(0,0,0,0.28)] group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_rgba(0,0,0,0.28)]"
              >
                <h3 className="text-lg leading-snug font-bold">{benefit.title}</h3>

                {/* `0fr` to `1fr`: a height the browser can both measure and
                    interpolate. `overflow-hidden` on the child is what makes
                    the closed row actually clip. */}
                <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-out group-focus-within:grid-rows-[1fr] group-hover:grid-rows-[1fr]">
                  <p className="overflow-hidden text-(--on-ground-muted) transition-[padding] duration-500 group-focus-within:pt-3 group-hover:pt-3">
                    {benefit.body}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Mobile: two rows, three each, opposite directions, no end. */}
        <div className="flex flex-col gap-4 lg:hidden">
          <BenefitMarquee benefits={whyChooseUs.benefits.slice(0, 3)} />
          <BenefitMarquee benefits={whyChooseUs.benefits.slice(3)} reverse />
        </div>

        <CtaLink href="#quote" className="mt-14">
          {whyChooseUs.cta}
        </CtaLink>
      </div>
    </Section>
  );
}

/**
 * One travelling row. The three blocks are rendered twice and the track moves
 * exactly half its own width, which is what makes the loop seamless; the second
 * set is `aria-hidden` so only the real three are announced.
 *
 * The width of a block is the reason two are in view: half the window, less the
 * gutter either side and the gap between them.
 */
function BenefitMarquee({
  benefits,
  reverse = false,
}: {
  benefits: readonly { title: string; body: string }[];
  reverse?: boolean;
}) {
  const run = [...benefits, ...benefits];

  return (
    // The row bleeds past the measure to the window edges — a loop that starts
    // and ends inside a gutter reads as a list that happens to slide.
    <div className="-mx-gutter overflow-hidden">
      {/* The gap is a margin on each block rather than `gap` on the row, and
          that is arithmetic, not taste: `gap` puts five gaps between six
          blocks, so half the track is half a gap short of one full set and the
          loop drifts by that much every pass. As a margin every block is the
          same width including its space, half the track is exactly three of
          them, and the seam disappears. */}
      <ul className={`flex w-max ${reverse ? "marquee-reverse" : "marquee"}`}>
        {run.map((benefit, i) => (
          <li
            key={`${benefit.title}-${i}`}
            aria-hidden={i >= benefits.length ? "true" : undefined}
            className="mr-4 w-[calc(50vw-2rem)] shrink-0"
          >
            <div data-ground="paper" className="h-full rounded-2xl px-5 py-5">
              <h3 className="text-base leading-snug font-bold">{benefit.title}</h3>
              <p className="mt-2 text-sm text-(--on-ground-muted)">{benefit.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
