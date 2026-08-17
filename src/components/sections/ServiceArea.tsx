import { Section, SectionHeader } from "@/components/ui";
import { serviceArea } from "@/content/home";

/**
 * Blue, continuing the blue of About rather than cutting against it: who we are
 * and where we work are one answer, and running them on one ground is what says
 * so. The heading and the white space between them are the break.
 *
 * Thirty-one city names is a lot of small repeated text, so the list reads as
 * one object: outlined rather than filled, in the ground's own ink at 35%, so
 * the band still shows through and the eye reads a texture instead of a wall.
 * The border is a ground role, not a swatch — it was navy on green and is white
 * on blue by saying neither.
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

      <ul className="mt-5 flex flex-wrap gap-2">
        {serviceArea.cities.map((city) => (
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
