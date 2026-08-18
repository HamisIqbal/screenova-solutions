import { CardStage, RevealCard, Section, SectionHeader, Typewriter } from "@/components/ui";
import { howItWorks } from "@/content/home";

/**
 * The one section where numbering is honest: these steps happen in order, and
 * the order is information the reader needs. The numerals are set in the hero
 * face, which is the only other place on the page that shouts.
 *
 * Back on white, and this is where all three colours are visible at once: a
 * green rule opens each step, the numeral under it is blue, the copy is navy on
 * paper. Green as a 3px rule rather than as the numeral is deliberate — green
 * is 2.9:1 on white, under the 3:1 large-text floor, so it can be a mark here
 * but never a word.
 *
 * This is the section the staged reveal was really built for. The steps are a
 * sequence, so having them arrive one at a time as you scroll is not decoration
 * — it is the same information the numerals carry, said again in time. The
 * backdrop follows down the line with them: enquiry, quote, workshop, install.
 *
 * The copy here sits straight on the band with no card under it, so paper's
 * lighter `--stage-tint` is doing real work. Navy has 17.5:1 to spend and the
 * multiply blend at 16% takes it to about 12:1 at the worst pixel, which is
 * still well clear.
 */
export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      ground="paper"
      labelledBy="how-it-works-title"
      bandClassName="relative isolate"
    >
      <SectionHeader
        eyebrow={howItWorks.eyebrow}
        title={howItWorks.title}
        titleId="how-it-works-title"
      />

      <CardStage
        as="ol"
        images={howItWorks.steps.map((step) => step.image)}
        columns={4}
        className="mt-14 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4"
      >
        {howItWorks.steps.map((step, index) => (
          <RevealCard
            key={step.number}
            index={index}
            // A step is not a card, so it gets a mark that changes rather than
            // a box that lifts: the rule at the top turns from green to blue
            // while this step is the one whose photograph is up, which is the
            // same blue its numeral is already set in.
            className="group border-t-green data-[active=true]:border-t-blue border-t-[3px] pt-5 transition-[border-color,transform] duration-500 ease-(--ease-out-expo) hover:-translate-y-1"
          >
            <span
              aria-hidden="true"
              // Blue, not green: green is the click, and green is also too
              // close to white to carry a numeral. The numerals carry sequence,
              // which is structure, and blue holds 4.7:1 on paper so a number
              // that means something is actually readable.
              className="font-hero text-blue block leading-none"
              // Stays below the hero title at every width — a step number
              // should never out-shout the headline.
              style={{ fontSize: "clamp(2rem, 3vw, 2.5rem)" }}
            >
              {String(step.number).padStart(2, "0")}
            </span>

            <h3 className="mt-5">
              <Typewriter text={step.title} />
            </h3>

            <div className="mt-3 flex flex-col gap-3 text-(--on-ground-muted)">
              {step.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </RevealCard>
        ))}
      </CardStage>
    </Section>
  );
}
