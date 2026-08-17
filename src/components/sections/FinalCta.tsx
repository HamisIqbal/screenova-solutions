import { CtaLink, Section } from "@/components/ui";
import { finalCta } from "@/content/home";

/**
 * The closer. Paper, arriving off the blue of the quote form, and the loudest
 * thing on it is the button rather than the band. That is the trade this
 * section makes: green is no longer a ground anywhere on the page, so the one
 * place it can still be the brand's "go" is the pill — and on white it is, at
 * full strength, which it never was on a green band where it had to give way to
 * navy to stay a pill at all. The page ends on the colour of the thing you are
 * being asked to do; it is just the button wearing it now, not the floor.
 *
 * `finalCta.eyebrow` is deliberately not rendered — "Final Call to Action" is
 * a label from the content brief describing the block, not copy for the page.
 */
export function FinalCta() {
  return (
    <Section id="contact" ground="paper" labelledBy="contact-title">
      <h2 id="contact-title" className="max-w-2xl">
        {finalCta.title}
      </h2>

      <div className="mt-5 flex max-w-xl flex-col gap-3 text-(--on-ground-muted)">
        {finalCta.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
        <CtaLink href="#quote">{finalCta.primaryCta}</CtaLink>
        <span className="font-title" style={{ fontWeight: 400 }}>
          {finalCta.secondaryCta}
        </span>
      </div>

      {/* The tagline stays in the ink. Sunset would read here — it is 2.6:1 on
          paper as text, which is exactly why it is only ever a fill — and the
          two sparks the page is allowed are already spent on the "Best for"
          chip and the FAQ marker. */}
      <p
        className="font-title mt-10"
        style={{ fontSize: "var(--text-label)", letterSpacing: "0.16em", fontWeight: 400 }}
      >
        {finalCta.tagline.toUpperCase()}
      </p>
    </Section>
  );
}
