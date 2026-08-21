import { CtaLink, Section, SectionHeader } from "@/components/ui";
import { howItWorks } from "@/content/home";

/**
 * The one section where numbering is honest: these steps happen in order, and
 * the order is information the reader needs. The numerals are set in the hero
 * face, which is the only other place on the page that shouts.
 *
 * Back on white. Each card opens with nothing but its numeral, set large, in
 * the hero's Black weight and in black: at that size and that weight the figure
 * is the mark, and it does not need a colour to be one. Blue made it a second
 * brand moment on a band that already carries the action pill, and green was
 * never an option — 2.9:1 on white, under the large-text floor. Black is 21:1
 * and reads as structure, which is what a step number is.
 *
 * ---------------------------------------------------------------------------
 * The four steps are a deck rather than a row. Each card is `sticky` at the
 * same line under the header, so as the page moves the next step rises and
 * covers the one before it — you are handed one step at a time, in order, and
 * the covering is the thing that says "and then". A four-across grid showed all
 * four at once, which is exactly what a sequence is not.
 *
 * How it works, all in CSS and no JavaScript at all: every card sticks at
 * `top`, and the list items that follow keep scrolling up over the stuck one.
 * Each card's `top` is a few pixels lower than the last so the ones underneath
 * leave a visible edge — you can see the deck you have already been through
 * rather than a single card that mysteriously changes contents. `z-index`
 * rises with the step for the same reason: later covers earlier, never the
 * reverse.
 *
 * The scroll distance is the gap between the items. Each card is a screenful
 * tall at most and the gaps are what you travel through to get from one to the
 * next, so the section is about four screens of scrolling — one per step.
 *
 * A stuck card must be opaque or the one beneath reads through it, which is why
 * the card is `--ground` and not the usual `--raised` tint: white on white with
 * a hairline and a shadow is the only combination that both covers and still
 * reads as a card on this band.
 */
export function HowItWorks() {
  const steps = howItWorks.steps;

  return (
    <Section id="how-it-works" ground="paper" labelledBy="how-it-works-title">
      <SectionHeader title={howItWorks.title} titleId="how-it-works-title" />

      {/* The gap between cards is the travel from one step to the next. It is
          short and the cards are tall, because the alternative — small cards
          far apart — is a long stretch of empty white band between them. */}
      {/* No reveal on the deck: a card arriving is a card covering the one
          before it, and a fade on top of that was the same card arriving twice.
          See `RevealGroup`. */}
      <ol data-reveal="off" className="flex flex-col gap-[14vh] pb-[6vh]">
        {steps.map((step, i) => (
          <li
            key={step.number}
            className="sticky"
            style={{
              // Under the header, then 0.75rem lower per step so each card in
              // the deck leaves an edge of the one before it showing.
              top: `calc(var(--header-clearance) + ${i * 0.75}rem)`,
              zIndex: i + 1,
            }}
          >
            <article className="flex min-h-[52vh] flex-col justify-center rounded-3xl border border-(--raised-border) bg-(--ground) p-7 shadow-[0_-1px_24px_rgba(11,31,59,0.08)] sm:min-h-[58vh] sm:p-10 lg:p-12">
              <p
                // Black in both senses — the colour and the weight. The
                // numerals carry sequence, which is structure, and structure on
                // this page is set in the page's own ink at its heaviest.
                className="font-hero block leading-none text-black"
                // The numeral is now the only marker of position in the four,
                // so it is set large — but still under the section title,
                // which stays the largest thing on the band.
                style={{ fontSize: "clamp(2.5rem, 7vw, 4.5rem)", fontWeight: 900 }}
              >
                <span className="sr-only">Step </span>
                {String(step.number).padStart(2, "0")}
              </p>

              <h3 className="mt-4 text-xl sm:text-2xl">{step.title}</h3>

              <div className="mt-4 flex max-w-xl flex-col gap-3 text-(--on-ground-muted) lg:gap-4 lg:text-base xl:text-[1.0625rem]">
                {step.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          </li>
        ))}
      </ol>

      {/* The band's own closer, so a reader who has just been told how simple
          it is does not have to scroll to the foot of the page to start. */}
      <div className="flex justify-center">
        <CtaLink href="#quote">{howItWorks.cta}</CtaLink>
      </div>
    </Section>
  );
}
