import Image from "next/image";
import { Section, SectionHeader } from "@/components/ui";
import { serviceArea } from "@/content/home";

/**
 * Blue, continuing the blue of About rather than cutting against it: who we are
 * and where we work are one answer, and running them on one ground is what says
 * so. The heading and the white space between them are the break.
 *
 * ---------------------------------------------------------------------------
 * The service area is told twice, because thirty-one cities is two different
 * pieces of information wearing one label.
 *
 * Four of them are shown: four tall blocks in a row, each a photograph of the
 * place, big enough that they are pictures rather than thumbnails. That is the
 * part a person looks at instead of reading — it says "we are there" with a
 * picture rather than a claim. The other twenty-seven are set as three columns
 * of names underneath, because that list answers exactly one question — is my
 * city on it — and a name is the fastest way to answer it.
 *
 * The blocks answer to the pointer, and it is done with flex rather than with
 * JavaScript:
 *
 *   - Each block is `basis-0 grow`, so the row is split four equal ways.
 *   - The pointed-at block goes to `grow-[2.2]`, taking a little over a third
 *     of the row while the other three share the rest. Because growth is a
 *     share of the row and the basis never changes, the four can never wrap or
 *     jump — they only trade width with each other.
 *   - The others also dim and drop to 97%, so the effect reads as one block
 *     coming forward rather than as a column being resized.
 *
 * It is one 500ms transition per block on a single hover state, so it is smooth
 * in both directions and there is nothing to hydrate: this is still a server
 * component. Below `sm` the row becomes a two-by-two grid and the hover is
 * dropped — there is no hover on a touchscreen, and four blocks side by side on
 * a phone would be four slivers.
 *
 * The names sit on the pictures rather than under them. Under them they would
 * be a caption, and a caption implies the picture is the subject; the city is
 * the subject, and the picture is what it looks like.
 */
export function ServiceArea() {
  return (
    <Section id="service-area" ground="blue" labelledBy="service-area-title">
      <SectionHeader
        title={serviceArea.title}
        titleId="service-area-title"
        intro={serviceArea.intro}
      />

      <h3>{serviceArea.citiesLabel}</h3>

      <ul className="group/row mt-6 flex flex-wrap gap-3 sm:flex-nowrap">
        {serviceArea.featured.map((city) => (
          <li
            key={city.name}
            className={[
              // Two-up on a phone at a friendly aspect; one row of four, and
              // taller, from `sm` — that height is what makes them blocks
              // rather than banners.
              "relative aspect-4/5 basis-[calc(50%-0.375rem)] overflow-hidden rounded-2xl",
              "sm:aspect-auto sm:h-[26rem] sm:grow sm:basis-0 lg:h-[30rem]",
              "transition-[flex-grow,opacity,transform] duration-500 ease-out",
              // The resting state of the *other* three while the row is hovered.
              "sm:group-hover/row:scale-[0.97] sm:group-hover/row:opacity-60",
              // The pointed-at block overrides both and takes the width.
              "sm:hover:z-10 sm:hover:grow-[2.2]! sm:hover:scale-100! sm:hover:opacity-100!",
            ].join(" ")}
          >
            <Image
              src={city.src}
              alt={city.alt}
              fill
              // Between a quarter of the measure and a little over a third of
              // it, depending on which one is being pointed at.
              sizes="(min-width: 64rem) 30rem, (min-width: 40rem) 40vw, 50vw"
              className="object-cover"
            />

            {/* Weighted to the bottom, where the name sits — enough to hold
                white type over a photograph without greying the top of the
                picture out. */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

            <h4 className="absolute right-5 bottom-4 left-5 font-bold text-white">{city.name}</h4>
          </li>
        ))}
      </ul>

      <h3 className="mt-14">{serviceArea.otherCitiesLabel}</h3>

      {/* Three columns, filled top-to-bottom rather than left-to-right, which
          is how a list of names is read — `columns` keeps the reading order in
          the markup and lets the browser balance the three. */}
      <ul className="mt-5 columns-2 gap-x-10 sm:columns-3">
        {serviceArea.cities.map((city) => (
          <li key={city} className="py-1 text-(--on-ground-muted)">
            {city}
          </li>
        ))}
      </ul>

      <p className="mt-10 max-w-2xl text-(--on-ground-muted)">{serviceArea.outro}</p>
    </Section>
  );
}
