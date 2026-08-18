import { services } from "@/content/home";
import { CardStage, RevealCard, Section, SectionHeader, Typewriter } from "@/components/ui";

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
 *
 * The band is a stage now: the cards arrive one at a time as you come down the
 * page, each title types itself in, and the photograph behind the whole band
 * changes to whichever service you are currently reading. Six white cards over
 * a moving picture is also the arrangement that needed the least protecting —
 * the cards are opaque, so none of the copy in them is sitting on the image at
 * all, and only the band showing through the gutters is affected.
 */
export function Services() {
  return (
    <Section
      id="services"
      ground="blue"
      labelledBy="services-title"
      // `relative` gives the stage backdrop its containing block; `isolate` is
      // what makes the backdrop's negative z-index land above the band's own
      // colour instead of behind it. See `CardStage`.
      bandClassName="relative isolate"
    >
      <SectionHeader
        eyebrow={services.eyebrow}
        title={services.title}
        titleId="services-title"
        intro={services.intro}
      />

      <CardStage
        images={services.items.map((service) => service.image)}
        columns={3}
        className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
      >
        {services.items.map((service, index) => (
          <RevealCard
            key={service.id}
            index={index}
            id={service.id}
            // The card declares its own ground, so everything inside it —
            // text, muted copy, the link underline — flips back to the white
            // set without a single child knowing it moved.
            data-ground="paper"
            // The lift on hover is what makes the grid feel like six objects
            // rather than six panels. `data-active` is the card whose picture
            // is currently up behind the band; it gets the same lift, so the
            // page tells you what the backdrop is showing without a caption.
            className="flex flex-col rounded-3xl p-7 transition-[transform,box-shadow] duration-500 ease-(--ease-out-expo) hover:-translate-y-1.5 hover:shadow-[0_18px_40px_-24px_rgba(7,26,47,0.55)] data-[active=true]:-translate-y-1"
          >
            <h3>
              <Typewriter text={service.title} />
            </h3>

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
          </RevealCard>
        ))}
      </CardStage>
    </Section>
  );
}
