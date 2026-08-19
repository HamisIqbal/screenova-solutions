import { BandPhoto, CtaLink, Section, SectionHeader } from "@/components/ui";
import { bandImages, whyChooseUs } from "@/content/home";

/**
 * Six reasons, on a photograph: six white blocks, three and three, each showing
 * its heading and its sentence at all times.
 *
 * Nothing here is hidden and nothing has to be opened. Six short reasons are
 * exactly the amount a reader will take in one pass, and a section whose whole
 * job is "here is why" should not make you work for the why.
 *
 * The band was blue and is now `sky`, because its floor is a picture and a
 * photograph needs the text roles a dark ground provides. The blocks are
 * `data-ground="paper"`, so a white block on a dark band is a ground change
 * rather than a colour — the heading and the copy inside resolve to navy on
 * white without either of them naming one, exactly as the Services card does.
 *
 * The photograph is four windows in a row seen flat on, with the lower half of
 * the frame plain siding. That flat half is the reason it is this section's and
 * not another's: two rows of white blocks need somewhere quiet to land.
 *
 * ---------------------------------------------------------------------------
 * Hover, on a desktop: one block comes forward and the other five go soft.
 *
 * The blocks sit close together — a 12px gutter, near enough to read as one
 * panel of six — and hovering one lifts it, scales it up, and blurs the rest
 * back. It is a focus effect rather than a reveal: the same six reasons are on
 * screen the whole time, and the pointer is only choosing which of them is
 * being read. The blur is what makes it work; a scale on its own reads as a
 * button being pressed, while a scale against five soft neighbours reads as
 * depth.
 *
 * It is transform and filter only, and that is the requirement, not a
 * preference: the band's floor is a photograph sized to the band, so anything
 * that changed the section's height would move the picture behind it. `scale`
 * and `blur` are painted, not laid out — the grid is the same size at rest and
 * under the pointer, and the photograph never moves.
 *
 * No JavaScript in any of it. The list is the hover group, so "some block is
 * hovered" is a state CSS already knows; the hovered one takes the `hover:`
 * side of each pair and its five neighbours take the group's.
 *
 * Below `lg` there is no hover to build on, so none of it applies: the blocks
 * are simply six blocks, one or two to a row, all six equally readable.
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

        <ul className="group/blocks grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseUs.benefits.map((benefit) => (
            <li
              key={benefit.title}
              // The group's side of the pair blurs and softens every block
              // while any of them is hovered; the element's own `hover:` side
              // takes it back for the one under the pointer and brings it
              // forward. `z-10` so the scaled block is over its neighbours and
              // not under them.
              className="transition-[filter,opacity,transform] duration-500 ease-out lg:group-hover/blocks:scale-[0.98] lg:group-hover/blocks:opacity-55 lg:group-hover/blocks:blur-[3px] lg:hover:z-10 lg:hover:scale-[1.06] lg:hover:opacity-100! lg:hover:blur-none!"
            >
              <div data-ground="paper" className="h-full rounded-2xl px-6 py-6">
                <h3 className="text-lg leading-snug font-bold">{benefit.title}</h3>
                <p className="mt-3 text-(--on-ground-muted)">{benefit.body}</p>
              </div>
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
