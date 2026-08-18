import { Section, SectionHeader } from "@/components/ui";
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
 */
export function HowItWorks() {
  return (
    <Section id="how-it-works" ground="paper" labelledBy="how-it-works-title">
      <SectionHeader
        eyebrow={howItWorks.eyebrow}
        title={howItWorks.title}
        titleId="how-it-works-title"
      />

      <ol className="mt-14 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-4">
        {howItWorks.steps.map((step) => (
          <li key={step.number} className="border-t-green border-t-[3px] pt-5">
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

            <h3 className="mt-5">{step.title}</h3>

            <div className="mt-3 flex flex-col gap-3 text-(--on-ground-muted)">
              {step.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
