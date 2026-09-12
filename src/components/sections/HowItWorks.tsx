import { CtaLink, Section, SectionHeader } from "@/components/ui";
import { howItWorks } from "@/content/home";
import { quoteHref } from "@/content/nav";

/**
 * How It Works. Four steps, set out plainly and all at once.
 *
 * This band used to be a deck — every card `sticky` under the header, each one
 * rising to cover the last as the page scrolled, a large 01–04 numeral heading
 * each — and the blocks around it faded in as they were reached. All of that is
 * gone on purpose: the section is static now. The steps are four cards on the
 * white band, two across from `md`, and nothing on the band moves.
 *
 * The order is still information, so the steps stay an ordered list (`ol`) and
 * a screen reader still hears "1 of 4". The bold step heading is what carries
 * each card now that the numeral is gone.
 *
 * `reveal={false}` on the band is what switches the scroll fades off for its
 * header and its closing button as well as for the cards — see `RevealGroup`.
 */
export function HowItWorks() {
  const steps = howItWorks.steps;

  return (
    <Section id="how-it-works" ground="paper" labelledBy="how-it-works-title" reveal={false}>
      <SectionHeader title={howItWorks.title} titleId="how-it-works-title" />

      <ol className="grid gap-4 md:grid-cols-2 lg:gap-6">
        {steps.map((step) => (
          <li key={step.number}>
            <article className="h-full rounded-3xl border border-(--raised-border) bg-(--ground) p-7 shadow-[0_1px_24px_rgba(11,31,59,0.06)] sm:p-10">
              <h3 className="text-2xl leading-tight font-bold sm:text-[1.75rem]">{step.title}</h3>

              <div className="mt-4 flex max-w-xl flex-col gap-3 text-(--on-ground-muted) lg:gap-4">
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
      <div className="mt-[clamp(3rem,8vw,6rem)] flex justify-center">
        <CtaLink href={quoteHref}>{howItWorks.cta}</CtaLink>
      </div>
    </Section>
  );
}
