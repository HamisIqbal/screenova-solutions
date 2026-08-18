import Image from "next/image";
import { Section, SectionHeader } from "@/components/ui";
import { serviceArea } from "@/content/home";

/**
 * Blue, continuing the blue of About rather than cutting against it: who we are
 * and where we work are one answer, and running them on one ground is what says
 * so. The heading and the white space between them are the break.
 *
 * ---------------------------------------------------------------------------
 * Thirty-one cities, one picture each, in a grid that answers to the pointer.
 *
 * The size is picked so the whole service area is one object on the screen —
 * around seven tiles a row on a desktop and five rows deep, small enough that
 * the grid reads as a territory rather than a gallery, large enough that each
 * city is still a photograph and not a swatch. On a phone it settles to two a
 * row and stays legible.
 *
 * The hover is done with flex, not with JavaScript, and the choice is the
 * reason it behaves:
 *
 *   - Every tile is `basis-36 grow`, so the row's spare width is shared out
 *     evenly and all tiles start equal.
 *   - The pointed-at tile takes `grow-[8]`. Growth is only ever a share of the
 *     row's *spare* width, and the basis never changes, so its neighbours give
 *     way to it and the wrap points cannot move. No tile ever jumps to another
 *     row mid-animation, which is the failure mode of doing this with widths.
 *   - Everything else, anywhere in the grid, dims and drops to 97% while a
 *     pointer is in the grid at all. That is what makes the rest get smaller
 *     rather than just narrower — the tiles in other rows have no width to
 *     give, so they answer with scale instead.
 *
 * All of it is one 500ms transition per tile on a single hover state, so it is
 * smooth in both directions and there is nothing to hydrate: this section is
 * still a server component.
 *
 * The names sit on the pictures rather than under them. Under them they would
 * be a caption, and a caption implies the picture is the subject; the city is
 * the subject, and the picture is what it looks like.
 */
export function ServiceArea() {
  return (
    <Section id="service-area" ground="blue" labelledBy="service-area-title">
      <SectionHeader
        eyebrow={serviceArea.eyebrow}
        title={serviceArea.title}
        titleId="service-area-title"
        intro={serviceArea.intro}
      />

      <h3 className="mt-12">{serviceArea.citiesLabel}</h3>

      <ul className="group/grid mt-6 flex flex-wrap gap-2">
        {serviceArea.cities.map((city) => (
          <li
            key={city.name}
            className={[
              "relative h-28 grow basis-36 overflow-hidden rounded-xl sm:h-32 sm:basis-40",
              "transition-[flex-grow,opacity,transform] duration-500 ease-out",
              // Resting state of the *other* tiles while the grid is hovered.
              "group-hover/grid:scale-[0.97] group-hover/grid:opacity-55",
              // The pointed-at tile overrides both, and takes the row's width.
              "hover:z-10 hover:grow-[8]! hover:scale-100! hover:opacity-100!",
            ].join(" ")}
          >
            <Image
              src={city.src}
              alt={city.alt}
              fill
              // Tiles are small in the common case and only the hovered one is
              // wide, so the smallest useful candidate is the right default.
              sizes="(min-width: 64rem) 22rem, (min-width: 40rem) 40vw, 50vw"
              className="object-cover"
            />

            {/* Weighted to the bottom, where the name sits — enough to hold
                white type at 4.5:1 over a photograph without greying the top
                of the picture out. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

            <span
              className="absolute right-3 bottom-2.5 left-3 font-semibold text-white"
              style={{ fontSize: "var(--text-label)" }}
            >
              {city.name}
            </span>
          </li>
        ))}
        {/* Thirty-one does not divide by the row, so the last row would hold a
            single tile and `grow` would stretch it the full width of the
            measure. These five are that row's missing tiles: they take a basis
            like any other so the wrap sees a full row, and they are zero-height
            so the rows they fall into on narrower screens are not there at
            all. */}
        {[0, 1, 2, 3, 4].map((i) => (
          <li key={`filler-${i}`} className="h-0 grow basis-36 sm:basis-40" aria-hidden="true" />
        ))}
      </ul>

      <p className="mt-10 max-w-2xl text-(--on-ground-muted)">{serviceArea.outro}</p>
    </Section>
  );
}
