import { services } from "@/content/home";
import { Section, SectionHeader } from "@/components/ui";

/**
 * Six services in a card grid, on the page's first blue band. The cards go
 * white, which is the whole reason this section can be blue at all: a solid
 * field of blue behind six blocks of small copy would be unreadable, but six
 * white cards floating on blue put the reading back on paper and let the band
 * do its work in the gutters.
 *
 * These are alternatives, not a sequence, so there is no numbering — each card
 * stands on its own and the quote link is pinned to the bottom so it lands on
 * the same line across every card.
 */
export function Services() {
  return (
    <Section id="services" ground="blue" labelledBy="services-title">
      <SectionHeader
        eyebrow={services.eyebrow}
        title={services.title}
        titleId="services-title"
        intro={services.intro}
      />

      <ul className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.items.map((service) => (
          <li
            key={service.id}
            id={service.id}
            // The card declares its own ground, so everything inside it —
            // text, muted copy, the link underline — flips back to the white
            // set without a single child knowing it moved.
            data-ground="paper"
            className="flex flex-col rounded-3xl p-7"
          >
            <h3>{service.title}</h3>

            <div className="mt-4 flex flex-col gap-3 text-(--on-ground-muted)">
              {service.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {service.cta ? (
              <p className="mt-auto pt-6">
                <a href="#quote">{service.cta}</a>
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}
