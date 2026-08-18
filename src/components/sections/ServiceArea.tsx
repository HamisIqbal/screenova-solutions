import { CinematicList, Section, SectionHeader } from "@/components/ui";
import { serviceArea } from "@/content/home";

/**
 * Blue, continuing the blue of About rather than cutting against it: who we are
 * and where we work are one answer, and running them on one ground is what says
 * so. The heading and the white space between them are the break.
 *
 * ---------------------------------------------------------------------------
 * The cities are told twice, at two weights, because thirty-one is two
 * different pieces of information wearing one label.
 *
 * The first six are the ones the work is actually in, and they get the
 * cinematic list: a row of type each that opens into a photograph of the place
 * when it is pointed at. That is the part of this section a person looks at
 * rather than reads — it says "we are there" with a picture instead of a claim,
 * and six is the count at which the list is still a gesture and not a scroll.
 *
 * The remaining twenty-five stay as they were: outlined chips in the ground's
 * own ink at 35%, so the band shows through and the eye reads a texture instead
 * of a wall. That list answers one question only — is my city on it — and a
 * texture is the right shape for a question you scan for your own name in. The
 * border is a ground role, not a swatch; it was navy on green and is white on
 * blue by saying neither.
 *
 * The list is full-bleed to the section's measure rather than the page's, which
 * is why it is not pulled out of the gutter: the rows carry their own inner
 * padding and pulling them wider would put the city names outside the column
 * every other line in the section is set in.
 */
export function ServiceArea() {
  /* The six above are not repeated below — a city that has just been shown as a
     photograph does not also need to appear as a chip four inches lower. */
  const featured = new Set<string>(serviceArea.featuredCities.map((city) => city.title));
  const rest = serviceArea.cities.filter((city) => !featured.has(city));

  return (
    <Section id="service-area" ground="blue" labelledBy="service-area-title">
      <SectionHeader
        eyebrow={serviceArea.eyebrow}
        title={serviceArea.title}
        titleId="service-area-title"
        intro={serviceArea.intro}
      />

      <h3 className="mt-12">{serviceArea.citiesLabel}</h3>

      <CinematicList items={serviceArea.featuredCities} className="mt-6" />

      <h3 className="mt-14">{serviceArea.moreCitiesLabel}</h3>

      <ul className="mt-5 flex flex-wrap gap-2">
        {rest.map((city) => (
          <li
            key={city}
            className="rounded-full border border-(--on-ground)/35 px-3.5 py-1.5"
            style={{ fontSize: "var(--text-label)" }}
          >
            {city}
          </li>
        ))}
      </ul>

      <p className="mt-10 max-w-2xl text-(--on-ground-muted)">{serviceArea.outro}</p>
    </Section>
  );
}
